# BookIt — Frontend

Angular frontend for BookIt, an appointment booking platform. Service providers ("tenants" — hairdressers, beauticians, personal trainers, etc.) manage their business — services, working hours, incoming appointments — while clients browse tenant profiles and book available time slots.

> This is a learning project built to get hands-on experience with Angular on top of an already-built ASP.NET Core backend ([BookIt](https://github.com/ctrlaltdelete3/BookIt)). It is intentionally not production-ready — see [Known Limitations](#known-limitations) below for what's missing or should be improved.

---

## Stack

- **Angular 21** — standalone components, zoneless change detection (signals-based reactivity), functional guards and interceptors
- **RxJS** — HTTP calls via `HttpClient`
- **Reactive Forms** — including `FormArray` for the working-hours (7-day) form
- **JWT** — short-lived access token stored in localStorage, attached via interceptor; silent refresh via HttpOnly cookie when a request gets a 401, and proactively in the route guard when the access token has already expired
- **Vitest** — configured as the test runner (no real test coverage yet, see below)

---

## Features

- **Auth** — register, login, logout; role-based guard distinguishing tenant owners from clients
- **Public tenant profile** (`/t/:slug`) — services and working hours, no login required
- **Booking wizard** — pick a service, then a date/available slot, then confirm
- **My appointments** (client) — list of bookings with status, cancel option
- **Tenant owner dashboard** (nested routes, guarded) — manage services (CRUD), working hours, incoming appointments (confirm/reject with an optional note), and tenant profile info
- **Form validation** — password rules checklist on register, cross-field validation on the working-hours form (working day requires start/end time, optional pause must fit inside working hours, partially typed times are rejected), backend validation errors shown in the form

---

## Known Limitations

These are known gaps, tracked for follow-up — not oversights.

- **The add/edit service form renders inline below the services list**, not as a modal/overlay — on a long list the form isn't visible without scrolling
- **No redirect back to the originally requested page** after login or a failed silent token refresh — the user always lands on the default page instead
- **Clients can't enter a cancellation reason** — the backend supports it, but the UI always sends none
- **Backend error messages are shown as-is** — most of them are in English while the UI is in Croatian
- **No real unit tests** — only the default generated spec file exists; Vitest is set up but unused
- **A few cross-feature pieces still live under a single feature folder instead of `core/`** — e.g. `TenantService` and the `Service`/`WorkingHours` models are used by multiple features but weren't moved when they stopped being single-feature; tracked as a refactor, not urgent
- **No loading indicators or toast/snackbar notifications** for async requests
