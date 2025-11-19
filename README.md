# Project Management SULAM - Volunteerism App

A modern volunteerism platform built with FastAPI (Python) backend and React + Vite frontend, featuring Clerk authentication.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.10+** - [Download Python](https://www.python.org/downloads/)
- **Node.js 18+** and npm - [Download Node.js](https://nodejs.org/)
- **Git** - [Download Git](https://git-scm.com/)
- **Clerk Account** - [Sign up at Clerk](https://clerk.com/) for authentication

## First-Time Setup

### 1. Clone the Repository

```powershell
git clone https://github.com/Jayden-Yong/Project-Management-SULAM.git
cd Project-Management-SULAM
```

### 2. Backend Setup (FastAPI)

#### Navigate to backend directory
```powershell
cd backend
```

#### Create Python virtual environment
```powershell
python -m venv venv
```

#### Activate virtual environment
```powershell
.\venv\Scripts\Activate.ps1
```

> **Note:** If you get an execution policy error, run:
> ```powershell
> Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
> ```

#### Install Python dependencies
```powershell
pip install -r requirements.txt
```

#### Configure environment variables

Create a `.env` file in the `backend/` directory by copying the example:
```powershell
Copy-Item .env.example .env
```

Or create it manually with these contents:
```env
# App Configuration
APP_NAME=Volunteerism App Backend
ENVIRONMENT=development
DEBUG=True

# Server Configuration
HOST=0.0.0.0
PORT=8000

# CORS Configuration
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

> **Note:** The `.env` file is gitignored for security. Use `.env.example` as a template.

#### Run the backend server
```powershell
python main.py
```

✅ Backend is now running at `http://localhost:8000`
- API documentation: `http://localhost:8000/docs`

---

### 3. Frontend Setup (React + Vite)

Open a **new terminal** and navigate to the project root:

#### Navigate to frontend directory
```powershell
cd frontend
```

#### Install Node dependencies
```powershell
npm install
```

#### Configure Clerk Authentication

1. **Get your Clerk Publishable Key:**
   - Go to [Clerk Dashboard](https://dashboard.clerk.com/)
   - Select your application (or create a new one)
   - Navigate to **API Keys**
   - Copy the **Publishable Key** (starts with `pk_test_` or `pk_live_`)

2. **Create `.env` file** in the `frontend/` directory:
```powershell
# Copy the example file
Copy-Item .env.example .env

# Then edit .env and replace your actual Clerk key
```

Or create `.env` manually with these contents:
```env
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key_here

# Backend API URL
VITE_API_URL=http://localhost:8000

# App Information
VITE_APP_NAME=VolunteerHub
VITE_APP_VERSION=1.0.0
```

> **Important:** Replace `pk_test_your_actual_key_here` with your real Clerk publishable key!

3. **Enable OAuth providers in Clerk (Optional):**
   - In Clerk Dashboard → **SSO Connections**
   - Enable **Google** and/or **Apple** OAuth
   - Configure credentials from respective developer consoles

#### Run the frontend development server
```powershell
npm run dev
```

Frontend is now running at `http://localhost:5173`

---

## Daily Development Workflow

### Starting the Application

**Terminal 1 - Backend:**
```powershell
cd backend
.\venv\Scripts\Activate.ps1
python main.py
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

### Installing New Dependencies

**Backend (Python packages):**
```powershell
# Activate venv first
.\venv\Scripts\Activate.ps1

# Install package
pip install package-name

# Update requirements.txt
pip freeze > requirements.txt
```

**Frontend (npm packages):**
```powershell
cd frontend
npm install package-name
```

---

## Project Structure

```
Project-Management-SULAM/
├── backend/
│   ├── venv/              # Python virtual environment (gitignored)
│   ├── main.py            # FastAPI application entry point
│   ├── config.py          # Configuration management
│   ├── requirements.txt   # Python dependencies
│   ├── .env.example       # Environment variables template
│   └── .env               # Your local environment variables (gitignored)
│
├── frontend/
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable UI components
│   │   ├── routes/        # React Router configuration
│   │   ├── config/        # Frontend configuration
│   │   └── main.tsx       # React application entry point
│   ├── package.json       # Node dependencies
│   ├── vite.config.js     # Vite configuration
│   ├── .env.example       # Environment variables template
│   └── .env               # Your local environment variables (gitignored)
│
└── README.md
```

---

## Environment Variables Reference

### Backend (.env)
| Variable | Description | Default |
|----------|-------------|---------|
| `APP_NAME` | Application name | Volunteerism App Backend |
| `ENVIRONMENT` | Environment mode | development |
| `DEBUG` | Debug mode | True |
| `HOST` | Server host | 0.0.0.0 |
| `PORT` | Server port | 8000 |
| `CORS_ORIGINS` | Allowed CORS origins | http://localhost:5173,http://localhost:3000 |

### Frontend (.env)
| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk authentication key | Yes |
| `VITE_API_URL` | Backend API URL | Yes |
| `VITE_APP_NAME` | Application name | No |
| `VITE_APP_VERSION` | Application version | No |

---

## Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **Uvicorn** - ASGI server
- **Pydantic** - Data validation
- **Python-dotenv** - Environment variable management

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Clerk** - Authentication
- **React Router** - Client-side routing
- **Radix UI** - Accessible UI components
- **Lucide Icons** - Icon library

---

## Testing the Setup

1. **Backend health check:**
   ```powershell
   curl http://localhost:8000/health
   ```
   Expected response:
   ```json
   {
     "status": "healthy",
     "app": "Volunteerism App Backend",
     "version": "1.0.0"
   }
   ```

2. **Frontend:** 
   - Visit `http://localhost:5173`
   - You should see the landing page
   - Try logging in with Clerk authentication

---

## Troubleshooting

### Backend Issues

**"Python not recognized"**
- Ensure Python is installed and added to PATH
- Try `python3` instead of `python`

**Port 8000 already in use**
- Change `PORT` in `backend/.env`
- Or kill the process using port 8000

**Module not found errors**
- Ensure virtual environment is activated
- Reinstall dependencies: `pip install -r requirements.txt`

### Frontend Issues

**"Cannot find module" errors**
- Delete `node_modules/` and `package-lock.json`
- Run `npm install` again

**Clerk authentication not working**
- Verify `VITE_CLERK_PUBLISHABLE_KEY` is set correctly
- Check Clerk Dashboard for valid API key
- Ensure key starts with `pk_test_` or `pk_live_`

**Port 5173 already in use**
- Vite will automatically try the next available port
- Or specify a custom port: `npm run dev -- --port 3000`

---

## Team Collaboration

After pulling latest changes from the repository:

**Backend updates:**
```powershell
cd backend
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

**Frontend updates:**
```powershell
cd frontend
npm install
```

---

## Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vite.dev/)
- [Clerk Documentation](https://clerk.com/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs)

---

## License

This project is part of the SULAM group project initiative.

---

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

For questions or issues, contact the project team.
