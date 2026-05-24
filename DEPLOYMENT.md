# CivicPulse Deployment Guide

## Pre-Deployment Checklist

### Environment Variables ✅
- [ ] Create `.env` file in `civic-pulse-backend/` (copy from `.env.example`)
- [ ] Create `.env.production` file in `civic-pulse-backend/` with production values
- [ ] Create `.env.production` file in `civic-pulse-frontend/` with production values
- [ ] Verify all required environment variables are set:
  - **Backend**: `MONGO_URI`, `JWT_SECRET`, `EMAIL_USER`, `EMAIL_PASSWORD`, `FRONTEND_URL`, `PORT`
  - **Frontend**: `VITE_API_URL`, `VITE_AI_API_URL` (optional)

### Security Checks ✅
- [ ] Ensure `.env` files are in `.gitignore` (NOT committed to version control)
- [ ] Use strong, unique `JWT_SECRET` (minimum 32 characters)
- [ ] Email password should be an app-specific password (not main Gmail password)
- [ ] CORS is configured to accept only your production domain
- [ ] HTTPS/SSL is enabled on production domain

### Database ✅
- [ ] MongoDB Atlas cluster is created and accessible
- [ ] Database user credentials are set in `MONGO_URI`
- [ ] Network access whitelist includes your server IP
- [ ] Backup strategy is in place

### Email Service ✅
- [ ] Gmail/Email service is configured
- [ ] App-specific password is generated and saved
- [ ] Test email sending in development before deploying

### API Service ✅
- [ ] Ollama/AI service endpoint is configured (or use cloud service)
- [ ] `VITE_AI_API_URL` points to your production AI service
- [ ] Fallback error messages are user-friendly

---

## Deployment Steps

### Backend Deployment (Node.js)

#### Option 1: Heroku
```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set MONGO_URI=mongodb+srv://...
heroku config:set JWT_SECRET=your_secret_here
heroku config:set EMAIL_USER=your_email@gmail.com
heroku config:set EMAIL_PASSWORD=your_app_password
heroku config:set FRONTEND_URL=https://your-domain.com
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

#### Option 2: AWS EC2 / DigitalOcean / Linode
```bash
# SSH into server
ssh user@your-server-ip

# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repository
git clone https://github.com/your-repo.git
cd civic-pulse-backend

# Install dependencies
npm install

# Set up environment variables
nano .env  # Paste production values

# Install PM2 for process management
sudo npm install -g pm2

# Start app with PM2
pm2 start server.js --name "civic-pulse"
pm2 startup
pm2 save

# Set up Nginx reverse proxy
sudo apt-get install nginx
# Configure nginx to proxy requests to localhost:5000
```

#### Option 3: Railway / Render / Vercel
- Connect your GitHub repository
- Set environment variables in dashboard
- Deploy on push automatically

### Frontend Deployment (React + Vite)

#### Option 1: Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Login and deploy
vercel

# Set environment variables in Vercel dashboard
# VITE_API_URL=https://api.your-domain.com/api
```

#### Option 2: Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

#### Option 3: GitHub Pages / AWS S3 + CloudFront
```bash
# Build
npm run build

# Upload dist/ to S3 or GitHub Pages
```

---

## Environment Variables Reference

### Backend (.env)
```
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/civicpulse
JWT_SECRET=your_32_character_secret_minimum
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=app_specific_password_not_main_password
FRONTEND_URL=https://your-domain.com
NODE_ENV=production
```

### Frontend (.env.production)
```
VITE_API_URL=https://api.your-domain.com/api
VITE_AI_API_URL=https://your-ai-service.com/api/generate
```

---

## Post-Deployment

### Monitoring ✅
- [ ] Set up error logging (consider: Sentry, LogRocket, DataDog)
- [ ] Monitor API response times
- [ ] Monitor database performance
- [ ] Set up uptime monitoring (UptimeRobot, Pingdom)

### Verification ✅
- [ ] Test user registration and login
- [ ] Test complaint submission with image upload
- [ ] Test complaint tracking
- [ ] Test admin dashboard
- [ ] Test email notifications
- [ ] Test password reset flow
- [ ] Verify API endpoints are accessible only from frontend domain

### SSL/HTTPS ✅
- [ ] Install SSL certificate (Let's Encrypt recommended for free)
- [ ] Redirect HTTP to HTTPS
- [ ] Update FRONTEND_URL to use HTTPS

### Performance ✅
- [ ] Enable gzip compression
- [ ] Optimize images
- [ ] Set up CDN if needed
- [ ] Monitor database indexes

### Backups ✅
- [ ] Set up automated MongoDB backups
- [ ] Test restore procedure
- [ ] Document backup location

---

## Troubleshooting

### CORS Errors
- Check `FRONTEND_URL` matches your domain
- Verify CORS configuration in `server.js`
- Check browser console for specific error

### Database Connection Issues
- Verify `MONGO_URI` is correct
- Check MongoDB Atlas network whitelist
- Ensure database user has correct permissions

### Email Not Sending
- Verify Gmail app-specific password is correct
- Check email service is enabled in backend
- Review email logs

### Images Not Uploading
- Check `/uploads` directory permissions
- Verify `multer` configuration
- Check file size limits

---

## Security Best Practices

1. **Never commit .env files** - Use `.env.example` as template
2. **Rotate JWT_SECRET periodically** - Invalidates all existing tokens
3. **Use strong passwords** - Minimum 8 chars + uppercase + number + special
4. **Enable HTTPS** - Use SSL/TLS certificates
5. **Rate limiting** - Implement to prevent abuse
6. **Input validation** - All endpoints validate input
7. **Update dependencies** - Regular `npm audit fix`
8. **Database backups** - Automated and tested
9. **Access control** - Admin routes protected
10. **Logging** - Errors logged for debugging

---

## Support & Troubleshooting

- Backend logs: Check PM2 logs (`pm2 logs`)
- Frontend errors: Check browser console (F12)
- Database logs: MongoDB Atlas dashboard
- Email logs: Gmail security log

