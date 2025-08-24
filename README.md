<h3 align="center">EventNest</h3>

<div align="center">
  <div>
    <img src="https://img.shields.io/badge/-Next_JS-black?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="nextjs" />
    <img src="https://img.shields.io/badge/-Firebase-black?style=for-the-badge&logo=firebase&logoColor=white&color=FFCA28" alt="firebase" />
    <img src="https://img.shields.io/badge/-NextAuth-black?style=for-the-badge&logo=auth0&logoColor=white&color=3A0CA3" alt="nextauth" />
    <img src="https://img.shields.io/badge/-TailwindCSS-black?style=for-the-badge&logo=tailwindcss&logoColor=white&color=38BDF8" alt="tailwind" />
    <img src="https://img.shields.io/badge/-ShadCN_UI-black?style=for-the-badge&logo=radixui&logoColor=white&color=7C3AED" alt="shadcn" />
    <img src="https://img.shields.io/badge/-DateFns-black?style=for-the-badge&logo=calendar&logoColor=white&color=0A9396" alt="date-fns" />
    <img src="https://img.shields.io/badge/-Recharts-black?style=for-the-badge&logo=chartdotjs&logoColor=white&color=FF4500" alt="recharts" />
  </div>
</div>

------------------------------------------------------------------------

## 📋 Table of Contents

1.  🧠 [Introduction](#introduction)
2.  ⚙️ [Tech Stack](#tech-stack)
3.  🩺 [Features](#features)
4.  🚀 [Quick Start](#quick-start)

------------------------------------------------------------------------

## 🧠 Introduction

**EventNest** is a modern event management platform built with
**Next.js** and **Firebase**.\
It allows users to create, manage, and explore events with real-time
updates, authentication, and engaging UI/UX.\
The platform supports event categories, location-based filtering, and
provides a smooth experience for both organizers and attendees.

------------------------------------------------------------------------

## ⚙️ Tech Stack

-   **Framework:** Next.js 15 with React 19\
-   **Database & Hosting:** Firebase\
-   **Authentication:** NextAuth.js\
-   **Styling:** TailwindCSS + ShadCN\
-   **UI Components:** Radix UI\
-   **Charts & Analytics:** Recharts\
-   **Date/Time Handling:** date-fns + React Day Picker\
-   **Language:** TypeScript

------------------------------------------------------------------------

## 🩺 Key Features

👉 **Authentication with NextAuth.js** -- Secure login with providers.\
👉 **Event Creation & Management** -- Add events with title,
description, location (Google Places API), date, and time.\
👉 **Interactive Dashboard** -- Real-time event stats with Recharts
visualizations.\
👉 **Location Filtering** -- Search and filter events by city/pincode.\
👉 **Responsive UI** -- Optimized for mobile & desktop using
TailwindCSS.\
👉 **Hover Actions** -- Smooth transitions for edit/delete with Radix
UI + Lucide Icons.\
👉 **Notifications & Toasts** -- User-friendly alerts with Sonner.

------------------------------------------------------------------------

## 🚀 Quick Start

Follow these steps to run EventNest locally:

### 🔧 Prerequisites

-   [Node.js](https://nodejs.org/en)\
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)\
-   [Git](https://git-scm.com/)

### 📁 Clone the Repo

``` bash
git clone https://github.com/Yaswanth1320/EventNest
cd eventnest
```

### 📦 Install Dependencies

``` bash
npm install
```

### 🛠️ Set Environment Variables

Create a `.env.local` file in the root and add the following:

``` env
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000

FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
```

> 💡 Replace with your actual Firebase + NextAuth credentials.

### ▶️ Run the App

``` bash
npm run dev
```

Open <http://localhost:3000> to view the project.

------------------------------------------------------------------------

## 📊 Deployment

This project is optimized for **Vercel Deployment**:

``` bash
npm run build
npm start
```

> Ensure environment variables are properly set in Vercel dashboard.

------------------------------------------------------------------------

## 🤝 Contributing

Contributions are welcome! Please fork the repo and submit a PR.


