# ERP Honey

Enterprise resource planning (ERP) system focused on **project management**, built on a modern **fullstack** architecture:

- **Backend**: [NestJS](https://nestjs.com) (Node.js / TypeScript) with Prisma ORM
- **Frontend**: [React](https://react.dev) 19 + [Vite](https://vitejs.dev)
- **Database**: PostgreSQL 17
- **Containerization**: Docker & Docker Compose

## 📋 About the project

An **ERP (Enterprise Resource Planning)** is software that centralizes and automates the management of a company's resources and processes (HR, projects, production, finance, ...).

"ERP Honey" applies this logic by offering a **project management module**:

- **User management**: accounts secured with JWT + bcrypt authentication.
- **Project management**: creation, status (`Pending`, `IN_PROGRESS`, `COMPLETED`, `CANCELED`), owner and members.
- **Task management**: titles, descriptions, due dates, status, priority (`LOW`, `MEDIUM`, `HIGH`) and user assignments.
- **Collaboration**: member ↔ project association via `ProjectMember`, and assignee ↔ task via `TaskAssignment`.

The architecture is designed to be extensible: the backend, split into modules, can be extended with new ERP modules (inventory, invoicing, HR, ...) without starting from scratch.

---

## 🧩 Architecture

```
ERP/
├── backend/          # NestJS REST API + Prisma + PostgreSQL
│   ├── prisma/       # Data schema & migrations
│   └── src/          # Source code (modules, services, controllers)
├── frontend/         # React + Vite application
└── docker-compose.yml # Orchestrates the 3 services (db, api, web)
```

| Service | Technology | Host port |
|---------|------------|-----------|
| `postgres` | PostgreSQL 17 | `5433` |
| `backend` | NestJS | `3001` (→ internal `3000`) |
| `frontend` | React + Vite | `5174` (→ internal `5173`) |

---

## 🚀 Prerequisites

- [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/) installed
- (Optional) [Node.js](https://nodejs.org) ≥ 22 for a local run without Docker

---

## 📦 Installation & Running

### 1. Clone the repository

```bash
git clone <REPO_URL> erp_honey
cd erp_honey
```

### 2. Configure environment variables

Create the **`.env`** file in each service (they are Git-ignored), based on the examples below:

**Backend** — `backend/.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@postgres:5432/erp_honey?schema=public"
JWT_SECRET=my_secret
PORT=3000
```

> ⚠️ Note: your `DATABASE_URL` must point to the `postgres` service (the container name), **not** `localhost`.

**Frontend** — `frontend/.env`:

```env
VITE_API_URL=http://localhost:3001
```

### 3. Start the services with Docker

```bash
docker-compose up --build
```

Docker will:
1. Start the **PostgreSQL** database (`erp_honey`).
2. Build & start the **backend** (API at `http://localhost:3001`).
3. Build & start the **frontend** (at `http://localhost:5174`).

### 4. Initialize the database (migrations)

Once the backend container is up, run the Prisma migrations:

```bash
npx prisma migrate dev
```

(or `docker exec -it backend_erp npx prisma migrate dev` if you are inside the container)

---

## 🖥️ Access the services

| Service | URL |
|---------|------|
| Frontend (React) | http://localhost:5174 |
| Backend API (NestJS) | http://localhost:3001 |
| Swagger / API docs | *enabled in the backend* |

---

## 🛠️ Useful scripts

In the **backend** / **frontend** directories (outside the container):

```bash
# Backend
npm run start:dev      # start in watch mode
npm run build          # build
npm run lint           # ESLint
npm test               # Jest tests
npx prisma studio      # database admin interface

# Frontend
npm run dev            # Vite dev server
npm run build          # production build
npm run lint           # ESLint
```

---

## 📁 Data model (excerpt)

- **User** — identity, unique email, hashed password
- **Project** — name, description, status, owner
- **Task** — title, due date, status, priority, linked project
- **ProjectMember** — project ↔ user association (with role)
- **TaskAssignment** — task ↔ user association

---

## 🧱 Tech stack

- **Backend**: NestJS 11, Prisma 7, Passport JWT, bcrypt, Pino (logging), Throttler, Helmet, Swagger, Mailer
- **Frontend**: React 19, Vite 8, TypeScript
- **Database**: PostgreSQL 17
- **Infrastructure**: Docker Compose

---

## 📝 License

Private project — "UNLICENSED".