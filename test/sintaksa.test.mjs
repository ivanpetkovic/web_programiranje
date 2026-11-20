import assert from "node:assert/strict";
import test from "node:test";
import { obojenHtml } from "../site/vendor/highlight/highlight.js";

test("poznat jezik dobija tokene, a običan tekst ostaje prazan HTML", () => {
  assert.match(obojenHtml("javascript", "const a = 1;"), /hljs-keyword/);
  assert.match(obojenHtml("js", "let x = 1;"), /hljs-keyword/);
  assert.match(obojenHtml("html", "<p class=\"digit\">24</p>"), /hljs-name/);
  assert.match(obojenHtml("css", ".digit { color: red; }"), /hljs-selector-class/);
  assert.match(obojenHtml("json", "{\"a\": 1}"), /hljs-attr/);
  assert.match(obojenHtml("typescript", "const n: number = 1;"), /hljs-built_in/);
  assert.match(obojenHtml("sql", "SELECT * FROM soba;"), /hljs-keyword/);
  assert.equal(obojenHtml("text", "GET /api/soba"), "");
  assert.equal(obojenHtml("", "const a = 1;"), "");
  assert.equal(obojenHtml("nepoznat", "const a = 1;"), "");
});

test("oznake u kodu ostaju tekst, ne HTML", () => {
  const html = obojenHtml("javascript", "console.log(\"<b>\");");
  assert.equal(html.includes("<b>"), false);
  assert.match(html, /&lt;b&gt;/);
});
