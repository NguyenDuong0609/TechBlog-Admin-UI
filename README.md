This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

### 🐳 Docker Deployment

We support both **Development** and **Production** environments using Docker.

### 1. Development Mode (Recommended for Testing)
Use this for local development with hot-reloading and auto-seeding data.

```bash
# Start Dev environment
docker-compose -f docker-compose.dev.yml up --build -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f app

# Reset Data (Manual Seed)
docker-compose -f docker-compose.dev.yml exec app npx tsx prisma/seed.ts
```
- **URL**: [http://localhost:3000](http://localhost:3000)
- **Features**: Hot reload, Auto-seed on first run, persistent SQLite data (`./data/dev.db`).

### 2. Production Mode (Optimized)
Use this for stable deployment. Steps include full build optimization and standalone output.

```bash
# Start Prod environment
docker-compose -f docker-compose.prod.yml up --build -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f app
```
- **URL**: [http://localhost:3000](http://localhost:3000)
- **Features**: Optimized build, lightweight image (Debian Slim), persistent data.

---

## 🛠 Manual Installation (Non-Docker)

### Prerequisites
- Node.js 20+
- SQLite

### Setup
```bash
# 1. Install dependencies
npm install

# 2. Setup Database
npx prisma db push
npx tsx prisma/seed.ts

# 3. Run Dev Server
npm run dev
# or
npm run build && npm start
```


