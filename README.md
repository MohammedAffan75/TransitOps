# TransitOps

TransitOps is a next-generation enterprise fleet management and logistics platform. It provides role-based access for Fleet Managers, Dispatchers, Safety Officers, and Financial Analysts to seamlessly coordinate drivers, track maintenance, analyze financials, and optimize vehicle routing.

---

## 🚀 Tech Stack

### Frontend
- **Framework:** React 19 + Vite
- **Styling:** TailwindCSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Charts:** Recharts
- **PDF/CSV Export:** html2pdf.js

### Backend
- **Framework:** Express.js (Node.js)
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT (JSON Web Tokens)
- **Security:** bcryptjs, express-rate-limit, cors, helmet

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [PostgreSQL](https://www.postgresql.org/) (Running locally or hosted)

---

## 📦 Setup & Installation

Follow these steps to get the project up and running locally.

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd TransitOps
```

### 2. Backend Setup
Open a terminal and navigate to the backend directory:
```bash
cd backend
npm install
```

Configure your environment variables by creating a `.env` file in the `backend` directory (you can copy `.env.example` if it exists):
```env
PORT=5000
DATABASE_URL="postgresql://postgres:password@localhost:5432/transitops?schema=public"
JWT_SECRET="your_super_secret_jwt_key_here"
JWT_EXPIRES_IN="7d"
```
*(Make sure to update the `DATABASE_URL` with your actual Postgres credentials).*

Run the database migrations and seed the database with mock data and default users:
```bash
npx prisma db push
npx prisma db seed
```

### 3. Frontend Setup
Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
npm install
```

---

## 🏃‍♂️ Running the Application

You will need two terminal windows open to run both the frontend and backend servers simultaneously.

**Start the Backend:**
```bash
cd backend
npm run dev
```
*(The backend will run on `http://localhost:5000`)*

**Start the Frontend:**
```bash
cd frontend
npm run dev
```
*(The frontend will typically run on `http://localhost:5173` or `5174`)*

---

## 🔐 Default Login Credentials

The database seeder automatically creates four default users so you can test the different role-based dashboards immediately.

| Role | Email | Password |
| :--- | :--- | :--- |
| **Fleet Manager** | `manager@transitops.in` | `password` |
| **Dispatcher** | `dispatcher@transitops.in` | `password` |
| **Safety Officer** | `safety@transitops.in` | `password` |
| **Financial Analyst** | `analyst@transitops.in` | `password` |

---

## 🏗️ Project Structure

```
TransitOps/
├── backend/
│   ├── prisma/           # Database schema and seeders
│   ├── src/
│   │   ├── controllers/  # Route logic
│   │   ├── middlewares/  # Auth & Role validation
│   │   ├── routes/       # API endpoints
│   │   ├── services/     # Business logic & DB queries
│   │   └── app.js        # Express configuration
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable UI elements
│   │   ├── pages/        # Dashboard views
│   │   ├── routes/       # React Router setup
│   │   └── index.css     # Global styles
└── README.md
```

---

## 📄 License

This project is licensed under the MIT License.
