# HamrohUz — In-Progress Work (Resume Here)

Last session interrupted at: **15-Feature Production Upgrade — 40% complete**

---

## What Was Just Completed (in this session, already in codebase)

### Identity & Core ✅
- `components/shared/Logo.tsx` — SVG logo component with `<LogoIcon>` (color / white variants), `size` prop, used in Header/Footer
- `public/favicon.svg` — SVG favicon (teal shield + H + green accent dot)
- `public/manifest.json` — PWA manifest with shortcuts
- `app/layout.tsx` — Full SEO metadata (Open Graph, Twitter, alternates, icons, manifest)
- `app/globals.css` — Full design system with CSS variables

### Footer ✅
- `components/layout/Footer.tsx` — Professional 5-column dark footer: brand + social, Platform links, Support links, Partners, Legal + Language switcher. Emergency bar at top. Legal basis at bottom.

### New Pages ✅ (partially)
- `app/[locale]/about/page.tsx` — Full About page (mission, stats, values, legal basis, team)
- `app/[locale]/faq/page.tsx` — Interactive FAQ with search + category filter
- `app/[locale]/emergency/page.tsx` — Emergency SOS (local numbers table, embassy contacts, step guide)
- `app/[locale]/contact/page.tsx` — Contact form + info
- `app/[locale]/privacy/page.tsx` — Full Privacy Policy (10 sections)
- `app/[locale]/terms/page.tsx` — Full Terms of Service (10 sections)

### Bug Fixes ✅
- Removed `framer-motion` from landing components (was causing blank page in React 19)
- Renamed `middleware.ts` → `proxy.ts` for Next.js 16

---

## What Needs To Be Done Next (resume from here)

### 1. Remaining New Pages
- `app/[locale]/rights/page.tsx` — AI-powered Rights Checker tool
- `app/[locale]/petitions/[id]/page.tsx` — Petition detail view with timeline

### 2. Global UX Components
- `components/shared/Toast.tsx` + `store/toastStore.ts` — Toast notification system
- `components/shared/CookieConsent.tsx` — Cookie consent banner (bottom of screen)
- `components/shared/BackToTop.tsx` — Floating back-to-top button
- `components/shared/Breadcrumbs.tsx` — Breadcrumb navigation for inner pages

### 3. Layout Improvements
- Update `components/layout/Sidebar.tsx` — Add user avatar section at bottom, show user name/country
- Update all auth layouts to use new Logo component
- `app/[locale]/(auth)/login/page.tsx` — Replace manual logo with `<Logo>` component
- `app/[locale]/(auth)/register/page.tsx` — Same

### 4. SEO Files
- `app/sitemap.ts` — Dynamic sitemap.xml
- `app/robots.ts` — robots.txt

### 5. Error Pages
- `app/[locale]/not-found.tsx` — Custom 404 page (branded, with navigation)
- `app/error.tsx` — Global error boundary

### 6. Dashboard Polish
- Add greeting with user's name
- Add "Your country" quick-edit
- Make stat cards clickable links

### 7. Landing Page Improvements
- Add SDG badges section (SDG 8, 10, 16)
- Add "Legal Basis" section (Constitution Art. 23 + Presidential Directive)
- Add real testimonials section (placeholder)
- Improve hero CTA section

### 8. Message Files
Add these keys to all 4 locale files (en/ru/uz/uz-cyrl):
- `nav.about`, `nav.faq`, `nav.emergency`, `nav.contact`
- `rights.*` section for Rights Checker page

---

## Current Route List (all working)
```
/ → redirects to /uz
/[locale]                  Landing page
/[locale]/dashboard        Dashboard
/[locale]/ai-assistant     Hamroh AI chat
/[locale]/petitions        Petition list
/[locale]/petitions/new    New petition form
/[locale]/content          Legal content feed
/[locale]/news             Live news (NewsAPI)
/[locale]/translator       Translator tabs
/[locale]/maps/legal       Legal services map
/[locale]/maps/security    Security map
/[locale]/voice            Voice mode
/[locale]/login            Login
/[locale]/register         Register
/[locale]/profile          Profile
/[locale]/about            About HamrohUz ✅ NEW
/[locale]/faq              FAQ ✅ NEW
/[locale]/emergency        Emergency SOS ✅ NEW
/[locale]/contact          Contact ✅ NEW
/[locale]/privacy          Privacy Policy ✅ NEW
/[locale]/terms            Terms of Service ✅ NEW
/[locale]/rights           Rights Checker (PENDING)
/api/chat                  Gemini streaming chat
/api/translate             Translation
/api/scan-petition         AI risk scan
/api/generate-draft        AI draft generator
/api/categorize-petition   Auto-categorization
/api/analyze-document      Document analysis
/api/news                  NewsAPI proxy
```

## API Keys (in .env.local — NOT committed to git)
- `GEMINI_API_KEY` — Google Gemini AI (all AI features)
- `NEWS_API_KEY` — NewsAPI.org (live news module)
- Firebase keys — NOT yet configured (user needs to set up)
- Google Maps API key — NOT yet configured

## Dev Server
Runs on `http://localhost:3001` (port 3000 was taken)
Start with: `npm run dev` in `d:/hamroh.uz (Claude Code)/`
