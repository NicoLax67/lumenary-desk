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

test("server-renders the required email login gate", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Lumenary Desk \| Privates Desktop-E-Mail-Programm<\/title>/i);
  assert.match(html, /Anmeldung erforderlich/);
  assert.match(html, /Ihr E-Mail-Programm ist geschützt/);
  assert.match(html, /Mail-App öffnen/);
  assert.match(html, /Keine offene Demo/);
  assert.match(html, /Lokale Sitzung/);
  assert.doesNotMatch(html, /Priorisierter Posteingang|Mail-Plan bestellen/);
  assert.doesNotMatch(html, /Desktop-Produktivitätssuite|Tresormodell|Passkeys/i);
  assert.doesNotMatch(html, /Proton|Outlook|Microsoft|Google/i);
});

test("keeps checkout, desktop app, and email positioning wired", async () => {
  const [page, layout, packageJson, css, desktopMain, desktopHtml, installer, installButton, protonReadme] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../desktop/main.cjs", import.meta.url), "utf8"),
    readFile(new URL("../desktop/app.html", import.meta.url), "utf8"),
    readFile(new URL("../desktop/install-windows.ps1", import.meta.url), "utf8"),
    readFile(new URL("../install button.ps1", import.meta.url), "utf8"),
    readFile(new URL("../README.proton-mail.md", import.meta.url), "utf8"),
  ]);

  assert.match(page, /lumenary-mail-user/);
  assert.match(page, /submitLogin/);
  assert.match(page, /Mail-App öffnen/);
  assert.match(page, /const features = \[/);
  assert.match(page, /Posteingang/);
  assert.match(page, /Kontakte/);
  assert.match(page, /Aufgaben/);
  assert.match(page, /Regeln/);
  assert.match(page, /id: "family"/);
  assert.match(page, /gemeinsam verwalteten Mailkonten/);
  assert.match(page, /Gewählter Mail-Plan/);
  assert.match(page, /submitCheckout/);
  assert.match(page, /Bitte geben Sie eine gültige E-Mail-Adresse ein/);
  assert.match(page, /Zahlungs-Testmodus/);
  assert.match(layout, /Desktop-E-Mail-Programm/);
  assert.match(layout, /E-Mail, Kalender und Kontakte ruhig organisiert/);
  assert.match(packageJson, /"desktop": "electron desktop\/main\.cjs"/);
  assert.match(packageJson, /"electron":/);
  assert.match(desktopMain, /BrowserWindow/);
  assert.match(desktopMain, /loadFile\(APP_FILE\)/);
  assert.doesNotMatch(desktopMain, /lumenary-desk\.nicolax67\.chatgpt\.site|loadURL/);
  assert.match(desktopHtml, /Es wird keine ChatGPT-Anmeldung benötigt/);
  assert.match(desktopHtml, /lumenary-desktop-user/);
  assert.match(desktopHtml, /data-folder="Posteingang"/);
  assert.match(desktopHtml, /data-subject="Angebot für Website-Relaunch"/);
  assert.match(desktopHtml, /readerTitle\.textContent/);
  assert.match(desktopHtml, /Ordner " \+ folder\.dataset\.folder \+ " geöffnet/);
  assert.match(desktopHtml, /Antwortentwurf erstellt/);
  assert.match(desktopHtml, /search\.addEventListener\("input"/);
  assert.match(desktopHtml, /Proton Mail via Bridge/);
  assert.match(desktopHtml, /127\.0\.0\.1/);
  assert.match(desktopHtml, /1143/);
  assert.match(desktopHtml, /1025/);
  assert.match(desktopHtml, /lumenary-mail-account/);
  assert.match(installer, /electron\.exe/);
  assert.doesNotMatch(installer, /npm\.cmd|run desktop/);
  assert.match(installButton, /desktop\\install-windows\.ps1/);
  assert.match(protonReadme, /Proton Mail Bridge/);
  assert.match(protonReadme, /127\.0\.0\.1/);
  assert.match(css, /\.authCard/);
  assert.match(css, /\.desktop/);
  assert.match(css, /\.checkoutPanel/);
  assert.match(css, /\.comparison/);
  assert.match(css, /@media \(max-width: 640px\)/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.doesNotMatch(page + layout, /_sites-preview|SkeletonPreview|codex-preview/);
});
