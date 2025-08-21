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

project-root/
│── src/
│   ├── app/
│   │   ├── error/
│   │   ├── interface/
│   │   ├── middlewares/
│   │   │   │   ├── auth.ts
│   │   │   │   ├── globalErrorHandler.ts
│   │   │   │   ├── notFound.ts
│   │   │   │   ├── validateRequest.ts
│   │   ├── modules/
│   │   │   ├── authorRequest/
│   │   │   │   ├── authorRequest.controller.ts
│   │   │   │   ├── authorRequest.service.ts
│   │   │   │   ├── authorRequest.model.ts
│   │   │   │   ├── authorRequest.route.ts
│   │   │   ├── blogPost/
│   │   │   │   ├── blogPost.controller.ts
│   │   │   │   ├── blogPost.service.ts
│   │   │   │   ├── blogPost.model.ts
│   │   │   │   ├── blogPost.route.ts
│   │   │   ├── bookmark/
│   │   │   │   ├── bookmark.controller.ts
│   │   │   │   ├── bookmark.service.ts
│   │   │   │   ├── bookmark.model.ts
│   │   │   │   ├── bookmark.route.ts
│   │   │   ├── category/
│   │   │   │   ├── category.controller.ts
│   │   │   │   ├── category.service.ts
│   │   │   │   ├── category.model.ts
│   │   │   │   ├── category.route.ts
│   │   │   ├── comment/
│   │   │   │   ├── comment.controller.ts
│   │   │   │   ├── comment.service.ts
│   │   │   │   ├── comment.model.ts
│   │   │   │   ├── comment.route.ts
│   │   │   ├── follow/
│   │   │   │   ├── follow.controller.ts
│   │   │   │   ├── follow.service.ts
│   │   │   │   ├── follow.model.ts
│   │   │   │   ├── follow.route.ts
│   │   │   ├── like/
│   │   │   │   ├── like.controller.ts
│   │   │   │   ├── like.service.ts
│   │   │   │   ├── like.model.ts
│   │   │   │   ├── like.route.ts
│   │   │   ├── tag/
│   │   │   │   ├── tag.controller.ts
│   │   │   │   ├── tag.service.ts
│   │   │   │   ├── tag.model.ts
│   │   │   │   ├── tag.route.ts
│   │   │   ├── user/
│   │   │   │   ├── user.controller.ts
│   │   │   │   ├── user.service.ts
│   │   │   │   ├── user.model.ts
│   │   │   │   ├── user.route.ts
│   │   │   ├── view/
│   │   │   │   ├── view.controller.ts
│   │   │   │   ├── view.service.ts
│   │   │   │   ├── view.model.ts
│   │   │   │   ├── view.route.ts
│   │   ├── routes/   
│   │   │   ├── index.ts <--- in this file handle all route of project
│   ├── utils/
│   ├── server.ts
│── package.json
│── tsconfig.json
│── README.md
