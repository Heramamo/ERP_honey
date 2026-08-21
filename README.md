# ERP Honey

ERP Honey handles HR and payroll for teaching staff. Teachers log their hours, `RH` and `ADMIN` validate the timesheets, and the schema carries payroll slips, financial poles, charges, and revenues for the finance modules to come.

## Stack

| Layer | Technology |
|-------|------------|
| Backend | [NestJS](https://nestjs.com) 11 (TypeScript), Prisma 7, Passport JWT, bcrypt, Pino, Throttler, Helmet, Swagger, Mailer |
| Frontend | [React](https://react.dev) 19 + [Vite](https://vitejs.dev) 8, TypeScript |
| Database | PostgreSQL 17 |
| Infrastructure | Docker Compose |

## Features

- **Authentication**: JWT + bcrypt login. Four roles (`ADMIN`, `RH`, `FINANCE`, `ENSEIGNANT`) guard the protected endpoints.
- **Teacher profiles**: users with the `ENSEIGNANT` role fill in a base hourly rate and employment status via `POST /teachers/profile`.
- **Timesheets**: teachers declare a date, normal hours, overtime, and activity type via `POST /saisie-feuille`.
- **Validation**: `RH` or `ADMIN` approves or rejects each sheet (`VALIDE`, `REFUSE`, `EN_ATTENTE`) and the sheet records who validated it.
- **Queries**: list every sheet (RH/ADMIN), your own sheets (`/saisie-feuille/me`), or sheets awaiting validation (`/saisie-feuille/pending`).
- **Finance groundwork**: you can build payroll and accounting modules on the existing `Paie`, `Pôle`, `Charge`, and `Revenu` models.

Each backend feature lives in its own NestJS module, so new ERP modules plug in without touching the rest of the code.

## Architecture

```
ERP/
├── backend/             # NestJS REST API, Prisma schema and migrations
│   └── src/             # Modules, services, controllers
├── frontend/            # React + Vite application
└── docker-compose.yml   # Runs postgres, backend, frontend
```

| Container | Source | Host port |
|-----------|--------|-----------|
| `postgres_erp` | postgres:17-alpine | `5433` |
| `backend_erp` | built from `./backend` | `3001` (internal `3000`) |
| `frontend-erp` | built from `./frontend` | `5174` (internal `5173`) |

## Prerequisites

- [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/)
- Optional: [Node.js](https://nodejs.org) 22+ to run services outside Docker

## Setup

### 1. Clone the repository

```bash
git clone <REPO_URL> erp_honey
cd erp_honey
```

### 2. Create the `.env` files

Both files are git-ignored.

`backend/.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@postgres:5432/erp_honey?schema=public"
JWT_SECRET=my_secret
PORT=3000
```

The host in `DATABASE_URL` is the Compose service name `postgres`: containers resolve each other by service name on the Compose network, so `localhost` here would point at the backend container itself.

`frontend/.env`:

```env
VITE_API_URL=http://localhost:3001
```

### 3. Start the services

```bash
docker-compose up --build
```

Compose starts PostgreSQL, then the backend at http://localhost:3001, then the frontend at http://localhost:5174. The backend container runs `npm run start:dev`, so it restarts when you save code.

### 4. Run the migrations

Once the backend container is up:

```bash
docker exec -it backend_erp npx prisma migrate dev
```

To run without Docker, execute the same command from `backend/`.

## Access the services

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5174 |
| Backend API | http://localhost:3001 |
| Swagger docs | http://localhost:3001/api |

## Useful scripts

Run these from `backend/` or `frontend/`, outside the containers:

```bash
# Backend
npm run start:dev      # watch mode
npm run build          # production build
npm run lint           # ESLint
npm test               # Jest tests
npx prisma studio      # browse the database

# Frontend
npm run dev            # Vite dev server
npm run build          # production build
npm run lint           # ESLint
```

## Data model

- **Utilisateur**: identity, unique email, hashed password, role (`ADMIN`, `RH`, `FINANCE`, `ENSEIGNANT`)
- **Enseignant**: base hourly rate and employment status, linked 1:1 to a `Utilisateur`
- **FeuilleDeTemps**: date, hours worked, overtime, activity type, status, validator
- **Paie**: total salary, payment status, month, linked to an `Enseignant`
- **Pôle**: financial pole name and description
- **Charge / Revenu**: charge and revenue entries attached to a `Pôle`

## License

Private project, UNLICENSED.
