# 3W Internship — Mini Social Post App

A full‑stack MERN application built for the 3W Full‑Stack Internship assignment (Task 1).  
Simple social feed where users can sign up, create posts (text + images), like, and comment.

Live Demo
- Frontend (Vercel):(https://social-app-gamma-liard.vercel.app)

## Features
- User authentication (signup / login)
- JWT session management
- Create posts with text and/or images
- Image uploads handled with multer + Cloudinary
- Public feed showing all posts (newest first)
- Like/unlike posts and add comments
- Instant UI updates (React state)
- Responsive Material‑UI (MUI) design
- Uses only 2 MongoDB collections: users and posts

## Tech Stack
- Frontend: React, Vite, Material‑UI, React Router, Axios
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt
- Image storage: Cloudinary (via multer)
- Dev tools: dotenv, CORS

## Prerequisites
- Node.js (16+)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account (for image uploads)

## Repo structure (high level)
- /frontend — React app (Vite)
- /backend — Express API
- README.md — this file

## Local setup

1. Clone
```bash
git clone https://github.com/The-morning-star23/social-app.git
cd YOUR_REPO_NAME
```

2. Backend
```powershell
cd backend
npm install
# create .env file
# recommended: copy .env.example if present
notepad .env
```
Add these to backend/.env:
```
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_jwt_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
PORT=5000
```

3. Frontend
```powershell
cd ../frontend
npm install
notepad .env
```
Add to frontend/.env:
```
VITE_API_URL=http://localhost:5000
```

4. Run locally
Open two terminals.

Backend:
```powershell
cd backend
npm run dev
# server runs at http://localhost:5000 (default)
```

Frontend:
```powershell
cd frontend
npm run dev
# frontend runs at http://localhost:5173 (Vite default)
```

## Deployment
- Frontend: Vercel (build from /frontend)
- Backend: Render (or Heroku) — ensure environment variables are set
- Database: MongoDB Atlas
- Cloudinary: set production cloud credentials

## Notes & Tips
- Use a .env.example to show required env variables without secrets.
- For testing image uploads locally, verify Cloudinary credentials.
- Ensure CORS is configured in backend to allow your frontend origin.

## Contribution
- Create a branch per feature, open a PR, and include descriptive commit messages.

## License
Specify project license here (e.g., MIT).
