# Smart College Recommendation System

A beginner-friendly MERN minor project for students after Class 12. Uses React, plain CSS, Express, MongoDB, cookie sessions, and transparent rule-based recommendations. No AI/ML or JWT.

## First run (PowerShell)

The application source is in `backend/` and `frontend/`. The repository includes `.env` files with public development placeholders; replace these with your own settings before running or deploying. Local credentials are not included in the upload.

1. Install the declared dependencies:
   - `cd backend` then `npm.cmd install`
   - In another terminal: `cd frontend` then `npm.cmd install`
2. Copy `backend/.env.example` to `backend/.env` and configure both MongoDB connection strings, a random session secret of at least 32 characters, and the seed admin credentials. Use distinct database names: `smart_college` and `smart_college_sessions`. Start your local MongoDB service or configure a reachable MongoDB deployment.
3. Optionally copy `frontend/.env.example` to `frontend/.env`. The API defaults to `http://localhost:5000/api`.
4. From `backend`: `npm.cmd run seed` (safe to repeat; existing admin password is preserved).
5. From `backend`: `npm.cmd run dev`.
6. From `frontend`: `npm.cmd run dev`.
7. Open `http://localhost:5173`. Administrator login: `/admin/login`, email from `SEED_ADMIN_EMAIL`, password from `SEED_ADMIN_PASSWORD`.

On systems without PowerShell script restrictions, `npm` works in place of `npm.cmd`. Never commit real credentials. The included `.env` files contain public development placeholders only. On the original checkout, Git skip-worktree protects the existing local environment files from accidental staging; keep using `.env.example` for shared configuration changes. A secure cookie requires HTTPS; leave `SESSION_COOKIE_SECURE=false` during local HTTP development. Production needs HTTPS, a trusted reverse proxy and matching `CLIENT_URL`/cookie configuration. The origin check intentionally rejects mutation requests without an exact `Origin` header; API tests must supply `Origin: http://localhost:5173`.

## What is included

- Separate user/admin login, bcrypt password hashes, session regeneration, server-side Mongo session storage and logout cookie clearing.
- Eleven explicitly named application collections; sessions use a separate database.
- One student profile per user, password changes and account deletion with owned-data cleanup.
- Eligible programme generation, sorted match scores, shortlist create/read/change/delete, owned feedback CRUD.
- Administrator dashboard and CRUD for streams, courses, entrance exams, colleges and college-course offerings. Admin can list/delete users and feedback.
- Search/filter/pagination, lazy routes, responsive tables, labelled forms, password visibility controls and accessible delete dialogs.
- Seed data: three streams, fourteen course definitions, five exams and a combined real-institution catalogue covering all 28 Indian states, with sample course offerings. All fees, ratings, cutoffs and affiliations are illustrative. Campus photos are stored locally with author/source/license credits; college courses, fees, ratings and admission rules remain sample data. See CAMPUS_PHOTO_CREDITS.md.

## Recommendation rules

A programme must meet the student's marks and budget, any selected state/course preference, and its entrance exam and score requirement. Category and stream are saved but are not eligibility filters, matching the requested rules. Fees and budget use the same illustrative course-fee basis.

Score out of 100: percentage margin (one point per percentage point above the minimum, capped at 30), unused-budget fraction times 25, rating divided by 5 times 20, preferred state 15, preferred course 10. Blank preferences earn their full preference points. Zero-budget/free programmes earn full budget points. This is ranking, not admission probability. Updating/deleting a profile clears outdated recommendations. Generating again replaces old results; a process-local guard prevents overlapping generation requests for the same user in the supplied single-server setup.

Master deletion automatically cleans up dependencies: colleges remove their offerings, recommendations and shortlists; courses remove their exams, offerings and recommendations and clear profile preferences; streams additionally remove their courses and linked student profiles. Exam deletion clears optional exam references and scores. Shared parent records are preserved. User account deletion explicitly removes that user's profile, recommendations, shortlists and feedback. No public admin registration exists. Seed creates an admin only when the configured email does not already exist.

## API

Responses are `{ success, message, data }`. Lists return `{ items, total, page, limit, pages }` inside `data`. Page defaults to 1; limit defaults to 12 and is capped at 100.

- `/api/auth`: POST `/register`, `/login`, `/admin/login`, `/logout`; GET `/me`.
- `/api/public`: GET `/colleges`, `/colleges/:id`, `/streams`, `/courses`, `/entrance-exams`. Colleges accept `search`, `state`, `course`, `maxFees`.
- `/api/user`: GET/POST/PUT/DELETE `/profile`; PUT `/password`; DELETE `/account`; POST `/recommendations/generate`; GET `/recommendations`; GET/POST `/shortlist` and `/feedback`; PUT/DELETE each `/:id`.
- `/api/admin`: GET `/dashboard`; full CRUD `/streams`, `/courses`, `/entrance-exams`, `/colleges`, `/college-courses`; GET `/users`, `/feedbacks`; DELETE each `/:id`.

The additional public entrance-exam lookup supplies profile dropdowns. Details list course offerings with pagination. Lookup dropdowns load every page so choices do not silently disappear beyond the first 100 records.

## Validation

From `frontend`: `npm.cmd run build`, `npm.cmd run lint`.
From `backend`: `node --test tests/core.test.js` runs 45 focused tests without a database.
From `backend`: `Get-ChildItem -Recurse -Filter *.js -Exclude node_modules | Where-Object FullName -NotMatch 'node_modules' | ForEach-Object { node --check $_.FullName }`.

See `VERIFICATION.md` for actual checks run in this workspace and their limitations.


## Real college identities and campus photos

Run `npm.cmd run update:colleges` from `backend` to update existing seeded college identities and photographs. This preserves IDs, ratings, offerings and shortlists, backs up the affected college records in `backend/.backups/`, and does not recreate deleted colleges. Fresh seeds use the same real institution catalogue. Real photos do not imply that the sample course listings, fees, ratings or eligibility rules are official. Image credits are visible on cards and details and documented in `CAMPUS_PHOTO_CREDITS.md`.


## Colleges across all Indian states

The state catalogue selects two institutions in each of the 28 Indian states (56 selections) and keeps existing records. Run `npm.cmd run add:state-colleges` from `backend` to import it without resetting existing data. The command is safe to repeat and backs up matching existing colleges and offerings. The public State dropdown loads the states available in the database. See `STATE_COLLEGE_CATALOGUE.md` for selection sources and coverage, and `CAMPUS_PHOTO_CREDITS.md` for photo attribution. These are curated picks, not a definitive ranking across every academic discipline. Programme assignments, fees, seats, admission rules and ratings remain labelled sample data.


## Active and inactive records

Admin lists for streams, courses, entrance exams, colleges, college-course offerings and users include an Active/Inactive switch. New and legacy records default to Active. Admin-only `PUT /api/admin/<resource>/:id/status` accepts an explicit boolean `{ "isActive": false }` (or `true`). Status changes preserve records and relationships.

Public lookups hide inactive records and inactive parents. College details, filtered search and saved/generated recommendations only show offerings whose stream, course, college and optional entrance exam are active. Inactive colleges are hidden from search, details and shortlists. Deactivating a user blocks login and invalidates access through existing sessions; reactivation permits a fresh login. Admin lists retain all records so they can be reactivated.

Run `node --test tests/status.integration.test.js` from `backend` for persistence and visibility checks. It creates a uniquely named temporary database using the configured MongoDB connection and removes only that test database afterward; it does not change the application database.
