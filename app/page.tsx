"use client";

import { FormEvent, useMemo, useState } from "react";

const inbox = [
  ["Startplan Hafen", "Mara Chen", "09:18", "Bereit"],
  ["Vertragsprüfung", "Jon Bell", "10:05", "Recht"],
  ["Notizen zum Design-Abgleich", "Ana Vale", "Gestern", "Team"],
  ["Quartalsrechnung", "Northstar Labs", "Di", "Finanzen"],
];

const apps = [
  ["Mail", "Ein gemeinsamer Posteingang mit ruhiger Priorisierung", "14 ungelesen"],
  ["Tresor", "Passwörter, Passkeys, Karten und sichere Notizen", "Gesperrt"],
  ["Kalender", "Tag, Woche, Buchungslinks und geteilte Räume", "5 heute"],
  ["Dateien", "Verschlüsselte Ordner, Vorschauen und Transferlinks", "2,4 TB"],
  ["Notizen", "Meetingnotizen, Aufgaben und Projekt-Notizbücher", "32 Dokumente"],
  ["Fokus", "Timer, Blocker, Rituale und Tagesrückblick", "25 Min."],
];

const plans = [
  {
    id: "solo",
    name: "Solo",
    price: 4,
    description: "Für eine Person mit allen Kernmodulen",
    detail: "1 Person, 250 GB Dateien, privater Tresor",
    action: "Solo für 4 EUR starten",
    audience: "Einzelperson",
  },
  {
    id: "family",
    name: "Familie",
    price: 8,
    description: "Für Haushalte, die mehrere Personen gemeinsam verwalten",
    detail: "Bis 6 Personen, Familienkalender, geteilte Ordner und Tresore",
    action: "Familie für 8 EUR starten",
    audience: "Familie",
  },
  {
    id: "team",
    name: "Team",
    price: 12,
    description: "Für kleine Teams mit geteilten Arbeitsbereichen",
    detail: "Bis 10 Mitglieder, Projekträume, Adminrollen",
    action: "Team für 12 EUR starten",
    audience: "Team",
  },
  {
    id: "studio",
    name: "Studio",
    price: 29,
    description: "Für regulierte Teams mit Admin-Kontrollen",
    detail: "Erweiterte Freigaben, Audit-Export, bevorzugter Support",
    action: "Studio für 29 EUR anfragen",
    audience: "Organisation",
  },
];

type CheckoutState = "idle" | "checkout" | "success" | "cancelled";

export default function Home() {
  const [selectedPlanId, setSelectedPlanId] = useState(plans[1].id);
  const [checkoutState, setCheckoutState] = useState<CheckoutState>("idle");
  const [form, setForm] = useState({ name: "", email: "", company: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedPlan = useMemo(
    () => plans.find((plan) => plan.id === selectedPlanId) ?? plans[0],
    [selectedPlanId],
  );

  function openCheckout(planId: string) {
    setSelectedPlanId(planId);
    setCheckoutState("checkout");
    setErrors({});
    window.location.hash = "checkout";
  }

  function cancelCheckout() {
    setCheckoutState("cancelled");
    setErrors({});
    window.location.hash = "pricing";
  }

  function submitCheckout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: Record<string, string> = {};
    if (form.name.trim().length < 2) {
      nextErrors.name = "Bitte geben Sie einen vollständigen Namen ein.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = "Bitte geben Sie eine gültige E-Mail-Adresse ein.";
    }
    if ((selectedPlan.id === "team" || selectedPlan.id === "studio") && form.company.trim().length < 2) {
      nextErrors.company = "Für Team- und Studio-Pläne ist eine Organisation erforderlich.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setCheckoutState("success");
    window.location.hash = "checkout";
  }

  return (
    <main>
      <section className="hero" id="top">
        <nav className="nav" aria-label="Hauptnavigation">
          <a className="brand" href="#top" aria-label="Lumenary Desk Startseite">
            <span className="brandMark">L</span>
            <span>Lumenary Desk</span>
          </a>
          <div className="navLinks">
            <a href="#suite">Suite</a>
            <a href="#security">Sicherheit</a>
            <a href="#pricing">Preise</a>
          </div>
          <a className="navCta" href="#pricing">Jetzt kaufen</a>
        </nav>

        <div className="heroGrid">
          <div className="heroCopy">
            <p className="eyebrow">Desktop-Produktivitätssuite</p>
            <h1>Lumenary Desk</h1>
            <p className="lede">
              Mail, Tresor, Kalender, Dateien, Notizen und Fokuswerkzeuge in
              einem ruhigen Desktop-Arbeitsbereich für private, organisierte
              Arbeit.
            </p>
            <div className="heroActions">
              <a className="primaryBtn" href="#pricing">Plan auswählen</a>
              <a className="secondaryBtn" href="#suite">App ansehen</a>
            </div>
            <div className="proof">
              <span>Offline-first Desktop-Shell</span>
              <span>Zero-Knowledge-Tresormodell</span>
              <span>Kein Werbenetzwerk-Tracking</span>
            </div>
          </div>

          <div className="desktop" aria-label="Vorschau der Desktop-App Lumenary Desk">
            <aside className="rail">
              <span className="railLogo">L</span>
              {["Mail", "Tresor", "Kalender", "Dateien", "Notizen", "Fokus"].map((item) => (
                <button key={item} type="button" aria-label={item}>{item.slice(0, 2)}</button>
              ))}
            </aside>
            <section className="mailPanel">
              <div className="panelHeader">
                <span>Priorisierte Mail</span>
                <button type="button">Schreiben</button>
              </div>
              {inbox.map(([subject, sender, time, tag]) => (
                <article className="message" key={subject}>
                  <div>
                    <strong>{subject}</strong>
                    <small>{sender}</small>
                  </div>
                  <div>
                    <span>{time}</span>
                    <em>{tag}</em>
                  </div>
                </article>
              ))}
            </section>
            <section className="dayPanel">
              <div className="panelHeader">
                <span>Heute</span>
                <strong>9. Aug.</strong>
              </div>
              <div className="calendarStrip">
                {["09", "10", "11", "12", "13"].map((day, index) => (
                  <span className={index === 2 ? "activeDay" : ""} key={day}>{day}</span>
                ))}
              </div>
              <div className="vaultCard">
                <span className="lock">Sicherer Tresor</span>
                <strong>186 Einträge geschützt</strong>
                <p>Passkeys, Wiederherstellungscodes, geteilte Geheimnisse und Karten.</p>
              </div>
              <div className="fileRows">
                <span>Projekträume</span>
                <span>Produkt-Roadmap.pdf</span>
                <span>Teamvereinbarungen.docx</span>
              </div>
            </section>
            <section className="focusPanel">
              <div className="ring">25</div>
              <strong>Fokusphase für konzentrierte Arbeit</strong>
              <p>Benachrichtigungen in Mail, Kalender und Dateien sind pausiert.</p>
              <button type="button">Fokus starten</button>
            </section>
          </div>
        </div>
      </section>

      <section className="suite" id="suite">
        <div className="sectionIntro">
          <p className="eyebrow">Vollständige erste Version</p>
          <h2>Ein Arbeitsbereich, sechs einsatzbereite Module.</h2>
        </div>
        <div className="appGrid">
          {apps.map(([name, text, meta]) => (
            <article className="appCard" key={name}>
              <span>{meta}</span>
              <h3>{name}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="security" id="security">
        <div>
          <p className="eyebrow">Klare Vertrauensgrenze</p>
          <h2>Privat in der Architektur, eigenständig im Design.</h2>
        </div>
        <p>
          Lumenary Desk nutzt einen eigenen Namen, eine eigene visuelle Sprache,
          ein eigenes Inhaltsmodell und eigene Interaktionsmuster. Das MVP
          vermeidet Fremdmarken und konzentriert sich auf verschlüsselte lokale
          Daten, bewusstes Teilen, Gerätefreigaben und einfache Exportkontrollen.
        </p>
      </section>

      <section className="pricing" id="pricing">
        <div className="sectionIntro">
          <p className="eyebrow">Pläne</p>
          <h2>Die Desktop-Suite kaufen.</h2>
        </div>
        <div className="planGrid">
          {plans.map((plan) => (
            <article className="plan" key={plan.id}>
              <span className="planAudience">{plan.audience}</span>
              <h3>{plan.name}</h3>
              <p>{plan.description}</p>
              <strong>{plan.price} EUR<small>/Monat</small></strong>
              <p className="planDetail">{plan.detail}</p>
              <button type="button" onClick={() => openCheckout(plan.id)}>
                {plan.action}
              </button>
            </article>
          ))}
        </div>
        <div className="comparison" aria-label="Planvergleich">
          <span>Solo: privat und günstig</span>
          <span>Familie: gemeinsame Verwaltung für mehrere Personen</span>
          <span>Team: Arbeitsbereiche und Rollen</span>
          <span>Studio: Kontrolle für regulierte Organisationen</span>
        </div>
      </section>

      <section className="checkout" id="checkout" aria-live="polite">
        <div className="checkoutShell">
          <div>
            <p className="eyebrow">Checkout-Demo</p>
            <h2>Bestellung abschließen.</h2>
            <p className="checkoutNote">
              Testmodus: Diese Demo erfasst keine Zahlungsdaten und löst keine
              echte Zahlung aus. Für Live-Zahlungen muss ein Zahlungsanbieter
              mit geheimen Server-Zugangsdaten konfiguriert werden.
            </p>
          </div>

          <div className="checkoutPanel">
            {checkoutState === "success" ? (
              <div className="statusBox success">
                <h3>Bestellung vorgemerkt</h3>
                <p>
                  Der Plan {selectedPlan.name} wurde im Testmodus erfolgreich
                  für {selectedPlan.price} EUR pro Monat ausgewählt. Im Live-Betrieb würde hier die Zahlungsbestätigung
                  des Anbieters verarbeitet.
                </p>
                <button type="button" onClick={() => setCheckoutState("idle")}>
                  Neue Bestellung starten
                </button>
              </div>
            ) : checkoutState === "cancelled" ? (
              <div className="statusBox">
                <h3>Checkout abgebrochen</h3>
                <p>Die Auswahl wurde nicht abgeschlossen. Sie können jederzeit neu starten.</p>
                <button type="button" onClick={() => setCheckoutState("checkout")}>
                  Checkout fortsetzen
                </button>
              </div>
            ) : (
              <form onSubmit={submitCheckout} noValidate>
                <div className="summary">
                  <span>Gewählter Plan</span>
                  <strong>{selectedPlan.name}</strong>
                  <p>{selectedPlan.price} EUR pro Monat, Testmodus aktiv</p>
                  <p>{selectedPlan.detail}</p>
                </div>

                <label>
                  Name
                  <input
                    value={form.name}
                    onChange={(event) => setForm({ ...form, name: event.target.value })}
                    aria-invalid={Boolean(errors.name)}
                    autoComplete="name"
                  />
                  {errors.name && <small>{errors.name}</small>}
                </label>

                <label>
                  E-Mail
                  <input
                    value={form.email}
                    onChange={(event) => setForm({ ...form, email: event.target.value })}
                    aria-invalid={Boolean(errors.email)}
                    autoComplete="email"
                    inputMode="email"
                  />
                  {errors.email && <small>{errors.email}</small>}
                </label>

                <label>
                  Organisation
                  <input
                    value={form.company}
                    onChange={(event) => setForm({ ...form, company: event.target.value })}
                    aria-invalid={Boolean(errors.company)}
                    autoComplete="organization"
                  />
                  {errors.company && <small>{errors.company}</small>}
                </label>

                <div className="checkoutActions">
                  <button type="submit">Testbestellung bestätigen</button>
                  <button type="button" onClick={cancelCheckout}>Abbrechen</button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
