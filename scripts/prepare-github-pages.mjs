#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const repoName =
  process.env.GITHUB_REPOSITORY?.split("/")[1] ||
  process.env.PAGES_REPO_NAME ||
  "web_programiranje";
const base = `/${repoName.replace(/^\/+|\/+$/g, "")}`;
const outDir = path.join(root, "_site");
const TEXT_EXT = new Set([".html", ".css", ".js", ".json", ".svg", ".md", ".mjs"]);

function rimraf(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
}

function prefixPaths(text, prefix) {
  if (!prefix) return text;
  const marker = "__GH_PAGES_BASE__";
  let out = text.split(prefix).join(marker);
  out = out.replaceAll('"/', `"${prefix}/`);
  out = out.replaceAll("'/", `'${prefix}/`);
  out = out.replaceAll('url("/', `url("${prefix}/`);
  out = out.replaceAll("url('/", `url('${prefix}/`);
  out = out.replaceAll("url(/", `url(${prefix}/`);
  return out.split(marker).join(prefix);
}

function copyTree(src, dest, { rewrite = false } = {}) {
  fs.mkdirSync(dest, { recursive: true });
  for (const ent of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, ent.name);
    const to = path.join(dest, ent.name);
    if (ent.isDirectory()) {
      copyTree(from, to, { rewrite });
      continue;
    }
    if (rewrite && TEXT_EXT.has(path.extname(ent.name))) {
      const text = prefixPaths(fs.readFileSync(from, "utf8"), base);
      fs.writeFileSync(to, text);
    } else {
      fs.copyFileSync(from, to);
    }
  }
}

rimraf(outDir);
copyTree(path.join(root, "site"), outDir, { rewrite: true });
copyTree(path.join(root, "client"), path.join(outDir, "client"), { rewrite: true });
fs.copyFileSync(path.join(root, "GLOSSARY.md"), path.join(outDir, "pojmovnik"));
fs.writeFileSync(path.join(outDir, ".nojekyll"), "");

console.log(`GitHub Pages artifact: ${outDir} (base ${base})`);
