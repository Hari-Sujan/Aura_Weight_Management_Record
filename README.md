# AURA — Precision Weight & Wellness Management Platform

Aura is an award-winning, luxury-grade weight and metabolic management platform engineered for elite wellness clinics and high-performance individuals. Built with a bespoke dark-mode aesthetic, immersive 3D backgrounds, smooth animations, and robust data management.

---

## 🌟 Key Features

### 1. Ultra-Luxury Aesthetic & Experience
- **Bespoke Design System**: Deep slate surfaces (`#171717`, `#262626`), rich gold and platinum gradients, glowing borders, and glassmorphic panels.
- **3D Backgrounds & Animations**: Powered by HTML5 Canvas particle/wave networks and Framer Motion for buttery-smooth page transitions and micro-interactions.
- **Responsive & Accessible**: Fully optimized for mobile, tablet, and desktop viewports adhering to high contrast and readability standards.

### 2. Dual-Role Architecture
- **System Administrator**:
  - Full access to Client Management (Add, Edit, Deactivate, Delete clients).
  - Staff & Coach Management (Assign access levels and manage admin accounts).
  - Comprehensive Health Record Entry (Manual BMI calculation, biometric tracking, visceral fat ratings, metabolic age, and clinical notes).
  - Global Search, Analytics, Export, and Import of database backups.
- **Client / Member Role**:
  - Secure personalized dashboard access.
  - View personal health milestones, historical weight tracking, and wellness records without administrative privileges.

### 3. Advanced Biometric Engine
- Track comprehensive wellness metrics including weight (kg/lbs), height, BMI, body fat percentage, visceral fat, muscle mass, and metabolic age.
- Automated health status calculation (Underweight, Optimal, Overweight, Obese) with color-coded badges.

### 4. Robust Local Persistence & Sync
- Built-in JSON database simulation with automatic `localStorage` persistence.
- Full backup and restore capabilities via JSON export and import.

---

## 🛠️ Tech Stack

- **Framework**: React 18 + Vite (TypeScript)
- **Styling**: Tailwind CSS with custom CSS variables and glassmorphism utilities
- **Animations**: Framer Motion & Canvas 3D Effects
- **Icons**: Lucide React
- **Notifications**: Custom Toast alert system

---

## 🚀 Getting Started

The development server is already running in your environment. You can immediately interact with the application.

### Default Administrator Credentials
- **Username**: `admin123`
- **Password**: `7339260108S`

---

## 📂 Project Structure

```text
src/
├── components/          # Modular UI components (Login, Layout, UserManagement, AdminManagement, RecordEntry, SearchRecords, ThreeDBackground)
├── utils/               # Database simulation, localStorage handlers, and helper utilities
├── types/               # TypeScript interfaces for users, admins, and health records
├── App.tsx              # Root application component with state management and routing
└── index.css            # Custom design system, gradients, and luxury animations
```

---

## 📄 License

This project is proprietary and confidential. Designed for Aura Wellness Systems.
