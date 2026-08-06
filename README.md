# Short-ly

A modern full-stack URL shortener built with the PERN stack. Short-ly lets users create secure, customizable short links with analytics, QR codes, password protection, expiry dates, custom slugs, authentication, and AI-assisted features.

## Features

### URL Management
- Create short URLs
- Custom slug support (AI Supported)
- Expiring links
- Single-use URLs
- Password protected URLs
- Edit destination URL
- Assign categories
- Active/Disable Urls
- Links scheduling 

### Analytics
- Click tracking
- Location tracking
- Referrer tracking
- Browser/device detection
- Analytics dashboard

### Performance
- Redis caching for instant redirects
- Background analytics processing with BullMQ
- Rate limiting
- Optimized database queries


### User Management
- Email authentication
- Google OAuth
- Profile management
- Password reset system

## API Routes

### Authentication
```bash
POST /api/auth/signup
POST /api/auth/login
POST /api/auth/logout
```
### URL
```bash
GET /:shortCode
POST /api/url/short
POST /api/url/:id/verify-password
POST /api/url/bulk
GET /api/url/
GET /api/url/category
GET /api/url/search/:query
GET /api/url/:query
DELETE /api/url/:id
PATCH /api/url/:id
```

### Analytics
```bash
GET /api/url/analytics
GET /api/url/:id/analytics
```

## Performance Optimizations

- Redis caching reduces redirect lookup latency
- BullMQ handles analytics asynchronously
- Database indexing for faster queries
- Rate limiting prevents abuse
- Pagination for large datasets

## Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS v4
- React Query
- React Router
- Recharts
- Axios
- Framer Motion

### Backend
- Node.js
- Express 5
- PostgreSQL
- Prisma ORM
- Redis
- BullMQ
- Passport.js
- Cloudinary
- Brevo Email
- Gemini AI integration

## Project Structure

```text
FRONTEND/
BACKEND/
```

## Getting Started

### Clone

```bash
git clone https://github.com/WorkingPiyush/Short-ly.git
cd Short-ly
```

### Backend

```bash
cd BACKEND
npm install
npm run dev
```

### Frontend

```bash
cd FRONTEND
npm install
npm run dev
```

## Environment Variables

Backend requires values similar to:

```env
DATABASE_URL=
REDIS_URL=
JWT_SECRET=
SESSION_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
BREVO_API_KEY=
```

## Highlights

- Secure authentication
- Fast redirects using Redis
- Async analytics processing with BullMQ
- PostgreSQL + Prisma
- Responsive dashboard
- Production-ready architecture

## Future Improvements

- Team workspaces
- Public API
- Webhooks
- Link scheduling enhancements
- More analytics
- Custom domains
- QR code customization


## License

MIT
