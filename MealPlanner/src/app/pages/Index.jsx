import React from 'react';
import { Box, Container, Typography, Button, Grid, Card, CardContent } from "@mui/material";
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
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Header />
      
      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          py: 12,
          textAlign: "center"
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
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
              color: "#667eea",
              px: 6,
              py: 2,
              fontSize: "1.2rem",
              fontWeight: "bold",
              borderRadius: 3,
              textTransform: "none",
              boxShadow: "0 8px 32px rgba(255,255,255,0.3)",
              border: "2px solid transparent",
              position: "relative",
              overflow: "hidden",
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              '&:before': {
                content: '""',
                position: "absolute",
                top: 0,
                left: "-100%",
                width: "100%",
                height: "100%",
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                transition: "left 0.6s"
              },
              '&:hover': {
                bgcolor: "#667eea",
                color: "white",
                transform: "translateY(-4px) scale(1.05)",
                boxShadow: "0 16px 48px rgba(102,126,234,0.4)",
                '&:before': {
                  left: "100%"
                }
              }
            }}
          >
            🚀 Start Your Journey
          </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box sx={{ py: 12, bgcolor: "grey.50" }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Typography variant="h3" fontWeight="bold" gutterBottom sx={{ color: "text.primary" }}>
              How It Works
            </Typography>
            <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 600, mx: "auto" }}>
              Simple steps to revolutionize your cooking experience
            </Typography>
          </Box>
          
          <Grid container spacing={6} sx={{ mt: 4 }} justifyContent="center">
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} lg={3} key={index}>
                <Box sx={{ pt: 3 }}>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      bgcolor: "primary.main",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      boxShadow: 3,
                      mx: "auto",
                      mb: 3
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Card 
                    elevation={0}
                    sx={{ 
                      height: "100%", 
                      textAlign: "center", 
                      p: 3,
                      borderRadius: 3,
                      border: "1px solid",
                      borderColor: "grey.200",
                      bgcolor: "white",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      '&:hover': {
                        transform: "translateY(-8px)",
                        boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
                        borderColor: "primary.main"
                      }
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Index;
