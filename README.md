# HBPlus Authentication App

A cross-platform authentication application built using **React Native, Expo, React Native Web, and Supabase**. The application enables users to sign in with Google OAuth and restricts access to verified email accounts belonging to the `@hbplus.fit` domain.

## Features

- **Google OAuth 2.0:** Secure Google sign-in using Supabase Authentication.
- **Domain Restriction:** Only verified email addresses ending in `@hbplus.fit` are authorized.
- **Protected Dashboard:** Authenticated and authorized users can access the dashboard.
- **Logout:** Users can securely sign out of their accounts.
- **Session Management:** Maintains authentication state across app navigation and reloads.
- **Loading States:** Provides feedback during authentication and session initialization.
- **Error Handling:** Displays appropriate messages for authentication failures and unauthorized accounts.
- **Cross-Platform Support:** Uses a shared codebase for web and mobile platforms.
- **Responsive UI:** Provides a clean, modern interface for different screen sizes.

## Tech Stack

- React Native
- Expo and Expo Router
- React Native Web
- TypeScript
- Supabase Authentication
- Google OAuth 2.0
- `@supabase/supabase-js`
- `@react-native-async-storage/async-storage`
- Netlify for web deployment

## Project Structure

```text
hbplus-auth/
├── src/
│   ├── app/
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   ├── dashboard.tsx
│   │   └── auth/
│   │       └── callback.tsx
│   ├── lib/
│   │   └── supabase.ts
│   └── providers/
│       └── AuthProvider.tsx
├── assets/
├── .env.example
├── .gitignore
├── app.json
├── netlify.toml
├── package.json
└── README.md
```

## Prerequisites

- Node.js 22.13 or newer
- npm
- A Google Cloud project
- A Supabase project with Google authentication configured
- A Google account for testing

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/Himesh021/hbplus.git
cd hbplus
```

### 2. Install dependencies

```bash
npm ci
```

### 3. Configure environment variables

Create a `.env` file in the project root using `.env.example` as a reference.

```env
EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
```

Replace the placeholders with your Supabase project URL and publishable key.

**Security:** Never commit your `.env` file, Google OAuth client secret, or Supabase service-role key to GitHub.

### 4. Run the web application

```bash
npm run web
```

If the script is unavailable, use:

```bash
npx expo start --web
```

### 5. Run on mobile

Start the Expo development server:

```bash
npm start
```

Follow the Expo CLI instructions to open the application on an Android or iOS emulator or a compatible device. Native OAuth redirects must be configured for the mobile app separately.

## Google OAuth and Supabase Configuration

### 1. Configure Google OAuth

1. Open the Google Cloud Console.
2. Create or select a Google Cloud project.
3. Configure the OAuth consent screen.
4. Create an OAuth 2.0 client ID for a web application.
5. Add the Supabase callback URL displayed in the Supabase Google provider settings to the Google OAuth client's authorized redirect URIs.
6. Configure the Google client ID and client secret in Supabase.

### 2. Configure Supabase Authentication

1. Open your Supabase project.
2. Navigate to **Authentication → Sign In / Providers**.
3. Enable Google and configure its OAuth credentials.
4. Open the authentication URL configuration.
5. Set the appropriate site URL for your environment.
6. Add the required local, production, and mobile redirect URLs to the allowed redirect URL list.

Use the exact callback and redirect URLs configured for your application. The Supabase OAuth callback and the application's post-login redirect URL serve different purposes.

## Authentication Flow

1. The user opens the login page.
2. The user selects **Sign in with Google**.
3. Supabase initiates the Google OAuth flow.
4. Google authenticates the user and redirects back to the application.
5. The application completes the OAuth callback and establishes the session.
6. The user's email must be verified and match the allowed `@hbplus.fit` domain.
7. Authorized users are redirected to the protected dashboard.
8. Unauthorized users are denied access and shown an error message.

### Domain Validation

The application authorizes only email addresses ending in `@hbplus.fit`, such as:

- `employee@hbplus.fit` — eligible, provided the email is verified.
- `employee@gmail.com` — rejected.
- `employee@otherdomain.com` — rejected.
- `employee@hbplus.fit.example.com` — rejected.

The application uses an exact domain check rather than a loose substring match.

Example validation logic:

```typescript
const isAllowedEmail = (email: string) =>
  /^[^@\s]+@hbplus\.fit$/i.test(email);
```

The validation must be applied after authentication, and unauthorized sessions must not be allowed to access protected application screens.

**Important:** Client-side route protection improves the user experience but is not, by itself, a complete security boundary for backend data. Any protected database or API resources must enforce their own authorization rules.

## Protected Dashboard

The dashboard is intended only for authenticated users whose email addresses are verified and belong to the allowed domain.

The application checks the authentication state before rendering protected content. Users without an authorized session are redirected to the login page.

The dashboard also provides logout functionality so users can end their session.

## Deployment on Netlify

The web application can be deployed to Netlify using the connected GitHub repository.

### Build settings

| Setting | Value |
|---|---|
| Repository | `Himesh021/hbplus` |
| Branch | `main` |
| Base directory | Leave empty |
| Build command | `npm run build:web` |
| Publish directory | `dist` |

The build command assumes the `build:web` script is configured in `package.json`. The project also includes `netlify.toml` for deployment configuration.

### Environment variables

Configure the following environment variables in the Netlify project settings:

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

After adding or changing environment variables, trigger a new deployment.

### Deployment URL

**Live application:** https://hbplus-authh.netlify.app/

The URL above is the intended submission URL. Confirm that the latest deployment is published and that the site loads correctly before submitting it.

After deployment, add the production redirect URL to Supabase's allowed redirect URLs and test Google sign-in on the deployed site.

## Testing Checklist

- [ ] Login page loads successfully.
- [ ] Google sign-in opens the OAuth flow.
- [ ] Verified `@hbplus.fit` accounts can access the dashboard.
- [ ] Gmail and other unauthorized domains are rejected.
- [ ] Unauthorized users cannot access the dashboard by entering its URL directly.
- [ ] Authentication errors are displayed appropriately.
- [ ] Loading states appear during authentication.
- [ ] Logout clears the session and returns the user to login.
- [ ] The application works in a web browser.
- [ ] The mobile application launches using Expo.
- [ ] Production OAuth redirects work correctly.
- [ ] No secrets are committed to the repository.

## Limitations and Notes

- Successful login with an authorized account requires access to a valid, verified `@hbplus.fit` Google account.
- Native Android and iOS OAuth flows require the appropriate platform-specific redirect configuration and testing.
- Domain restriction controls which users can sign in; role-based access control is not implemented unless additional role checks are added.

## Repository

GitHub: https://github.com/Himesh021/hbplus

## Author

Developed as a cross-platform Google authentication assignment for HBPlus.
