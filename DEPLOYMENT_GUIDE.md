# 🪁 Kite — Deployment Guide (Render + Aiven MySQL)

This guide walks you through deploying the full Kite application:
- **Frontend** → Render Static Site (free)
- **Backend** → Render Web Service (free)
- **Database** → Aiven MySQL (free)

---

## Step 1: Set Up Aiven MySQL (Free Cloud Database)

1. Go to [https://aiven.io/](https://aiven.io/) and **Sign Up** (use GitHub login for speed).
2. After signing in, click **Create Service**.
3. Select **MySQL**.
4. Choose the **Free** plan (Hobbyist).
5. Pick a region closest to you (e.g., **Google Cloud — Singapore**).
6. Click **Create Free Service**.
7. Wait ~2 minutes for the service to be ready.

### Get Your Aiven MySQL Credentials

Once the service is running, go to the **Overview** tab. You'll see:

| Field | Example |
|-------|---------|
| **Host** | `mysql-xyz-your-project.a.aivencloud.com` |
| **Port** | `12345` |
| **User** | `avnadmin` |
| **Password** | `AVNS_xxxxxxxxxx` |
| **Database** | `defaultdb` |

Also download the **CA Certificate** file (`ca.pem`) — you'll need this for SSL.

> **Important**: Note down ALL of these values. You'll enter them in Render.

---

## Step 2: Deploy on Render

### 2a. Deploy the Backend (Flask API)

1. Go to [https://render.com/](https://render.com/) and **Sign Up / Log In**.
2. Click **New +** → **Web Service**.
3. Connect your GitHub account and select the **`Abhishek7439/Kite`** repository.
4. Configure the service:

| Setting | Value |
|---------|-------|
| **Name** | `kite-backend` |
| **Region** | Singapore (or closest) |
| **Root Directory** | `server` |
| **Runtime** | Python |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `gunicorn server:app --bind 0.0.0.0:$PORT --workers 2 --timeout 120` |

5. Under **Environment Variables**, add these (using your Aiven values):

| Key | Value |
|-----|-------|
| `MYSQL_HOST` | *(your Aiven host)* |
| `MYSQL_PORT` | *(your Aiven port)* |
| `MYSQL_USER` | `avnadmin` |
| `MYSQL_PASSWORD` | *(your Aiven password)* |
| `MYSQL_DATABASE` | `defaultdb` |
| `MYSQL_SSL_CA` | `/etc/ssl/certs/ca-certificates.crt` |
| `IMAGE_DIR` | `/opt/render/project/src/Images` |

6. Select **Free** plan.
7. Click **Create Web Service**.
8. Wait for the build to complete (~3-5 minutes).
9. Once deployed, copy the backend URL (e.g., `https://kite-backend-xxxx.onrender.com/`).

> **Note on SSL**: Aiven requires SSL. The `MYSQL_SSL_CA` path above points to the system CA bundle on Render, which should work with Aiven. If it doesn't, you can paste the CA cert contents into a Render Secret File instead.

---

### 2b. Deploy the Frontend (React Static Site)

1. Go to Render Dashboard → **New +** → **Static Site**.
2. Connect the same **`Abhishek7439/Kite`** repository.
3. Configure:

| Setting | Value |
|---------|-------|
| **Name** | `kite-frontend` |
| **Branch** | `main` |
| **Root Directory** | *(leave empty — root of repo)* |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |

4. Under **Environment Variables**, add:

| Key | Value |
|-----|-------|
| `VITE_DB_IP` | `https://kite-backend-xxxx.onrender.com/` ← *(your backend URL from Step 2a, with trailing slash!)* |

5. Click **Create Static Site**.
6. Wait for the build (~2-3 minutes).

---

## Step 3: Verify Deployment

1. Open your frontend URL (e.g., `https://kite-frontend-xxxx.onrender.com`).
2. Try creating a new account.
3. If signup works — 🎉 **You're fully deployed!**

### Quick Health Check

Visit `https://kite-backend-xxxx.onrender.com/health` in your browser. You should see:
```json
{"status": "ok"}
```

---

## Troubleshooting

### Backend won't start
- Check Render logs for MySQL connection errors
- Verify your Aiven credentials are correct
- Make sure the Aiven service status is "Running"

### Frontend shows blank or API errors
- Ensure `VITE_DB_IP` has the **trailing slash** (`/`)
- Ensure `VITE_DB_IP` starts with `https://`
- Rebuild the frontend after changing env vars (Render does this automatically)

### MySQL SSL errors
- Try setting `MYSQL_SSL_CA` to an empty string first to test without SSL
- Or download the Aiven CA cert and upload it as a Render Secret File

### Free tier cold starts
- Render free tier services spin down after 15 min of inactivity
- First request after sleep takes ~30 seconds to wake up
- This is normal behavior for free tier

---

## Architecture Overview

```
┌─────────────────┐     HTTPS      ┌─────────────────┐     SSL/TCP     ┌─────────────────┐
│  Render Static  │ ──────────────→│  Render Flask   │ ──────────────→│  Aiven MySQL    │
│  (React + Vite) │    API calls   │  (Python API)   │   DB queries   │  (Cloud DB)     │
│  kite-frontend  │                │  kite-backend   │                │  Free Plan      │
└─────────────────┘                └─────────────────┘                └─────────────────┘
       ↑                                                                       
   Browser                                                              
```

---

## Your Live URLs (fill in after deployment)

- **Frontend**: `https://kite-frontend-____.onrender.com`
- **Backend API**: `https://kite-backend-____.onrender.com`
- **Health Check**: `https://kite-backend-____.onrender.com/health`
- **GitHub Repo**: `https://github.com/Abhishek7439/Kite`
