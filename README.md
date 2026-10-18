# HBPlus Authentication

An Expo and React Native app for HBPlus team sign-in with Google OAuth and Supabase. Access is restricted to verified `@hbplus.fit` email accounts.

## Requirements

- Node.js 22.13 or newer
- npm
- A Supabase project with Google authentication configured

## Local setup

1. Install dependencies:

   ```sh
   npm ci
   ```

2. Copy `.env.example` to `.env` and provide your Supabase project URL and publishable key. Keep `.env` local; it is excluded from Git.

3. Start the app:

   ```sh
   npm run web
   ```

   Use `npm start` to open the Expo development menu for Android and iOS.

## Supabase and Google OAuth

- Enable Google as an authentication provider in Supabase and configure its Google OAuth client credentials in the Supabase dashboard.
- Add the Supabase Auth callback URL shown in the Google provider settings to the Google OAuth client's authorized redirect URIs.
- Add your local app callback (for example, `http://localhost:8081/auth/callback`) and deployed callback URL to Supabase's allowed redirect URLs.
- The app exchanges the OAuth PKCE code in `src/app/auth/callback.tsx` and only authorizes verified `@hbplus.fit` accounts. The dashboard redirects users without an authorized session back to login.

## Web deployment

Netlify builds the static Expo Router export using `netlify.toml`. Set `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in the Netlify site's environment variables, then deploy the site. The build command is:

```sh
npm run build:web
```

The generated `dist/` directory is a build artifact and is ignored by Git.

## Project layout

```text
src/
  app/          Expo Router screens and layouts
  lib/          Supabase client
  providers/    Authentication state and actions
assets/         App icons and splash assets
```
