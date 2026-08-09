import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the Lumenary Desk product page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Lumenary Desk \| Private Desktop Productivity Suite<\/title>/i);
  assert.match(html, /Desktop productivity suite/);
  assert.match(html, /Priority Mail/);
  assert.match(html, /Secure vault/);
  assert.match(html, /Buy the desktop suite/);
  assert.match(html, /Zero-knowledge vault model/);
  assert.doesNotMatch(html, /codex-preview|Building your site|react-loading-skeleton/i);
  assert.doesNotMatch(html, /Proton|Outlook|Microsoft|Google/i);
});

test("keeps starter preview code out of the finished MVP", async () => {
  const [page, layout, packageJson, css] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(page, /const apps = \[/);
  assert.match(page, /Mail/);
  assert.match(page, /Vault/);
  assert.match(page, /Calendar/);
  assert.match(page, /Files/);
  assert.match(page, /Notes/);
  assert.match(page, /Focus/);
  assert.match(layout, /openGraph/);
  assert.match(layout, /\/og\.png/);
  assert.match(css, /\.desktop/);
  assert.match(css, /@media \(max-width: 640px\)/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.doesNotMatch(page + layout, /_sites-preview|SkeletonPreview|codex-preview/);
});
