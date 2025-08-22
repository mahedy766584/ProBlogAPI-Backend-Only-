# 📖 ProBlog API (Backend Only)

A fully-featured **Blog Management REST API** built with **Node.js, Express, MongoDB with mongoose, and TypeScript**.  
This project is designed with a **modular architecture** and follows professional backend development practices suitable for **production-ready applications**.

✨ Key Highlights:

🏗️ Modular & Layered Architecture – easy to extend and maintain.

🔒 Secure & Scalable – ready for production environments.

⚡ Type-Safe Development – powered by TypeScript.

📚 Professional Project Structure – follows backend best practices.

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

```
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

```

---


## 🚀 Installation & Setup

```bash
# 1. Clone the repository
git clone https://github.com/mahedy766584/ProBlogAPI-Backend-Only-.git

# 2. Navigate into the project
cd ProBlogAPI-Backend-Only-

# 3. Install dependencies
npm install

# 4. Create a .env file and configure the following
PORT=5000
DATABASE_URL=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
REFRESH_SECRET=your_refresh_secret
REFRESH_EXPIRES_IN=30d

# 5. Start the development server
npm run dev

```

---

## 📌 API Endpoints

## 🔑 Authentication APIs
| Endpoint                       | Method   | Description                                          |
| ------------------------------ | -------- | ---------------------------------------------------- |
| `/api/v1/auth/login`           | **POST** | Authenticate user and return access & refresh tokens |
| `/api/v1/auth/change-password` | **POST** | Change the password of the logged-in user            |
| `/api/v1/auth/refresh-token`   | **POST** | Generate a new access token using a refresh token    |
| `/api/v1/auth/forget-password` | **POST** | Send password reset link to user’s email             |
| `/api/v1/auth/reset-password`  | **POST** | Reset password using a valid token                   |

## 📝 Author APIs
| Endpoint                                | Method     | Description                          |
| --------------------------------------- | ---------- | ------------------------------------ |
| `/api/v1/authors/create-author-request` | **POST**   | Submit a request to become an author |
| `/api/v1/authors/`                      | **GET**    | Retrieve all author requests         |
| `/api/v1/authors/:id`                   | **GET**    | Retrieve a specific author request   |
| `/api/v1/authors/:id`                   | **PATCH**  | Update an author request             |
| `/api/v1/authors/:id`                   | **DELETE** | Delete an author request             |

## 📚 Blog APIs
| Endpoint                    | Method     | Description                        |
| --------------------------- | ---------- | ---------------------------------- |
| `/api/v1/blogs/create-blog` | **POST**   | Create a new blog post             |
| `/api/v1/blogs/`            | **GET**    | Retrieve all blog posts            |
| `/api/v1/blogs/:id`         | **GET**    | Retrieve a blog post by ID         |
| `/api/v1/blogs/:id`         | **PATCH**  | Update a blog post (Auth required) |
| `/api/v1/blogs/:id`         | **DELETE** | Delete a blog post                 |

## 🔖 Bookmark APIs
| Endpoint                            | Method     | Description               |
| ----------------------------------- | ---------- | ------------------------- |
| `/api/v1/bookmarks/create-bookmark` | **POST**   | Create a new bookmark     |
| `/api/v1/bookmarks/`                | **GET**    | Retrieve all bookmarks    |
| `/api/v1/bookmarks/:id`             | **GET**    | Retrieve a bookmark by ID |
| `/api/v1/bookmarks/:id`             | **DELETE** | Remove a bookmark         |

## 🏷 Category APIs
| Endpoint                             | Method   | Description               |
| ------------------------------------ | -------- | ------------------------- |
| `/api/v1/categories/create-category` | **POST** | Create a new category     |
| `/api/v1/categories/`                | **GET**  | Retrieve all categories   |
| `/api/v1/categories/:id`             | **GET**  | Retrieve a category by ID |

## 💬 Comment APIs
| Endpoint                          | Method     | Description              |
| --------------------------------- | ---------- | ------------------------ |
| `/api/v1/comments/create-comment` | **POST**   | Add a new comment        |
| `/api/v1/comments/`               | **GET**    | Retrieve all comments    |
| `/api/v1/comments/:id`            | **GET**    | Retrieve a comment by ID |
| `/api/v1/comments/:id`            | **PATCH**  | Update a comment by ID   |
| `/api/v1/comments/:id`            | **DELETE** | Delete a comment by ID   |

## 👍 Like APIs
| Endpoint                    | Method   | Description                        |
| --------------------------- | -------- | ---------------------------------- |
| `/api/v1/likes/create-like` | **POST** | Like and unlike a blog post                   |
| `/api/v1/likes/:blogPostId` | **GET**  | Retrieve all likes for a blog post |

## 🏷 Tag APIs
| Endpoint                  | Method   | Description          |
| ------------------------- | -------- | -------------------- |
| `/api/v1/tags/create-tag` | **POST** | Create a new tag     |
| `/api/v1/tags/`           | **GET**  | Retrieve all tags    |
| `/api/v1/tags/:id`        | **GET**  | Retrieve a tag by ID |

## 👤 User APIs
| Endpoint                    | Method     | Description                                |
| --------------------------- | ---------- | ------------------------------------------ |
| `/api/v1/users/create-user` | **POST**   | Register a new user                        |
| `/api/v1/users/`            | **GET**    | Retrieve all users                         |
| `/api/v1/users/:id`         | **GET**    | Retrieve a user by ID                      |
| `/api/v1/users/:id`         | **PATCH**  | Update a user by ID                        |
| `/api/v1/users/:id`         | **DELETE** | Delete a user by ID                        |
| `/api/v1/users/:id/blog`    | **GET**    | Retrieve all blog posts by a specific user |


---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!  
Feel free to fork the repo and submit a pull request.


## 👨‍💻 Author
- [Mohammad Mehedi Hasan](https://github.com/mahedy766584)
- LinkedIn: [[Mohammad Mehedi Hasan](https://linkedin.com/in/mohammad-mehedi-hasan-364b2432b)]


