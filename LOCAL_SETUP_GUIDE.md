# Complete Local Setup Guide for Beginners

This guide will walk you through setting up and running this Medusa e-commerce project on your local computer from scratch. No prior knowledge required!

---

## Table of Contents

1. [What You're Building](#what-youre-building)
2. [Prerequisites Installation](#prerequisites-installation)
3. [Download the Project](#download-the-project)
4. [Install Project Dependencies](#install-project-dependencies)
5. [Database Setup](#database-setup)
6. [Environment Variables Setup](#environment-variables-setup)
7. [Initialize the Backend](#initialize-the-backend)
8. [Start the Application](#start-the-application)
9. [Access Your Store](#access-your-store)
10. [Troubleshooting](#troubleshooting)
11. [What's Next](#whats-next)

---

## What You're Building

This project consists of three parts:

1. **Backend** - The Medusa server (API that handles products, orders, payments, etc.)
2. **Admin Dashboard** - A web interface where you manage your store (add products, process orders, etc.)
3. **Storefront** - Your customer-facing online store (where customers browse and buy products)

---

## Prerequisites Installation

You need to install these programs first. Think of them as tools that your project needs to run.

### Step 1: Install Node.js

Node.js lets you run JavaScript code on your computer (not just in a browser).

1. Go to [https://nodejs.org](https://nodejs.org)
2. Download the **LTS version** (currently v20 or higher)
3. Run the installer and follow the prompts (just click "Next" through everything)
4. Verify it's installed:
   ```bash
   node --version
   ```
   You should see something like `v20.x.x`

### Step 2: Install pnpm

pnpm is a package manager (it downloads and manages code libraries your project needs).

1. Open your terminal/command prompt
2. Run this command:
   ```bash
   npm install -g pnpm
   ```
3. Verify it's installed:
   ```bash
   pnpm --version
   ```
   You should see a version number like `10.x.x`

### Step 3: Install PostgreSQL

PostgreSQL is a database where your products, orders, and customer data will be stored.

**On macOS:**
1. Download from [https://postgresapp.com](https://postgresapp.com)
2. Drag the app to Applications folder and open it
3. Click "Initialize" to create a new server
4. PostgreSQL is now running!

**On Windows:**
1. Download from [https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)
2. Run the installer
3. Remember the password you set for the `postgres` user (you'll need it later!)
4. Default port is 5432 (keep this)

**On Linux:**
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

Verify PostgreSQL is running:
```bash
psql --version
```
You should see something like `psql (PostgreSQL) 14.x`

### Step 4: Install Redis (Optional but Recommended)

Redis handles background jobs (like sending emails, processing payments, etc.). You can skip this initially, but it's recommended for a full experience.

**On macOS:**
```bash
brew install redis
brew services start redis
```

**On Windows:**
Download from [https://github.com/tporadowski/redis/releases](https://github.com/tporadowski/redis/releases)

**On Linux:**
```bash
sudo apt-get install redis-server
sudo systemctl start redis
```

Verify Redis is running:
```bash
redis-cli ping
```
You should see `PONG`

---

## Download the Project

If you haven't already downloaded the project:

1. **If it's a Git repository:**
   ```bash
   git clone <your-repository-url>
   cd <project-folder-name>
   ```

2. **If you downloaded a ZIP file:**
   - Extract the ZIP file to a folder
   - Open your terminal and navigate to that folder:
     ```bash
     cd /path/to/your/project
     ```

---

## Install Project Dependencies

This downloads all the code libraries your project needs.

1. Make sure you're in the project root folder
2. Run this command:
   ```bash
   pnpm install
   ```
3. Wait 2-5 minutes while it downloads everything (you'll see a progress bar)
4. When done, you should see "Done in X.Xs"

---

## Database Setup

You need to create a database for your store.

### Step 1: Create a Database

**On macOS/Linux:**
```bash
createdb medusa-store
```

**On Windows or if the above doesn't work:**
1. Open the PostgreSQL command line:
   ```bash
   psql -U postgres
   ```
2. Enter your PostgreSQL password when prompted
3. Create the database:
   ```sql
   CREATE DATABASE medusa_store;
   ```
4. Exit:
   ```sql
   \q
   ```

### Step 2: Get Your Database Connection Info

You'll need:
- **Username**: Usually `postgres`
- **Password**: The password you set during PostgreSQL installation
- **Host**: `localhost`
- **Port**: `5432`
- **Database name**: `medusa-store` (or `medusa_store`)

---

## Environment Variables Setup

Environment variables are like settings files that tell your app how to connect to the database, where the backend is, etc.

### Backend Environment Variables

1. Navigate to the backend folder:
   ```bash
   cd apps/backend
   ```

2. Copy the example file:
   ```bash
   cp .env.example .env
   ```

3. Open `.env` in any text editor (VS Code, Notepad, etc.)

4. Fill in the required values:

   ```env
   # Replace 'postgres' with your PostgreSQL username
   # Replace 'password' with your PostgreSQL password
   # Replace 'medusa-store' with your database name if different
   DATABASE_URL=postgresql://postgres:password@localhost:5432/medusa-store

   # If you installed Redis, keep this. Otherwise, remove this line
   REDIS_URL=redis://localhost:6379

   # Generate random strings for these (at least 32 characters)
   # You can use: https://generate-secret.vercel.app/32
   # Or just mash your keyboard randomly!
   JWT_SECRET=my-super-secret-jwt-key-change-this-to-something-random-and-long
   COOKIE_SECRET=my-super-secret-cookie-key-change-this-to-something-else-random

   # Keep these exactly as shown for local development
   ADMIN_CORS=http://localhost:9001
   STORE_CORS=http://localhost:9002,http://localhost:5173
   AUTH_CORS=http://localhost:9001,http://localhost:9002,http://localhost:5173

   # Leave file storage empty for now (you can add this later)
   S3_BUCKET=
   S3_REGION=
   S3_ENDPOINT=
   S3_FILE_URL=

   # If you have a Stripe account, add your secret key here
   # Get it from: https://dashboard.stripe.com/apikeys
   # Otherwise, leave empty
   STRIPE_API_KEY=

   # Backend URL
   MEDUSA_BACKEND_URL=http://localhost:9001
   ```

5. Save the file

### Storefront Environment Variables

1. Navigate to the storefront folder:
   ```bash
   cd ../storefront
   ```
   (Or from project root: `cd apps/storefront`)

2. Copy the example file:
   ```bash
   cp .env.example .env
   ```

3. Open `.env` in your text editor

4. Update the values:

   ```env
   # This tells the storefront where to find the backend
   VITE_MEDUSA_BACKEND_URL=http://localhost:9001

   # Leave this empty for now - we'll get it after starting the backend
   VITE_MEDUSA_PUBLISHABLE_KEY=

   # If you have Stripe, add your PUBLISHABLE key (starts with pk_)
   VITE_STRIPE_PUBLISHABLE_KEY=

   # Keep these as-is for local development
   VITE_PORT=9002
   VITE_HMR_PORT=24677
   VITE_DEPLOYMENT_TARGET=local
   ```

5. Save the file

---

## Initialize the Backend

Now we'll set up the database tables and create your admin account.

### Step 1: Run Database Migrations

Migrations create the tables in your database (products, orders, customers, etc.).

1. Make sure you're in the backend folder:
   ```bash
   cd apps/backend
   ```

2. Run migrations:
   ```bash
   npx medusa db:migrate
   ```

3. You should see output like "Migration completed successfully"

### Step 2: Create an Admin User

This creates your account so you can log in to the admin dashboard.

```bash
npx medusa user -e admin@example.com -p supersecret
```

**What this does:**
- Creates an admin user with email: `admin@example.com`
- Password: `supersecret`
- You can change these to anything you want!

You'll use these credentials to log in to the admin dashboard later.

### Step 3: Seed the Database (Optional)

This adds sample products so you can see how the store works.

```bash
npx medusa exec ./src/scripts/seed.ts
```

**Note:** The current seed script is empty by default. If you prefer to start with an empty store, skip this step and add products manually through the admin dashboard later.

### Step 4: Get the Publishable API Key

The storefront needs this key to talk to the backend.

1. Start the backend temporarily:
   ```bash
   pnpm dev
   ```

2. Wait until you see "Server is ready" (takes 30-60 seconds)

3. **Open a NEW terminal window** (keep the first one running!)

4. Navigate to the backend folder again:
   ```bash
   cd apps/backend
   ```

5. Run this script:
   ```bash
   npx medusa exec ./src/scripts/get-publishable-key.ts
   ```

6. You'll see output like:
   ```
   Publishable API Key: pk_01HXXXXXXXXXXXXXXXXXXXXXXXXXXX
   ```

7. **Copy that key!** (the part that starts with `pk_`)

8. Go back to `apps/storefront/.env` and paste it:
   ```env
   VITE_MEDUSA_PUBLISHABLE_KEY=pk_01HXXXXXXXXXXXXXXXXXXXXXXXXXXX
   ```

9. Save the file

10. Stop the backend (press `Ctrl+C` in the terminal where it's running)

---

## Start the Application

Now you're ready to run everything!

### Option 1: Start Everything at Once (Recommended)

From the **project root** (not inside apps/backend or apps/storefront):

```bash
pnpm dev
```

This starts both the backend and storefront together.

### Option 2: Start Each Separately

If you prefer more control:

**Terminal 1 - Backend:**
```bash
cd apps/backend
pnpm dev
```

Wait for "Server is ready" before proceeding.

**Terminal 2 - Storefront:**
```bash
cd apps/storefront
pnpm dev
```

---

## Access Your Store

Once everything is running, open your browser and visit:

### 1. **Admin Dashboard**
- URL: [http://localhost:9001/app](http://localhost:9001/app)
- Login with:
  - Email: `admin@example.com` (or whatever you set)
  - Password: `supersecret` (or whatever you set)
- Here you can:
  - Add products
  - Manage orders
  - View customers
  - Configure settings

### 2. **Storefront (Customer View)**
- URL: [http://localhost:9002](http://localhost:9002)
- This is what your customers see
- Browse products, add to cart, checkout, etc.

### 3. **API**
- URL: [http://localhost:9001](http://localhost:9001)
- This is the backend API (you usually won't visit this directly)

---

## Troubleshooting

### "Port already in use" error

**Problem:** Something else is using ports 9001 or 9002

**Solution:**
1. Find and stop the other program, OR
2. Change the port in your .env files

### "Database connection failed"

**Problem:** PostgreSQL isn't running or credentials are wrong

**Solutions:**
1. Make sure PostgreSQL is running:
   ```bash
   # macOS
   brew services list
   
   # Linux
   sudo systemctl status postgresql
   
   # Windows - check Services app
   ```

2. Double-check your `DATABASE_URL` in `apps/backend/.env`:
   - Username correct?
   - Password correct?
   - Database name correct?

3. Test the connection:
   ```bash
   psql -U postgres -d medusa-store
   ```

### "Redis connection failed"

**Problem:** Redis isn't running

**Solutions:**
1. If you installed Redis, make sure it's running:
   ```bash
   # macOS
   brew services start redis
   
   # Linux
   sudo systemctl start redis
   ```

2. If you didn't install Redis, remove the `REDIS_URL` line from `apps/backend/.env`

### "Module not found" errors

**Problem:** Dependencies didn't install correctly

**Solution:**
```bash
# From project root
rm -rf node_modules apps/*/node_modules
pnpm install
```

### "EADDRINUSE" error

**Problem:** The port is already taken

**Solution:**
1. Find what's using the port:
   ```bash
   # macOS/Linux
   lsof -i :9001
   
   # Windows
   netstat -ano | findstr :9001
   ```

2. Kill that process or change your port in .env files

### Storefront shows "Cannot connect to backend"

**Problem:** Backend isn't running or URL is wrong

**Solutions:**
1. Make sure backend is running at http://localhost:9001
2. Check `VITE_MEDUSA_BACKEND_URL` in `apps/storefront/.env`
3. Make sure you added the publishable key

### Admin dashboard shows blank page

**Problem:** Build issue or backend not ready

**Solutions:**
1. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
2. Restart the backend
3. Check browser console for errors (F12 → Console tab)

### "Migration failed" error

**Problem:** Database isn't clean or permissions issue

**Solution:**
1. Drop and recreate the database:
   ```bash
   # Drop existing database
   dropdb medusa-store
   
   # Create fresh database
   createdb medusa-store
   
   # Run migrations again
   cd apps/backend
   npx medusa db:migrate
   ```

---

## What's Next?

### Customize Your Store

1. **Add Products**
   - Log in to admin dashboard
   - Go to "Products" → "Add Product"
   - Upload images, set prices, manage inventory

2. **Configure Payment**
   - Get Stripe API keys from [https://dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys)
   - Add to backend `.env`: `STRIPE_API_KEY=sk_test_...`
   - Add to storefront `.env`: `VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...`
   - Restart both servers

3. **Set Up File Uploads**
   - Create an S3 bucket on AWS or Cloudflare R2
   - Add credentials to `apps/backend/.env`
   - Restart backend
   - Now you can upload product images!

### Learn the Codebase

- **Backend code**: `apps/backend/src/`
  - `api/` - Custom API endpoints
  - `workflows/` - Business logic workflows
  - `modules/` - Custom data models
  - `admin/` - Admin dashboard customizations

- **Storefront code**: `apps/storefront/src/`
  - `routes/` - Pages (uses TanStack Router)
  - `components/` - React components
  - `lib/` - Utility functions

### Documentation

- [Medusa Docs](https://docs.medusajs.com) - Learn about Medusa features
- [TanStack Router Docs](https://tanstack.com/router/latest) - Learn about the storefront framework
- [Medusa Admin SDK](https://docs.medusajs.com/resources/references/admin-sdk) - Customize the admin

### Common Commands Reference

**Backend (from `apps/backend/`):**
```bash
pnpm dev                                        # Start development server
pnpm build                                      # Build for production
pnpm start                                      # Start production server
npx medusa db:migrate                           # Run database migrations
npx medusa exec ./src/scripts/seed.ts           # Add sample data (if seed script has data)
npx medusa user -e <email> -p <password>        # Create admin user
npx medusa exec ./src/scripts/get-publishable-key.ts  # Get publishable API key
```

**Storefront (from `apps/storefront/`):**
```bash
pnpm dev      # Start development server
pnpm build    # Build for production
pnpm preview  # Preview production build
```

**Both (from project root):**
```bash
pnpm dev      # Start both backend and storefront
pnpm build    # Build both for production
```

---

## Need Help?

If you're stuck:

1. Check the [Troubleshooting](#troubleshooting) section above
2. Read the error message carefully - it usually tells you what's wrong
3. Check the Medusa Discord community: [https://discord.gg/medusajs](https://discord.gg/medusajs)
4. Search GitHub issues: [https://github.com/medusajs/medusa/issues](https://github.com/medusajs/medusa/issues)

---

## Summary Checklist

- [ ] Node.js installed (v20+)
- [ ] pnpm installed
- [ ] PostgreSQL installed and running
- [ ] Redis installed and running (optional)
- [ ] Project dependencies installed (`pnpm install`)
- [ ] Database created (`medusa-store`)
- [ ] Backend `.env` file created and configured
- [ ] Storefront `.env` file created and configured
- [ ] Database migrations run (`npx medusa db:migrate`)
- [ ] Admin user created (`npx medusa user`)
- [ ] Publishable key obtained and added to storefront `.env`
- [ ] Backend running at http://localhost:9001
- [ ] Storefront running at http://localhost:9002
- [ ] Can log in to admin dashboard
- [ ] Can view storefront

You're all set! Happy building!
