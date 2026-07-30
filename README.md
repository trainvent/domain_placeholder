# Trainvent domain placeholder

A bilingual static placeholder published from one source repository to:

- `trainvent/website-trainvent-org` → `trainvent.org`
- `trainvent/website-vivot-org` → `vivot.org`
- `trainvent/website-stimmapp-org` → `stimmapp.org`

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

Next.js writes the static site to `out/`.

## Deployment

The workflow at `.github/workflows/publish-domain-repos.yml` builds the site
and publishes identical output to all three deployment repositories. It writes
the appropriate `CNAME` file for each domain.

The source repository needs an Actions secret named `WEBSITE_DEPLOY_TOKEN`.
Use a fine-grained GitHub token with repository contents read/write access to
the three deployment repositories.

For each deployment repository, configure GitHub Pages to deploy from the
`main` branch and repository root.
