const path = require("node:path");
const { execFile } = require("node:child_process");
const { promisify } = require("node:util");
const { app, BrowserWindow, ipcMain, shell } = require("electron");
const { ImapFlow } = require("imapflow");
const { simpleParser } = require("mailparser");
const nodemailer = require("nodemailer");

const APP_FILE = path.join(__dirname, "app.html");
const PRELOAD_FILE = path.join(__dirname, "preload.cjs");
const PROJECT_ROOT = path.join(__dirname, "..");
const execFileAsync = promisify(execFile);

async function run(command, args) {
  const { stdout, stderr } = await execFileAsync(command, args, {
    cwd: PROJECT_ROOT,
    windowsHide: true,
    timeout: 120000,
  });

  return `${stdout ?? ""}${stderr ?? ""}`.trim();
}

async function updateDesktopApp() {
  const steps = [];
  steps.push(await run("git", ["fetch", "github", "main"]));
  steps.push(await run("git", ["pull", "--ff-only", "github", "main"]));
  steps.push(await run("cmd.exe", ["/c", "npm.cmd", "install", "--ignore-scripts", "--no-audit", "--no-fund"]));

  return steps.filter(Boolean).join("\n");
}

function normalizeAccount(account) {
  if (!account || typeof account !== "object") {
    throw new Error("Kontodaten fehlen");
  }

  const imapHost = String(account.imapHost || "").trim();
  const smtpHost = String(account.smtpHost || "").trim();
  const user = String(account.user || account.email || "").trim();
  const pass = String(account.pass || "");
  const from = String(account.email || user).trim();

  if (!imapHost || !smtpHost || !user || !pass || !from) {
    throw new Error("Bitte E-Mail, Benutzername, Passwort, IMAP und SMTP ausfüllen");
  }

  return {
    provider: String(account.provider || "standard"),
    email: from,
    user,
    pass,
    imapHost,
    imapPort: Number(account.imapPort || 993),
    smtpHost,
    smtpPort: Number(account.smtpPort || 465),
  };
}

function isLocalHost(host) {
  return host === "127.0.0.1" || host === "localhost";
}

async function withImap(account, action) {
  const config = normalizeAccount(account);
  const client = new ImapFlow({
    host: config.imapHost,
    port: config.imapPort,
    secure: !isLocalHost(config.imapHost) && config.imapPort !== 143 && config.imapPort !== 1143,
    auth: {
      user: config.user,
      pass: config.pass,
    },
    logger: false,
  });

  await client.connect();
  try {
    return await action(client, config);
  } finally {
    await client.logout().catch(() => {});
  }
}

async function fetchInbox(account) {
  return withImap(account, async (client) => {
    const lock = await client.getMailboxLock("INBOX");
    try {
      const total = client.mailbox.exists || 0;
      if (!total) return [];

      const start = Math.max(1, total - 24);
      const messages = [];
      for await (const message of client.fetch(`${start}:*`, {
        envelope: true,
        flags: true,
        source: true,
      })) {
        const parsed = await simpleParser(message.source);
        messages.push({
          uid: message.uid,
          subject: parsed.subject || "(Ohne Betreff)",
          from: parsed.from?.text || message.envelope?.from?.map((item) => item.address).join(", ") || "",
          date: parsed.date ? parsed.date.toISOString() : "",
          text: parsed.text || parsed.html?.replace(/<[^>]*>/g, " ") || "",
          unread: !message.flags?.has("\\Seen"),
        });
      }
      return messages.reverse();
    } finally {
      lock.release();
    }
  });
}

async function sendReply(payload) {
  const account = normalizeAccount(payload?.account);
  const to = String(payload?.to || "").trim();
  const subject = String(payload?.subject || "").trim();
  const text = String(payload?.text || "").trim();

  if (!to || !subject || !text) {
    throw new Error("Empfänger, Betreff und Nachricht sind erforderlich");
  }

  const transport = nodemailer.createTransport({
    host: account.smtpHost,
    port: account.smtpPort,
    secure: !isLocalHost(account.smtpHost) && account.smtpPort === 465,
    auth: {
      user: account.user,
      pass: account.pass,
    },
  });

  await transport.sendMail({
    from: account.email,
    to,
    subject: subject.startsWith("Re:") ? subject : `Re: ${subject}`,
    text,
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 980,
    minHeight: 680,
    title: "Lumenary Desk Mail",
    backgroundColor: "#f6f1e8",
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: PRELOAD_FILE,
      sandbox: false,
    },
  });

  win.loadFile(APP_FILE);

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  win.webContents.on("will-navigate", (event, url) => {
    if (!url.startsWith("file://")) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });
}

app.whenReady().then(() => {
  ipcMain.handle("lumenary:update-app", async () => {
    try {
      const output = await updateDesktopApp();
      return { ok: true, output };
    } catch (error) {
      return {
        ok: false,
        message: error instanceof Error ? error.message : "Update fehlgeschlagen",
      };
    }
  });

  ipcMain.handle("lumenary:mail-test", async (_event, account) => {
    try {
      await withImap(account, async () => true);
      return { ok: true, message: "Mailkonto verbunden" };
    } catch (error) {
      return { ok: false, message: error instanceof Error ? error.message : "Verbindung fehlgeschlagen" };
    }
  });

  ipcMain.handle("lumenary:mail-fetch-inbox", async (_event, account) => {
    try {
      const messages = await fetchInbox(account);
      return { ok: true, messages };
    } catch (error) {
      return { ok: false, message: error instanceof Error ? error.message : "Posteingang konnte nicht geladen werden" };
    }
  });

  ipcMain.handle("lumenary:mail-send-reply", async (_event, payload) => {
    try {
      await sendReply(payload);
      return { ok: true, message: "E-Mail wurde gesendet" };
    } catch (error) {
      return { ok: false, message: error instanceof Error ? error.message : "E-Mail konnte nicht gesendet werden" };
    }
  });

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
