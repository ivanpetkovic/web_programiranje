import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import test from "node:test";

test("prepare-github-pages pravi artifact sa prefiksom repoa", () => {
  const root = process.cwd();
  execFileSync(process.execPath, ["scripts/prepare-github-pages.mjs"], {
    cwd: root,
    env: { ...process.env, PAGES_REPO_NAME: "web_programiranje" },
  });
  const index = fs.readFileSync(path.join(root, "_site/index.html"), "utf8");
  assert.match(index, /\/web_programiranje\/css\/site\.css/);
  assert.ok(fs.existsSync(path.join(root, "_site/pojmovnik")));
  assert.ok(fs.existsSync(path.join(root, "_site/client/css/soba.css")));
  fs.rmSync(path.join(root, "_site"), { recursive: true, force: true });
});
