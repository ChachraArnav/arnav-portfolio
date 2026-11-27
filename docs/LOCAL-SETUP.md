# Local setup (Windows + PowerShell)

Every command below says **where** to run it. "In `E:\Portfolio`" means your PowerShell prompt should show `PS E:\Portfolio>` before you type the command.

Local development runs the site on your own laptop at `http://localhost:3000`. Only you can see it, and it stops when you close PowerShell or turn the laptop off. To put the site online permanently, see [`DEPLOYMENT.md`](DEPLOYMENT.md).

---

## 1. Install the prerequisites (once)

Open **PowerShell** (Start menu → type "PowerShell" → Windows PowerShell). From any folder:

```powershell
winget install OpenJS.NodeJS.LTS
winget install Git.Git
```

If `winget` isn't recognized, download the installers instead: Node.js **LTS** from https://nodejs.org and Git from https://git-scm.com/download/win. Accept the defaults.

**Close PowerShell and open a new window** so it picks up the new programs.

Optional but recommended: [VS Code](https://code.visualstudio.com/) (`winget install Microsoft.VisualStudioCode`).

## 2. Check Node.js and npm versions

From any folder:

```powershell
node --version
npm --version
git --version
```

You need Node **20.9 or newer** (22 or 24 LTS is ideal). Any npm 10+ is fine.

If PowerShell says `running scripts is disabled on this system` when you run `npm`, run this once:

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

Type `Y` when asked.

## 3. Put the project in `E:\Portfolio`

1. Download `portfolio.zip` from the conversation.
2. Extract it so that `E:\Portfolio\package.json` exists. Check that the files aren't one folder deeper, like `E:\Portfolio\portfolio\package.json`.

Then, from any folder:

```powershell
Set-Location E:\Portfolio
Get-ChildItem
```

You should see `package.json`, `src`, `public`, `docs` and so on.

## 4. Install dependencies

In `E:\Portfolio`:

```powershell
npm ci
```

This installs the exact versions from `package-lock.json` into `node_modules` (a few hundred MB, one to three minutes). If `npm ci` complains, use `npm install` instead.

## 5. Start the development server

In `E:\Portfolio`:

```powershell
npm run dev
```

Leave this window open. It reloads the page automatically whenever you save a file.

## 6. Open the website

Open http://localhost:3000 in your browser, or from a **second** PowerShell window:

```powershell
Start-Process http://localhost:3000
```

Try `Ctrl+K` for the command palette, and http://localhost:3000/quick-view and http://localhost:3000/projects/emak-solutions.

**Don't see the effects?** If Windows has animations turned off (Settings → Accessibility → Visual effects → Animation effects), the site starts with effects off to respect that. Click the ⚡ button in the header to turn them on. The choice is remembered in that browser.

To stop the server, click the first PowerShell window and press `Ctrl+C`.

## 7. Run linting

In `E:\Portfolio`:

```powershell
npm run lint
```

No output means no problems.

## 8. Run type checking

In `E:\Portfolio`:

```powershell
npm run typecheck
```

## 9. Run tests

In `E:\Portfolio`:

```powershell
npm test
```

Expect `Tests  55 passed (55)`. Use `npm run test:watch` to re-run tests as you edit.

## 10. Create a production build

Stop the dev server first (`Ctrl+C`). Then, in `E:\Portfolio`:

```powershell
npm run build
```

This is the same build Vercel runs. If it passes here, it should pass there.

## 11. Run the production build locally

In `E:\Portfolio`, after step 10:

```powershell
npm start
```

Open http://localhost:3000. This is the optimized site as visitors will get it. Stop with `Ctrl+C`.

Shortcut that runs steps 7 to 10 in one go, in `E:\Portfolio`:

```powershell
npm run check
```

## 12. Restart after changes

- **While `npm run dev` is running:** just save the file. The browser updates by itself.
- **After editing `next.config.ts`, `.env.local` or `package.json`:** in the dev-server window press `Ctrl+C`, then run `npm run dev` again in `E:\Portfolio`.
- **To check a production build after changes:** `Ctrl+C`, then in `E:\Portfolio`:

  ```powershell
  npm run build
  npm start
  ```

- **If something behaves strangely:** stop the server, then in `E:\Portfolio`:

  ```powershell
  Remove-Item -Recurse -Force .next
  npm run dev
  ```

## Troubleshooting

| Symptom                                     | Fix                                                                                                  |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `Port 3000 is in use`                       | Something else is running there. Use `npm run dev -- -p 3001` and open http://localhost:3001         |
| `'node' is not recognized`                  | Close and reopen PowerShell after installing Node. If it still fails, reinstall Node LTS.            |
| `npm ci` fails with lockfile errors         | Run `npm install` instead                                                                            |
| Changes don't appear                        | Hard refresh with `Ctrl+Shift+R`. If that doesn't help, delete `.next` as above                      |
| "Recently on GitHub" shows the fallback box | Normal when GitHub's API is unreachable or rate-limited. Optionally add a token (see `.env.example`) |

## Optional: environment variables

Copy the example file, in `E:\Portfolio`:

```powershell
Copy-Item .env.example .env.local
notepad .env.local
```

Both values are optional. `.env.local` is git-ignored and never committed.
