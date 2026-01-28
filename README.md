SabiGuy Frontend


Frontend interface for SabiGuy, an on-demand platform that connects customers with pre-vetted service providers around them.
This client application enables authentication, provider onboarding, buyer onboarding, media uploads, and job/service interactions with the backend API.

🚀 Features

⚡ Fast UI built with React (Vite)

🎨 Styled with TailwindCSS

🔐 Full Authentication + Google OAuth UI

👤 Buyer and Provider onboarding flow

🧰 Provider business setup & service selection

🖼️ Cloudinary Image/Video Upload UI

📍 Geolocation & address selectors (if included)

🔄 Axios-based API service layer

🧩 Reusable components + modular architecture

📦 Tech Stack
Layer	Technology
Framework	React + Vite
Styling	TailwindCSS
State Management	React Hooks / Redux
HTTP Client	Axios
Deployment	Vercel / Netlify / Any static host
🌍 Environment Setup
1. Clone the repository
git clone https://github.com/sabiguy/sabiguy-frontend.git
cd sabiguy-frontend

2. Install dependencies
npm install

3. Environment variables

Create a .env file in the project root:

VITE_BASE_URL=https://deployed-link/api/v1
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_GOOGLE_CLIENT_ID=your_google_key


Frontend uses the VITE_ prefix for all environment variables.

▶️ Running the Application
Start development server
npm run dev


The frontend should be available at:

http://localhost:5173/

Build for production
npm run build

Preview production build
npm run preview

🧱 Project Structure
sabiguy-frontend/
 ├── src/
 │   ├── components/
 │   ├── pages/
 │   ├── layouts/
 │   ├── services/       # Axios API services
 │   ├── context/        # Auth / User context
 │   ├── hooks/
 │   ├── utils/
 │   ├── assets/
 │   └── main.jsx
 ├── public/
 ├── .env
 ├── package.json
 ├── index.html
 └── README.md

🔗 Connected API Routes

The frontend integrates with:

Auth

Login / Register (Buyer & Provider)

Google OAuth login/signup

Email verification

Password reset flows

Provider

Personal profile update

Business profile setup

Adding job/services

Uploading profile picture

Uploading work visuals

Updating bank information

Users

Fetch user info by ID / email

Get customer or provider dashboard data

🧪 Testing

You can use:

Browser DevTools

React Testing Library (optional)

Postman for backend endpoint tests

🚀 Deployment Guide

You can deploy using:

Vercel
vercel --prod

Netlify
netlify deploy

GitHub Pages

(only works for static builds)

npm run build


Upload the dist/ folder.

📄 License

This project is licensed under the MIT License.