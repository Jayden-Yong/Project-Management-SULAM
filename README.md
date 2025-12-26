# UMission - Project Management Volunteerism Platform

**UMission** is a modern, gamified volunteerism platform designed to bridge the gap between student volunteers and club organizers. Built with a high-performance **FastAPI** backend and a reactive **React 19** frontend, it features secure identity management via **Clerk**, real-time concurrency control, and cloud object storage via **Supabase**.

-----

## 🏗️ System Architecture

The application follows a clean **Client-Server Architecture**:

  * **Frontend (Client)**: Built with **React 19** and **TypeScript**, utilizing **Vite** for fast bundling and **Tailwind CSS v4** for styling. It manages user state, real-time feedback, and interactive dashboards.
  * **Backend (Server)**: Powered by **FastAPI** (Python 3.10+), serving as a RESTful API. It handles business logic, database transactions, and complex SQL aggregations.
  * **Database**: Uses **PostgreSQL**, managed via **SQLModel** (combining SQLAlchemy and Pydantic) for strictly typed interactions.
  * **Authentication**: Managed by **Clerk**, providing secure identity management (JWTs). The backend validates these tokens via a dependency injection system using JWKS.
  * **Storage**: **Supabase Storage** is used for hosting optimized event banners directly from the client.

-----

## 🚀 Key Features

### 1. For Students (Volunteers)

*   **Discovery Feed**:
    *   **Browse & Search**: Filter events by category (e.g., "Education") or Keywords (e.g., "KK12").
    *   **Bookmarks (NEW)**: Save events to your personal "Saved" list using the Heart button.
    *   **Event Details**: View full mission objectives, tasks, and location maps.
    *   **One-Click Join**: Send requests instantly. View status in the **"Applications"** tab.
*   **Student Dashboard**:
    *   **Digital Profile**: Personalized ID card showing valid volunteer status.
    *   **Merit System**: Automatically earn **5 Merit Stars** per completed event.
    *   **Badges**: Unlock achievements ("First Step", "Helping Hand", "Super Star") at 1, 3, and 5 missions.
    *   **My Schedule**: dedicated view for **Confirmed** vs **Pending** applications.

### 2. For Organizers (Club Admins)

*   **Event Management**:
    *   **Create & Edit**: Full control over event details, including tasks and volunteer quotas.
    *   **Banner Upload**: Drag-and-drop poster uploads powered by **Supabase**.
*   **Volunteer Control**:
    *   **Command Center**: Approve or Reject applicants with one click.
    *   **Quota Safety**: Prevents over-booking (e.g., stops at 20/20 volunteers).
*   **Analytics**:
    *   **Feedback**: View average star ratings and read student reviews.
    *   **History**: Archive events as "Completed" to finalize merit distribution.

### 3. Security & Access

*   **Auth**: Secure sign-up/login via **Clerk** (supporting Password Reset).
*   **Role Protection**: Strict access control preventing students from accessing Admin features.

-----

## 🛠️ Tech Stack

### Frontend (Client-Side)

  * **Framework**: React 19 + Vite 7
  * **Language**: TypeScript
  * **Styling**: Tailwind CSS v4 (Oxide engine) + Radix UI Primitives
  * **State/Network**: Axios (with Interceptors for Bearer Token injection)
  * **Authentication**: Clerk React SDK
  * **Icons**: Lucide React

### Backend (Server-Side)

  * **Framework**: FastAPI (Python 3.10+)
  * **Server**: Uvicorn (ASGI)
  * **ORM**: SQLModel (Pydantic + SQLAlchemy)
  * **Database**: PostgreSQL (via Supabase or Local)
  * **Security**: Python-Jose (JWT Verification with JWKS)

-----

## 📦 Prerequisites

Ensure you have the following installed:

  * **Python 3.10+**
  * **Node.js 18+** & **npm**
  * **Git**

You will also need accounts for:

1.  **Clerk**: For user authentication (Client ID & Issuer URL).
2.  **Supabase**: For the PostgreSQL database and Storage bucket (`event-banners`).

-----

## ⚡ Installation & Setup

### ⚠️ IMPORTANT: Environment Variables
Before starting the services, you **must** set up your environment variables. 
1. Copy the `.env.example` file in **both** `backend/` and `frontend/` directories.
2. Rename them to `.env`.
3. Fill in the required credentials (Supabase, Clerk, etc.).

---

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# Windows: .\venv\Scripts\activate | Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
python main.py
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

-----

## 📂 Project Structure

```
├── backend/
│   ├── main.py             # API Entry Point & Route Definitions
│   ├── models.py           # Database Schemas (Event, Registration, Bookmark)
│   ├── auth.py             # JWT Verification Logic (Clerk)
│   ├── database.py         # SQLModel Engine Setup
│   ├── config.py           # Environment Configuration (Pydantic Settings)
│   └── requirements.txt    # Python Dependencies
│
└── frontend/
    ├── src/
    │   ├── pages/Event/    # Feature Views (EventFeed, Dashboards)
    │   ├── components/     # Reusable UI (Navbar, Modals)
    │   ├── services/       # API & Supabase Clients
    │   ├── hooks/          # Custom Logic (useUserRole)
    │   ├── types/          # TypeScript Interfaces
    │   ├── routes/         # Router Configuration
    │   └── App.tsx         # Root Component (Auth Interceptors)
    └── vite.config.js      # Vite Config (Tailwind v4)
```

-----

## 📡 API Reference

### Events

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/events` | Public | List all events (supports filtering by `organizerId`, `status`). |
| `GET` | `/events/{id}` | Public | Get full details of a specific event. |
| `POST` | `/events` | Organizer | Create a new event. |
| `PUT` | `/events/{id}` | Organizer | Update event details (Title, Date, Description). |
| `PATCH` | `/events/{id}` | Organizer | Update event status (e.g., `upcoming` → `completed`). |
| `GET` | `/events/{id}/rating` | Public | Get the average star rating for a specific event. |

### Organizers

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/organizers/dashboard` | Organizer | Get events with pre-aggregated stats (Avg Rating & Feedback Count) for the dashboard. |

### Registrations (Volunteers)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/events/{id}/join` | User | Register for an event. |
| `GET` | `/events/{id}/registrations` | User | Get list of participants for an event. |
| `PATCH` | `/registrations/{id}` | Organizer | Approve/Reject a volunteer (Updates event quotas). |
| `GET` | `/users/{id}/registrations` | User | Get a user's entire history and upcoming plans. |

### User Interaction

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/users/{id}/badges` | User | Get gamification badges based on completed missions. |
| `GET` | `/users/{id}/bookmarks` | User | Get list of bookmarked event IDs. |
| `POST` | `/users/{id}/bookmarks` | User | Toggle bookmark (Save/Unsave) for an event. |
| `GET` | `/users/me/bookmarks/events` | User | Get full details of all bookmarked events. |
| `POST` | `/feedbacks` | User | Submit an event review. |
| `GET` | `/feedbacks` | Public | Get reviews (filterable by user or event). |

-----

## 🌐 Deployment

### Production URLs
- **Frontend (Vercel)**: [https://umissionweb.vercel.app](https://umissionweb.vercel.app)
- **Backend (Render)**: [https://volunteer-backend-u15e.onrender.com](https://volunteer-backend-u15e.onrender.com)

### Frontend Deployment (Vercel)

**Environment Variables Required:**
```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...    # Use pk_live_... for production
VITE_API_URL=https://volunteer-backend-u15e.onrender.com
VITE_SUPABASE_URL=https://[project-ref].supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
MODE=production
```

**Steps:**
1. Connect your GitHub repository to Vercel
2. Set **Framework Preset** to "Vite"
3. Set **Root Directory** to `frontend`
4. Add all environment variables above
5. Deploy

### Backend Deployment (Render)

**Environment Variables Required:**
```bash
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
CLERK_ISSUER=https://[your-app].clerk.accounts.dev
CORS_ORIGINS=https://umissionweb.vercel.app,http://localhost:5173
ENVIRONMENT=production
DEBUG=False
```

**Important Notes:**
- ⚠️ **Use Transaction Pooler**: For Render, you MUST use Supabase's **Transaction pooler** (port `6543`) instead of Direct connection (port `5432`) to avoid IPv6 network issues
- ⚠️ **Match Clerk Environments**: If backend uses `.clerk.accounts.dev` (Development), frontend must use `pk_test_...`. For production, use `.clerk.accounts.com` issuer and `pk_live_...` key

**Steps:**
1. Create a new **Web Service** on Render
2. Connect your GitHub repository
3. Set **Root Directory** to `backend`
4. Set **Build Command**: `pip install -r requirements.txt`
5. Set **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add all environment variables above
7. Deploy

### Post-Deployment: Database Schema Fix

After first deployment, you MUST run this SQL command in Supabase to fix the date column type:

**Go to Supabase Dashboard → SQL Editor → New Query:**
```sql
-- Fix date column type from VARCHAR to DATE
ALTER TABLE event 
ALTER COLUMN date TYPE DATE 
USING date::DATE;
```

This fixes date comparison issues that cause errors like:
```
operator does not exist: character varying < date
```

-----

## ❓ Troubleshooting

**1. "Missing VITE\_CLERK\_PUBLISHABLE\_KEY" Error**

  * Ensure you created the `.env` file in the `frontend` folder, not the root.
  * Restart the Vite server (`npm run dev`) after creating the file.

**2. Images not uploading**

  * Check your Supabase Bucket policies. You must enable **Public** access for the `event-banners` bucket or set up proper RLS policies to allow authenticated users to upload.

**3. Database Connection Failed (Production)**

  * **Error:** `Network is unreachable` or `Connection timed out`
  * **Cause:** Using Direct connection (port 5432) on Render triggers IPv6 routing issues
  * **Fix:** Switch to **Transaction pooler** (port 6543):
    ```
    postgresql://postgres.[ref]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
    ```
  * Verify your `DATABASE_URL` in `backend/.env` (local) or Render environment variables (production)
  * **Important:** Ensure the connection string starts with `postgresql://` (required by SQLAlchemy/FastAPI), not `postgres://`

**4. "password authentication failed for user postgres"**

  * Go to **Supabase Dashboard** → **Settings** → **Database** → Reset your database password
  * Update the `DATABASE_URL` with the new password
  * **Critical:** If password contains special characters (like `@`, `#`, `/`), they must be URL-encoded:
    - `@` → `%40`
    - `#` → `%23`
    - `/` → `%2F`

**5. CORS Errors / "No 'Access-Control-Allow-Origin' header"**

  * **Frontend (Vercel) can't reach Backend (Render)**
  * Verify `CORS_ORIGINS` in Render includes your Vercel URL:
    ```bash
    CORS_ORIGINS=https://umissionweb.vercel.app,http://localhost:5173
    ```
  * **Note:** CORS errors can also appear when the backend is returning 500 errors (check Render logs)

**6. "Not Authorized" / JWT Token Errors**

  * **Error:** `Signature has expired` or `Couldn't find your account`
  * **Cause:** Mismatch between Clerk Development and Production environments
  * **Fix:** Ensure Frontend and Backend are using matching Clerk keys:
    - **Development:** Backend uses `https://[app].clerk.accounts.dev` + Frontend uses `pk_test_...`
    - **Production:** Backend uses `https://[app].clerk.accounts.com` + Frontend uses `pk_live_...`
  * Check that the `CLERK_ISSUER` in `backend/.env` matches the `iss` claim in your JWT
  * **Critical:** In Clerk Dashboard → **JWT Templates**, ensure you have a template named `default` that includes `{{user.unsafe_metadata}}` in the claims. The backend relies on this to read the user's role

**7. Date Comparison Error: "operator does not exist: character varying < date"**

  * **Cause:** The `event.date` column was created as VARCHAR/TEXT instead of DATE type
  * **Fix:** Run this SQL in Supabase SQL Editor:
    ```sql
    ALTER TABLE event 
    ALTER COLUMN date TYPE DATE 
    USING date::DATE;
    ```
  * This affects the auto-update feature that marks past events as completed

**8. "supabaseUrl is required" Error (Frontend)**

  * **Cause:** Missing Supabase environment variables in Vercel
  * **Fix:** Add to Vercel environment variables:
    ```bash
    VITE_SUPABASE_URL=https://[project-ref].supabase.co
    VITE_SUPABASE_ANON_KEY=eyJ...  # Your anon public key
    ```
  * Redeploy after adding variables

-----

## 📄 License

This project is part of the Project Management group initiative at Universiti Malaya.

**Vercel App Link:** [https://umissionweb.vercel.app/](https://umissionweb.vercel.app/)
