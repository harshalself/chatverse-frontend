# ChatVerse - Deployment Guide

## 🚀 Deployment to Vercel

### Prerequisites

- Node.js 18+ installed
- Vercel CLI installed: `npm i -g vercel`
- Git repository connected to Vercel

### Environment Setup

#### 1. Environment Variables

Create these environment variables in your Vercel project:

**Production:**

```bash
VITE_API_BASE_URL=https://api.chatverse.com/api/v1
VITE_APP_NAME=ChatVerse
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=production
VITE_DEBUG_MODE=false
```

**Staging (Preview):**

```bash
VITE_API_BASE_URL=https://staging-api.chatverse.com/api/v1
VITE_APP_NAME=ChatVerse (Staging)
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=staging
VITE_DEBUG_MODE=true
```

#### 2. Build Configuration

The project is already configured with:

- ✅ `vercel.json` for deployment settings
- ✅ Environment-specific builds
- ✅ Production optimizations
- ✅ SPA routing configuration

### Deployment Steps

#### Option 1: Automatic Deployment (Recommended)

1. **Connect Repository to Vercel:**

   ```bash
   vercel --prod
   ```

2. **Follow the prompts:**

   - Connect to Git repository
   - Set framework preset to "Vite"
   - Configure build settings

3. **Set Environment Variables:**
   - Go to Vercel Dashboard → Project → Settings → Environment Variables
   - Add all required environment variables for each environment

#### Option 2: Manual Deployment

1. **Build the project:**

   ```bash
   npm run deploy:production
   ```

2. **Deploy to Vercel:**
   ```bash
   vercel --prod --local-config=vercel.json
   ```

### Environment Switching

The application supports three environments:

#### Development

```bash
npm run dev
# Uses .env.development
```

#### Staging

```bash
npm run build:staging
npm run preview
# Uses .env.staging
```

#### Production

```bash
npm run build:production
npm run preview:production
# Uses .env.production
```

### Domain Configuration

#### Production Domain

- Primary: `chatverse.com`
- Vercel: `chatverse.vercel.app`

#### Staging Domain

- Staging: `staging.chatverse.com`
- Vercel Preview: `chatverse-git-staging.vercel.app`

### Security Headers

The following security headers are automatically applied via `vercel.json`:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Cache-Control` for static assets

### Performance Optimizations

#### Bundle Analysis

```bash
npm run build:production
# Check bundle sizes in terminal output
```

#### Key Optimizations Applied:

- ✅ Code splitting with manual chunks
- ✅ Tree shaking enabled
- ✅ CSS extraction and minification
- ✅ Asset optimization with hashing
- ✅ Gzip compression
- ✅ Browser caching strategies

### Monitoring

#### Build Status

Monitor builds at: `https://vercel.com/dashboard`

#### Performance Monitoring

- Bundle size warnings at 600KB
- Lighthouse scores via Vercel Analytics
- Core Web Vitals tracking

### Troubleshooting

#### Build Failures

1. Check TypeScript errors: `npm run type-check`
2. Check lint errors: `npm run lint`
3. Verify environment variables

#### Runtime Issues

1. Check browser console for errors
2. Verify API endpoints are accessible
3. Check environment variable values

#### Common Issues

**Issue: API calls failing**

- Verify `VITE_API_BASE_URL` is correct
- Check CORS configuration on backend
- Ensure SSL certificates are valid

**Issue: Routing not working**

- Verify `vercel.json` routes configuration
- Check for case sensitivity in paths

**Issue: Build size too large**

- Review bundle analysis output
- Consider lazy loading components
- Check for duplicate dependencies

### API Integration Checklist

Before deployment, ensure:

- [ ] Backend API is deployed and accessible
- [ ] API endpoints match frontend expectations
- [ ] CORS is configured for frontend domain
- [ ] Authentication endpoints are working
- [ ] File upload limits match frontend config
- [ ] Database connections are stable
- [ ] Rate limiting is properly configured

### Post-Deployment Verification

1. **Functionality Tests:**

   - [ ] Homepage loads correctly
   - [ ] User registration/login works
   - [ ] Dashboard is accessible
   - [ ] Chat functionality works
   - [ ] File uploads work
   - [ ] Mobile responsiveness

2. **Performance Tests:**

   - [ ] Page load times < 3 seconds
   - [ ] Bundle sizes within limits
   - [ ] Images are optimized
   - [ ] Lighthouse score > 90

3. **Security Tests:**
   - [ ] HTTPS enforced
   - [ ] Security headers present
   - [ ] No sensitive data in console
   - [ ] XSS protection working

### Rollback Strategy

In case of issues:

1. **Quick Rollback:**

   ```bash
   vercel rollback
   ```

2. **Specific Version:**

   ```bash
   vercel rollback [deployment-url]
   ```

3. **Revert to Last Known Good:**
   - Identify working deployment in Vercel dashboard
   - Promote to production

### Support

For deployment issues:

- Check Vercel documentation: https://vercel.com/docs
- Review build logs in Vercel dashboard
- Monitor application logs for runtime errors
