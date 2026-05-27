# Medusa E-commerce Store

A full-stack e-commerce application built with Medusa 2.0, featuring a custom storefront and admin dashboard.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v20 or higher)
- **pnpm** (recommended package manager)
- **PostgreSQL** (v14 or higher)
- **Redis** (v6 or higher)

## Project Structure

```
.
├── apps/
│   ├── backend/          # Medusa backend (API, admin dashboard)
│   └── storefront/       # TanStack Start storefront
└── README.md
```

## Local Development Setup

### 1. Install Dependencies

Install pnpm globally if you haven't already:

```bash
npm install -g pnpm
```

Install project dependencies:

```bash
pnpm install
```

### 2. Database Setup

Create a PostgreSQL database for the project:

```bash
createdb medusa-store
```

### 3. Environment Variables

#### Backend Environment Variables

Create a `.env` file in `apps/backend/`:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/medusa-store

# Redis
REDIS_URL=redis://localhost:6379

# JWT Secret (generate a random string)
JWT_SECRET=your-random-jwt-secret-here

# Cookie Secret (generate a random string)
COOKIE_SECRET=your-random-cookie-secret-here

# Admin CORS
ADMIN_CORS=http://localhost:9001

# Store CORS
STORE_CORS=http://localhost:9002

# Auth CORS
AUTH_CORS=http://localhost:9001,http://localhost:9002

# S3 Configuration (for file uploads)
S3_BUCKET=your-s3-bucket
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=your-access-key
S3_SECRET_ACCESS_KEY=your-secret-key
S3_ENDPOINT=https://s3.us-east-1.amazonaws.com
```

#### Storefront Environment Variables

Create a `.env` file in `apps/storefront/`:

```env
# Backend URL
VITE_MEDUSA_BACKEND_URL=http://localhost:9001

# Publishable API Key (get this after running the backend)
VITE_MEDUSA_PUBLISHABLE_KEY=your-publishable-key-here
```

### 4. Run Database Migrations

Navigate to the backend directory and run migrations:

```bash
cd apps/backend
pnpm medusa db:migrate
```

### 5. Seed Database (Optional)

Populate your database with sample data:

```bash
pnpm seed
```

### 6. Create Admin User

Create your first admin user:

```bash
npx medusa user -e admin@example.com -p supersecret
```

### 7. Get Publishable API Key

Start the backend and retrieve the publishable key:

```bash
pnpm dev
```

In another terminal, run:

```bash
npx medusa exec ./src/scripts/get-publishable-key.ts
```

Copy the publishable key and add it to `apps/storefront/.env` as `VITE_MEDUSA_PUBLISHABLE_KEY`.

## Running the Application

### Start the Backend

From the `apps/backend` directory:

```bash
pnpm dev
```

The backend will be available at:
- **API**: http://localhost:9001
- **Admin Dashboard**: http://localhost:9001/app

### Start the Storefront

From the `apps/storefront` directory:

```bash
pnpm dev
```

The storefront will be available at:
- **Storefront**: http://localhost:9002

## Development Workflow

### Backend Development

- **API Routes**: Add custom routes in `apps/backend/src/api/`
- **Workflows**: Create workflows in `apps/backend/src/workflows/`
- **Modules**: Build custom modules in `apps/backend/src/modules/`
- **Admin Customizations**: Add widgets and pages in `apps/backend/src/admin/`

### Storefront Development

- **Pages**: Add routes in `apps/storefront/src/routes/`
- **Components**: Create components in `apps/storefront/src/components/`
- **Styles**: Update styles in `apps/storefront/src/styles/`

## Building for Production

### Build Backend

```bash
cd apps/backend
pnpm build
```

### Build Storefront

```bash
cd apps/storefront
pnpm build
```

### Start Production Server

**Backend:**
```bash
cd apps/backend
pnpm start
```

**Storefront:**
```bash
cd apps/storefront
pnpm serve
```

## Common Commands

### Backend

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm medusa db:migrate` - Run database migrations
- `pnpm seed` - Seed database with sample data

### Storefront

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm serve` - Preview production build

## Troubleshooting

### Port Already in Use

If ports 9001 or 9002 are already in use, you can change them in the respective package.json files or by setting environment variables.

### Database Connection Issues

Ensure PostgreSQL is running and the `DATABASE_URL` in your `.env` file is correct.

### Redis Connection Issues

Ensure Redis is running and the `REDIS_URL` in your `.env` file is correct.

### Module Not Found Errors

Try clearing node_modules and reinstalling:

```bash
rm -rf node_modules apps/*/node_modules
pnpm install
```

## Documentation

- [Medusa Documentation](https://docs.medusajs.com)
- [TanStack Start Documentation](https://tanstack.com/router/latest/docs/framework/react/start/overview)
- [Medusa Admin SDK](https://docs.medusajs.com/resources/references/admin-sdk)

## License

MIT
