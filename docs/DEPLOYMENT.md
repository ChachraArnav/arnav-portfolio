# Publishing the site permanently (GitHub + Vercel)

## Local vs production: the difference

|                      | Local (`npm run dev`)         | Production (Vercel)                               |
| -------------------- | ----------------------------- | ------------------------------------------------- |
| Who can see it       | Only you, at `localhost:3000` | Anyone, at a public `https://` URL                |
| Needs your laptop on | Yes                           | **No.** It runs on Vercel's servers and CDN, 24/7 |
| Updates              | Instantly as you save         | Automatically about a minute after you `git push` |

The workflow: your code lives on **GitHub**. **Vercel** watches the repository, builds the site whenever you push to `main`, and serves it worldwide over HTTPS. Your computer is only needed to make changes.

**Conditions to keep it online:** keep the GitHub repository and Vercel project (don't delete either), keep your Vercel account in good standing, and stay within the free plan's limits (below). If you add a custom domain, renew it every year.

---

## Part A: GitHub

### 1. Create a GitHub repository

1. Sign in at https://github.com as **chachraarnav**.
2. Click **+** (top right) → **New repository**.
3. Repository name: `portfolio`. Visibility: **Public** (lets recruiters read the code, which is part of the point) or Private (works the same with Vercel).
4. **Do not** tick "Add a README", ".gitignore" or "license". The project already has them.
5. Click **Create repository**. Keep the page open. You'll need the URL `https://github.com/chachraarnav/portfolio.git`.

### 2. Initialize Git locally

First time only, set your identity. From any folder:

```powershell
git config --global user.name "Arnav Chachra"
git config --global user.email "chachraarnav@gmail.com"
```

Then in `E:\Portfolio`:

```powershell
git init -b main
```

(If the folder already has a `.git` folder from the zip, this just says "Reinitialized". That's fine.)

### 3. The `.gitignore` file

It's already included at `E:\Portfolio\.gitignore`. It keeps out `node_modules`, `.next` build output, `.env*` secret files (except `.env.example`), `.vercel`, TypeScript build info and OS clutter. Check what will be committed, in `E:\Portfolio`:

```powershell
git status
```

You should **not** see `node_modules`, `.next` or `.env.local` in the list.

### 4. Commit the project

In `E:\Portfolio`:

```powershell
git add -A
git commit -m "Portfolio site"
```

### 5. Connect to GitHub

In `E:\Portfolio`:

```powershell
git remote add origin https://github.com/chachraarnav/portfolio.git
git remote -v
```

If it says `remote origin already exists`, run `git remote set-url origin https://github.com/chachraarnav/portfolio.git` instead.

### 6. Push

In `E:\Portfolio`:

```powershell
git push -u origin main
```

A browser window opens to sign in to GitHub the first time (Git Credential Manager). Approve it. Refresh the GitHub page and your files appear.

---

## Part B: Vercel

### 7. Create a Vercel account

Go to https://vercel.com/signup, choose **Hobby** (free, for personal non-commercial projects; a personal portfolio fits) and **Continue with GitHub**. Signing up through GitHub links the two accounts.

### 8. Import the repository

1. On the Vercel dashboard click **Add New… → Project**.
2. Under "Import Git Repository", find `chachraarnav/portfolio` and click **Import**. If it's not listed, click **Adjust GitHub App Permissions** and grant access to the repository.

### 9. Build settings

Vercel detects Next.js. Leave the defaults:

- Framework Preset: **Next.js**
- Root Directory: `./`
- Build Command: `next build` (default)
- Output Directory: default
- Install Command: default (`npm install`)

Node.js version: the project needs ≥ 20.9. Vercel's current default meets that. You can confirm under **Project → Settings → Build and Deployment → Node.js Version** after import.

### 10. Environment variables

**None are required.** The site URL is detected from Vercel automatically.

Optional, under **Environment Variables** on the import screen or later in **Settings → Environment Variables**:

| Name                   | Value                                               | When                                                                                                                                                             |
| ---------------------- | --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | `https://arnavchachra.com`                          | Only after you connect a custom domain (step 14). Makes canonical URLs, the sitemap and social previews use it.                                                  |
| `GITHUB_TOKEN`         | a GitHub fine-grained token with **no** permissions | Only if the "Recently on GitHub" list ever shows the fallback because of rate limits. Create at GitHub → Settings → Developer settings → Personal access tokens. |

After changing environment variables, redeploy (Deployments → ⋯ → Redeploy) for them to take effect.

### 11. Deploy

Click **Deploy**. The build takes about one to two minutes. When it finishes you'll see a preview image and **Continue to Dashboard**.

### 12. Verify the public URL

On the project page, **Domains** shows the production URL, typically `https://portfolio-<something>.vercel.app` or `https://<project-name>.vercel.app`. You can rename the project (Settings → General → Project Name) to get a nicer `*.vercel.app` address, if it's available.

Check on your phone (on mobile data, not Wi-Fi) with your laptop **off**:

- [ ] Home page loads over `https://` with the padlock
- [ ] `/quick-view` and `/projects/emak-solutions` load
- [ ] The ⚡ effects switch turns animations on and off
- [ ] `Ctrl+K` opens the palette (on desktop)
- [ ] `/sitemap.xml` lists URLs that start with your live domain
- [ ] A made-up URL such as `/test-404` shows the custom 404 page

Then run Lighthouse: Chrome → open your live URL → `F12` → **Lighthouse** tab → Analyze page load (mobile and desktop). The site is built to score well, but these scores haven't been measured yet, so record them yourself.

### 13. Automatic redeployment

This is already on. Every `git push` to `main` triggers a production deployment. Pushes to other branches create **preview** deployments with their own URLs, which is useful for trying changes before they go live.

**Updating the site later**, in `E:\Portfolio`:

```powershell
npm run check
git add -A
git commit -m "Describe what changed"
git push
```

Watch progress under the project's **Deployments** tab. The new version is live about a minute after a green "Ready".

---

## Part C: Custom domain (optional)

### 14. Connect a domain such as arnavchachra.com

1. Check availability and buy it, either at **Vercel → Domains → Buy** (DNS is then configured automatically, so you can skip step 15) or at a registrar like Cloudflare, Namecheap or Porkbun. A `.com` typically costs about US$10–20 per year and must be renewed annually. `.ca` is also an option for Canadians.
2. In Vercel: **Project → Settings → Domains → Add**, enter `arnavchachra.com`. Vercel will offer to add `www.arnavchachra.com` too and redirect one to the other. Accept.

### 15. DNS and HTTPS

If you bought the domain elsewhere, Vercel shows the exact records to add. Typically:

| Type    | Name  | Value                                                |
| ------- | ----- | ---------------------------------------------------- |
| `A`     | `@`   | the IP address Vercel shows (e.g. `76.76.21.21`)     |
| `CNAME` | `www` | the value Vercel shows (e.g. `cname.vercel-dns.com`) |

Use the values on **your** Vercel Domains screen, not this table, as Vercel may give project-specific ones. Add them in your registrar's DNS settings and delete any conflicting `A`/`CNAME` records for `@` and `www` (often a "parking" record).

DNS can take from minutes to a few hours. The Vercel Domains page turns green when it's working. **HTTPS certificates are issued and renewed automatically**, so there's nothing else to configure.

Finally set `NEXT_PUBLIC_SITE_URL` to `https://arnavchachra.com` (step 10) and redeploy, so search engines and link previews use your domain.

**Make it discoverable:** add the domain at https://search.google.com/search-console (verify with a DNS TXT record), then submit `https://arnavchachra.com/sitemap.xml` under **Sitemaps**. Put the URL on your LinkedIn profile, GitHub profile and resume. Those links help indexing too.

---

## Part D: When things go wrong

### 16. Troubleshooting failed deployments

1. Open **Deployments**, click the failed (red) one, then **Building** to read the log. The real error is usually the first red line, not the last.
2. Reproduce locally, in `E:\Portfolio`:

   ```powershell
   npm ci
   npm run check
   ```

   If it fails locally, fix it there first.

| Error in the log                    | Likely cause and fix                                                                                                                                        |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Type error: ...`                   | A TypeScript mistake, often a typo in `src/data/*.ts`. `npm run typecheck` shows the exact line.                                                            |
| `Module not found`                  | A file was renamed or not committed. Check `git status`. Windows is case-insensitive but Vercel's Linux builders are not, so `Projects.ts` ≠ `projects.ts`. |
| `Unsupported engine` / Node version | Set Node.js Version to 22.x or newer in Project Settings                                                                                                    |
| Build passes but a page 404s        | The `slug` in `projects.ts` doesn't match the URL                                                                                                           |
| Lockfile / `npm ci` errors          | Run `npm install` locally, commit the updated `package-lock.json`, push                                                                                     |
| Image doesn't show                  | The path must start with `/` and the file must be inside `public/`, with exact capitalization                                                               |

A failed build **never** replaces the live site. Vercel keeps serving the last good deployment.

### 17. Rolling back a broken deployment

If a deployment succeeded but the site looks wrong:

- **Instant rollback (dashboard):** Deployments → find the last good one → **⋯** → **Promote to Production** (shown as **Instant Rollback** on some screens). It's live within seconds.
- **Fix the code properly**, in `E:\Portfolio`:

  ```powershell
  git log --oneline
  git revert <commit-id-of-the-bad-change>
  git push
  ```

  `git revert` creates a new commit that undoes the bad one, keeping history intact and redeploying automatically. After an instant rollback, Vercel may pause automatic production deploys for that project until you push a fix or promote a newer deployment. The dashboard shows a notice if so.

---

## Free-tier limits and costs (as of November 2026)

The **Hobby** plan is free and intended for personal, non-commercial use. Monthly included usage includes 100 GB of Fast Data Transfer, 1,000,000 CDN requests, 1,000,000 function invocations and 5,000 image transformations, plus up to 100 deployments per day. A portfolio is mostly static pages served from the CDN, so it should use a small fraction of that.

If a Hobby limit is exceeded, Vercel generally pauses that feature until 30 days have passed rather than charging you. There's no surprise bill on Hobby. Upgrading to Pro costs US$20 per user per month and is unnecessary for this site.

Vercel can change its plans, limits and terms at any time, and no third-party host can be guaranteed free or available forever. Check https://vercel.com/docs/plans/hobby occasionally. Because this is a standard Next.js app in a Git repository, it can be moved to another host (Netlify, Cloudflare, or a Node server) if that ever becomes necessary.

**Your only likely cost:** the custom domain (roughly US$10–20/year), which is optional.
