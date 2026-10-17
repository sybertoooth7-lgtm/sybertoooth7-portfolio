# sybertoooth7 — portfolio site

Source for <https://sybertoooth7-lgtm.github.io/sybertoooth7-portfolio/>.

A single-page site aimed at freelance and consultancy enquiries, built to be read by
someone who will check the claims.

## What makes it different from most portfolios

- **Every figure is measured, not estimated.** The statistics and the engineering-evidence
  table were read out of the [ALUXPLAZA](https://github.com/sybertoooth7-lgtm/ALUXPLAZA)
  repository and are dated on-page. Re-run the measurements before trusting them.
- **It publishes its own weaknesses.** A "Known gaps" section is drawn from the project's
  own threat model, and the tooling section states what each audit script does *not* catch.
- **It records failed checks.** The case study notes that ALUXPLAZA's documented deployment
  returned HTTP 404 when tested, rather than linking a dead URL as a live demo.

## Layout

```
web/                    published directory — the whole site
  index.html            content
  styles.css            design system (ink canvas, hairline grid, mono labels)
  main.js               scroll-spy, reveal-on-scroll, stat count-up, enquiry composer
  assets/               project screenshot and architecture diagram
  robots.txt
  sitemap.xml
.github/workflows/deploy.yml
                        uploads web/ as a Pages artifact
serve.mjs               loopback preview only — deliberately outside web/
```

Plain HTML/CSS/JS. No build step, no dependencies, no framework.

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
