# 📖 ProBlog API (Backend Only)

A fully-featured **Blog Management REST API** built with **Node.js, Express, MongoDB with mongoose, and TypeScript**.  
This project is designed with a **modular architecture** and follows professional backend development practices suitable for **production-ready applications**.

---

## 🚀 Features

- 🔐 **Authentication & Authorization** (JWT-based, Refresh Token, Role-based access)
- 📝 **Blog Management** (CRUD operations for blogs)
- ❤️ **Like System** (Users can like/unlike blogs)
- 👥 **Follow System** (Follow/Unfollow authors & view followers/following list)
- 🔖 **Bookmark System** (Save favorite blogs for later reading)
- 👁️ **View Counter** (Tracks blog views)
- 📂 **Modular File Structure** (Controller, Service, Model, Route, Validation separated)
- ✅ **Request Validation** with Zod/Joi
- ⚡ **Query Builder** (Search, Filter, Sort, Pagination)
- 🛡️ **Error Handling & Logging**
- 📌 **Environment Configurations** (dotenv)

---


## 🛠️ Tech Stack

- **Node.js**
- **Express.js**
- **TypeScript**
- **MongoDB + Mongoose**
- **Zod for Validation**
- **JWT for Authentication**
- **ESLint + Prettier**

---




## 📂 Project Structure

`
project-root/
├── src/
│ ├── app/
│ │ ├── error/
│ │ ├── interface/
│ │ ├── middlewares/
│ │ │ ├── auth.ts
│ │ │ ├── globalErrorHandler.ts
│ │ │ ├── notFound.ts
│ │ │ ├── validateRequest.ts
│ │ ├── modules/
│ │ │ ├── authorRequest/
│ │ │ │ ├── authorRequest.controller.ts
│ │ │ │ ├── authorRequest.service.ts
│ │ │ │ ├── authorRequest.model.ts
│ │ │ │ ├── authorRequest.route.ts
│ │ │ ├── blogPost/
│ │ │ │ ├── blogPost.controller.ts
│ │ │ │ ├── blogPost.service.ts
│ │ │ │ ├── blogPost.model.ts
│ │ │ │ ├── blogPost.route.ts
│ │ │ ├── follow/
│ │ │ │ ├── follow.controller.ts
│ │ │ │ ├── follow.service.ts
│ │ │ │ ├── follow.model.ts
│ │ │ │ ├── follow.route.ts
│ │ ├── routes/
│ │ │ ├── index.ts <-- All project routes handled here
│ ├── utils/
│ ├── server.ts
├── package.json
├── tsconfig.json
├── README.md
`


---