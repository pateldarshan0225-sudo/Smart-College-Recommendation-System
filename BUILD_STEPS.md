# Build Order and Verification Guide

This project follows the requested 22-step order. Every implementation file is included in the project folder; the code in each file is complete working source rather than pseudo-code.

## Step 1 — Scaffold client + server
Files:
- `client/package.json`
- `client/index.html`
- `server/package.json`

Commands:
```bash
cd server
npm install
npm run dev
```
In another terminal:
```bash
cd client
npm install
npm run dev
```
Explanation: React is the client and Express/Node is the API server.
Test: Vite should show the client URL; Express starts after MongoDB is available.
Expected: client at `http://localhost:5173`, API at `http://localhost:5000`.
Common error: `npm is not recognized` -> install Node.js 20+ and reopen terminal.

## Step 2 — MongoDB + .env
Files:
- `server/config/db.js`
- `server/.env.example`
- `client/.env.example`

Commands:
```bash
cd server
copy .env.example .env
```
Linux/macOS:
```bash
cp .env.example .env
```
Set `MONGO_URI`, JWT secrets, `CLIENT_URL`.
Test:
```bash
npm run dev
```
Expected: `MongoDB connected: ...` then `API running at http://localhost:5000`.
Common error: `MONGO_URI is missing` -> create `server/.env`.

## Step 3 — 11 Mongoose models
Files:
- `server/models/User.js`
- `server/models/StudentProfile.js`
- `server/models/AcademicRecord.js`
- `server/models/College.js`
- `server/models/Course.js`
- `server/models/CollegeCourse.js`
- `server/models/CollegePlacement.js`
- `server/models/CollegeFee.js`
- `server/models/CampusFacility.js`
- `server/models/SavedCollege.js`
- `server/models/Recommendation.js`

Test: start server and run the seed command after Step 19.
Expected: MongoDB collections are created when documents are inserted.
Common error: duplicate index -> remove old conflicting demo database/index or use a clean database.

## Step 4 — Auth
Files:
- `server/controllers/authController.js`
- `server/routes/authRoutes.js`
- `server/utils/tokens.js`

Endpoints:
- POST `/api/auth/register`
- POST `/api/auth/login`
- POST `/api/auth/refresh`
- POST `/api/auth/logout`
- GET `/api/auth/me`

Commands:
```bash
npm run dev
```
Test with the React Login/Register pages or Postman.
Expected: login returns an access token and sets an httpOnly refresh cookie.
Common error: 401 after refresh -> verify `CLIENT_URL`, `withCredentials`, and cookie settings.

## Step 5 — Middleware
Files:
- `server/middleware/auth.js`
- `server/middleware/errorHandler.js`

Middleware:
- `authenticate`
- `authorizeAdmin`
- `authorizeUser`

Test: call an admin endpoint with a user token; expected HTTP 403.

## Step 6 — Student profile APIs
Files:
- `server/controllers/profileController.js`
- `server/routes/profileRoutes.js`

Endpoints:
- GET `/api/profile`
- POST `/api/profile`
- PUT `/api/profile`

Test: login as user and save profile.
Expected: profile document is created/updated for the logged-in user.

## Step 7 — Academic APIs
Files:
- `server/controllers/academicController.js`
- `server/routes/academicRoutes.js`

Endpoints:
- GET `/api/academic`
- POST `/api/academic`
- PUT `/api/academic`

Test: save 10th, 12th and UG percentages.
Expected: invalid percentage outside 0–100 returns HTTP 400.

## Step 8 — College CRUD
Files:
- `server/controllers/collegeController.js`
- `server/routes/collegeRoutes.js`

Endpoints:
- GET `/api/colleges`
- GET `/api/colleges/:id`
- POST `/api/colleges` (admin)
- PUT `/api/colleges/:id` (admin)
- DELETE `/api/colleges/:id` (admin)

Test: use Admin panel or Postman.
Expected: college can be inserted, viewed, edited and deleted.

## Step 9 — Course CRUD
Files:
- `server/routes/courseRoutes.js`
- `server/models/Course.js`

Endpoints:
- GET `/api/courses`
- POST `/api/courses` (admin)
- PUT `/api/courses/:id` (admin)
- DELETE `/api/courses/:id` (admin)

Test: Admin -> courses.
Expected: course appears in the list and can be edited/deleted.

## Step 10 — College-Course CRUD
Files:
- `server/models/CollegeCourse.js`
- Admin generic CRUD: `server/controllers/adminController.js`, `server/routes/adminRoutes.js`

Admin endpoints:
- GET `/api/admin/entities/college_courses`
- POST `/api/admin/entities/college_courses`
- PUT `/api/admin/entities/college_courses/:id`
- DELETE `/api/admin/entities/college_courses/:id`

Expected: a college can be connected to a course with eligibility and seats.

## Step 11 — Placement CRUD
Model:
- `server/models/CollegePlacement.js`
Admin generic CRUD entity:
- `college_placements`

Expected: placement rate/package data is manageable from Admin.

## Step 12 — Fee CRUD
Model:
- `server/models/CollegeFee.js`
Admin generic CRUD entity:
- `college_fees`

Expected: fee data is manageable from Admin.

## Step 13 — Facility CRUD
Model:
- `server/models/CampusFacility.js`
Admin generic CRUD entity:
- `campus_facilities`

Expected: boolean facility data is manageable from Admin.

## Step 14 — Recommendation algorithm
Files:
- `server/services/recommendationService.js`
- `server/controllers/recommendationController.js`
- `server/routes/recommendationRoutes.js`

Weights:
- Academic 30%
- Course 20%
- Placement 20%
- Budget 15%
- Facilities 10%
- Location 5%

Endpoints:
- POST `/api/recommendations/generate`
- GET `/api/recommendations`
- GET `/api/recommendations/:id`

Test: complete profile + academic + preferences, then Generate Recommendations.
Expected: scores and explanation reasons are returned.
Common error: `Complete your profile...` -> save profile, academic and preferences first.

## Step 15 — React authentication
Files:
- `client/src/context/AuthContext.jsx`
- `client/src/components/ProtectedRoute.jsx`
- `client/src/services/api.js`
- `client/src/pages/auth/Login.jsx`
- `client/src/pages/auth/Register.jsx`

Test: login, wait for access-token expiry in a controlled test, then call an API.
Expected: Axios attempts `/auth/refresh` and retries the failed request automatically.

## Step 16 — User panel
Files:
- `client/src/layouts/UserLayout.jsx`
- `client/src/pages/user/Dashboard.jsx`
- `client/src/pages/user/Profile.jsx`
- `client/src/pages/user/Academic.jsx`
- `client/src/pages/user/Preferences.jsx`
- `client/src/pages/user/Recommendations.jsx`
- `client/src/pages/user/CollegeDetails.jsx`
- `client/src/pages/user/Compare.jsx`
- `client/src/pages/user/Saved.jsx`

Test: login as `student@example.com` and use each menu item.
Expected: user can manage personal data, generate recommendations, compare and save colleges.

## Step 17 — Admin layout + dashboard
Files:
- `client/src/layouts/AdminLayout.jsx`
- `client/src/pages/admin/Dashboard.jsx`

Test: login as admin.
Expected: sidebar shows Dashboard and all 11 data entities.

## Step 18 — Admin CRUD pages
Files:
- `client/src/pages/admin/EntityPage.jsx`
- `client/src/App.jsx`

The reusable CRUD page handles all 11 entities:
- users
- student_profiles
- academic_records
- colleges
- courses
- college_courses
- college_placements
- college_fees
- campus_facilities
- saved_colleges
- recommendations

Operations:
- View/list
- Search
- Add
- Edit
- Delete

Test: open every Admin sidebar item.
Expected: table, Add form, Edit and Delete controls work.
Common error: duplicate relationship -> the database has a unique compound index; use a different college/course combination.

## Step 19 — Seed data
File:
- `server/seed/seedData.js`

Command:
```bash
cd server
npm run seed
```
Expected output:
```text
Seed complete. Admin: admin@example.com / Admin@123
Demo user: student@example.com / User@123
```
The seed uses fictional/demo college data.

## Step 20 — Final validation + README
Files:
- `README.md`
- `.gitignore`

Commands:
```bash
cd server
npm install
npm run dev
```
Another terminal:
```bash
cd client
npm install
npm run build
npm run dev
```
Test:
- register/login
- admin login
- all CRUD pages
- recommendation generation
- save/remove college
- compare colleges
- refresh after 401

Expected: Vite production build completes successfully and both applications run.

## Step 21 — Final project review/package preparation
Review:
- No college-manager role exists.
- Only `admin` and `user` roles exist.
- Passwords are hashed.
- Refresh token is httpOnly.
- Admin APIs require admin authorization.
- User APIs require user authorization.
- `.env` is ignored by Git.
- Demo credentials are documented.
- Recommendation score is explainable.

## Step 22 — ZIP
The final ZIP is created at:
`smart-college-recommendation.zip`

It contains the complete source tree without `node_modules` and without real `.env` secrets.
