# 💰 Personal Finance Tracker API

A modern, secure, and scalable RESTful API designed to manage personal income and expenses. This project provides a robust backend architecture focused on performance, security, and maintainability.

---

## 🚀 Features

- 🏗️ **Modular Architecture**
  - Built using the MVC (Model-View-Controller) design pattern for scalability and clean code.

- 📊 **Relational Data Management**
  - Connects Transactions and Categories using MongoDB references with `populate()`.

- 🔒 **Production-Ready Security**
  - Rate Limiting to prevent abuse and DDoS attacks.
  - CORS protection.
  - Field Whitelisting to block unauthorized inputs.

- ⚡ **High Performance**
  - Pagination support for efficient data retrieval.

- 🧪 **Automated Testing**
  - Integration testing with Jest and Supertest.

- 📖 **API Documentation**
  - Interactive Swagger UI documentation.

- 📝 **Centralized Logging**
  - HTTP request logging with Morgan.

---

## 🛠️ Tech Stack

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Security
- cors
- express-rate-limit

### Documentation
- swagger-ui-express
- yamljs

### Testing
- Jest
- Supertest

### Utilities
- Morgan

---

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/finance-tracker-api.git
cd finance-tracker-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
NODE_ENV=development
```

### 4. Start the Development Server

```bash
npm run dev
```

---

## 📖 API Documentation

Once the server is running, open your browser and visit:

```
http://localhost:3000/api-docs
```

Swagger UI allows you to explore and test every API endpoint interactively.

---

## 🧪 Running Tests

Execute the integration test suite with:

```bash
npm run test
```

---

## 📌 API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/transactions` | Retrieve all transactions (supports pagination) |
| POST | `/transactions` | Create a new transaction |
| GET | `/categories` | Retrieve all categories |
| POST | `/categories` | Create a new category |

---

## 📂 Project Structure

```
finance-tracker-api/
│
├── controllers/
├── models/
├── routes/
├── middleware/
├── config/
├── tests/
├── docs/
├── app.js
├── server.js
├── package.json
└── README.md
```

---

## 🔒 Security Features

- Rate Limiting
- CORS Protection
- Field Whitelisting
- Input Validation
- Centralized Error Handling

---

## ⚙️ Built With

- Node.js
- Express.js
- MongoDB
- Mongoose
- Swagger UI
- Jest
- Supertest
- Morgan

---

## 👨‍💻 Author

Developed with backend engineering best practices, focusing on scalability, maintainability, and security.

---
