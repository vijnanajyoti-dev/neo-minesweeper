# Deployment Guide

## Table of Contents
1. [Web Deployment](#web-deployment)
2. [Mobile Deployment](#mobile-deployment)
3. [Production Optimization](#production-optimization)
4. [Environment Configuration](#environment-configuration)
5. [CI/CD Setup](#cicd-setup)

## Web Deployment

### Vercel Deployment

**One-Click Deploy:**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/neo-minesweeper)

**Manual Deploy:**

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd frontend
vercel --prod
```

**Configuration** (`vercel.json`):

```json
{
  "buildCommand": "cd frontend && yarn build",
  "outputDirectory": "frontend/build",
  "framework": "create-react-app",
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

### Netlify Deployment

**One-Click Deploy:**

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/neo-minesweeper)

**Manual Deploy:**

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Build
cd frontend
yarn build

# Deploy
netlify deploy --prod --dir=build
```

**Configuration** (`netlify.toml`):

```toml
[build]
  base = "frontend/"
  command = "yarn build"
  publish = "build/"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize
firebase init hosting

# Select options:
# - Public directory: frontend/build
# - Single-page app: Yes
# - GitHub integration: Optional

# Build
cd frontend
yarn build

# Deploy
firebase deploy --only hosting
```

**Configuration** (`firebase.json`):

```json
{
  "hosting": {
    "public": "frontend/build",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

## Mobile Deployment

### Google Play Store (PWA to Android)

#### Using Bubblewrap (Trusted Web Activity)

**Step 1: Install Bubblewrap**

```bash
npm install -g @bubblewrap/cli
```

**Step 2: Initialize TWA**

```bash
bubblewrap init --manifest=https://your-domain.com/manifest.json
```

Provide:
- App name
- Package ID (com.yourcompany.neominesweeper)
- Host URL
- Icon path
- Splash screen

**Step 3: Build APK**

```bash
bubblewrap build
```

**Step 4: Generate Signing Key**

```bash
keytool -genkey -v -keystore my-release-key.keystore \
  -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

**Step 5: Sign APK**

```bash
jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 \
  -keystore my-release-key.keystore app-release-unsigned.apk my-key-alias
```

**Step 6: Upload to Play Console**

1. Go to [Google Play Console](https://play.google.com/console)
2. Create new app
3. Upload APK or AAB
4. Complete store listing
5. Submit for review

#### Required Assets for Play Store

- **App Icon**: 512×512px (PNG, no transparency)
- **Feature Graphic**: 1024×500px
- **Screenshots**: 
  - Phone: 320-3840px (min 2)
  - 7" Tablet: 320-3840px (min 2)
  - 10" Tablet: 320-3840px (optional)
- **Privacy Policy URL**: Required
- **Content Rating**: Complete questionnaire

### iOS App Store (PWA)

For iOS, users can add to home screen:

1. Open in Safari
2. Tap Share button
3. Select "Add to Home Screen"

For native app, use frameworks like:
- **Capacitor**: Wrap PWA in native shell
- **Cordova**: Similar to Capacitor

## Production Optimization

### Build Optimization

**1. Code Splitting**

```javascript
// App.js
import React, { lazy, Suspense } from 'react';

const StatsModal = lazy(() => import('./components/game/StatsModal'));
const Leaderboard = lazy(() => import('./components/game/Leaderboard'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StatsModal />
      <Leaderboard />
    </Suspense>
  );
}
```

**2. Image Optimization**

```bash
# Install image optimization tools
yarn add -D imagemin imagemin-webp

# Create optimization script
# scripts/optimize-images.js
```

**3. Bundle Analysis**

```bash
yarn add -D webpack-bundle-analyzer

# Add to package.json
"analyze": "source-map-explorer 'build/static/js/*.js'"

# Run analysis
yarn build
yarn analyze
```

**4. Service Worker for Offline**

```javascript
// src/service-worker.js
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('neo-minesweeper-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/static/js/main.js',
        '/static/css/main.css',
        '/manifest.json'
      ]);
    })
  );
});
```

### Performance Checklist

- [ ] Minify JavaScript and CSS
- [ ] Enable gzip compression
- [ ] Optimize images (WebP format)
- [ ] Implement lazy loading
- [ ] Add service worker for offline
- [ ] Enable browser caching
- [ ] Use CDN for static assets
- [ ] Reduce bundle size < 500KB
- [ ] Lighthouse score > 90

## Environment Configuration

### Production Environment Variables

Create `.env.production`:

```env
# API
REACT_APP_BACKEND_URL=https://api.your-domain.com

# Analytics
REACT_APP_GA_ID=G-XXXXXXXXXX

# AdMob
REACT_APP_ADMOB_APP_ID=ca-app-pub-xxxxx
REACT_APP_ADMOB_BANNER_ID=ca-app-pub-xxxxx/banner
REACT_APP_ADMOB_INTERSTITIAL_ID=ca-app-pub-xxxxx/interstitial

# Feature Flags
REACT_APP_ENABLE_ADS=true
REACT_APP_ENABLE_ANALYTICS=true
```

### Environment-Specific Builds

```bash
# Staging
REACT_APP_ENV=staging yarn build

# Production
REACT_APP_ENV=production yarn build
```

## CI/CD Setup

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'yarn'
          cache-dependency-path: frontend/yarn.lock
      
      - name: Install dependencies
        working-directory: frontend
        run: yarn install --frozen-lockfile
      
      - name: Run tests
        working-directory: frontend
        run: yarn test --watchAll=false
      
      - name: Build
        working-directory: frontend
        run: yarn build
        env:
          REACT_APP_BACKEND_URL: ${{ secrets.BACKEND_URL }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: frontend
```

### Docker Deployment

**Dockerfile**:

```dockerfile
# Build stage
FROM node:18-alpine AS build

WORKDIR /app/frontend

COPY frontend/package.json frontend/yarn.lock ./
RUN yarn install --frozen-lockfile

COPY frontend/ ./
RUN yarn build

# Production stage
FROM nginx:alpine

COPY --from=build /app/frontend/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**Build and Run**:

```bash
# Build image
docker build -t neo-minesweeper .

# Run container
docker run -p 8080:80 neo-minesweeper
```

**Docker Compose**:

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "8080:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

## Health Checks & Monitoring

### Health Check Endpoint

Add to `public/health.json`:

```json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### Monitoring Services

- **Sentry**: Error tracking
- **Google Analytics**: User analytics
- **Hotjar**: User behavior
- **Uptime Robot**: Uptime monitoring

## Troubleshooting

### Common Issues

**Build fails with memory error:**
```bash
# Increase Node memory
export NODE_OPTIONS="--max-old-space-size=4096"
yarn build
```

**PWA not updating:**
```javascript
// Unregister service worker
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(registration => registration.unregister());
});
```

**Cache issues:**
```bash
# Clear all caches
yarn cache clean
rm -rf node_modules
yarn install
```

## Security Checklist

- [ ] HTTPS enabled
- [ ] CSP headers configured
- [ ] XSS protection enabled
- [ ] Sensitive data encrypted
- [ ] API keys in environment variables
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Dependencies updated regularly

## Post-Deployment

1. **Test in production**:
   - Run through all game flows
   - Test on multiple devices
   - Verify analytics tracking
   - Check ad display

2. **Monitor metrics**:
   - Page load time
   - Error rate
   - User engagement
   - Conversion rate

3. **Set up alerts**:
   - Error spike notifications
   - Performance degradation
   - High traffic alerts

---

**Need help?** Open an issue on GitHub or contact support.