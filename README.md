# TaMa Backend (Task Manager Backend)

TaMa Backend is a RESTful API built for managing tasks with authentication, authorization, and secure token handling. The project is built using **Node.js**, **Express**, **TypeScript**, **Prisma**, and **PostgreSQL**.

---

## 🚀 Features

- User Authentication (Access + Refresh Token)
- Task Management with User Ownership
- Pagination, Filtering, and Search
- Secure Cookie-Based Authentication
- Prisma ORM Integration
- PostgreSQL Database

---

## 🛠 Tech Stack

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication

---

## 📦 Prerequisites

Make sure you have installed:

- Node.js (v18 or higher)
- PostgreSQL
- npm or yarn
- Git

---

## 📥 Clone Repository

```bash
git clone https://github.com/DecoderNikhil/TaMa-Backend.git
cd TaMa-Backend
```

---

## 📦 Install Dependencies

```bash
npm install
```

---

## ⚙️ Environment Variables Setup

Create a `.env` file in the root directory and add the following variables:

```env
PORT=5000

DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

PRODUCTION_ORIGIN=http://localhost:3000

ACCESS_TOKEN_SECRET=your_access_secret
ACCESS_TOKEN_EXPIRY=15m

REFRESH_TOKEN_SECRET=your_refresh_secret
REFRESH_TOKEN_EXPIRY=7d
```

---

### 🔑 Variable Explanation

| Variable             | Description                  |
| -------------------- | ---------------------------- |
| PORT                 | Backend server port          |
| DATABASE_URL         | PostgreSQL connection string |
| PRODUCTION_ORIGIN    | Frontend URL allowed in CORS |
| ACCESS_TOKEN_SECRET  | Secret key for access token  |
| ACCESS_TOKEN_EXPIRY  | Access token expiration      |
| REFRESH_TOKEN_SECRET | Secret key for refresh token |
| REFRESH_TOKEN_EXPIRY | Refresh token expiration     |

---

## 🗄 Database Setup

### Generate Prisma Client

```bash
npm run prisma:generate
```

---

### Run Database Migrations

```bash
npx prisma migrate dev
```

---

(Optional) Open Prisma Studio

```bash
npx prisma studio
```

---

## ▶️ Running Project Locally

### Development Mode

```bash
npm run dev
```

---

### Production Mode

```bash
npm run build
npm start
```

---

## 🔐 Authentication Endpoints

### Register User

```
POST /auth/register
```

Creates a new user account.

---

### Login User

```
POST /auth/login
```

Authenticates user and returns access & refresh tokens via cookies.

---

### Refresh Access Token

```
POST /auth/refresh
```

Generates a new access token using refresh token.

---

### Logout User

```
POST /auth/logout
```

Clears authentication cookies and invalidates session.

---

## ✅ Task Management Endpoints

⚠️ All task endpoints require authentication.
Each task belongs to the logged-in user only.

---

### Get All Tasks

```
GET /tasks
```

Supports:

- Pagination
- Filtering by status
- Searching by title

#### Query Parameters

| Parameter | Description                               |
| --------- | ----------------------------------------- |
| page      | Page number                               |
| limit     | Number of tasks per page                  |
| status    | Filter by task status (pending/completed) |
| search    | Search task by title                      |

---

### Create Task

```
POST /tasks
```

Creates a new task for the logged-in user.

---

### Get Task By ID

```
GET /tasks/:id
```

Returns a specific task owned by the user.

---

### Update Task

```
PATCH /tasks/:id
```

Updates task details such as title or description.

---

### Delete Task

```
DELETE /tasks/:id
```

Deletes a task owned by the user.

---

### Toggle Task Status

```
PATCH /tasks/:id/toggle
```

Switches task status between **pending** and **completed**.

---

## 🔐 Authentication Flow

1. User logs in
2. Server generates:
   - Access Token (Short-lived)
   - Refresh Token (Long-lived)

3. Tokens are stored in HTTP-only cookies
4. Access token is used for protected routes
5. Refresh token generates new access token when expired

---

## 🧪 API Testing

You can test APIs using:

- Postman
- Thunder Client
- Insomnia

---

## 🧾 Available Scripts

| Script                  | Description                    |
| ----------------------- | ------------------------------ |
| npm run dev             | Run server in development mode |
| npm run build           | Compile TypeScript             |
| npm start               | Run compiled server            |
| npm run prisma:generate | Generate Prisma client         |
| npm run prisma:migrate  | Run production migrations      |

---

## ❗ Troubleshooting

### Prisma Client Not Found

```bash
npm run prisma:generate
```

---

### Database Connection Issues

- Verify PostgreSQL is running
- Verify DATABASE_URL
- Ensure database exists

---

### Port Already In Use

Change `PORT` value in `.env`

---

## 👨‍💻 Author

Nikhil
