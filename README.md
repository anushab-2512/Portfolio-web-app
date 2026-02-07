# Portgolio Web Application
A responsive portfolio web application with user registration and login functionality. After successful authentication, users can view their profile with About Me, Skills, and Projects sections. The app includes database integration, secure authentication flow, logout support, and live deployment.

Built with **FastAPI**, **MongoDB**, and vanilla **HTML/CSS/JavaScript**.

## 🚀 Features

### Authentication
- **Register & Login** on a single landing page with smooth transitions
- **Email validation** with regex pattern matching
- **Strong password validation** with clear error messages:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one digit
  - At least one special character
- **Password visibility toggle** (eye icon) for all password fields
- **Auto-fill credentials** after successful registration
- **bcrypt password hashing** (never stores plain passwords)

### Portfolio Page
- Displays user profile with name, email, and location
- About Me section
- Skills showcase with styled chips
- Projects section with detailed descriptions
- Contact Information card

### UI/UX Features
- 🌙/☀️ **Light/Dark theme toggle** (persists in localStorage)
- Fully **responsive design** for all screen sizes
- Clean, modern aesthetic with smooth animations
- Centered layouts with proper typography

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| **FastAPI** | Modern Python web framework for building APIs |
| **MongoDB** | NoSQL database for storing user data |
| **Motor** | Async MongoDB driver for Python |
| **bcrypt** | Secure password hashing |
| **Pydantic** | Data validation and serialization |
| **Uvicorn** | ASGI server for running the application |
| **python-dotenv** | Environment variable management |

### Frontend
| Technology | Purpose |
|------------|---------|
| **HTML5** | Semantic markup structure |
| **CSS3** | Styling with CSS variables for theming |
| **Vanilla JavaScript** | DOM manipulation and API calls |
| **SVG Icons** | Scalable vector icons for UI elements |

## 📁 Folder Structure
```
twenty20/
├── backend/
│   ├── app/
│   │   ├── main.py           # FastAPI app entry point
│   │   ├── db.py             # MongoDB connection
│   │   ├── routes/
│   │   │   └── auth.py       # Authentication endpoints
│   │   └── utils/
│   │       ├── security.py   # Password hashing utilities
│   │       └── validators.py # Input validation
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── index.html            # Login/Register page
│   ├── portfolio.html        # Portfolio display page
│   ├── styles.css            # All styles with theme support
│   ├── app.js                # Auth page logic
│   ├── portfolio.js          # Portfolio page logic
│   └── theme.js              # Theme toggle functionality
├── docker-compose.yml
└── README.md
```

## 🏃 How to Run

### Prerequisites
- Python 3.10+
- MongoDB (Docker)
- Git

### Step 1: Clone and Setup
```bash
cd c:\Users\anush\OneDrive\Documents\Projects\twenty20
```

### Step 2: Start MongoDB (using Docker)
```bash
docker compose up -d
```

### Step 3: Create Environment File
```bash
# Copy the example env file
copy backend\.env.example backend\.env
```

### Step 4: Install Dependencies
```powershell
# Create virtual environment
python -m venv .venv

# Activate (Windows PowerShell)
.\.venv\Scripts\Activate.ps1

# Install packages
pip install -r backend/requirements.txt
```

### Step 5: Run the Application
```bash
python -m backend.app.main
```

### Step 6: Open in Browser
Navigate to: **http://127.0.0.1:8000**

## 📝 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Landing page (Login/Register) |
| `GET` | `/portfolio` | Portfolio page |
| `POST` | `/api/register` | Register new user |
| `POST` | `/api/login` | Login existing user |
| `GET` | `/health` | Health check endpoint |

## 🎨 Theme Support

The app supports **Light** and **Dark** themes:
- **Login/Register page**: Theme toggle at top-right corner
- **Portfolio page**: Theme toggle in user dropdown menu
- **Theme preference is saved in localStorage**

## 👤 Author

**Anusha B**
- 📧 Email: anushab0012@gmail.com
- 📍 Location: Bangalore, India
- 💻 GitHub: https://github.com/anushab-2512
- 🔗 LinkedIn: https://www.linkedin.com/in/anusha-b-b07b9b2a8/
