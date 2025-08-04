# AWMP - Smart Kitchen Meal Planner

A comprehensive AI-powered meal planning and pantry management application that helps reduce food waste and simplify cooking.

## 🍳 Features

### Smart Pantry Management
- **Manual Item Addition**: Add pantry items with expiry dates, quantities, and categories
- **Receipt Scanning**: AI-powered receipt scanning using Gemini AI to automatically extract grocery items
- **Expiry Tracking**: Visual indicators for items expiring soon with color-coded alerts

### AI-Powered Recipe Assistance
- **Voice Recipe Assistant**: Voice-activated cooking companion powered by Gemini AI
- **YouTube Integration**: Find recipe videos based on available ingredients
- **Personalized Suggestions**: Get recipe recommendations based on pantry contents

### Meal Planning
- **Weekly Meal Plans**: Plan and organize meals for the week
- **Smart Shopping Lists**: Generate shopping lists based on meal plans
- **Saved Recipes**: Save and organize favorite recipes

### User Experience
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Smooth Animations**: Enhanced UI with Lottie animations and smooth transitions
- **Intuitive Navigation**: Burger menu with easy access to all features

## 🛠️ Technology Stack

### Frontend
- **React** - Modern JavaScript framework
- **Material-UI** - Component library for consistent design
- **Lottie React** - Smooth animations
- **React Query** - Data fetching and caching
- **React Router** - Navigation

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **Firebase Firestore** - NoSQL database
- **Google Gemini AI** - AI-powered features
- **Multer** - File upload handling

### APIs & Services
- **Google Gemini AI** - Recipe generation and receipt scanning
- **YouTube Data API** - Recipe video search
- **Firebase Authentication** - User management
- **Speech Recognition API** - Voice commands

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Firebase project setup
- Google Gemini API key
- YouTube Data API key

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd AWMP
```

2. **Install Backend Dependencies**
```bash
cd Backend
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ../MealPlanner
npm install
```

4. **Environment Setup**

Backend (.env):
```
GEMINI_API_KEY=your_gemini_api_key
```

Frontend (.env):
```
VITE_APP_GEMINI_API_KEY=your_gemini_api_key
VITE_APP_YOUTUBE_API_KEY=your_youtube_api_key
```

5. **Firebase Configuration**
- Set up Firebase project
- Configure Firestore database
- Add Firebase config to `src/firebase/firebase.js`

### Running the Application

1. **Start Backend Server**
```bash
cd Backend
npm run dev
```

2. **Start Frontend Development Server**
```bash
cd MealPlanner
npm run dev
```

3. **Access the Application**
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## 📱 Usage

1. **Sign Up/Login**: Create an account or login with existing credentials
2. **Add Pantry Items**: Manually add items or scan grocery receipts
3. **Get Recipe Suggestions**: Use voice commands to find recipes based on available ingredients
4. **Plan Meals**: Create weekly meal plans and generate shopping lists
5. **Track Expiry**: Monitor items expiring soon to reduce food waste

## 🎯 Key Benefits

- **Reduce Food Waste**: Track expiry dates and use ingredients efficiently
- **Save Time**: AI-powered recipe suggestions and meal planning
- **Smart Shopping**: Generate optimized shopping lists
- **Voice Assistance**: Hands-free cooking guidance
- **Organized Kitchen**: Keep track of pantry inventory

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

**By Patchamomma**

---

*Transform your kitchen experience with AI-powered meal planning and smart pantry management!*