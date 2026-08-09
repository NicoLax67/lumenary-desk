# Lumenary Desk Mail

Lumenary Desk Mail is a desktop-focused email client prototype with a local
Electron shell, a German product website, a download page, and Windows launcher
scripts.

## Features

- Local desktop app with email sign-in gate
- Interactive inbox, folders, search, reader actions, calendar notes, and tasks
- Small email assistant letter that explains the app and selected messages
- Proton Mail Bridge settings for local IMAP/SMTP compatibility
- Windows install and start launchers
- Separate download page with installer files

## Requirements

- Windows
- Node.js `>=22.13.0`
- Git for installer-based updates
- Proton Mail Bridge when connecting a Proton Mail account

## Development

```bash
npm install
npm run build
npm test
npm run desktop
```

## Local Installation

Run:

```powershell
powershell.exe -ExecutionPolicy Bypass -File ".\install button.ps1"
```

The installer creates desktop and Start Menu shortcuts for:

- `Lumenary Desk Mail`
- `start button`

## Proton Mail

Use Proton Mail Bridge, then choose `Proton Mail via Bridge` inside the desktop
app under `Konto verbinden`.

Default local Bridge settings:

- IMAP: `127.0.0.1:1143`
- SMTP: `127.0.0.1:1025`

Use the mailbox credentials shown inside Proton Mail Bridge, not the regular
account password.
