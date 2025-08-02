import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  useTheme,
  useMediaQuery,
  Avatar,
  Stack,
} from '@mui/material';
import { ChefHat, Menu, Bell, User, BookOpen, Calendar } from 'lucide-react';
import SavedRecipes from './SavedRecipes';
import MealPlansView from './MealPlansView';
import Profile from './MyProfile';  

const Header = () => {
  const [showSavedRecipes, setShowSavedRecipes] = useState(false);
  const [showMealPlan, setShowMealPlan] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const [userData, setUserData] = useState({
    name: 'Ananya Miriyala',
    email: 'ananya@example.com',
    phone: '9876543210',
    avatar: 'https://i.pravatar.cc/300', // Default avatar URL
  });
  

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleProfileSave = (updatedData) => {
    setUserData(updatedData);
    setShowProfile(false);
  };

  return (
    <>
      <AppBar position="sticky" color="default" elevation={1}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box display="flex" alignItems="center" gap={1}>
            <ChefHat size={32} color={theme.palette.success.main} />
            <Typography variant="h6" fontWeight="bold">
              Cooksy
            </Typography>
          </Box>

          {!isMobile ? (
            <Stack direction="row" alignItems="center" spacing={2}>
              <Button
                variant="contained"
                onClick={() => setShowMealPlan(true)}
                startIcon={<Calendar size={18} />}
              >
                My Meal Plans
              </Button>
              <Button
                variant="text"
                onClick={() => setShowSavedRecipes(true)}
                startIcon={<BookOpen size={18} />}
              >
                Saved Recipes
              </Button>
              <Button variant="text" startIcon={<Bell size={18} />}>
                Notifications
              </Button>
              <IconButton onClick={() => setShowProfile(true)}>
                <Avatar alt={userData.name} src={userData.avatar} />
              </IconButton>
            </Stack>
          ) : (
            <IconButton color="inherit">
              <Menu />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <Dialog open={showSavedRecipes} onClose={() => setShowSavedRecipes(false)} maxWidth="lg" fullWidth>
        <DialogTitle>My Saved Recipes</DialogTitle>
        <DialogContent dividers sx={{ maxHeight: '80vh' }}>
          <SavedRecipes />
        </DialogContent>
      </Dialog>

      <Dialog open={showMealPlan} onClose={() => setShowMealPlan(false)} maxWidth="xl" fullWidth>
        <DialogTitle>My Meal Plans</DialogTitle>
        <DialogContent dividers sx={{ maxHeight: '80vh' }}>
          <MealPlansView />
        </DialogContent>
      </Dialog>

      <Profile
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        userData={userData}
        onSave={handleProfileSave}
      />
    </>
  );
};

export default Header;
