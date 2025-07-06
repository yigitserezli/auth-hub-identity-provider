# AuthHub 🔐

**AuthHub** is a secure, scalable authentication API designed for modern microservice-based architectures. It supports Access/Refresh token-based authentication, token rotation with Redis, and user activity logging. Built with Node.js, Express.js, PostgreSQL, and Redis.

---

## 🚀 Features

- ✅ JWT Access & Refresh Token architecture
- 🔁 Secure token rotation with Redis
- 📦 PostgreSQL with Prisma ORM
- 🌐 RESTful API with Express.js
- 🔐 Password encryption with bcryptjs
- 🧠 IP + User-Agent logging for login & token events
- ⚠️ Rate limiting & global error handling middleware
- 📅 Time-filtered log retrieval endpoints

---

## 🛠️ Getting Started

git clone https://github.com/yigitserezli/auth-hub-identity-provider.git
cd authhub-api
cp .env.example .env
npm install


## 🧪 API Endpoints

| Method | URL                       | Description                     |
| ------ | ------------------------- | ------------------------------- |
| POST   | `/api/auth/register`      | Register a new user             |
| POST   | `/api/auth/login`         | User login                      |
| POST   | `/api/auth/refresh-token` | Refresh access token            |
| POST   | `/api/auth/logout`        | Logout and revoke refresh token |
| GET    | `/api/logs`               | Get all request logs            |
| GET    | `/api/logs/last100`       | Get last 100 logs               |
| GET    | `/api/logs/today`         | Logs for today                  |
| GET    | `/api/logs/last-7-days`   | Logs for the past 7 days        |
| ...    | `/api/logs/last-1-year`   | Logs for custom time ranges     |



## 📁 Project Structure

src/
├── config/
├── controllers/
├── middlewares/
├── routes/
├── utils/
├── prisma/


📜 License
MIT License © 2025 Yigit Serezli

🤝 Contributing
Pull requests, issues, and suggestions are welcome.
This project is fully open-source and built to be extended.

🌐 Projects Using This
PocketPulse App
(More integrations coming soon...)


---

Let me know if you’d like a ready-to-paste `.env.example`, `Dockerfile`, or GitHub Actions CI setup to include as well. I can also [generate those files](f) or help you [prepare your GitHub repo for deployment](f).

