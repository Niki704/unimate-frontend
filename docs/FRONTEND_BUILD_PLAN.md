# Unimate Frontend — Build Plan

**Status:** Planning complete, build not yet started.
**Purpose:** A bottom-up action plan for building the Next.js frontend against the now-complete Unimate Spring Boot backend, following the same layer-by-layer discipline used for the backend (Repository → DTO → Service → Controller). This document is the reference for both manual development and for agent-driven execution later — each phase below is written to become its own agent prompt on request.

---

## 1. Confirmed Tech Stack (verified current, not assumed)

| Tool         | Version       | Notes                                                                                                                               |
| ------------ | ------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Next.js      | 16.2.x        | Turbopack is the default bundler; `middleware.ts` is renamed to **`proxy.ts`** — this is a real breaking change, not a style choice |
| React        | 19.2          | Ships with Next.js 16                                                                                                               |
| Node.js      | 22 LTS        | Next.js 16 requires 20.9+ minimum; use 22                                                                                           |
| TypeScript   | latest stable | Non-negotiable for the 1:1 DTO mirroring this plan depends on                                                                       |
| Tailwind CSS | 4.3.x         | CSS-first config via `@theme` in a single CSS file — no `tailwind.config.js` by default                                             |

**Correction from the original version of this plan:** no JWT library is needed at all. `proxy.ts` in Next.js 16 runs on the **Node.js runtime only** — Edge is not supported and cannot be configured (confirmed directly from Next.js's own docs, not assumed). The original reasoning for `jose` was Edge-Runtime compatibility, which no longer applies. See Section 2 for what replaces it.

**Init command:**

```
npx create-next-app@latest unimate-frontend --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

---

## 2. Architecture Decision: Server-Only Backend Calls

**The rule:** every call to the Spring API happens on the server — inside Server Components (reads) or Server Actions (mutations). Client Components never hold or send the JWT directly; they only trigger Server Actions.

**Why this, not a client-side SPA calling Spring directly:**

- The JWT lives in an **httpOnly cookie**, invisible to browser JavaScript — eliminates the XSS-token-theft risk that comes with `localStorage` token storage.
- **No CORS configuration needed on Spring.** CORS only governs browser-to-server requests; server-to-server calls (Next.js's server calling Spring's server) aren't subject to it at all.
- **No shared secret between the two codebases.** Per the decision below, neither `proxy.ts` nor the layout guards verify the JWT's signature — they just read its claims for UX/redirect purposes. The actual trust decision is still made by Spring on every real request; a forged or tampered cookie simply fails there (401/403), one step later than ideal, but never a real security gap. Given this project runs locally only, that tradeoff is the right one — it removes a dependency and a secret to keep in sync, in exchange for relying on the check Spring already does correctly.

**Where the route-protection logic actually lives — corrected from the original version of this plan:**

`proxy.ts` (Next.js 16) runs on the **Node.js runtime only** — confirmed directly from Next.js's own docs: _"The edge runtime is NOT supported in proxy. The proxy runtime is nodejs, and it cannot be configured."_ This isn't just a rename from `middleware.ts` — Next.js's current guidance is explicit that `proxy.ts` is _"strictly for Routing... It is NOT for Authentication (Auth should happen in Layouts or Route Handlers)."_ This followed a real vulnerability (CVE-2025-29927) where auth checks inside the old Edge-Runtime `middleware.ts` could be bypassed under certain request conditions.

So the split is:

- **`proxy.ts`** — thin, blanket check only: does the session cookie exist at all? If not, redirect to `/login`. No JWT parsing here.
- **A `layout.tsx` per role-based route group** (`app/(admin)/layout.tsx`, `app/(lecturer)/layout.tsx`, `app/(student)/layout.tsx`) — the real check. Reads the cookie, decodes the JWT's payload (a plain base64url-decode of the middle segment — no library needed, since we're not verifying the signature, per the decision above), and redirects away if the role doesn't match that section. This runs as an ordinary part of Server Component rendering, not a separate interceptable layer, so it doesn't carry the same bypass risk class that affected `middleware.ts`.

The Spring backend's URL stays a **server-only environment variable** (not `NEXT_PUBLIC_*`) — it's never shipped to the browser bundle at all.

---

## 3. Folder Structure

**Corrected from the original version of this plan** — two real fixes, not style changes:

1. `(admin)`, `(lecturer)`, `(student)` are no longer parenthesized route groups. Route groups are invisible in the URL, so three separate `dashboard/page.tsx` files under three parenthesized groups would all resolve to the same `/dashboard` path — a genuine build-breaking collision, not a style issue. They're now real folders (`admin/`, `lecturer/`, `student/`), giving clean, distinct URLs (`/admin/dashboard`, `/lecturer/dashboard`, `/student/dashboard`) as a side benefit.
2. No `app/api/` folder. Server Actions can set/clear cookies directly — there's no technical requirement forcing login/logout into Route Handlers, so they're Server Actions like everything else, in `actions/auth.actions.ts`.

```
unimate-frontend/
├── .env.local                          # SPRING_API_BASE_URL, COOKIE_NAME
├── src/
│   ├── app/
│   │   ├── page.tsx                     # root — redirects to /login or the right dashboard
│   │   ├── (auth)/                      # route group is fine here — no collision risk
│   │   │   ├── login/page.tsx
│   │   │   └── register/
│   │   │       ├── student/page.tsx
│   │   │       └── lecturer/page.tsx
│   │   ├── admin/
│   │   │   ├── layout.tsx               # role guard for everything under /admin
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── pending-approvals/page.tsx
│   │   │   ├── students/page.tsx
│   │   │   ├── lecturers/page.tsx
│   │   │   └── batches/page.tsx
│   │   ├── lecturer/
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── batches/page.tsx
│   │   │   ├── feedback/student/page.tsx
│   │   │   ├── feedback/batch/page.tsx
│   │   │   └── announcements/page.tsx
│   │   └── student/
│   │       ├── layout.tsx
│   │       ├── dashboard/page.tsx
│   │       ├── portfolio/page.tsx
│   │       ├── profile/page.tsx
│   │       └── announcements/page.tsx
│   ├── lib/
│   │   ├── session.ts                  # cookie read/write + unverified JWT-payload decode
│   │   ├── routes.ts                   # dashboardPathForRole() — shared by actions + all 3 layouts
│   │   ├── api-client.ts               # fetch wrapper: base URL, bearer header, ErrorResponse parsing
│   │   └── repositories/               # 1:1 mirror of Spring's endpoint surface
│   │       ├── auth.repo.ts
│   │       ├── student.repo.ts
│   │       ├── lecturer.repo.ts
│   │       ├── admin.repo.ts
│   │       ├── batch.repo.ts
│   │       ├── profile.repo.ts
│   │       ├── portfolio.repo.ts
│   │       ├── announcement.repo.ts
│   │       ├── student-feedback.repo.ts
│   │       └── batch-feedback.repo.ts
│   ├── actions/                        # Server Actions — mirror Service-layer mutations
│   │       ├── auth.actions.ts         # login, logout — no backend Service equivalent for logout
│   │       ├── student.actions.ts
│   │       ├── lecturer.actions.ts
│   │       ├── batch.actions.ts
│   │       ├── profile.actions.ts
│   │       ├── portfolio.actions.ts
│   │       ├── announcement.actions.ts
│   │       └── feedback.actions.ts
│   ├── types/                          # 1:1 mirror of DTO + enum layer
│   │       ├── student.ts
│   │       ├── lecturer.ts
│   │       ├── admin.ts
│   │       ├── batch.ts
│   │       ├── profile.ts
│   │       ├── portfolio.ts
│   │       ├── announcement.ts
│   │       ├── feedback.ts
│   │       ├── auth.ts
│   │       ├── enums.ts
│   │       └── error.ts
│   └── components/
│       ├── ui/                         # Button, Input, Select, Card, Table, Badge, Alert
│       ├── forms/                      # one per entity: StudentRegisterForm, BatchForm, etc.
│       └── layout/                     # Navbar, Sidebar
└── (standard Next.js config files)
```

---

## 4. Backend ↔ Frontend Mapping Table

| Backend layer                              | Frontend equivalent                                                                | Relationship                                                                                                                                                 |
| ------------------------------------------ | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `com.unimate.model` + `com.unimate.enums`  | `src/types/`                                                                       | Exact field-for-field mirror — same names, same nullability                                                                                                  |
| `com.unimate.dto` (Request/Response DTOs)  | `src/types/`                                                                       | Same files as above — request and response shapes both live here                                                                                             |
| `com.unimate.repo`                         | `src/lib/repositories/`                                                            | Not a DB query mirror — one typed function per **Spring Controller endpoint**, since that's the actual boundary this layer talks to                          |
| `com.unimate.service`                      | `src/actions/` (Server Actions)                                                    | Orchestrates one or more repository calls, mirrors the same composition principle used in `BatchService`/`AdminService`                                      |
| `com.unimate.controller` + `@PreAuthorize` | Role folders (`admin/`, `lecturer/`, `student/`) + their `layout.tsx` guards       | Role-based access expressed as folder structure + redirect logic, not as a second REST surface                                                               |
| `GlobalExceptionHandler` + `ErrorResponse` | `lib/api-client.ts`'s centralized error parsing + a shared error-display component | Same `{ message, errorCode }` shape consumed uniformly everywhere                                                                                            |
| `SecurityConfig`'s public endpoint list    | The `(auth)` route group's pages staying outside any role folder                   | `/login`, `/register/*` stay unauthenticated; everything under `admin/`, `lecturer/`, `student/` requires the cookie, enforced by each folder's `layout.tsx` |

**Deliberately not mirrored:** Admin self-registration (doesn't exist in the backend, so no frontend page for it either) and any password-reset flow (no backend endpoint exists — not invented on the frontend just because it's a common pattern elsewhere).

---

## 5. Phased Build Plan

Each phase is a complete, testable unit — and each becomes its own agent prompt when you're ready to execute it.

### Phase 0 — Init & Tooling

`create-next-app` with the flags above, confirm Turbopack dev server boots, set up `.env.local` with `SPRING_API_BASE_URL` (pointing at your local Spring instance for now) and `COOKIE_NAME`, install `jose`.

### Phase 1 — Types Layer

Write every file in `src/types/`, mirroring `Models.java`/the DTO files/`enums` exactly — same field names, same optionality (`?` for nullable fields like `batchCode` on `StudentResponseDTO`), same enum value sets. This is the foundation everything else type-checks against.

### Phase 2 — Shared Plumbing (`lib/api-client.ts`, `lib/session.ts`)

- `api-client.ts`: one function that takes a path + options, prepends `SPRING_API_BASE_URL`, attaches `Authorization: Bearer <token>` (token read from the cookie via `session.ts`), and — critically — parses a non-2xx response into the typed `ErrorResponse` shape so every repository function gets consistent error objects, not raw fetch failures.
- `session.ts`: `getToken()`, `setSessionCookie()`, `clearSessionCookie()`, and `decodeRole()` (a plain base64url-decode of the JWT's payload segment — no library, since signature verification is deliberately Spring's job only, per Section 2).

### Phase 3 — Repositories

One file per entity in `lib/repositories/`, each function corresponding to exactly one Spring endpoint (e.g. `studentRepo.approve(id, dto)` → `PATCH /api/v1/students/{id}/approve`). These are the only files allowed to call `api-client.ts` directly.

### Phase 4 — Auth Flow + Route Protection

Corrected from the original split: login and logout are Server Actions in `actions/auth.actions.ts` (no Route Handlers needed — Server Actions can set/clear cookies directly), plus `lib/routes.ts`'s `dashboardPathForRole()` helper, the login page, both registration pages (Student, Lecturer), the root `page.tsx` redirect, and a `layout.tsx` per role folder doing the actual protection — checking session existence _and_ role match in one place. A separate `proxy.ts` turned out to be pure redundancy here: every protected page already lives under one of the three role folders, so its layout guard already covers what a blanket `proxy.ts` check would add. Skipped entirely unless a future page outside those three folders needs protecting.

### Phase 5 — _(merged into Phase 4 above — nothing separate to build)_

### Phase 6 — Server Actions

One file per entity-group in `src/actions/`, each a `'use server'` function calling the relevant repository function(s), then `revalidatePath`/`redirect` as appropriate. This is where the "Lecturer must be assigned to this batch" type of UX feedback gets surfaced from the `ErrorResponse` Spring sends back — not re-implemented client-side.

### Phase 7 — UI Component Library

Tailwind-based primitives in `components/ui/` (Button, Input, Select, Card, Table, Badge for `AccountStatus`/`Role` display, Alert for error display). Built once, reused across every feature page.

### Phase 8 — Feature Pages, Per Role

Build out each route group's pages using Phases 1–7. Suggested order: Auth pages → Admin (pending-approvals, batch creation — needed to unblock everything else) → Lecturer → Student. This mirrors the dependency order you already tested manually in Postman.

### Phase 9 — Production Readiness

`loading.tsx`/`error.tsx` per route segment, confirm `SPRING_API_BASE_URL` is set as a real environment variable on Vercel (pointing at wherever Spring ends up deployed — separate decision, not covered here), and a final manual smoke test of the full flow against the real backend before considering this done.

---

## 6. Next.js 16 / Tailwind v4 Conventions Checklist

Worth keeping visible during the build — these are exactly the kind of details a stale tutorial or an agent trained on older patterns will get wrong:

- File is `proxy.ts`, not `middleware.ts` — and it runs on **Node.js only**, not Edge (confirmed from Next.js's own docs; several third-party tutorials still say otherwise and are wrong).
- **Real auth/role checks belong in `layout.tsx`, not `proxy.ts`.** Next.js's own current guidance is explicit about this, following a real bypass vulnerability (CVE-2025-29927) in the old Edge-Runtime `middleware.ts`. Keep `proxy.ts` to a blanket cookie-existence check only.
- `cookies()` and `headers()` are **async** — always `await cookies()`, not the old synchronous call.
- Tailwind config lives in CSS (`@import "tailwindcss"; @theme { ... }`), not a `tailwind.config.js`, unless a specific need for the JS config format comes up.
- Turbopack is the default bundler — no need to opt in, and no legacy webpack-specific plugins should be introduced.

---

## 7. Next Step

This document is the reference; no code gets written yet. When you're ready to execute a given phase, tell me which one and I'll turn it into a concrete agent prompt — scoped tightly to that phase's files only, the same discipline we used on the backend (explicit file scope, no wandering into unrelated phases, stop-and-ask before introducing any dependency not already listed in Section 1).
