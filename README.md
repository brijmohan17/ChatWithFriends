# Chat Application

A real‑time chat application built with the **MERN** stack (MongoDB, Express, React, Node.js) and styled with Tailwind CSS. It supports user authentication, group chats, and instant messaging with real‑time updates via Socket.IO. The app is fully responsive and includes notifications and Redux‑powered state management.

---


## Demo

You can try the live demo here:  
[https://chat-application-jack.vercel.app](https://chat-application-jack.vercel.app)

---

## Features

- **User Authentication**  
  Sign up, sign in, and log out with secure password hashing and JSON Web Tokens.

- **Real‑time Messaging**  
  Send and receive messages instantly using Socket.IO.

- **Group Chats**  
  Create, join, and manage group conversations.

- **Notifications**  
  Visual and audio alerts for incoming messages and mentions.

- **State Management**  
  Global state handled with Redux Toolkit for predictable updates.

- **Responsive Design**  
  Mobile-first layout and adaptive UI components with Tailwind CSS.

---

## Tech Stack

- **Frontend**  
  React, React Router, Redux Toolkit, React‑Toastify, Tailwind CSS, Vite

- **Backend**  
  Node.js, Express.js, MongoDB (Mongoose), Socket.IO, bcryptjs, JWT

---

## Getting Started

### Installation

### 1. Clone the Repository

```bash
git clone https://github.com/brijmohan17/ChatWithFriends.git
cd ChatWithFriends
```

### 2. Setup Environment Variables

Create a `.env` file in the `backend/` directory with the following:

```
PORT=9000
MONGODB_URI=mongodb://127.0.0.1:27017/chat-app
JWT_SECRET=your_jwt_secret_here
FRONTEND_URL=http://localhost:5173
```

### 3. Install Dependencies

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

### 4. Run the Application

#### Start Backend

```bash
cd server
npm start
```

#### Start Frontend

```bash
cd client
npm run dev
```

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend: [http://localhost:8080](http://localhost:8080)

## Thank You

Thank you for exploring Chat App! Your feedback is valuable. If you have any suggestions or thoughts, feel free to share them with us. 😊
