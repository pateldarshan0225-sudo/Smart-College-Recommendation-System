# Smart College Recommendation System

MERN minor project with two panels: **Admin** and **User**.

## Stack
- React + Vite
- Node.js + Express
- MongoDB + Mongoose
- JWT access tokens + httpOnly refresh cookie
- bcryptjs
- Bootstrap 5

## 1. Requirements
- Node.js 20+
- MongoDB local server or MongoDB Atlas
- npm

## 2. Server setup
```bash
cd server
copy .env.example .env
npm install
npm run seed
npm run dev
```
Linux/macOS: `cp .env.example .env`.

Edit `.env` and set your MongoDB URI and strong JWT secrets.

## 3. Client setup
Open another terminal:
```bash
cd client
copy .env.example .env
npm install
npm run dev
```
Linux/macOS: `cp .env.example .env`.

Open the Vite URL shown in the terminal, normally http://localhost:5173.

## Demo accounts
Admin: `admin@example.com` / `Admin@123`
User: `student@example.com` / `User@123`

Change demo passwords for any real deployment.

## API
Server normally runs at http://localhost:5000.
Health check: GET http://localhost:5000/api/health

## Recommendation weights
Academic 30%, Course 20%, Placement 20%, Budget 15%, Facilities 10%, Location 5%.

The recommendation is a transparent compatibility score based on stored data and user preferences; it is not a claim that one college is universally best.
"# smart-college-recommendation" 
