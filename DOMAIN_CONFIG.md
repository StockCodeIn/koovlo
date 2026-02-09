# 🌐 Domain Configuration Guide - Koovlo

## Current Setup

```
Primary Domain: koovlo.com
Redirect: www.koovlo.com → koovlo.com (307 Temporary)
Deployment: koovlo.vercel.app
```

---

## What's Configured ✅

### 1. **Middleware Redirect** (`src/middleware.ts`)
- Automatically redirects `www.koovlo.com` → `koovlo.com` with **307 status code**
- Applies to all routes except static files
- Runs on every request at edge level (fast)

### 2. **Robots.txt**
```
Sitemap: https://koovlo.com/sitemap.xml
```
✅ Configured for **koovlo.com** (no www)

### 3. **Application Code** (`src/app/layout.tsx`)
- All canonical URLs use **koovlo.com**
- metadataBase: `https://koovlo.com`
- OpenGraph URLs: `https://koovlo.com`
- All internal links properly formatted

### 4. **Tool Metadata** (`src/lib/toolMetadata.ts`)
- All tool URLs use **koovlo.com**
- Schema markup points to **koovlo.com**
- Social sharing uses primary domain

### 5. **Vercel Configuration** (`vercel.json`)
- Security headers configured
- Cache headers for assets
- API caching rules
- Environment variables support

---

## DNS/Domain Setup Required ✅

In your domain provider (likely Vercel's nameservers), you need:

```
A Record:      koovlo.com        → 76.76.19.165
CNAME Record:  www.koovlo.com    → cname.vercel.com
```

**Status**: You mentioned it's already set up with 307 redirect ✓

---

## SEO Benefits

| Issue | Status | Impact |
|-------|--------|--------|
| Primary domain unified | ✅ | No duplicate content |
| Canonical URLs set | ✅ | Search engines know primary |
| Robots.txt correct | ✅ | Crawlers follow single sitemap |
| 307 (not 301) redirect | ✅ | Temporary, preserves method |
| All hardcoded URLs match | ✅ | Consistent crawling |

---

## Testing

### 1. **Check Redirect** (in terminal)
```bash
# Should show 307 redirect
curl -I https://www.koovlo.com
# Location: https://koovlo.com/
```

### 2. **Verify Canonical URL**
Visit any page at `koovlo.com` and inspect:
- Meta canonical tag should point to **koovlo.com**
- OpenGraph og:url should be **koovlo.com**

### 3. **Google Search Console**
- Add both koovlo.com and www.koovlo.com
- Site will show one as primary
- Google will consolidate under koovlo.com automatically

### 4. **Check Sitemap**
```
https://koovlo.com/sitemap.xml
```
- All URLs should be koovlo.com
- Should not include www versions

---

## How Redirect Works

```
User visits: https://www.koovlo.com/tools
           ↓
Middleware catches at edge
           ↓
Returns 307 redirect to: https://koovlo.com/tools
           ↓
Browser follows redirect (GET request preserved)
           ↓
Content served from koovlo.com
```

---

## Why 307 Instead of 301?

| Redirect | Status | Use Case |
|----------|--------|----------|
| **301** | Permanent | Domain move, SEO transferred, POST→GET |
| **307** | Temporary | Temporary change, preserves method |

We use **307** because:
- Doesn't permanently move all weight to non-www
- Preserves HTTP method (POST stays POST)
- Can be changed if needed later
- Works great for API redirects

---

## Environment Variables

📝 **No special env vars needed for domain redirect!**

The middleware runs automatically. Just ensure:
- `.env.local` has NEXT_PUBLIC_GA_ID (optional)
- Vercel deployment connected to koovlo.com domain

---

## Deployment Checklist

- ✅ Middleware configured
- ✅ Vercel.json created
- ✅ Robots.txt correct
- ✅ Canonical URLs set
- ✅ Build tested (succeeds)

**Ready to deploy!** 🚀

---

## Questions/Issues

If www.koovlo.com doesn't redirect:
1. Check Vercel nameservers are active
2. Wait 24-48 hours for DNS propagation
3. Clear browser cache
4. Test with: `curl -I https://www.koovlo.com`

If canonical URLs show www:
- Ensure vercel.json is deployed
- Rebuild: `npm run build`
- Re-deploy to Vercel

---

**Configuration Date**: February 9, 2026
**Status**: ✅ Production Ready
