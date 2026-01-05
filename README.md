# UMission - Project Management Volunteerism Platform

**UMission** is a modern, gamified volunteerism platform designed to bridge the gap between student volunteers and club organizers. Built with a high-performance **FastAPI** backend and a reactive **React 19** frontend, it features secure identity management via **Clerk**, real-time concurrency control, and cloud object storage via **Supabase**.

-----

## 📚 Documentation & Guides

> **[📖 User Guide (Volunteers & Organizers)](USER_GUIDE.md)**  
> A complete manual explaining how to use all features of the platform.

> **[💻 Local Setup Guide](Local%20Host.txt)**  
> Step-by-step instructions on how to run this project on your local machine.

-----

## 🏗️ System Architecture

The application follows a clean **Client-Server Architecture** optimized for serverless deployment (Vercel):

* **Frontend (Client)**: Built with **React 19** and **TypeScript**, utilizing **Vite** for fast bundling and **Tailwind CSS v4** for styling. It manages user state, real-time feedback, and interactive dashboards.
* **Backend (Server)**: Powered by **FastAPI** (Python 3.10+), positioned in the `api/` directory for Vercel Serverless Function compatibility. It handles business logic, database transactions, and complex SQL aggregations.
* **Database**: Uses **PostgreSQL**, managed via **SQLModel** (combining SQLAlchemy and Pydantic) for strictly typed interactions.
* **Authentication**: Managed by **Clerk**, providing secure identity management (JWTs).
* **Storage**: **Supabase Storage** is used for hosting optimized event banners directly from the client.

-----

## 🚀 Key Features

### 1. For Students (Volunteers)

* **Discovery Feed**:
  * **Browse & Search**: Filter events by category (e.g., "Education") or Keywords (e.g., "KK12").
  * **Bookmarks (NEW)**: Save events to your personal "Saved" list using the Heart button.
  * **Event Details**: View full mission objectives, tasks, and location maps.
  * **One-Click Join**: Send requests instantly. View status in the **"Applications"** tab.
* **Student Dashboard**:
  * **Digital Profile**: Personalized ID card showing valid volunteer status.
  * **Merit System**: Automatically earn **5 Merit Stars** per completed event.
  * **Badges**: Unlock achievements ("First Step", "Helping Hand", "Super Star") at 1, 3, and 5 missions.
  * **My Schedule**: dedicated view for **Confirmed** vs **Pending** applications.

### 2. For Organizers (Club Admins)

* **Event Management**:
  * **Create & Edit**: Full control over event details, including tasks and volunteer quotas.
  * **Banner Upload**: Drag-and-drop poster uploads powered by **Supabase**.
* **Volunteer Control**:
  * **Command Center**: Approve or Reject applicants with one click.
  * **Quota Safety**: Prevents over-booking (e.g., stops at 20/20 volunteers).
* **Analytics**:
  * **Feedback**: View average star ratings and read student reviews.
  * **History**: Archive events as "Completed" to finalize merit distribution.

### 3. Security & Access

* **Auth**: Secure sign-up/login via **Clerk** (supporting Password Reset).
* **Role Protection**: Strict access control preventing students from accessing Admin features.

-----

## 🛠️ Tech Stack

### Frontend (Client-Side)

* **Framework**: React 19 + Vite 7
* **Language**: TypeScript
* **Styling**: Tailwind CSS v4 (Oxide engine) + Radix UI Primitives
* **State/Network**: React Query + Axios
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

1. **Clerk**: For user authentication (Client ID & Issuer URL).
2. **Supabase**: For the PostgreSQL database and Storage bucket (`event-banners`).

-----

## ⚡ Installation & Setup

### ⚠️ IMPORTANT: Environment Variables

Before starting the services, you **must** set up your environment variables.

1. Copy `.env.example` in the root (Frontend) and `api/.env.example` (Backend).
2. Rename them to `.env`.
3. Fill in the required credentials (Supabase, Clerk, etc.).

---

### 1. Backend Setup

The backend currently resides in the `api/` folder.

```bash
# Create virtual environment
python -m venv venv

# Activate (Windows)
.\venv\Scripts\activate
# Activate (Mac/Linux)
source venv/bin/activate

# Install dependencies from the api folder
pip install -r api/requirements.txt

# Run the Server (pointer to the api module)
uvicorn api.index:app --reload
```

### 2. Frontend Setup

The frontend is in the root directory.

```bash
# Install dependencies
npm install

# Run Dev Server
npm run dev
```

---

-----

## 📂 Project Structure

```
├── api/                # FastAPI Backend
│   ├── index.py        # API Entry Point & Route Definitions
│   ├── models.py       # Database Schemas
│   ├── auth.py         # JWT Verification Logic
│   ├── database.py     # SQLModel Engine Setup
│   └── config.py       # Environment Configuration
│
├── src/                # React Frontend Source
│   ├── pages/Event/    # Feature Views (EventFeed, Dashboards)
│   ├── components/     # Reusable UI (Navbar, Modals)
│   ├── services/       # API Clients
│   ├── hooks/          # Custom Hooks (useAuth)
│   ├── types/          # TypeScript Interfaces
│   ├── routes/         # Router Config
│   └── App.tsx         # Root Component
│
├── scripts/            # Database Migration Scripts
├── public/             # Static Assets
├── package.json        # Frontend Dependencies
└── vite.config.js      # Vite Config
```

-----

## 📡 API Reference

### Events

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/events` | Public | List all events (supports filtering by `organizerId`, `status`). |
| `GET` | `/api/events/{id}` | Public | Get full details of a specific event. |
| `POST` | `/api/events` | Organizer | Create a new event. |
| `PUT` | `/api/events/{id}` | Organizer | Update event details (Title, Date, Description). |
| `PATCH` | `/api/events/{id}` | Organizer | Update event status (e.g., `upcoming` → `completed`). |
| `GET` | `/api/events/{id}/rating` | Public | Get the average star rating for a specific event. |

### Organizers

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/organizers/dashboard` | Organizer | Get events with pre-aggregated stats (Avg Rating & Feedback Count) for the dashboard. |

### Registrations (Volunteers)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/events/{id}/join` | User | Register for an event. |
| `GET` | `/api/events/{id}/registrations` | User | Get list of participants for an event. |
| `PATCH` | `/api/registrations/{id}` | Organizer | Approve/Reject a volunteer (Updates event quotas). |
| `GET` | `/api/users/{id}/registrations` | User | Get a user's entire history and upcoming plans. |

### User Interaction

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/users/{id}/badges` | User | Get gamification badges based on completed missions. |
| `GET` | `/api/users/{id}/bookmarks` | User | Get list of bookmarked event IDs. |
| `POST` | `/api/users/{id}/bookmarks` | User | Toggle bookmark (Save/Unsave) for an event. |
| `GET` | `/api/users/me/bookmarks/events` | User | Get full details of all bookmarked events. |
| `POST` | `/api/feedbacks` | User | Submit an event review. |
| `GET` | `/api/feedbacks` | Public | Get reviews (filterable by user or event). |

-----

## ❓ Troubleshooting

**1. "Missing VITE\_CLERK\_PUBLISHABLE\_KEY" Error**

* Ensure you created the `.env` file in the **root** folder.
* Restart the Vite server (`npm run dev`) after creating the file.

**2. Images not uploading**

* Check your Supabase Bucket policies. You must enable **Public** access for the `event-banners` bucket or set up proper RLS policies to allow authenticated users to upload.

**3. Database Connection Failed**

* Verify your `DATABASE_URL` in `api/.env`.
* If using Supabase transaction pooler (port 6543), ensure you are using the correct password.
* **Important:** Ensure the connection string starts with `postgresql://` (required by SQLAlchemy/FastAPI), not `postgres://`.

**4. "Not Authorized" on Backend**

* Ensure your Clerk Frontend and Backend are using keys from the **same Clerk instance**.
* Check that the `CLERK_ISSUER` in `api/.env` matches the `iss` claim in your JWT.
* **Critical:** In Clerk Dashboard → **JWT Templates**, ensure you have a template named `default` that includes `{{user.unsafe_metadata}}` in the claims. The backend relies on this to read the user's role.

-----

## 📄 License

This project is part of the Project Management group initiative at Universiti Malaya.

**Vercel App Link:** [https://umissionweb.vercel.app/](https://umissionweb.vercel.app/)
