# Upscale Hub

React/Vite frontend with Node API routes for contact and career submissions.

## Local Development

Install dependencies:

```bash
npm install
```

Run the frontend:

```bash
npm run dev
```

Run the production-style Node server locally:

```bash
npm run build
npm run server
```

The server runs on:

```txt
http://localhost:3001
```

To test the React app against the local Node API, set:

```env
VITE_API_BASE_URL=http://localhost:3001
```

To test the React app against the deployed API, set:

```env
VITE_API_BASE_URL=https://upscale-hub.vercel.app
```

## Environment Variables

The backend needs these variables:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com
CONTACT_TO_EMAIL=contact-recipient@example.com
CAREERS_TO_EMAIL=careers-recipient@example.com
RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key
CORS_ALLOWED_ORIGINS=https://yourdomain.com,http://localhost:5173,http://localhost:5174
```

Only the reCAPTCHA site key goes in the frontend. The secret key must stay on the backend.

## Own Server Deployment

Build the frontend:

```bash
npm install
npm run build
```

Run the Node server with PM2:

```bash
npm install -g pm2
PORT=3001 pm2 start server.js --name upscale-hub
pm2 save
pm2 startup
```

Example Nginx config:

```nginx
server {
  server_name yourdomain.com www.yourdomain.com;

  location / {
    proxy_pass http://127.0.0.1:3001;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

Then add SSL:

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```
