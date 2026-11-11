import { test } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { randomBytes } from "node:crypto";
const origin = "http://localhost:3107";
const password = randomBytes(24).toString("hex");
let server;
async function start(dataDir) {
  server = spawn(
    process.execPath,
    [
      "node_modules/next/dist/bin/next",
      "start",
      "-p",
      "3107",
      "--hostname",
      "127.0.0.1",
    ],
    {
      env: {
        ...process.env,
        DATA_DIR: dataDir,
        ADMIN_PASSWORD: password,
        SESSION_SECRET: randomBytes(32).toString("hex"),
        APP_URL: origin,
      },
      stdio: "pipe",
    },
  );
  let log = "";
  server.stderr.on("data", (b) => {
    log += b;
  });
  for (let i = 0; i < 100; i++) {
    try {
      const r = await fetch(`${origin}/api/assets`, {
        signal: AbortSignal.timeout(2000),
      });
      if (r.ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 100));
  }
  throw new Error(`Server did not start: ${log}`);
}
async function stop() {
  if (server && server.exitCode === null) {
    server.kill();
    await new Promise((r) => server.once("exit", r));
  }
}
test("public routes and persistent authenticated asset lifecycle", async () => {
  const dataDir = await mkdtemp(path.join(os.tmpdir(), "lpk-test-"));
  try {
    await start(dataDir);
    for (const route of [
      "/",
      "/public/about",
      "/public/program",
      "/public/galeri",
      "/public/organization",
      "/public/legalitas",
      "/admin",
    ])
      assert.equal((await fetch(origin + route)).status, 200, route);
    assert.equal((await fetch(origin + "/public/unknown")).status, 404);
    assert.equal(
      (
        await fetch(origin + "/api/assets", {
          method: "POST",
          headers: { Origin: origin },
        })
      ).status,
      401,
    );
    assert.equal(
      (
        await fetch(origin + "/api/auth", {
          method: "POST",
          headers: {
            Origin: "https://invalid.example",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        })
      ).status,
      403,
    );
    assert.equal(
      (
        await fetch(origin + "/api/auth", {
          method: "POST",
          headers: { Origin: origin, "Content-Type": "application/json" },
          body: JSON.stringify({ password: "wrong" }),
        })
      ).status,
      401,
    );
    const login = await fetch(origin + "/api/auth", {
      method: "POST",
      headers: { Origin: origin, "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    assert.equal(login.status, 200);
    assert.match(login.headers.get("set-cookie"), /HttpOnly/i);
    const cookie = login.headers.get("set-cookie").split(";")[0];
    const headers = { Origin: origin, Cookie: cookie };
    const invalid = new FormData();
    invalid.set(
      "file",
      new File(["<svg/>"], "image.svg", { type: "image/svg+xml" }),
    );
    assert.equal(
      (
        await fetch(origin + "/api/assets", {
          method: "POST",
          headers,
          body: invalid,
        })
      ).status,
      400,
    );
    const form = new FormData();
    form.set(
      "file",
      new File(
        [await readFile("public/sites/asahi/stock-1.jpg")],
        "class.jpg",
        { type: "image/jpeg" },
      ),
    );
    form.set("title", "Integration classroom");
    form.set("alt", "Classroom");
    form.set("category", "Sarana");
    const upload = await fetch(origin + "/api/assets", {
      method: "POST",
      headers,
      body: form,
    });
    assert.equal(upload.status, 201);
    const asset = await upload.json();
    const edited = await fetch(origin + `/api/assets/${asset.id}`, {
      method: "PATCH",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ ...asset, slot: "profile", order: 0 }),
    });
    assert.equal(edited.status, 200);
    assert.equal(
      (await fetch(origin + asset.src)).headers.get("content-type"),
      "image/webp",
    );
    assert.equal(
      (
        await fetch(origin + `/api/assets/${asset.id}`, {
          method: "DELETE",
          headers,
        })
      ).status,
      409,
    );
    assert.match(
      await (await fetch(origin + "/")).text(),
      new RegExp(asset.id),
    );
    await stop();
    await start(dataDir);
    const persisted = await (await fetch(origin + "/api/assets")).json();
    assert.equal(persisted.find((a) => a.id === asset.id).slot, "profile");
    assert.equal((await fetch(origin + asset.src)).status, 200);
    // A server restart rotates the test secret, invalidating the previous session.
    assert.equal(
      (
        await fetch(origin + `/api/assets/${asset.id}`, {
          method: "DELETE",
          headers,
        })
      ).status,
      401,
    );
    const again = await fetch(origin + "/api/auth", {
      method: "POST",
      headers: { Origin: origin, "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const nextCookie = again.headers.get("set-cookie").split(";")[0];
    const nextHeaders = {
      Origin: origin,
      Cookie: nextCookie,
      "Content-Type": "application/json",
    };
    assert.equal(
      (
        await fetch(origin + `/api/assets/${asset.id}`, {
          method: "PATCH",
          headers: nextHeaders,
          body: JSON.stringify({ ...asset, slot: "", order: 0 }),
        })
      ).status,
      200,
    );
    assert.equal(
      (
        await fetch(origin + `/api/assets/${asset.id}`, {
          method: "DELETE",
          headers: nextHeaders,
        })
      ).status,
      200,
    );
    assert.equal(
      (await (await fetch(origin + "/api/assets")).json()).some(
        (a) => a.id === asset.id,
      ),
      false,
    );
    assert.equal(
      (
        await fetch(origin + "/api/auth", {
          method: "DELETE",
          headers: nextHeaders,
        })
      ).status,
      200,
    );
  } finally {
    await stop();
    await rm(dataDir, { recursive: true, force: true });
  }
});
