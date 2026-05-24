# CivicPulse - Production Setup Quick Start

## What Was Fixed

✅ **Environment Isolation**
- Created `.env.example` files for both backend and frontend
- Created `.env.production` files for production configuration
- All sensitive credentials moved to environment variables

✅ **Production-Ready AI Service**
- Removed hardcoded Ollama localhost URL
- Added `VITE_AI_API_URL` environment variable for flexibility
- Graceful fallback if AI service is unavailable

✅ **Cleaned Console Logs**
- Removed all production console logs
- Development logs only appear when `NODE_ENV !== 'production'`
- Kept only critical error logs for production

✅ **Security Hardening**
- Added security headers (X-Content-Type-Options, X-Frame-Options, HSTS)
- Improved CORS configuration with multiple domain support
- Better error handling without exposing sensitive information

✅ **Deployment Documentation**
- Complete [DEPLOYMENT.md](./DEPLOYMENT.md) with step-by-step guides
- [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) for verification
- `.gitignore` to prevent accidental credential exposure

---

## Quick Start for Deployment

### 1. Backend Setup

```bash
cd civic-pulse-backend

# Copy example file
cp .env.example .env

# Edit with production values
nano .env
# Add:
# - MONGO_URI (MongoDB Atlas connection string)
# - JWT_SECRET (strong random string, minimum 32 chars)
# - EMAIL_USER (your Gmail address)
# - EMAIL_PASSWORD (app-specific password)
# - FRONTEND_URL (your production domain)

# Install dependencies
npm install

# Test locally
NODE_ENV=production npm start
```

### 2. Frontend Setup

```bash
cd civic-pulse-frontend

# Copy example file
cp .env.example .env.production

# Edit production values
nano .env.production
# Add:
# - VITE_API_URL (backend API endpoint: https://api.your-domain.com/api)
# - VITE_AI_API_URL (AI service endpoint, optional)

# Install dependencies
npm install

# Build for production
npm run build

# Test build locally
npm run preview
```

### 3. Environment Variables

**Backend (.env)**
```
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/civicpulse
JWT_SECRET=generate_strong_random_32_char_string_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password_not_main_password
FRONTEND_URL=https://your-domain.com
NODE_ENV=production
```

**Frontend (.env.production)**
```
VITE_API_URL=https://api.your-domain.com/api
VITE_AI_API_URL=https://your-ai-service.com/api/generate
```

### 4. Where to Deploy

- **Backend**: Heroku, AWS EC2, DigitalOcean, Railway, Render
- **Frontend**: Vercel, Netlify, GitHub Pages, AWS S3 + CloudFront
- **Database**: MongoDB Atlas (cloud)
- **Email**: Gmail (free tier) or SendGrid/Mailgun

### 5. Security Checklist

- [ ] Never commit `.env` files to GitHub
- [ ] Use strong JWT_SECRET (32+ random characters)
- [ ] Email password should be app-specific, not main password
- [ ] Enable HTTPS on your domain
- [ ] Update CORS `FRONTEND_URL` to your production domain
- [ ] Test all flows in production environment
- [ ] Set up error monitoring (Sentry, LogRocket)
- [ ] Configure automated backups

### 6. Testing Your Deployment

```bash
# Backend health check
curl https://api.your-domain.com/api/auth/me

# Frontend should load
https://your-domain.com

# Test registration
POST https://api.your-domain.com/api/auth/register

# Test complaint submission
POST https://api.your-domain.com/api/complaints
```

---

## Common Deployment Platforms

### Heroku (Easiest for Beginners)
```bash
heroku login
heroku create civic-pulse-api
heroku config:set MONGO_URI=...
heroku config:set JWT_SECRET=...
# ... set all env vars
git push heroku main
```

### DigitalOcean / Linode
- Create VPS (Ubuntu 20.04+)
- Install Node.js: `curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -`
- Install PM2: `sudo npm install -g pm2`
- Clone repo, set .env, run: `pm2 start server.js`

### AWS EC2
- Launch t2.micro instance (free tier)
- Follow DigitalOcean setup above
- Use Security Groups to allow ports 80, 443

### Vercel (Frontend)
- Connect GitHub repo
- Set environment variables in dashboard
- Auto-deploys on push

### Netlify (Frontend)
- Connect GitHub repo
- Set build command: `npm run build`
- Set publish directory: `dist`

---

## Troubleshooting

**CORS Errors**: Check `FRONTEND_URL` in backend matches your domain
**Database Connection**: Verify MongoDB Atlas network whitelist and credentials
**Email Not Sending**: Verify app-specific password and Gmail account settings
**Images Not Uploading**: Check `/uploads` directory permissions
**AI Service Down**: Check `VITE_AI_API_URL` and service availability

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed troubleshooting.

---

## What's Next?

1. Complete [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
2. Read [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions
3. Choose deployment platform (Heroku recommended for beginners)
4. Set up environment variables
5. Deploy backend first, then frontend
6. Test all features in production
7. Set up monitoring and backups

---

## Need Help?

- Check DEPLOYMENT.md for detailed guides
- Review DEPLOYMENT_CHECKLIST.md to ensure nothing is missed
- Check console logs: `NODE_ENV=development npm start`
- Verify environment variables are set correctly
- Test locally before deploying to production

