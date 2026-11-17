# Pomerol Intimates: wholesale presentation site

Public domain target: https://bra.pomerol.trade/

## Contents
- Cloudflare Workers static-assets website in `dist/index.html`
- 33 catalog images for 2665# and 307# under `dist/images/p*.webp`
- 6 optimized GPT-produced editorial/production visuals in `dist/images`
- Client-side catalog filtering, product detail galleries, mailto inquiry for Nicole
- No mandatory prices; more styles can be added to the embedded `products` array in `dist/index.html`

## Deploy with Cloudflare
1. Confirm `pomerol.trade` DNS zone is managed by the Cloudflare account you want to publish from.
2. In GitHub repository Settings → Secrets and variables → Actions, create:
   - `CLOUDFLARE_API_TOKEN`: Cloudflare API token with Workers Scripts Edit, Workers Routes Edit and necessary zone permissions.
   - `CLOUDFLARE_ACCOUNT_ID`: the Cloudflare account id for the zone.
3. Open Actions → Deploy Pomerol Intimates to Cloudflare Workers → Run workflow. Future pushes to main will also publish.
4. Wrangler binds custom domain via `routes` in `wrangler.jsonc` (requires domain available in the account).
5. After deployment, open the site and check images, product gallery, inquiry email launch, and HTTPS.

## Notes
- Contact: Nicole / +86 139 2338 7986 / 13923387986@163.com.
- The contact form is a `mailto:` helper; it does NOT submit to a server or guarantee delivery.
- Some visuals are AI-generated editorial images, not verified documentation of a particular facility. Replace with actual factory photos before making facility-specific representations.
- Product fabric composition should be independently verified before publishing laboratory or percentage claims.
- The domain is not live merely because these files exist in GitHub. Publication depends on Cloudflare access/secrets.
