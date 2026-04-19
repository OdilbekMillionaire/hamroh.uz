# HamrohUz

HamrohUz is a multilingual Next.js civic-tech app for Uzbek citizens abroad, with AI chat, translation, petitions, legal/security maps, and news features.

## Getting Started

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

Copy `.env.example` to `.env.local` for local development and fill in the values:

```bash
GEMINI_API_KEY=
NEWS_API_KEY=
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
FIREBASE_ADMIN_SDK_KEY=
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
CRON_SECRET=
```

Do not commit `.env.local`; it is intentionally ignored.

## Scripts

```bash
npm run lint
npm run build
npm run start
```

## Deploy on Vercel

1. Import this repository in Vercel.
2. Keep the framework preset as `Next.js`.
3. Use the default build command: `npm run build`.
4. Add the environment variables from `.env.example` in Vercel Project Settings.
5. Deploy.

Vercel will install dependencies from `package-lock.json` and build the app automatically.

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
