# Issue: Fix Login Authentication Bug & Integration Deficiencies

**Title:** `[BUG] Fix login authentication failure, schema mismatch, and mock bypass in backend and web frontend`

---

## 1. Problem
The current authentication implementation across the Ageix / Varaha Mitra codebase exhibits critical bugs, integration gaps, and security vulnerabilities:

1. **Backend API Schema Mismatch (HTTP 422)**: The FastAPI authentication models (`UserRegisterSchema` and `UserLoginSchema`) require a `username` field. Client payloads (such as in `backend/tests/test_auth.py` and web login forms) send `email` without `username`, causing requests to fail with `422 Unprocessable Entity`.
2. **Insecure Auto-Provisioning & Password Bypass**: In `backend/app/api/v1/auth.py`, when login fails due to an invalid user or incorrect password, the handler auto-provisions a dummy user and issues a valid JWT access token (200 OK) instead of rejecting the request with `401 Unauthorized`.
3. **Web Frontend Decoupled from Backend Auth API**: The React web client (`LoginPage.tsx`) uses a client-side `setTimeout` mock to simulate authentication with hardcoded tokens (`jwt_access_token_...`), bypassing the FastAPI auth backend entirely.
4. **Pre-authenticated Initial Redux State**: In `authSlice.ts`, the default state sets `isAuthenticated: true` with a hardcoded commander user (`INITIAL_USER`), allowing unauthenticated users to access protected routes on startup without logging in.

---

## 2. Current Behavior
- Running automated backend tests (`pytest backend/tests/test_auth.py`) fails with `assert 422 == 200`.
- Attempting to log into the backend with invalid credentials or arbitrary emails succeeds because `backend/app/api/v1/auth.py` fallback logic returns a standard 200 OK JWT token.
- The web app (`LoginPage.tsx`) does not trigger any network request to `/api/v1/auth/login` when the form is submitted.
- Fresh app launches bypass the login screen because Redux initializes `isAuthenticated` to `true`.

---

## 3. Expected Behavior
- **Backend Schema & Validation**:
  - `UserLoginSchema` should accept `email` or `username` as identifier inputs.
  - Endpoint `POST /api/v1/auth/login` must strictly verify passwords against stored password hashes (PostgreSQL / DB).
  - Invalid credentials must return `401 Unauthorized` with detail `"Invalid email/username or password"`. Auto-provisioning on failed login must be removed.
- **Frontend API Integration**:
  - `LoginPage.tsx` must send a `POST` request to `${API_BASE_URL}/api/v1/auth/login` containing the user's credentials.
  - On 200 OK, update Redux auth state with the returned JWT token and user profile, then navigate to `/dashboard`.
  - On error, display the server-returned error message to the user.
- **Redux Initial State**:
  - `authSlice.ts` initial state must default to `isAuthenticated: false` and `user: null` unless a valid persisted token is restored.
- **Automated Tests**:
  - `pytest backend/tests/test_auth.py` must execute cleanly and return `200 OK`.

---

## 4. Steps to Reproduce
1. **Backend API Schema Test Failure**:
   ```bash
   PYTHONPATH=backend pytest backend/tests/test_auth.py
   ```
   *Observation:* Fails with `AssertionError: assert 422 == 200`.
2. **Backend Authentication Bypass**:
   Send a `POST` request to `http://localhost:8000/api/v1/auth/login` with an unregistered email or invalid password:
   ```bash
   curl -X POST "http://localhost:8000/api/v1/auth/login" \
     -H "Content-Type: application/json" \
     -d '{"username": "nonexistent_user", "password": "wrongpassword"}'
   ```
   *Observation:* Returns HTTP 200 OK with a newly generated JWT access token instead of 401 Unauthorized.
3. **Frontend Mock Bypass**:
   - Open web client at `http://localhost:5173/login`.
   - Inspect Browser Developer Tools Network tab.
   - Click "Establish Command Connection".
   - *Observation:* No HTTP request is sent to the backend endpoint; login succeeds via local `setTimeout`.

---

## 5. Relevant Files & Components

- [`backend/app/api/v1/auth.py`](file:///Users/pranesh/Desktop/Ageix/backend/app/api/v1/auth.py#L25-L177): Backend authentication router, login/register endpoints, and auto-provisioning fallback logic.
- [`backend/tests/test_auth.py`](file:///Users/pranesh/Desktop/Ageix/backend/tests/test_auth.py#L1-L26): Backend authentication unit tests with missing `username` fields in request payloads.
- [`src/features/auth/pages/LoginPage.tsx`](file:///Users/pranesh/Desktop/Ageix/src/features/auth/pages/LoginPage.tsx#L19-L71): Web frontend login component using client-side mock authentication instead of API calls.
- [`src/features/auth/authSlice.ts`](file:///Users/pranesh/Desktop/Ageix/src/features/auth/authSlice.ts#L4-L22): Redux slice containing pre-authenticated `initialState`.
- [`civilian-mobile/lib/services/api_service.dart`](file:///Users/pranesh/Desktop/Ageix/civilian-mobile/lib/services/api_service.dart#L86-L115): Mobile app API service handling backend auth calls.

---

## 6. Suggested Acceptance Criteria

- [ ] `UserLoginSchema` supports logging in via `email` or `username`.
- [ ] `POST /api/v1/auth/login` returns `401 Unauthorized` for non-existent users or incorrect passwords.
- [ ] Auto-provisioning of fake users during failed login attempts is completely removed from backend logic.
- [ ] Web `LoginPage.tsx` performs an async API call to `/api/v1/auth/login` and handles success/error states properly.
- [ ] Redux `authSlice.ts` defaults to `isAuthenticated: false` and `user: null`.
- [ ] Automated test suite `PYTHONPATH=backend pytest backend/tests/test_auth.py` passes with 0 failures.
- [ ] No API keys, database connection strings, or JWT secret strings are exposed in logs, code, or environment files.
