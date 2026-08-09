import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lumenary Desk Download",
  description: "Laden Sie Lumenary Desk Mail für Windows herunter.",
};

export default function DownloadPage() {
  return (
    <main className="downloadPage">
      <section className="downloadHero">
        <nav className="downloadNav" aria-label="Download Navigation">
          <a className="brand" href="/" aria-label="Lumenary Desk Startseite">
            <span className="brandMark">L</span>
            <span>Lumenary Desk</span>
          </a>
          <a className="secondaryBtn" href="/">Zur Mail-Seite</a>
        </nav>

        <div className="downloadGrid">
          <div>
            <p className="eyebrow">Download-Webseite</p>
            <h1>Lumenary Desk Mail herunterladen.</h1>
            <p className="lede">
              Installieren Sie die Desktop-App mit einem eigenen Installer.
              Danach finden Sie den start button auf dem Desktop und im Startmenü.
            </p>
            <div className="heroActions">
              <a className="primaryBtn" href="/download/install-button.ps1" download>
                install button herunterladen
              </a>
              <a className="secondaryBtn" href="/download/start-button.cmd" download>
                start button herunterladen
              </a>
            </div>
          </div>

          <aside className="downloadCard">
            <h2>So geht es</h2>
            <ol>
              <li>install button herunterladen.</li>
              <li>Datei mit Rechtsklick ausführen.</li>
              <li>Falls Windows fragt, Ausführung bestätigen.</li>
              <li>Danach start button öffnen.</li>
            </ol>
            <p>
              Der Installer lädt die aktuelle Version aus GitHub, installiert
              Electron und richtet die Desktop-Verknüpfungen ein.
            </p>
          </aside>
        </div>
      </section>

      <section className="downloadInfo">
        <article>
          <h3>Adresse</h3>
          <p>
            Die gültige Download-Adresse wird als Sites-URL veröffentlicht. Eine
            Eingabe wie <strong>hhts.lumenary-desk-download</strong> ist keine
            gültige Webadresse; nutzen Sie die unten genannte HTTPS-Adresse.
          </p>
        </article>
        <article>
          <h3>Proton Mail</h3>
          <p>
            Proton Mail funktioniert in der Desktop-App über Proton Mail Bridge.
            Nach der Installation wählen Sie Konto verbinden und dann Proton Mail
            via Bridge.
          </p>
        </article>
      </section>
    </main>
  );
}
