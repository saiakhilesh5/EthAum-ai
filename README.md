# 🚀 EthAum.ai - Enterprise Startup Intelligence Platform

<div align="center">

![EthAum.ai](https://img.shields.io/badge/EthAum.ai-Enterprise%20Startup%20Intelligence-7c3aed?style=for-the-badge&logo=rocket&logoColor=white)

**The AI-powered marketplace connecting enterprises with verified startups**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ecf8e?style=flat-square&logo=supabase)](https://supabase.com/)

[📖 Features](#-features) • [🚀 Deploy](#-deployment-guide)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [Deployment Guide](#-deployment-guide)
- [API Reference](#-api-reference)
- [Keyboard Shortcuts](#-keyboard-shortcuts)
- [Embed Trust Badge](#-embed-trust-badge)
- [Contributing](#-contributing)

---

## 🎯 Overview

**EthAum.ai** is a comprehensive SaaS marketplace that combines the best features of **Product Hunt**, **G2**, **Gartner**, and **AppSumo** into one AI-powered platform. It helps:

- 🚀 **Startups** launch products, build credibility, and connect with enterprises
- 🏢 **Enterprises** discover, evaluate, and partner with innovative startups
- 💼 **Investors** identify promising opportunities with AI-powered insights

---

## ✨ Features

### 🚀 For Startups

| Feature | Description |
|---------|-------------|
| **Product Launches** | Product Hunt-style launches with upvotes, comments, and featured placements |
| **Trust Score** | Build credibility through verified reviews, engagement metrics, and verification badges |
| **Startup Profile** | Comprehensive profiles with team info, funding details, technologies, and media gallery |
| **Analytics Dashboard** | Track views, upvotes, reviews, and engagement in real-time |
| **Embeddable Badges** | Showcase your trust score on your website with customizable widgets |

### 🏢 For Enterprises

| Feature | Description |
|---------|-------------|
| **AI Matchmaking** | Find perfect startup partners using AI-powered recommendations |
| **Deal Predictor** | Evaluate deal potential and success probability before engaging |
| **Compare Tool** | Side-by-side startup comparisons with detailed metrics |
| **Executive Briefs** | AI-generated summaries for leadership presentations |
| **Smart Search** | Natural language search to find exactly what you need |

### 🤖 AI-Powered Features

| Feature | Description |
|---------|-------------|
| **Pitch Analyzer** | Get AI feedback on your pitch before presenting to investors |
| **Review Analyzer** | Extract insights from reviews using sentiment analysis |
| **Voice Reviews** | Record and transcribe voice reviews with AI |
| **Content Generator** | AI-powered launch content and description generation |
| **Smart Recommendations** | Personalized startup recommendations based on preferences |

### 📊 Analytics & Insights

| Feature | Description |
|---------|-------------|
| **Real-time Dashboard** | Live metrics on views, upvotes, and engagement |
| **Advanced Analytics** | Performance trends, referrer tracking, and growth metrics |
| **Trust Score Breakdown** | Detailed analysis of credibility factors |
| **Competitive Insights** | Understand your market position |

### 🔔 Real-time Features

| Feature | Description |
|---------|-------------|
| **Live Notifications** | Instant updates on matches, reviews, upvotes, and mentions |
| **Activity Feed** | See what's happening in your network |
| **Real-time Updates** | Live data sync powered by Supabase |

### 📱 Progressive Web App (PWA)

| Feature | Description |
|---------|-------------|
| **Installable** | Install as a native app on any device |
| **Offline Support** | Access cached data without internet |
| **Push Notifications** | Stay updated even when the app is closed |
| **Quick Actions** | App shortcuts for common tasks |

### ⌨️ Productivity Features

| Feature | Description |
|---------|-------------|
| **Command Palette** | `Ctrl+K` for quick navigation and search |
| **Keyboard Shortcuts** | Power user shortcuts for all major actions |
| **Export Data** | Export to CSV, JSON, or PDF |
| **Advanced Search** | Filter by industry, stage, trust score, and more |

### 🔒 Security Features

| Feature | Description |
|---------|-------------|
| **Rate Limiting** | API protection against abuse |
| **CSRF Protection** | Cross-site request forgery prevention |
| **Input Sanitization** | XSS and injection attack prevention |
| **Security Headers** | Best practice HTTP security headers |

---

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4 |
| **Database** | Supabase (PostgreSQL) |
| **Authentication** | Supabase Auth |
| **Real-time** | Supabase Realtime |
| **AI** | Google Gemini |
| **UI Components** | shadcn/ui + Radix UI |
| **Charts** | Recharts |
| **Forms** | React Hook Form + Zod |
| **Date Handling** | date-fns |
| **State Management** | React Context + Hooks |
| **Deployment** | Vercel |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18 or higher
- **npm** or **yarn** or **pnpm**
- **Supabase** account (free tier available)
- **Google AI** API key (optional, for AI features)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/ethaum-ai.git
cd ethaum-ai

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials (see Environment Variables section)

# 4. Run the development server
npm run dev

# 5. Open http://localhost:3000 in your browser
```

---

## 📁 Project Structure

```
ethaum-ai/
├── 📁 public/                  # Static assets
│   ├── embed/                  # Embeddable widget scripts
│   ├── icons/                  # PWA icons
│   ├── manifest.json           # PWA manifest
│   └── sw.js                   # Service worker
│
├── 📁 src/
│   ├── 📁 app/                 # Next.js App Router
│   │   ├── (auth)/             # Authentication pages
│   │   │   ├── login/
│   │   │   └── register/
│   │   │       ├── enterprise/
│   │   │       └── startup/
│   │   │
│   │   ├── (dashboard)/        # Protected dashboard routes
│   │   │   ├── dashboard/      # Main dashboard
│   │   │   ├── insights/       # Analytics & insights
│   │   │   ├── launches/       # Launch management
│   │   │   │   ├── [id]/       # Launch detail
│   │   │   │   └── new/        # Create launch
│   │   │   ├── matchmaking/    # AI matchmaking
│   │   │   ├── profile/        # User profile
│   │   │   ├── reviews/        # Reviews management
│   │   │   └── settings/       # Account settings
│   │   │
│   │   ├── (marketing)/        # Public pages
│   │   │   ├── explore/        # Browse startups
│   │   │   └── startups/
│   │   │       └── [id]/       # Startup profile
│   │   │
│   │   ├── 📁 api/             # API Routes
│   │   │   ├── ai/             # AI endpoints
│   │   │   ├── auth/           # Auth callbacks
│   │   │   ├── badge/[id]/     # Trust badge API
│   │   │   ├── launches/       # Launch CRUD
│   │   │   ├── matchmaking/    # Match generation
│   │   │   ├── reviews/        # Review management
│   │   │   └── startups/       # Startup data
│   │   │
│   │   ├── embed/              # Embeddable pages
│   │   │   └── trust-badge/
│   │   ├── offline/            # PWA offline page
│   │   │
│   │   ├── error.tsx           # Error boundary
│   │   ├── global-error.tsx    # Global error handler
│   │   ├── layout.tsx          # Root layout
│   │   ├── loading.tsx         # Loading state
│   │   ├── not-found.tsx       # 404 page
│   │   ├── page.tsx            # Homepage
│   │   ├── robots.ts           # SEO robots.txt
│   │   └── sitemap.ts          # SEO sitemap
│   │
│   ├── 📁 components/          # React components
│   │   ├── common/             # Shared components
│   │   │   ├── advanced-analytics.tsx
│   │   │   ├── advanced-search.tsx
│   │   │   ├── command-palette.tsx
│   │   │   ├── embed-widget-generator.tsx
│   │   │   ├── keyboard-shortcuts-modal.tsx
│   │   │   ├── loading.tsx
│   │   │   ├── notification-center.tsx
│   │   │   └── pwa-install.tsx
│   │   ├── dashboard/
│   │   ├── insights/
│   │   ├── landing/
│   │   ├── launches/
│   │   ├── layout/
│   │   │   ├── header.tsx
│   │   │   └── footer.tsx
│   │   ├── matchmaking/
│   │   ├── profile/
│   │   └── reviews/
│   │
│   ├── 📁 context/             # React Context
│   │   ├── auth-context.tsx
│   │   └── notification-context.tsx
│   │
│   ├── 📁 hooks/               # Custom hooks
│   │   ├── use-user.ts
│   │   └── use-keyboard-shortcuts.tsx
│   │
│   ├── 📁 lib/                 # Utilities
│   │   ├── ai/                 # AI integrations
│   │   ├── api/
│   │   │   └── security.ts     # Rate limiting, CSRF
│   │   ├── auth/
│   │   ├── db/                 # Database clients
│   │   ├── helpers/
│   │   │   └── export.ts       # CSV, JSON, PDF export
│   │   ├── validators/         # Zod schemas
│   │   └── env.ts              # Env validation
│   │
│   ├── 📁 styles/              # Global styles
│   └── 📁 types/               # TypeScript types
│
├── 📁 components/              # Root UI components (shadcn/ui)
│   └── ui/
│
├── .env.example                # Environment template
├── next.config.ts              # Next.js config
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🔐 Environment Variables

Create a `.env.local` file in the root directory:

```env
# ===========================================
# SUPABASE (Required)
# ===========================================
# Get from: https://supabase.com/dashboard/project/_/settings/api

NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ===========================================
# GOOGLE AI (Optional - for AI features)
# ===========================================
# Get from: https://makersuite.google.com/app/apikey

NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY=your-gemini-api-key
GOOGLE_GEMINI_API_KEY=your-gemini-api-key

# ===========================================
# APP CONFIG
# ===========================================

NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### How to Get Supabase Keys

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project (or select existing)
3. Wait for the project to be ready
4. Go to **Settings** → **API**
5. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

### How to Get Google Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key → `GOOGLE_GEMINI_API_KEY`

---

## 🚀 Deployment Guide

### Deploy to Vercel (Recommended - FREE) ⭐

**Vercel** is the best and **completely free** option for Next.js apps.

#### Step 1: Create a GitHub Repository

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit your code
git commit -m "Initial commit - EthAum.ai"

# Create a new repository on GitHub.com, then:
git remote add origin https://github.com/YOUR_USERNAME/ethaum-ai.git
git branch -M main
git push -u origin main
```

#### Step 2: Deploy on Vercel

1. **Go to** [vercel.com](https://vercel.com) and click **"Sign Up"**

2. **Sign in with GitHub** (recommended for easy repo access)

3. **Click "Add New..."** → **"Project"**

4. **Import your repository**:
   - Find `ethaum-ai` in the list
   - Click **"Import"**

5. **Configure Project**:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: Leave empty (default)

6. **Add Environment Variables**:
   Click **"Environment Variables"** and add:

   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project.supabase.co` |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `your-anon-key` |
   | `SUPABASE_SERVICE_ROLE_KEY` | `your-service-role-key` |
   | `NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY` | `your-gemini-key` |
   | `GOOGLE_GEMINI_API_KEY` | `your-gemini-key` |

7. **Click "Deploy"** 🚀

8. **Wait 1-2 minutes** for deployment

9. **Your app is live!** 🎉
   - You'll get a URL like: `https://ethaum-ai.vercel.app`

#### Step 3: Update Configuration

After deployment:

1. Go to your Vercel project **Settings** → **Environment Variables**
2. Add: `NEXT_PUBLIC_APP_URL` = `https://your-actual-url.vercel.app`
3. Redeploy for changes to take effect (Deployments → Redeploy)

#### Step 4: Configure Supabase Auth (Important!)

Add your Vercel URL to Supabase Auth settings:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Authentication** → **URL Configuration**
4. Add to **Site URL**: `https://your-app.vercel.app`
5. Add to **Redirect URLs**:
   - `https://your-app.vercel.app/**`
   - `https://your-app.vercel.app/auth/callback`

---

### Alternative Free Hosting Options

| Platform | Pros | Cons | Best For |
|----------|------|------|----------|
| **Vercel** ⭐ | Best Next.js support, fast, free SSL, auto-deploys | 100GB bandwidth/month on free tier | Next.js apps (recommended) |
| **Netlify** | Easy setup, good free tier | Limited serverless functions | Static sites |
| **Railway** | Full-stack support, databases | $5 credit/month limit | Full-stack apps |
| **Render** | Generous free tier | Slower cold starts | General web apps |
| **Cloudflare Pages** | Unlimited bandwidth | Limited build minutes | Static + Edge |

---

## 📡 API Reference

### AI Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/ai/analyze-pitch` | POST | Analyze pitch deck/content with AI |
| `/api/ai/predict-deal` | POST | Predict deal success probability |
| `/api/ai/compare` | POST | Compare multiple startups |
| `/api/ai/generate-brief` | POST | Generate executive brief |
| `/api/ai/smart-search` | POST | Natural language startup search |
| `/api/ai/transcribe` | POST | Transcribe voice reviews |

### Badge API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/badge/[id]` | GET | Get SVG trust badge for startup |

### Other Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/callback` | GET | Supabase auth callback |
| `/api/launches` | GET/POST | Launch CRUD operations |
| `/api/matchmaking/generate` | POST | Generate AI matches |
| `/api/reviews` | GET/POST | Review management |
| `/api/startups` | GET | Search/list startups |

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + K` | Open command palette |
| `Alt + G` | Go to Dashboard |
| `Alt + L` | Go to Launches |
| `Alt + E` | Go to Explore |
| `Alt + M` | Go to Matchmaking |
| `Alt + S` | Go to Settings |
| `Ctrl + N` | Create new launch |
| `/` | Focus search input |
| `Esc` | Close modal/dialog |
| `?` | Open keyboard shortcuts help |

---

## 🎨 Embed Trust Badge

Showcase your EthAum trust score on your website:

### Option 1: JavaScript Widget (Recommended)

```html
<div id="ethaum-trust-badge-YOUR_STARTUP_ID"></div>
<script 
  src="https://YOUR_DEPLOYED_URL/embed/widget.js" 
  data-startup-id="YOUR_STARTUP_ID"
  data-theme="light"
  data-size="md"
  async>
</script>
```

### Option 2: Image Badge

```html
<a href="https://YOUR_DEPLOYED_URL/startups/YOUR_SLUG">
  <img 
    src="https://YOUR_DEPLOYED_URL/api/badge/YOUR_ID" 
    alt="EthAum Trust Score" 
  />
</a>
```

### Option 3: Markdown (for GitHub README)

```markdown
[![EthAum Trust Score](https://YOUR_DEPLOYED_URL/api/badge/YOUR_ID)](https://YOUR_DEPLOYED_URL/startups/YOUR_SLUG)
```

### Option 4: React Component

```jsx
<iframe
  src="https://YOUR_DEPLOYED_URL/embed/trust-badge/YOUR_ID"
  width="200"
  height="60"
  frameBorder="0"
  title="EthAum Trust Score"
/>
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. **Fork** the repository
2. **Create** your feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework for Production
- [Supabase](https://supabase.com/) - Open Source Firebase Alternative
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI Components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-First CSS Framework
- [Vercel](https://vercel.com/) - Platform for Frontend Developers
- [Google Gemini](https://ai.google.dev/) - Generative AI Capabilities
- [Radix UI](https://www.radix-ui.com/) - Unstyled, Accessible Components

---

<div align="center">

**Built with ❤️ for the startup ecosystem**

[⬆ Back to Top](#-ethaumai---enterprise-startup-intelligence-platform)

---

📧 Questions? Open an issue or reach out!

</div>
