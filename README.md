# sybertoooth7 — portfolio site

Source for <https://sybertoooth7-lgtm.github.io/sybertoooth7-portfolio/>.

A single-page site aimed at freelance and consultancy enquiries, built to be read by
someone who will check the claims.

## What makes it different from most portfolios

- **Every figure is measured, not estimated.** The statistics and the engineering-evidence
  table were read out of the [ALUXPLAZA](https://github.com/sybertoooth7-lgtm/ALUXPLAZA)
  repository and are dated on-page. §8 prints the exact commands and their real output, so
  a reader can re-run every claim instead of taking it on trust.
- **Ambiguous claims are footnoted, not smoothed over.** "Sole author" comes with the
  `git shortlog` breakdown behind three different committer identities; "28 migrations"
  explains why the numbering runs to 029; the Codecov figure is labelled as the backend
  suite only, because the frontend has no coverage job to average it against.
- **It publishes its own weaknesses.** A "Known gaps" section is drawn from the project's
  own threat model, and the tooling section states what each audit script does *not* catch.
- **It records failed checks.** Neither deployment ALUXPLAZA's README documents is reachable
  today — the frontend returned HTTP 404 and the backend HTTP 503 from Render's own suspension
  page — so the site says that in its verification log instead of linking dead URLs as a live
  demo. The cause of the suspension is recorded as unconfirmed rather than guessed at.

## Layout

```
web/                    published directory — the whole site
  index.html            content
  styles.css            typesetting — paper/ink report palette, print stylesheet
  main.js               running contents list, appendix-on-print, enquiry composer
  assets/               project screenshot and architecture diagram
  robots.txt
  sitemap.xml
.github/workflows/deploy.yml
                        uploads web/ as a Pages artifact
serve.mjs               loopback preview only — deliberately outside web/
```

Plain HTML/CSS/JS. No build step, no dependencies, no framework.

## Design

Set as a technical report rather than a product landing page: paper field, Spectral for
prose, IBM Plex Mono for every piece of metadata, rules instead of shadows, numbered
sections with a running contents list, real endnotes, and `§` cross-references.

Two deliberate absences:

- **Nothing animates.** No reveal-on-scroll, no counting-up statistics. A document does
  not need to perform; the figures are printed as measured.
- **No card grid.** Structure comes from section numbering, table captions and marginal
  file citations, so the same content reads as an argument rather than a feature matrix.

`@media print` is a real target, not an afterthought: it drops the navigation and the form,
writes external URLs inline after each link, keeps table headers with their rows, and
`beforeprint` expands the migration appendix so a printed copy is complete.

## Run it locally

```bash
node serve.mjs            # then open the URL it prints
PORT=4181 node serve.mjs  # if 4173 is taken
```

## Deploy

GitHub Pages, with the **source set to GitHub Actions** (not "Deploy from a branch").
Pushing to `main` runs `deploy.yml`, which publishes `web/`.

Do not add GitHub's Jekyll quick-start workflow alongside it. It builds the repository
root and deploys to the same Pages target, so the two race on every push and the Jekyll
build wins — the site then returns HTTP 200 while serving the README with every asset
404ing. Actions deploys are raw artifacts and never need Jekyll.

## Notes

- Asset links are relative, so the site works under the project subpath and would need no
  change on a custom domain.
- The enquiry form has no backend, because Pages is static. It composes a pre-filled
  `mailto:` in the visitor's own mail app and sends nothing from this page.
- `ECC` on the same GitHub account is a fork and is intentionally not presented as original
  work.

No licence file has been chosen for this site yet — the ALUXPLAZA project it describes is
MIT, but this repository is undecided.
