# Work Done Summary (This Chat)

## Overview
Implemented a new `joint_tables` module for skill linking, filled missing CRUD endpoints across modules, normalized the teacher module to Drizzle, added password hashing for roles, and built a full JWT-based auth module with email-based login and request user hydration.

## Major Changes

### 1. Joint Tables Module
- Removed old skill assignment table/logic and introduced a brand-new join table.
- Added `joint_tables` module with controller/service/repository.
- Endpoint: `POST /joints/skills` assigns a skill to `student|vacancy|project|employer` after validating both skill and target existence.

### 2. CRUD Coverage
- Added missing `GET /:id` and `PUT` endpoints where absent (skill, project, vacancy, university, employer).
- Added list/update for `university_admin`.
- Added `Skill` update DTO and repo update method.

### 3. Teacher Module Normalization
- Added Drizzle schema for `teachers` and refactored repository away from raw SQL.
- Added `TeacherController` and wired module into `AppModule`.
- Added DTOs for create/update/login and related service methods.
- Updated teacher repository tests to match Drizzle patterns.

### 4. Password + Hashing
- Added `password` column and hashing behavior for:
  - `student`
  - `teacher`
  - `university_admin`
- Login flows verify using `Hasher.verify(...)`.

### 5. Auth Module (JWT)
- Added `auth` module with:
  - `POST /auth/login` (email + password)
  - JWT strategy/guard
  - Global interceptor to hydrate `req.user` with role profile
- JWT payload includes: `userId`, `role`, `email`.
- Added `email` column to `users` table with unique index.
- Updated role creation flows to persist user email.
- Added env config validation for JWT secrets and expiry.

## Endpoints Added / Updated
- `POST /joints/skills`
- `GET /skill/:id`, `PUT /skill`
- `GET /project/:id`
- `GET /vacancy/:id`
- `GET /university/:id`
- `GET /employer/:id`
- `GET /uni_admin/:id`, `GET /uni_admin` (list), `PUT /uni_admin`
- `POST /auth/login`
- `POST /teacher`, `GET /teacher/:id`, `GET /teacher`, `PUT /teacher`, `POST /teacher/login`, `GET /teacher/profile`
- `POST /students/login`, `GET /students/profile`
- `POST /uni_admin/login`, `GET /uni_admin/profile`

## Schema Changes
- Added `joint_skills` table.
- Added `teacher` table.
- Added `password` to `student`, `teacher`, `university_admin`.
- Added `email` to `users` with unique index.

## Files Added
- `src/modules/database/schema/joint-skills.table.ts`
- `src/modules/database/schema/teacher.table.ts`
- `src/modules/joint_tables/**`
- `src/modules/teacher/controllers/teacher.controller.ts`
- `src/modules/teacher/dtos/*`
- `src/modules/student/dtos/login-student.dto.ts`
- `src/modules/university_admin/dtos/login-university-admin.dto.ts`
- `src/modules/auth/**`
- `src/shared/types/repository/joint_skills.ts`
- `WORK_DONE.md`

## Notes
- Auth interceptor hydrates `req.user` with role-specific profile data.
- Login for non-employer roles now relies on hashed passwords stored in their tables.
