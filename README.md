# Pomerol Intimates — Wholesale Website

Target domain: https://bra.pomerol.trade/

## Current status

- Complete static storefront committed on `main`: `dist/index.html` and 39 optimized image assets in `dist/images/`.
- GitHub Actions website integrity checks have passed.
- Cloudflare deployment is **BLOCKED** until this repository has the two Cloudflare GitHub Actions secrets configured. Missing secrets cause the workflow to fail rather than misleadingly report success.

## One-time Cloudflare authorization

1. Confirm `pomerol.trade` is an active Cloudflare zone under the target account. Check for any existing conflicting `bra` CNAME record.
2. In the Cloudflare dashboard, copy the **Account ID** for that account.
3. Create a Cloudflare **API token** for deploying Workers and managing Workers Custom Domains. It needs Worker creation/deployment permissions and `Zone > Workers Routes > Write` for `pomerol.trade`. Restrict it to the target account and zone.
4. Open this GitHub repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**. Add:
   - `CLOUDFLARE_API_TOKEN` with the token value
   - `CLOUDFLARE_ACCOUNT_ID` with the Cloudflare Account ID
5. Open **Actions** → **Deploy Pomerol Intimates to Cloudflare Workers** → **Run workflow**.
6. The workflow runs `node scripts/verify-site.mjs`, deploys static assets with Wrangler, maps the custom domain `bra.pomerol.trade`, then checks the homepage and hero image via public HTTPS. Later pushes to `main` also deploy automatically.

**Do not share API tokens in chat, commit them to files, or paste them in issue comments.**

## Contents

- `dist/index.html`: self-contained English storefront
- `dist/images/`: 33 supplied catalog image assets plus 6 GPT-generated visuals
- `scripts/verify-site.mjs`: HTML/JS and image integrity test
- `wrangler.jsonc`: Worker name, static assets directory, and custom domain
- `.github/workflows/deploy.yml`: CI verification + production deployment

## Business and imagery notes

- Nicole: +86 139 2338 7986 / 13923387986@163.com
- The inquiry form opens an email draft in the visitor's mail application, not a server-side submission.
- Confirm exact fabric composition, material certifications, and factory capacity before publishing any specific claims.
- GPT-generated editorial/factory images should not be presented as photographic evidence of the real premises, workforce, or production capacity.

## Official references

- https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/
- https://developers.cloudflare.com/workers/configuration/routing/custom-domains/
