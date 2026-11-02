# Deployment Guide

This guide covers how to deploy the Color Palette Tester to GitHub and Vercel.

## Prerequisites

- GitHub account
- Vercel account (sign up at [vercel.com](https://vercel.com))

## 🚀 Quick Deploy to Vercel

### Option 1: Via Replit (Recommended)

1. **Export to GitHub from Replit**:
   - Click on the "Version Control" tab in Replit
   - Connect your GitHub account if not already connected
   - Click "Create a Git Repo" or push to existing repo
   - Your code will be synced to GitHub

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com) and sign in
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect settings from `vercel.json`
   - Click "Deploy"

### Option 2: Manual GitHub Push

If you prefer manual control:

```bash
# Initialize git (already done in this project)
git add .
git commit -m "Initial commit"

# Add your GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push to GitHub
git push -u origin main
```

Then follow step 2 from Option 1 above.

## 📦 Build Configuration

The project is pre-configured with:

- **Install Command**: `npm ci --include=dev`
- **Build Command**: `npm run build`
- **Output Directory**: `dist/public`
- Vercel serves this app as a static site. `npm start` is only needed for the Express deployment, not Vercel.

### Build Scripts

```json
{
  "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
  "start": "NODE_ENV=production node dist/index.js",
  "dev": "NODE_ENV=development tsx server/index.ts"
}
```

## 🔧 Environment Variables

If you add backend features later, set these in Vercel:

- `NODE_ENV=production`
- `SESSION_SECRET` (generate a secure random string)
- Any API keys you use

## 📝 Important Files

- `vercel.json` - Vercel configuration
- `package.json` - Build scripts and dependencies
- `.gitignore` - Files excluded from Git
- `client/public/` - Static assets (favicon, robots.txt, sitemap.xml, ads.txt)

## 🌐 Custom Domain

After deploying to Vercel:

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add `colorpalettetester.com`
4. Follow DNS configuration instructions

## ⚡ Performance Tips

- Static assets are automatically optimized by Vercel
- Enable Vercel's Edge Network for faster global delivery
- Consider enabling Vercel Analytics for performance monitoring

## 🔄 Continuous Deployment

Once connected, every push to your `main` branch will automatically deploy to Vercel.

## 📊 Pre-deployment Checklist

✅ Build runs successfully (`npm run build`)
✅ All pages load correctly
✅ SEO meta tags are in place
✅ robots.txt and sitemap.xml are in `client/public/`
✅ ads.txt has your Google AdSense publisher ID
✅ Cookie consent banner works
✅ All legal pages (Privacy, Terms, Contact) are accessible

## 🐛 Troubleshooting

**Build fails?**
- Check the Vercel build logs
- Ensure all dependencies are in `package.json`
- Verify Node version compatibility (20.x recommended)
- If installation fails with `Exit handler never called`, check that dependency download URLs in `package-lock.json` use public npm URLs rather than a private development-environment host. Preserve locked versions and integrity hashes.
- After syncing the fix to GitHub, deploy the latest commit with **Use existing Build Cache** unchecked. Retrying the old commit will not include the fix.
- Keep imported product images in `client/src/assets`, not `attached_assets`. The uploads folder is excluded from Git by the workspace's global ignore rules, so those images will be missing on Vercel even if a workspace build succeeds.

**404 errors?**
- Check `vercel.json` rewrites configuration
- Ensure all routes in your app match the rewrite rules

**Static assets not loading?**
- Verify files are in `client/public/`
- Check file paths use absolute paths (`/favicon.png`, not `favicon.png`)

## 📞 Support

For deployment issues, check:
- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
