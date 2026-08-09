const inbox = [
  ["Harbor launch plan", "Mara Chen", "09:18", "Ready"],
  ["Contract review", "Jon Bell", "10:05", "Legal"],
  ["Design sync notes", "Ana Vale", "Yesterday", "Team"],
  ["Quarterly invoice", "Northstar Labs", "Tue", "Money"],
];

const apps = [
  ["Mail", "Unified inbox with quiet priority triage", "14 unread"],
  ["Vault", "Passwords, passkeys, cards, and secure notes", "Locked"],
  ["Calendar", "Day, week, booking links, and shared rooms", "5 today"],
  ["Files", "Encrypted folders, previews, and transfer links", "2.4 TB"],
  ["Notes", "Meeting notes, tasks, and project notebooks", "32 docs"],
  ["Focus", "Timers, blockers, rituals, and daily review", "25 min"],
];

const plans = [
  ["Solo", "$12", "For one independent operator", "Buy Solo"],
  ["Team", "$29", "For small teams that need shared workspaces", "Buy Team"],
  ["Studio", "$79", "For regulated teams with admin controls", "Talk to sales"],
];

export default function Home() {
  return (
    <main>
      <section className="hero" id="top">
        <nav className="nav" aria-label="Primary navigation">
          <a className="brand" href="#top" aria-label="Lumenary Desk home">
            <span className="brandMark">L</span>
            <span>Lumenary Desk</span>
          </a>
          <div className="navLinks">
            <a href="#suite">Suite</a>
            <a href="#security">Security</a>
            <a href="#pricing">Pricing</a>
          </div>
          <a className="navCta" href="#pricing">Buy now</a>
        </nav>

        <div className="heroGrid">
          <div className="heroCopy">
            <p className="eyebrow">Desktop productivity suite</p>
            <h1>Lumenary Desk</h1>
            <p className="lede">
              Mail, vault, calendar, files, notes, and focus tools in one calm
              desktop workspace built around private, organized work.
            </p>
            <div className="heroActions">
              <a className="primaryBtn" href="#pricing">Choose a plan</a>
              <a className="secondaryBtn" href="#suite">Preview the app</a>
            </div>
            <div className="proof">
              <span>Offline-first desktop shell</span>
              <span>Zero-knowledge vault model</span>
              <span>No ad network tracking</span>
            </div>
          </div>

          <div className="desktop" aria-label="Lumenary Desk desktop app preview">
            <aside className="rail">
              <span className="railLogo">L</span>
              {["Mail", "Vault", "Cal", "Files", "Notes", "Focus"].map((item) => (
                <button key={item} type="button" aria-label={item}>{item.slice(0, 2)}</button>
              ))}
            </aside>
            <section className="mailPanel">
              <div className="panelHeader">
                <span>Priority Mail</span>
                <button type="button">Compose</button>
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
                <span>Today</span>
                <strong>Aug 9</strong>
              </div>
              <div className="calendarStrip">
                {["09", "10", "11", "12", "13"].map((day, index) => (
                  <span className={index === 2 ? "activeDay" : ""} key={day}>{day}</span>
                ))}
              </div>
              <div className="vaultCard">
                <span className="lock">Secure vault</span>
                <strong>186 items protected</strong>
                <p>Passkeys, recovery codes, shared secrets, and cards.</p>
              </div>
              <div className="fileRows">
                <span>Project Rooms</span>
                <span>Product Roadmap.pdf</span>
                <span>Team Agreements.docx</span>
              </div>
            </section>
            <section className="focusPanel">
              <div className="ring">25</div>
              <strong>Deep work session</strong>
              <p>Notifications paused across Mail, Calendar, and Files.</p>
              <button type="button">Start focus</button>
            </section>
          </div>
        </div>
      </section>

      <section className="suite" id="suite">
        <div className="sectionIntro">
          <p className="eyebrow">Complete first version</p>
          <h2>One workspace, six production-ready modules.</h2>
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
          <p className="eyebrow">Clear trust boundary</p>
          <h2>Private by architecture, original by design.</h2>
        </div>
        <p>
          Lumenary Desk uses its own name, visual language, content model, and
          interaction patterns. The MVP avoids third-party branding and focuses
          on encrypted local data, explicit sharing, device approval, and simple
          export controls.
        </p>
      </section>

      <section className="pricing" id="pricing">
        <div className="sectionIntro">
          <p className="eyebrow">Plans</p>
          <h2>Buy the desktop suite.</h2>
        </div>
        <div className="planGrid">
          {plans.map(([name, price, text, action]) => (
            <article className="plan" key={name}>
              <h3>{name}</h3>
              <p>{text}</p>
              <strong>{price}<small>/mo</small></strong>
              <button type="button">{action}</button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
