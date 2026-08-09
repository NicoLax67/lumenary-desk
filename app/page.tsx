"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

const inbox = [
  ["Angebot für Website-Relaunch", "Mara Chen", "09:18", "Antwort"],
  ["Kalendereinladung: Strategie", "Jon Bell", "10:05", "Termin"],
  ["Rechnung August", "Northstar Labs", "Gestern", "Beleg"],
  ["Neue Nachricht aus dem Familienpostfach", "Lea Sommer", "Di", "Familie"],
];

const features = [
  ["Posteingang", "Mehrere Konten, Unterhaltungen, Anhänge und schnelle Antworten", "14 ungelesen"],
  ["Kalender", "Termine, Einladungen, Verfügbarkeiten und Erinnerungen", "5 heute"],
  ["Kontakte", "Adressbuch, Verteilerlisten und Kontaktverlauf", "842 Kontakte"],
  ["Aufgaben", "Nachrichten in Aufgaben verwandeln und Fristen verfolgen", "7 offen"],
  ["Regeln", "Filter, Labels, Weiterleitungen und automatische Ablage", "18 aktiv"],
  ["Archiv", "Schnelle Suche, gespeicherte Anhänge und lokale Offline-Kopie", "2,4 TB"],
];

const folders = ["Posteingang", "Gesendet", "Entwürfe", "Familie", "Rechnungen", "Archiv"];

const communityChannels = ["Mailhilfe", "Arbeitsabläufe", "Proton Bridge", "Familie", "Wünsche"];

const starterPosts = [
  {
    id: 1,
    channel: "Mailhilfe",
    title: "Wie halte ich den Posteingang leer?",
    author: "Lena",
    body: "Ich nutze Regeln für Rechnungen und lasse nur persönliche Antworten oben stehen.",
    votes: 38,
    replies: ["Regeln plus Aufgaben funktionieren gut.", "Ich archiviere alles nach Antwort."],
  },
  {
    id: 2,
    channel: "Proton Bridge",
    title: "Bridge-Verbindung schnell prüfen",
    author: "Nico",
    body: "Erst Proton Mail Bridge starten, dann in Lumenary Benutzername und Passwort aus Bridge kopieren.",
    votes: 24,
    replies: ["Der lokale Port 1143 war bei mir wichtig."],
  },
  {
    id: 3,
    channel: "Wünsche",
    title: "Familienpostfach mit klaren Rollen",
    author: "Mara",
    body: "Für Familie wäre praktisch: Eltern verwalten Regeln, Kinder sehen nur eigene Ordner.",
    votes: 19,
    replies: ["Gute Idee für den Familienplan."],
  },
];

const plans = [
  {
    id: "solo",
    name: "Solo Mail",
    price: 4,
    description: "Für eine Person mit mehreren E-Mail-Konten",
    detail: "1 Person, 5 Postfächer, Kalender, Kontakte und 250 GB Mailarchiv",
    action: "Solo Mail für 4 EUR starten",
    audience: "Einzelperson",
  },
  {
    id: "family",
    name: "Familie Mail",
    price: 8,
    description: "Für Haushalte mit gemeinsam verwalteten Mailkonten",
    detail: "Bis 6 Personen, Familienpostfach, geteilter Kalender und Rollen",
    action: "Familie Mail für 8 EUR starten",
    audience: "Familie",
  },
  {
    id: "team",
    name: "Team Mail",
    price: 12,
    description: "Für kleine Teams mit gemeinsamen Postfächern",
    detail: "Bis 10 Mitglieder, Team-Inbox, Aliasse, Regeln und Aufgaben",
    action: "Team Mail für 12 EUR starten",
    audience: "Team",
  },
  {
    id: "studio",
    name: "Studio Mail",
    price: 29,
    description: "Für Organisationen mit Freigaben und Kontrollbedarf",
    detail: "Audit-Export, Archivrichtlinien, Adminrollen und bevorzugter Support",
    action: "Studio Mail für 29 EUR anfragen",
    audience: "Organisation",
  },
];

type CheckoutState = "idle" | "checkout" | "success" | "cancelled";

export default function Home() {
  const [selectedPlanId, setSelectedPlanId] = useState(plans[1].id);
  const [checkoutState, setCheckoutState] = useState<CheckoutState>("idle");
  const [form, setForm] = useState({ name: "", email: "", company: "" });
  const [communityPosts, setCommunityPosts] = useState(starterPosts);
  const [postForm, setPostForm] = useState({ title: "", channel: communityChannels[0], body: "" });
  const [communityQuery, setCommunityQuery] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loginEmail, setLoginEmail] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    setUserEmail(window.localStorage.getItem("lumenary-mail-user") ?? "");
  }, []);

  const selectedPlan = useMemo(
    () => plans.find((plan) => plan.id === selectedPlanId) ?? plans[0],
    [selectedPlanId],
  );

  const visibleCommunityPosts = useMemo(() => {
    const query = communityQuery.trim().toLowerCase();
    if (!query) return communityPosts;
    return communityPosts.filter((post) =>
      `${post.channel} ${post.title} ${post.author} ${post.body}`.toLowerCase().includes(query),
    );
  }, [communityPosts, communityQuery]);

  function openCheckout(planId: string) {
    setSelectedPlanId(planId);
    setCheckoutState("checkout");
    setErrors({});
    window.location.hash = "checkout";
  }

  function submitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = loginEmail.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setLoginError("Bitte geben Sie eine gültige E-Mail-Adresse ein.");
      return;
    }

    window.localStorage.setItem("lumenary-mail-user", email);
    setUserEmail(email);
    setForm((current) => ({ ...current, email }));
    setLoginError("");
  }

  function signOut() {
    window.localStorage.removeItem("lumenary-mail-user");
    setUserEmail("");
    setLoginEmail("");
    setCheckoutState("idle");
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

  function submitPost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (postForm.title.trim().length < 3 || postForm.body.trim().length < 8) {
      return;
    }

    setCommunityPosts((current) => [
      {
        id: Date.now(),
        channel: postForm.channel,
        title: postForm.title.trim(),
        author: userEmail.split("@")[0] || "Mitglied",
        body: postForm.body.trim(),
        votes: 1,
        replies: [],
      },
      ...current,
    ]);
    setPostForm({ title: "", channel: communityChannels[0], body: "" });
  }

  function votePost(postId: number) {
    setCommunityPosts((current) =>
      current.map((post) => (post.id === postId ? { ...post, votes: post.votes + 1 } : post)),
    );
  }

  if (!userEmail) {
    return (
      <main className="authMain">
        <section className="authShell" aria-label="Anmeldung">
          <a className="brand" href="#top" aria-label="Lumenary Desk Startseite">
            <span className="brandMark">L</span>
            <span>Lumenary Desk</span>
          </a>
          <div className="authGrid">
            <div>
              <p className="eyebrow">Anmeldung erforderlich</p>
              <h1>Ihr E-Mail-Programm ist geschützt.</h1>
              <p className="lede">
                Melden Sie sich mit Ihrer E-Mail-Adresse an, um den Posteingang,
                Kalender, Kontakte, Regeln und die Bestellung von Lumenary Desk
                zu öffnen.
              </p>
              <div className="proof">
                <span>Lokale Sitzung</span>
                <span>Echte Mail-App</span>
                <span>Desktop-App bereit</span>
              </div>
            </div>

            <form className="authCard" onSubmit={submitLogin} noValidate>
              <h2>Anmelden</h2>
              <label>
                E-Mail-Adresse
                <input
                  value={loginEmail}
                  onChange={(event) => setLoginEmail(event.target.value)}
                  aria-invalid={Boolean(loginError)}
                  autoComplete="email"
                  inputMode="email"
                  placeholder="name@example.com"
                />
                {loginError && <small>{loginError}</small>}
              </label>
              <button type="submit">Mail-App öffnen</button>
              <p>
                Diese Anmeldung erstellt eine lokale Sitzung auf diesem Gerät.
                In der Desktop-App verbinden Sie Ihr echtes Mailkonto über
                IMAP/SMTP oder Proton Mail Bridge.
              </p>
            </form>
          </div>
        </section>
      </main>
    );
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
            <a href="#suite">E-Mail</a>
            <a href="#community">Kreis</a>
            <a href="#advertising">Werbung</a>
            <a href="#security">Sicherheit</a>
            <a href="#pricing">Preise</a>
          </div>
          <a className="navCta" href="#pricing">Mail-Plan kaufen</a>
          <button className="accountBtn" type="button" onClick={signOut}>
            {userEmail}
          </button>
        </nav>

        <div className="heroGrid">
          <div className="heroCopy">
            <p className="eyebrow">Desktop-E-Mail-Programm</p>
            <h1>Lumenary Desk</h1>
            <p className="lede">
              Ein eigenständiger Mail-Client für Windows, Mac und Web: mehrere
              Postfächer, Kalender, Kontakte, Aufgaben, Regeln und Offline-Suche
              in einer ruhigen Oberfläche.
            </p>
            <div className="heroActions">
              <a className="primaryBtn" href="#pricing">Mail-Plan auswählen</a>
              <a className="secondaryBtn" href="#suite">E-Mail-App ansehen</a>
            </div>
            <div className="proof">
              <span>Mehrere E-Mail-Konten</span>
              <span>Kalender und Kontakte integriert</span>
              <span>Offline lesen und suchen</span>
            </div>
          </div>

          <div className="desktop" aria-label="E-Mail-Programm Lumenary Desk">
            <aside className="rail">
              <span className="railLogo">L</span>
              {["Mail", "Kalender", "Kontakte", "Aufgaben", "Regeln", "Archiv"].map((item) => (
                <button key={item} type="button" aria-label={item}>{item.slice(0, 2)}</button>
              ))}
            </aside>
            <section className="mailPanel">
              <div className="panelHeader">
                <span>Priorisierter Posteingang</span>
                <button type="button">Neue Mail</button>
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
                <span>Ordner</span>
                <strong>6 aktiv</strong>
              </div>
              <div className="fileRows">
                {folders.map((folder) => (
                  <span key={folder}>{folder}</span>
                ))}
              </div>
              <div className="vaultCard">
                <span className="lock">Kalender heute</span>
                <strong>14:00 Strategie-Call</strong>
                <p>Einladung aus Mail erkannt, Raum und Agenda automatisch verknüpft.</p>
              </div>
            </section>
            <section className="focusPanel">
              <div className="ring">42</div>
              <strong>Minuten seit letzter Antwort</strong>
              <p>Antwortentwürfe, Regeln und Aufgaben helfen, den Posteingang leer zu halten.</p>
              <button type="button">Posteingang aufräumen</button>
            </section>
          </div>
        </div>
      </section>

      <section className="suite" id="suite">
        <div className="sectionIntro">
          <p className="eyebrow">E-Mail-Funktionen</p>
          <h2>Alles, was ein modernes Mail-Programm braucht.</h2>
        </div>
        <div className="appGrid">
          {features.map(([name, text, meta]) => (
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
          <p className="eyebrow">Eigenständig und vertraulich</p>
          <h2>Ein Mail-Client mit klarer Privatsphäre.</h2>
        </div>
        <p>
          Lumenary Desk ist keine Kopie eines bestehenden Mailprogramms. Name,
          Oberfläche und Abläufe sind eigenständig. Die App konzentriert sich
          auf mehrere Postfächer, lokale Suche, verschlüsselte Gerätespeicherung,
          klare Freigaben und nachvollziehbare Regeln.
        </p>
      </section>

      <section className="community" id="community">
        <div className="sectionIntro">
          <p className="eyebrow">Lumenary Kreis</p>
          <h2>Eine eigene Community für Mailfragen.</h2>
          <p>
            Fragen stellen, Lösungen sammeln, Wünsche besprechen und hilfreiche
            Beiträge nach oben wählen. Alles eigenständig für Lumenary Desk.
          </p>
        </div>

        <div className="communityShell">
          <aside className="channelPanel" aria-label="Community-Kanäle">
            <strong>Kanäle</strong>
            {communityChannels.map((channel) => (
              <span key={channel}>{channel}</span>
            ))}
          </aside>

          <section className="threadPanel" aria-label="Community-Beiträge">
            <div className="communityTools">
              <input
                value={communityQuery}
                onChange={(event) => setCommunityQuery(event.target.value)}
                placeholder="Beitrag oder Thema suchen"
                aria-label="Community durchsuchen"
              />
            </div>
            {visibleCommunityPosts.map((post) => (
              <article className="communityPost" key={post.id}>
                <button type="button" onClick={() => votePost(post.id)} aria-label={`${post.title} hilfreich finden`}>
                  ↑ {post.votes}
                </button>
                <div>
                  <span>{post.channel} · {post.author}</span>
                  <h3>{post.title}</h3>
                  <p>{post.body}</p>
                  <small>{post.replies.length} Antworten</small>
                </div>
              </article>
            ))}
          </section>

          <form className="postComposer" onSubmit={submitPost}>
            <strong>Neuen Beitrag schreiben</strong>
            <label>
              Kanal
              <select
                value={postForm.channel}
                onChange={(event) => setPostForm({ ...postForm, channel: event.target.value })}
              >
                {communityChannels.map((channel) => (
                  <option key={channel} value={channel}>{channel}</option>
                ))}
              </select>
            </label>
            <label>
              Titel
              <input
                value={postForm.title}
                onChange={(event) => setPostForm({ ...postForm, title: event.target.value })}
                placeholder="Kurze Frage oder Idee"
              />
            </label>
            <label>
              Text
              <textarea
                value={postForm.body}
                onChange={(event) => setPostForm({ ...postForm, body: event.target.value })}
                placeholder="Was möchten Sie teilen?"
              />
            </label>
            <button type="submit">Beitrag veröffentlichen</button>
          </form>
        </div>
      </section>

      <section className="adSection" id="advertising" aria-label="Anzeige für Lumenary Desk Mail">
        <div className="adShell">
          <div>
            <p className="eyebrow">Anzeige</p>
            <h2>Ein Posteingang, der wieder ruhig wirkt.</h2>
            <p>
              Lumenary Desk Mail verbindet echte E-Mail-Konten, Kalender,
              Aufgaben und Community-Hilfe in einer klaren Desktop-App.
            </p>
          </div>
          <div className="adCard">
            <span>Jetzt für Windows</span>
            <strong>Mail lesen, beantworten und organisieren.</strong>
            <p>
              Proton Mail Bridge, IMAP/SMTP, Familienplan und eigener
              Lumenary Kreis für Fragen und Tipps.
            </p>
            <div className="adActions">
              <a href="/download">Install Button holen</a>
              <button type="button" onClick={() => openCheckout("family")}>Familienplan ansehen</button>
            </div>
          </div>
        </div>
      </section>

      <section className="pricing" id="pricing">
        <div className="sectionIntro">
          <p className="eyebrow">Mail-Pläne</p>
          <h2>Das E-Mail-Programm kaufen.</h2>
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
          <span>Solo: persönlicher Mail-Client</span>
          <span>Familie: mehrere Personen gemeinsam verwalten</span>
          <span>Team: gemeinsame Postfächer und Aufgaben</span>
          <span>Studio: Adminrollen, Archiv und Kontrolle</span>
        </div>
      </section>

      <section className="checkout" id="checkout" aria-live="polite">
        <div className="checkoutShell">
          <div>
            <p className="eyebrow">Checkout</p>
            <h2>Mail-Plan bestellen.</h2>
            <p className="checkoutNote">
              Zahlungs-Testmodus: Diese Bestellung erfasst keine Zahlungsdaten und löst keine
              echte Zahlung aus. Für Live-Zahlungen muss ein Zahlungsanbieter
              mit geheimen Server-Zugangsdaten konfiguriert werden.
            </p>
          </div>

          <div className="checkoutPanel">
            {checkoutState === "success" ? (
              <div className="statusBox success">
                <h3>Mail-Plan vorgemerkt</h3>
                <p>
                  Der Plan {selectedPlan.name} wurde im Zahlungs-Testmodus erfolgreich
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
                  <span>Gewählter Mail-Plan</span>
                  <strong>{selectedPlan.name}</strong>
                  <p>{selectedPlan.price} EUR pro Monat, Zahlungs-Testmodus aktiv</p>
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
                  <button type="submit">Bestellung bestätigen</button>
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
