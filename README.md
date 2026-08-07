# FoodUnity -  Surplus Food Rescue and Donation Platform

FoodUnity is a two-sided web-based surplus food marketplace and aggregator platform specifically designed to bridge the gap between food businesses (supply) and the local community (demand). Powered by a cloud-native ecosystem, the platform enables local food merchants such as restaurants, bakeries, caterers, and street food vendors to effortlessly list and upload surplus meals, excess stock, or items nearing their expiration date in real time. Every meal saved through the platform directly contributes to a healthier planet. 

This document provides a technical deep dive into the technologies, libraries, and architecture used to build the project.

## 🧰 Technical Deep Dive (Tech Stack)

> Built with the tools and technologies:

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Midtrans](https://img.shields.io/badge/Midtrans-003D7A?style=for-the-badge)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=Cloudinary&logoColor=white)
![Google Cloud](https://img.shields.io/badge/Google_Cloud-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white)
![Railway](https://img.shields.io/badge/Railway-131415?style=for-the-badge&logo=railway&logoColor=white)

The project leverages a robust set of tools and technologies to ensure high performance, maintainability, and seamless user experience:

- **Frontend Core**: React.js + Vite for a blazing fast development experience and optimized production build.
- **Language**: TypeScript adds static typing, reducing bugs and improving developer experience.
- **Styling & UI Components**: Tailwind CSS combined with shadcn/ui provides a utility-first approach and accessible, beautiful pre-built components.
- **Animations**: Framer Motion is used for crafting fluid and complex animations.
- **Backend-as-a-Service**: Firebase is used for Authentication, Cloud Firestore, Realtime Database, and Hosting.
- **Custom Backend**: Node.js & Express.js are utilized for custom API endpoints (e.g., handling Midtrans webhooks).
- **Payment Gateway**: Midtrans is integrated for secure and reliable payment processing.
- **Media Management**: Cloudinary is used for optimized image and media delivery.
- **Deployment & Cloud**: Google Cloud Platform (GCP) is utilized specifically for the Google Maps API. Railway is used to deploy the Express.js backend.

## 🏗️ Architecture Overview (Hybrid)

FoodUnity implements a **Hybrid Architecture** combining a **Serverless-first** approach with a dedicated **Auxiliary Microservice**:

1. **Serverless / Backend-as-a-Service (Majority)**
   The primary backbone of this application utilizes managed services from **Firebase** (Authentication, Cloud Firestore, Realtime Database, and Hosting). The frontend application reacts directly to data without routing all traffic through an intermediary server, making the system highly scalable, cost-efficient, and low-maintenance.

2. **Auxiliary Microservice (Minority)**
   This application is **not a Monolith**, but is instead supported by a separate **Express.js** server deployed on Railway. This server acts as a dedicated microservice to handle specific tasks that cannot be securely performed on the client-side, such as securely receiving payment webhooks from **Midtrans** or securing external API keys.

This hybrid pattern ensures a high level of security and automatic scalability for users, while keeping third-party specific operations neatly isolated.

## 📚 Libraries & Dependencies (`package.json`)

Here is a detailed breakdown of the key libraries used in this project and their specific purposes:

### Core & State Management
- **`react` & `react-dom`**: The foundational library for building the user interface.
- **`zustand`**: A small, fast, and scalable state-management solution for global app state.
- **`@tanstack/react-query`**: Powerful data synchronization, caching, and state management for asynchronous operations (API calls).
- **`react-router-dom`**: Enables declarative routing and navigation across the application.

### UI & Styling
- **`tailwindcss` & `@tailwindcss/vite`**: Utility-first CSS framework for rapid UI development.
- **`radix-ui` (various primitives)**: Unstyled, accessible UI components that serve as the foundation for shadcn/ui.
- **`framer-motion`**: A production-ready motion library for React, used for micro-interactions and page transitions.
- **`lucide-react`**: A beautiful and consistent icon toolkit.
- **`sonner`**: An opinionated toast component used for elegant, non-intrusive user notifications.
- **`clsx` & `tailwind-merge`**: Utilities for constructing `className` strings conditionally without Tailwind class conflicts.
- **`next-themes`**: An abstraction for theme management (Dark/Light mode).

### Forms & Validation
- **`react-hook-form`**: Performant, flexible, and extensible forms with easy-to-use validation.
- **`zod` & `@hookform/resolvers`**: TypeScript-first schema declaration and validation, seamlessly integrated with React Hook Form.

### Specialized Features
- **`firebase`**: The official Firebase SDK for interacting with Auth, Firestore, and Storage from the client side.
- **`axios`**: A promise-based HTTP client for making custom backend API requests.
- **`@react-google-maps/api`**: Integration with Google Maps services, likely used for location selection or mapping features.
- **`react-qr-code`**: Used for generating QR codes (e.g., for voucher redemption or merchant identification).
- **`@yudiel/react-qr-scanner`**: A robust QR code scanner component for reading user or merchant QR codes.

## 📂 Project Structure

Below is the high-level tree structure of the FoodUnity repository:

```text
foodunity/
├── backend/                   # Custom Node.js & Express.js server
│   ├── config/                # Backend configuration files
│   ├── modules/               # Modular backend features/routes
│   ├── security/              # Security and middleware configurations
│   ├── server.js              # Main Express application entry point
│   ├── package.json           # Backend dependencies
│   └── serviceAccountKey.json # Firebase Admin SDK credentials
├── src/                       # React Frontend source code
│   ├── assets/                # Static assets (images, icons)
│   ├── components/            # Reusable UI components (shadcn/ui, etc.)
│   ├── config/                # Frontend configuration (Firebase config, etc.)
│   ├── features/              # Feature-based modular code
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility functions and library wrappers
│   ├── pages/                 # Route components/pages
│   ├── routes/                # Application routing configuration
│   ├── services/              # API and Firebase interaction logic
│   ├── App.tsx                # Root React component
│   ├── main.tsx               # React application entry point
│   └── index.css              # Global styles and Tailwind directives
├── docs/                      # Documentation files
├── public/                    # Public static files
├── package.json               # Frontend dependencies & scripts
├── vite.config.ts             # Vite bundler configuration
├── eslint.config.js           # ESLint linting rules
├── firebase.json              # Firebase project configuration
├── firestore.rules            # Firebase Firestore security rules
└── README.md                  # This file
```
