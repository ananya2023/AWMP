import React from 'react';
import { Box, Container, Typography, Button, Grid, Card, CardContent } from "@mui/material";
import { ChefHat, Clock, Users, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Header />
      
      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #4CAF50 0%, #81C784 100%)",
          color: "white",
          py: 12,
          textAlign: "center"
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" fontWeight="bold" gutterBottom>
            Welcome to Your Smart Kitchen
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
            Transform the way you cook, plan meals, and reduce food waste with AI-powered assistance
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={handleStartJourney}
            sx={{
              bgcolor: "white",
              color: "primary.main",
              px: 4,
              py: 1.5,
              fontSize: "1.1rem",
              fontWeight: "bold",
              '&:hover': {
                bgcolor: "grey.100"
              }
            }}
          >
            Start Your Journey
          </Button>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box sx={{ py: 10, bgcolor: "white" }}>
        <Container maxWidth="lg">
          <Typography variant="h3" textAlign="center" fontWeight="bold" gutterBottom>
            How It Works
          </Typography>
          <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
            Simple steps to revolutionize your cooking experience
          </Typography>
          
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={6} lg={3} key={index}>
                <Card 
                  sx={{ 
                    height: "100%", 
                    textAlign: "center", 
                    p: 2,
                    transition: "transform 0.2s",
                    '&:hover': {
                      transform: "translateY(-4px)",
                      boxShadow: 3
                    }
                  }}
                >
                  <CardContent>
                    <Box sx={{ color: "primary.main", mb: 2 }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Index;
