import React from 'react';
import { ChefHat, Clock, Users, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import Header from '../components/Header';

const Index = () => {
  const navigate = useNavigate();

  const handleStartJourney = () => {
    navigate('/home');
  };

  const features = [
    {
      icon: <ChefHat size={40} />,
      title: "Smart Recipe Suggestions",
      description: "Get personalized recipes based on your pantry items"
    },
    {
      icon: <Clock size={40} />,
      title: "Meal Planning Made Easy",
      description: "Plan your weekly meals and generate shopping lists automatically"
    },
    {
      icon: <Users size={40} />,
      title: "Reduce Food Waste",
      description: "Track your pantry and use ingredients before they expire"
    },
    {
      icon: <Lightbulb size={40} />,
      title: "AI-Powered Assistant",
      description: "Voice-activated recipe assistant to guide you through cooking"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
    </div>
  );
};

export default Index;
