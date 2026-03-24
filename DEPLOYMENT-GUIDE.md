# Deployment Guide — Mobile Shop Template

This guide covers deploying your mobile shop website and how to create multiple shops from this template.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Push to GitHub](#2-push-to-github)
3. [Set Up Supabase (Database)](#3-set-up-supabase-database)
4. [Deploy to Vercel](#4-deploy-to-vercel)
5. [Connect a Custom Domain](#5-connect-a-custom-domain)
6. [Google OAuth (Admin Login)](#6-google-oauth-admin-login)
7. [Creating Multiple Shops](#7-creating-multiple-shops)
8. [Updating Your Site](#8-updating-your-site)
9. [Troubleshooting](#9-troubleshooting)

---

## 1. Prerequisites

- **Node.js** 18+ installed on your computer
- A **GitHub** account (free): https://github.com
- A **Vercel** account (free): https://vercel.com (sign up with GitHub)
- A **Supabase** account (free): https://supabase.com
- A **Google Cloud** account (for admin OAuth): https://console.cloud.google.com

---

## 2. Push to GitHub

### First-time setup

```powershell
cd "c:\Users\Waris\Desktop\Mobile Shop Projects\mobile-shop"

# Initialize git (skip if already done)
git init
git add .
git commit -m "Initial commit - mobile shop"

# Create a repo on GitHub (via github.com → New Repository → name it "mobile-shop")
# Then push:
git remote add origin https://github.com/YOUR_USERNAME/mobile-shop.git
git branch -M main
git push -u origin main
```

> **Tip:** Make the repo **private** if you don't want others to see your code.

---

## 3. Set Up Supabase (Database)

### 3.1 Create a Supabase project

1. Go to https://supabase.com and sign in
2. Click **"New Project"**
3. Choose:
   - **Name:** `mobilehub` (or any name)
   - **Database Password:** Choose a strong password (save it!)
   - **Region:** Pick the closest to your customers (e.g., `eu-central-1` for Germany)
4. Wait for the project to be created (~2 minutes)

### 3.2 Run the database setup SQL

1. In your Supabase project, go to **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Copy the entire contents of the file `supabase-setup.sql` from your project
4. Paste it into the SQL editor
5. Click **"Run"** (or press Ctrl+Enter)
6. You should see "Success" — this creates the tables and inserts sample data

### 3.3 Get your Supabase credentials

1. Go to **Settings → API** in your Supabase project
2. Copy these two values:
   - **Project URL** → This is your `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Go to **Settings → API → Service role** (click "Reveal")
   - This is your `SUPABASE_SERVICE_ROLE_KEY`

### 3.4 Enable Storage (for image uploads)

1. Go to **Storage** in Supabase sidebar
2. Click **"New Bucket"**
3. Name it: `product-images`
4. Set it to **Public** (so images can be displayed on the site)
5. Click **"Create Bucket"**

---

## 4. Deploy to Vercel

### 4.1 Import your project

1. Go to https://vercel.com
2. Click **"Add New… → Project"**
3. Select **"Import Git Repository"**
4. Pick your `mobile-shop` repository
5. Vercel will auto-detect Next.js — leave defaults

### 4.2 Set environment variables

Before clicking "Deploy", add these environment variables:

| Variable Name                   | Value                                                              |
| ------------------------------- | ------------------------------------------------------------------ |
| `NEXT_PUBLIC_SUPABASE_URL`      | Your Supabase project URL                                          |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key                                             |
| `SUPABASE_SERVICE_ROLE_KEY`     | Your Supabase service role key                                     |
| `NEXTAUTH_SECRET`               | Generate one: run `openssl rand -base64 32` in terminal            |
| `NEXTAUTH_URL`                  | `https://your-domain.vercel.app` (update later with custom domain) |
| `GOOGLE_CLIENT_ID`              | From Google Cloud (see section 6)                                  |
| `GOOGLE_CLIENT_SECRET`          | From Google Cloud (see section 6)                                  |
| `ADMIN_EMAIL`                   | Your Google account email (only this can access admin)             |

### 4.3 Deploy

Click **"Deploy"** and wait (~2 minutes). Once done, you'll get a URL like:
`https://mobile-shop-xxxx.vercel.app`

> Your site is now **live**!

---

## 5. Connect a Custom Domain

### Buy a domain

Good registrars: **Namecheap**, **Cloudflare**, **GoDaddy**, **IONOS** (popular in Germany)

Example: Buy `mobilehub-berlin.de` or `handy-shop-name.de`

### Connect to Vercel

1. In Vercel, go to your project → **Settings → Domains**
2. Type your domain name and click **"Add"**
3. Vercel will show DNS records to add:
   - **Option A (Recommended):** Add a **CNAME** record:
     - Name: `www` → Value: `cname.vercel-dns.com`
   - **Option B:** Add an **A** record:
     - Name: `@` → Value: `76.76.21.21`
4. Go to your domain registrar's **DNS settings** and add these records
5. Wait 5–30 minutes for DNS to propagate
6. Update `NEXTAUTH_URL` in Vercel to your new domain: `https://yourdomain.de`

> Vercel provides **free SSL** (HTTPS) automatically!

---

## 6. Google OAuth (Admin Login)

### 6.1 Create a Google Cloud project

1. Go to https://console.cloud.google.com
2. Click **"Select a project" → "New Project"**
3. Name it `mobile-shop-admin`, click **"Create"**

### 6.2 Set up OAuth consent screen

1. Go to **APIs & Services → OAuth consent screen**
2. Choose **External** → Click **"Create"**
3. Fill in:
   - App name: `MobileHub Admin`
   - User support email: Your email
   - Developer contact: Your email
4. Click **"Save and Continue"** through all steps

### 6.3 Create OAuth credentials

1. Go to **APIs & Services → Credentials**
2. Click **"Create Credentials → OAuth client ID"**
3. Application type: **Web application**
4. Name: `Mobile Shop`
5. **Authorized redirect URIs** → Add:
   - `https://your-domain.vercel.app/api/auth/callback/google`
   - `http://localhost:3000/api/auth/callback/google` (for local dev)
6. Click **"Create"**
7. Copy the **Client ID** and **Client Secret**
8. Add them to Vercel environment variables

---

## 7. Creating Multiple Shops

This is a **template** — you can create as many shops as you want!

### Method: Fork for each shop

For each new shop:

1. **Duplicate the repository:**

   ```powershell
   # Copy the entire project folder
   Copy-Item "c:\Users\Waris\Desktop\Mobile Shop Projects\mobile-shop" `
     "c:\Users\Waris\Desktop\Mobile Shop Projects\shop-name-2" -Recurse

   cd "c:\Users\Waris\Desktop\Mobile Shop Projects\shop-name-2"

   # Remove old git history
   Remove-Item .git -Recurse -Force
   git init
   git add .
   git commit -m "Initial commit - Shop Name 2"
   ```

2. **Customize the shop** — edit `src/config.ts`:

   ```typescript
   export const siteConfig = {
     shopName: "PhoneFix Berlin",        // Change shop name
     tagline: "Ihr Handy-Spezialist",    // Change tagline
     phone: "+49 30 12345678",           // Change phone number
     whatsapp: "4930123456789",          // Change WhatsApp
     email: "info@phonefix-berlin.de",   // Change email
     address: "Kurfürstendamm 1, 10719 Berlin", // Change address
     primaryColor: "#2563eb",            // Change brand color (blue)
     primaryColorDark: "#1d4ed8",
     primaryColorLight: "#60a5fa",
     heroBackgroundImage: "https://...", // Change hero image
     openingHours: [ ... ],              // Change hours
     // ... etc
   };
   ```

3. **Create a new GitHub repo** → push the new code
4. **Create a new Supabase project** (free plan allows 2 projects)
5. **Deploy to Vercel** as a new project with its own environment variables
6. **Connect a custom domain** for this shop

### Cost per shop (approximately)

| Service      | Free Tier                           | Paid (if needed)          |
| ------------ | ----------------------------------- | ------------------------- |
| **Vercel**   | Free (hobby) — fine for small shops | Pro: $20/month            |
| **Supabase** | Free (2 projects, 500 MB)           | Pro: $25/month            |
| **Domain**   | N/A                                 | ~€10-15/year (.de domain) |
| **Total**    | **€0/month + domain**               | ~€45/month + domain       |

> **Free tier is enough for most small shops!** You only need paid plans when you get significant traffic.

---

## 8. Updating Your Site

After making changes locally:

```powershell
cd "c:\Users\Waris\Desktop\Mobile Shop Projects\mobile-shop"

# Test locally first
npm run dev

# When happy, push to deploy
git add .
git commit -m "Update: description of changes"
git push
```

> Vercel auto-deploys when you push to GitHub! Your site updates within ~2 minutes.

### Managing products & repairs

1. Go to `https://yourdomain.de/admin`
2. Sign in with the Google account set as `ADMIN_EMAIL`
3. Add, edit, or delete products and repair services
4. Changes appear on the site within 60 seconds (ISR)

---

## 9. Troubleshooting

### Site shows no products/repairs

- The site uses sample data as fallback — so it will always look filled
- To use real data: add products via the Admin panel at `/admin`
- Or run the SQL seed data in Supabase SQL Editor

### Admin login doesn't work

- Check that `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` are set in Vercel
- Check that the redirect URI in Google Cloud matches your domain exactly
- Make sure `ADMIN_EMAIL` matches the Google account you're signing in with
- Check `NEXTAUTH_URL` equals your actual domain (including `https://`)

### Styles look broken

- Clear the `.next` folder: `Remove-Item .next -Recurse -Force -ErrorAction SilentlyContinue`
- Rebuild: `npm run build`
- Redeploy: `git push`

### Images not loading

- Unsplash images should work out of the box
- For custom images: upload via Admin panel (requires Supabase Storage bucket)
- Check `next.config.js` has the image domain whitelisted

### Custom domain not working

- DNS changes can take up to 48 hours (usually 5-30 minutes)
- Check DNS records are correct at your registrar
- In Vercel: domain should show a green "Valid" badge

---

## Quick Reference

| What               | Where                                                  |
| ------------------ | ------------------------------------------------------ |
| **Site config**    | `src/config.ts` — shop name, phone, colors, hours      |
| **German text**    | `messages/de.json`                                     |
| **English text**   | `messages/en.json`                                     |
| **Database setup** | `supabase-setup.sql`                                   |
| **Admin panel**    | `https://yourdomain.de/admin`                          |
| **Brand colors**   | Change `primaryColor` in `src/config.ts`               |
| **Sample data**    | `src/lib/sample-data.ts` — fallback products & repairs |

---

**You're all set!** 🎉 Your mobile shop is ready to go live.
