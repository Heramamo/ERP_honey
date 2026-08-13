# ERP Honey

Enterprise resource planning (ERP) system for the **management of human resources & payroll of teaching staff**, built on a modern **fullstack** architecture:

- **Backend**: [NestJS](https://nestjs.com) (Node.js / TypeScript) with Prisma ORM
- **Frontend**: [React](https://react.dev) 19 + [Vite](https://vitejs.dev)
- **Database**: PostgreSQL 17
- **Containerization**: Docker & Docker Compose

## 📋 About the project

An **ERP (Enterprise Resource Planning)** is software that centralizes and automates the management of a company's resources and processes (HR, projects, production, finance, ...).

"ERP Honey" applies this logic to the **educational sector** by offering modules dedicated to the management of teaching staff and their activity:

- **Authentication & roles**: accounts secured with JWT + bcrypt, and a role system (`ADMIN`, `RH`, `FINANCE`, `ENSEIGNANT`) that controls access to protected endpoints.
- **Teacher management (`Enseignant`)**: each user with the `ENSEIGNANT` role completes a professional profile (base hourly rate, employment status) via `POST /teachers/profile`.
- **Time-sheet entry (`FeuilleDeTemps`)**: teachers declare their activity (date, normal hours, overtime hours, activity type) via `POST /saisie-feuille`.
- **Validation workflow**: `RH` / `ADMIN` validate or reject the time sheets (`VALIDE`, `REFUSE`, `EN_ATTENTE`), with the validator recorded on each sheet — all tracked on the backend.
- **Time-sheet queries**: listing of all sheets (RH / ADMIN), the connected teacher's own sheets (`/saisie-feuille/me`), and sheets awaiting validation (`/saisie-feuille/pending`).
- **Extensible financial foundation (data model)**: payroll slips (`Paie`), financial poles (`Pôle`), charges (`Charge`) and revenues (`Revenu`) — ready to be wired up in future modules.

The architecture is designed to be extensible: split into modules, the backend can be extended with new ERP modules (payroll processing, accounting, finance, ...) without starting from scratch.

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

- **Utilisateur** — identity, unique email, hashed password, role (`ADMIN`, `RH`, `FINANCE`, `ENSEIGNANT`)
- **Enseignant** — base hourly rate + employment status (linked 1:1 to a `Utilisateur`)
- **FeuilleDeTemps** — date, hours worked, overtime, activity type, status, validator
- **Paie** — total salary, payment status, month (linked to an `Enseignant`)
- **Pôle** — financial pole (name, description)
- **Charge / Revenu** — charge / revenue entries attached to a `Pôle`

---

## 🧱 Tech stack

- **Backend**: NestJS 11, Prisma 7, Passport JWT, bcrypt, Pino (logging), Throttler, Helmet, Swagger, Mailer
- **Frontend**: React 19, Vite 8, TypeScript
- **Database**: PostgreSQL 17
- **Infrastructure**: Docker Compose

---

## 📝 License

Private project — "UNLICENSED".