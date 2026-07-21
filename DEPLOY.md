# Deploying to GitHub Pages

If you are seeing a plain page with just the repository name and a one-line
description, the app files are not in the repository. That page is GitHub's
default, produced from the README when there is no `index.html` at the root.

**The single thing that must be true: `index.html` sits at the top level of the
repository, not inside a folder.**

---

## Option A — GitHub website, no software needed

1. Unzip the download. You will get a folder containing `index.html`,
   `manifest.webmanifest`, `sw.js`, `icons/`, `clinical/` and some others.

2. Go to your repository on GitHub → **Add file** → **Upload files**.

3. **Open the unzipped folder and select everything inside it.**
   Drag *the contents* into the browser, **not** the folder itself.

   - Correct → `index.html` appears in the repo's file list
   - Wrong → a single folder appears, and the site stays broken

   On a Mac, open the folder, press **⌘A** to select all, then drag.

4. Commit the upload.

5. Two files will not survive a browser upload because macOS hides them.
   Add each one manually: **Add file → Create new file**, type the name
   exactly, paste the contents, commit.

   - `.nojekyll` — leave the file completely empty. This stops GitHub trying
     to build your app as a blog.
   - `.github/workflows/pages.yml` — only needed for Option 2 below. Typing
     that path in the filename box creates the folders for you.

6. **Settings → Pages.** Choose one:

   - **Source: Deploy from a branch**, branch `main`, folder `/ (root)`.
     Simplest. Needs `.nojekyll` from step 5.
   - **Source: GitHub Actions.** Uses the included workflow, which checks the
     files are intact before publishing.

7. Wait a minute or two, then reload your site. Hard-refresh with
   **⌘⇧R** — browsers cache the old page aggressively.

## Option B — command line

```bash
cd path/to/unzipped-folder
git init
git add -A                       # -A includes .nojekyll and .github
git commit -m "Soft Ground"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main --force
```

Then set **Settings → Pages → Source: GitHub Actions**.

If the repository already has a README you did not write, `--force` replaces it.

---

## Checking it worked

Look at your repository's file list. You should see:

```
index.html          <- this one matters most
manifest.webmanifest
sw.js
icons/
clinical/
README.md
```

If you only see `README.md`, the upload did not go through.

Then visit `https://USERNAME.github.io/REPO/index.html` directly. If the app
loads there but not at the plain address, Pages is still serving a cached
build — wait a few minutes and hard-refresh.

## If you only want it working, quickly

The whole app is one file. Upload **`index.html`** on its own and it will work
immediately — every section, every exercise, every palette.

You lose only the extras: offline use, installing it to a home screen, and the
app icon. Add the other files whenever you want those.

## Troubleshooting

**Still the plain README page.** No `index.html` at the root. Recheck step 3.

**App loads but has no styling, or icons are missing.** The folders did not
upload. Confirm `icons/` and `clinical/` are in the repo.

**Works online but not offline.** Service workers need `https://`, which
GitHub Pages provides. Load the site once while connected, then it caches.
It cannot work offline from a `file://` address.

**Changes do not appear.** Bump `VERSION` in `sw.js` and hard-refresh.
Returning visitors are served the cached copy until the version changes.

**Actions tab shows a failed run.** Open the run to see which check failed.
Usually a missing file from step 5.
