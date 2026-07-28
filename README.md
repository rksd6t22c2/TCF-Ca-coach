# Mon Coach TCF+ — Phase 1

This delivery preserves the existing dashboard and adds the Phase 1 authentication interface.

## Files added

- `auth.html`, `auth.css`, `auth.js`: sign-in, account creation, password reset, and Google/Facebook OAuth UI.
- `supabase-config.js`: **public client-only** Supabase placeholder values.

## Enable Supabase

1. Create a Supabase project and enable Email, Google, and Facebook providers in **Authentication > Providers**.
2. In `supabase-config.js`, replace `YOUR_SUPABASE_PROJECT_URL` and `YOUR_SUPABASE_ANON_PUBLIC_KEY` with the project's public URL and anon key from **Project Settings > API**.
3. Add your GitHub Pages address and local testing address to **Authentication > URL Configuration > Redirect URLs**.

Never add the `service_role` key to these static files: it grants elevated access and must stay on a secure server.

## Current behavior

Until the public configuration is added, forms intentionally display a configuration message. The “démo” link remains available and returns to the unchanged dashboard. The next phase can add `epreuves.html` and extensible demonstration data.
