# TechBlog Admin UI

Admin dashboard for managing TechBlog technical articles, projects, and content. Built with modern frontend technologies to provide a smooth content management experience.

## 📦 Tech Stack

- **Framework**: Next.js 16
- **Styling**: TailwindCSS
- **UI Components**: shadcn/ui
- **Animations**: Motion
- **Database**: SQLite (Prisma ORM)
- **State Management**: Zustand
- **Language**: TypeScript

## 📋 Requirements

- Node.js 20+
- npm or yarn
- SQLite
- Docker (optional, for containerized deployment)

## 🚀 Getting Started

### Option 1: Local Development (Recommended)

1. **Clone the repository and install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   Create a `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. **Setup database:**
   ```bash
   npx prisma db push
   npx tsx prisma/seed.ts
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Option 2: Docker Deployment

#### Development Mode (Recommended for Testing)
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
- **Features**: Hot reload, auto-seed on first run, persistent SQLite data (`./data/dev.db`)

#### Production Mode (Optimized)
Use this for stable deployment with full build optimization.

```bash
# Start Prod environment
docker-compose -f docker-compose.prod.yml up --build -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f app
```

- **URL**: [http://localhost:3000](http://localhost:3000)
- **Features**: Optimized build, lightweight image, persistent data

#### Useful Docker Commands
- `docker ps`: List running containers
- `docker-compose logs -f app`: View live logs
- `docker-compose down`: Stop all containers
- `docker system prune -a`: Clean up unused images/containers (use with caution!)

---

## 📂 Project Structure

- **`prisma/`**: Database schema (`schema.prisma`) and seed scripts (`seed.ts`)
- **`public/`**: Static assets (images, fonts, icons, etc.)
- **`src/app/`**: Next.js App Router. Pages, layouts, API routes, and server actions
- **`src/components/`**: Reusable React components
- **`src/hooks/`**: Custom React hooks for reusable logic
- **`src/lib/`**: Utility functions and library configurations
- **`src/providers/`**: React Context Providers
- **`src/stores/`**: Client-side state management (Zustand)
- **`src/types/`**: TypeScript type definitions and interfaces

---

## ⚙️ Configuration Files

- **`package.json`**: Dependencies and scripts
- **`next.config.ts`**: Next.js configuration
- **`tsconfig.json`**: TypeScript configuration
- **`prisma/schema.prisma`**: Database schema definition
- **`components.json`**: shadcn/ui configuration
- **`.env`**: Environment variables (not committed to repo)
- **`.env.example`**: Template for environment variables
- **`Dockerfile.dev` & `Dockerfile.prod`**: Docker configurations for dev and production
- **`docker-compose.dev.yml` & `docker-compose.prod.yml`**: Docker Compose configurations
- **`tailwind.config.ts` & `postcss.config.js`**: CSS and PostCSS configurations

---

## 🔐 Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
DATABASE_URL="file:./dev.db"
```

**Important**: Never commit `.env` to version control. It's automatically ignored by `.gitignore`.

---

## 📚 Available Scripts

```bash
# Development
npm run dev          # Start dev server with hot reload
npm run build        # Build for production
npm start            # Start production server

# Database
npx prisma studio   # Open Prisma Studio (database UI)
npx prisma migrate  # Run migrations
npx prisma db push  # Push schema changes
```

---

## 👤 Author

- **NguyenDuong0609** - [GitHub Profile](https://github.com/NguyenDuong0609)

## 📝 License

This project is licensed under the [MIT License](LICENSE)