# 💰 Personal Finance Tracker

A modern full-stack web application designed to help users manage their personal finances efficiently. The application enables users to track income and expenses, visualize financial data by category, export reports as CSV files, and gain insights into their spending habits through interactive charts.

Built with a scalable architecture using **React**, **Node.js**, **Express**, and **MongoDB**, the project focuses on performance, maintainability, and a seamless user experience.

---

## 🚀 Features

* 💵 Track income and expense transactions.
* 📂 Organize transactions using custom categories.
* 📊 Visualize financial data with interactive charts.
* 🔎 Filter and search transactions by category, type, or date.
* 📈 Display financial summaries and spending analytics.
* 📤 Export transaction history as CSV files.
* ⚠️ Receive budget alerts and monitor spending limits.
* 📱 Responsive user interface optimized for desktop and mobile devices.
* ⚡ Real-time updates across the application.
* 🛡️ Robust backend architecture with centralized error handling.

---

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* Axios
* React Router
* Chart.js

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

### Development Tools

* Nodemon
* dotenv
* ESLint

---

## 🏗️ Architecture

The project follows a modular architecture inspired by the MVC (Model–View–Controller) pattern.

### Frontend Layer

The frontend is responsible for:

* Rendering the user interface.
* Managing application state.
* Sending API requests to the backend.
* Displaying charts and analytics.
* Exporting transaction data.

### Backend Layer

The backend handles:

* Business logic and validation.
* Processing incoming requests.
* Managing transactions and categories.
* Generating financial summaries.
* Handling CSV exports and error responses.

### Database Layer

MongoDB is used as the primary database, while Mongoose provides schema definitions and data modeling.

### Data Flow

```text
User Action
     ↓
React Components
     ↓
Axios Requests
     ↓
Express Routes
     ↓
Controllers
     ↓
MongoDB Database
     ↓
API Response
     ↓
UI Update
```

---

## 📖 API Endpoints

### Transactions

| Method | Endpoint            | Description                    |
| ------ | ------------------- | ------------------------------ |
| GET    | `/transactions`     | Retrieve all transactions      |
| GET    | `/transactions/:id` | Retrieve a transaction by ID   |
| POST   | `/transactions`     | Create a new transaction       |
| PUT    | `/transactions/:id` | Update an existing transaction |
| DELETE | `/transactions/:id` | Delete a transaction           |

### Analytics

| Method | Endpoint                   | Description                |
| ------ | -------------------------- | -------------------------- |
| GET    | `/transactions/summary`    | Get financial summary      |
| GET    | `/transactions/categories` | Get category statistics    |
| GET    | `/transactions/export`     | Export transactions as CSV |

### Categories

| Method | Endpoint          | Description             |
| ------ | ----------------- | ----------------------- |
| GET    | `/categories`     | Retrieve all categories |
| POST   | `/categories`     | Create a category       |
| PUT    | `/categories/:id` | Update a category       |
| DELETE | `/categories/:id` | Delete a category       |

---

## 📸 Screenshots

### Dashboard

<img width="1902" height="884" alt="image" src="https://github.com/user-attachments/assets/d3846470-a096-4bb6-b3d1-1446ef740215" />





### Transactions Page


<img width="1082" height="845" alt="image" src="https://github.com/user-attachments/assets/9fecdd4e-347b-466f-bd8b-38e70633447f" />






### Analytics & Charts

<img width="1036" height="517" alt="image" src="https://github.com/user-attachments/assets/8f64e848-7d6b-4ca4-876b-e5e8cd5896e1" />




### CSV Export


<img width="988" height="86" alt="image" src="https://github.com/user-attachments/assets/7efd8391-b123-4c65-8cbe-42aab398696b" />








## ⚙️ Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/brknsgn/personal-finance-tracker.git

cd personal-finance-tracker
```

### 2. Install dependencies

#### Backend

```bash
cd backend

npm install
```

#### Frontend

```bash
cd frontend

npm install
```

---

### 3. Configure environment variables

Create a `.env` file inside the backend folder:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

NODE_ENV=development
```

---

### 4. Run the development servers

#### Start the backend

```bash
cd backend

npm run dev
```

#### Start the frontend

```bash
cd frontend

npm run dev
```

The frontend application will typically run on:

```text
http://localhost:5173
```

The backend API will typically run on:

```text
http://localhost:5000
```

---

## 🚀 Deployment

### Frontend Deployment (Vercel)

The React frontend can be deployed easily using Vercel:

1. Connect your GitHub repository to Vercel.
2. Select the frontend directory.
3. Configure environment variables.
4. Deploy automatically on every push.

### Backend Deployment (Render)

The Express API can be deployed using Render:

1. Create a new Web Service.
2. Connect your GitHub repository.
3. Set the build and start commands.
4. Add the required environment variables.
5. Deploy the application.

### Database Hosting

MongoDB Atlas is recommended for hosting the production database.

---

## 🔮 Future Improvements

* 🔐 User authentication and authorization.
* 👤 Personalized user dashboard.
* 🌙 Dark mode support.
* 📅 Recurring transactions.
* 💰 Monthly budget planning.
* 🔔 Notifications and spending alerts.
* 📊 Advanced analytics and reporting.
* 📱 Progressive Web App (PWA) support.
* 🐳 Docker containerization.
* ⚙️ CI/CD pipeline integration.

---

## 👨‍💻 Author

**Barkın Sağın**

GitHub: https://github.com/brknsgn

---

## 📄 License

This project is licensed under the MIT License.
