# 🚀 Kite Social Media — Cloud Deployment Guide

This guide details how to deploy the **Kite Social Media Application** (React Frontend + Python Flask REST API + MySQL Database) to production cloud platforms like **Render**, **Vercel**, and **Cloud MySQL Providers** (Aiven / Railway / PlanetScale).

---

## 🛠️ Created Deployment Configuration Files

All required cloud deployment configuration files have been created in the repository:

| File | Purpose | Location |
|---|---|---|
| 📄 [`render.yaml`](file:///d:/Projects/DBMS%20Project/Kite/render.yaml) | Render Infrastructure-as-Code Blueprint (Web Service + Static Site) | Project Root |
| 📄 [`server/requirements.txt`](file:///d:/Projects/DBMS%20Project/Kite/server/requirements.txt) | Production Python dependencies (`Flask`, `mysql-connector-python`, `gunicorn`) | `server/` |
| 📄 [`server/Procfile`](file:///d:/Projects/DBMS%20Project/Kite/server/Procfile) | Gunicorn WSGI web process runner for Flask | `server/` |
| 📄 [`server/setup_db.sql`](file:///d:/Projects/DBMS%20Project/Kite/server/setup_db.sql) | DDL script to populate production cloud MySQL database | `server/` |

---

## 🌐 Option 1: 1-Click / Blueprint Deployment on Render (Recommended)

Render offers free hosting for Python Flask web services, static sites, and web applications.

### Step 1: Push Code to GitHub / GitLab
1. Create a repository on GitHub (e.g. `Kite-Social-Media`).
2. Push your project code:
   ```bash
   git add .
   git commit -m "Add production cloud deployment configuration"
   git push origin main
   ```

---

### Step 2: Set Up Free Cloud MySQL Database

Choose any free managed cloud MySQL provider:

#### Option A: Aiven MySQL (Free 30-day / Free tier)
1. Sign up at [aiven.io](https://aiven.io).
2. Create a **MySQL Service**.
3. Note your connection parameters:
   - `Host`
   - `Port` (e.g. `10000-30000`)
   - `User` (`avnadmin`)
   - `Password`
   - `Database Name` (`Kite`)

#### Option B: Railway.app / PlanetScale / FreeSQLDatabase
1. Create a free MySQL database on [railway.app](https://railway.app) or [freesqldatabase.com](https://www.freesqldatabase.com).
2. Obtain your `HOST`, `USER`, `PASSWORD`, and `DATABASE` details.

#### Import Database Schema:
Run the setup SQL file against your remote database:
```powershell
mysql -h <YOUR_REMOTE_HOST> -P <YOUR_REMOTE_PORT> -u <YOUR_REMOTE_USER> -p < server/setup_db.sql
```

---

### Step 3: Deploy via Render Blueprint

1. Go to [dashboard.render.com](https://dashboard.render.com) and log in.
2. Click **New +** -> **Blueprints**.
3. Connect your GitHub repository containing `render.yaml`.
4. Render will automatically detect both services:
   - **`kite-backend`** (Python Flask API with Gunicorn)
   - **`kite-frontend`** (React Static Site with Vite)
5. Fill in the Database Environment Variables when prompted:
   - `MYSQL_HOST`: Your cloud MySQL host
   - `MYSQL_USER`: Your cloud MySQL user
   - `MYSQL_PASSWORD`: Your cloud MySQL password
   - `MYSQL_DATABASE`: `Kite`
6. Click **Apply**.

Render will automatically build and deploy both services! 🎉

---

## ⚡ Option 2: Deploy Frontend on Vercel + Backend on Render

If you prefer Vercel for ultra-fast frontend CDN deployment:

### 1. Deploy Backend on Render:
1. Create a **Web Service** on Render pointing to the `server/` directory.
2. Build Command: `pip install -r requirements.txt`
3. Start Command: `gunicorn server:app`
4. Set Environment Variables (`MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`).

### 2. Deploy Frontend on Vercel:
1. Log in to [vercel.com](https://vercel.com).
2. Click **Add New** -> **Project** -> Import repository.
3. Framework Preset: **Vite**
4. Environment Variables:
   - `VITE_DB_IP`: `https://your-kite-backend.onrender.com/`
5. Click **Deploy**.

---

## 🔍 Local Production Build Verification

You can verify the production bundle locally anytime:
```powershell
npm run build
npm run preview
```
This serves the compiled production build from `./dist` at `http://localhost:4173`.
