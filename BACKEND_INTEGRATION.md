# Backend integration guide (Vida Verde)

## Frontend contract already expected

- Base URL via env: `VITE_API_BASE_URL`
- Example local: `http://127.0.0.1:3000/api`
- Login request:
  - `POST /auth/login`
  - body: `{ "email": "user@mail.com", "senha": "123456" }`
- Login response:
  - `200 { "token": "...", "usuario": { "id": "...", "nome": "...", "email": "...", "role": "customer|admin" } }`
- Register request:
  - `POST /auth/register`
  - body: `{ "nome": "...", "email": "...", "senha": "...", "cpf": "..." }`
- Register response:
  - `201 { "id": "...", "nome": "...", "email": "..." }`
- Auth:
  - frontend sends `Authorization: Bearer <token>`
  - on `401`, frontend clears auth and redirects to `/login`

## Prompt for the backend project

Use this prompt in the other repository:

```text
You are working on the backend for a React frontend called Vida Verde.

Goal:
- Build and maintain a production-ready REST API for auth and future admin features.
- Database is Neon Postgres.
- Keep strict compatibility with the frontend contract below.

Tech requirements:
- Node.js + Express
- Prisma ORM with PostgreSQL (Neon)
- JWT auth
- Bcrypt for password hashing
- CORS enabled for frontend origin
- Validation with Zod (or equivalent)
- Layered structure: routes, controllers, services, repositories, middlewares

Environment variables:
- DATABASE_URL=<neon connection string>
- JWT_SECRET=<strong secret>
- PORT=3000
- CORS_ORIGIN=<frontend url>

API base path:
- /api

Required endpoints:
1) POST /api/auth/register
   input: { nome, email, senha, cpf }
   rules:
   - email unique
   - cpf unique
   - senha hashed
   - default role = "customer"
   output 201: { id, nome, email }

2) POST /api/auth/login
   input: { email, senha }
   output 200:
   {
     token: "<jwt>",
     usuario: {
       id,
       nome,
       email,
       role
     }
   }

3) GET /api/auth/me
   auth required
   output 200:
   {
     usuario: {
       id,
       nome,
       email,
       role
     }
   }

Auth and authorization:
- JWT middleware validates Bearer token
- Add role middleware for admin routes (role === "admin")

Database model (minimum):
- User:
  - id (uuid or cuid)
  - nome (string)
  - email (unique)
  - senhaHash (string)
  - cpf (unique)
  - role (enum: customer, admin)
  - createdAt
  - updatedAt

Deliverables:
- Prisma schema + migrations
- Seed creating one admin user:
  - email: admin@vidaverde.com
  - senha: Admin@123
  - role: admin
- Full endpoint implementation
- Error handling with consistent JSON:
  - { error: "message" }
- .env.example
- README with run steps
- Postman/Insomnia collection (optional but preferred)

Compatibility notes:
- Keep field names in pt-BR exactly as above (`senha`, `nome`, `usuario`)
- Backend response shape must stay stable to avoid frontend changes
- Prefix every route with /api

After implementing:
- run migrations
- run seed
- test register/login/me flow
- provide curl examples for each endpoint
```
