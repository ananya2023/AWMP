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
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
} from '@mui/material';
import { ChefHat, Menu, Bell, User, BookOpen, Calendar, Utensils, ShoppingCart } from 'lucide-react';
import SavedRecipes from './SavedRecipes';
import MealPlansView from './MealPlansView';
import Profile from './MyProfile';
import Pantry from './Pantry';
import VoiceRecipeAssistant from './VoiceRecipeAssistant';  

const Header = () => {
  const [showSavedRecipes, setShowSavedRecipes] = useState(false);
  const [showMealPlan, setShowMealPlan] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showPantry, setShowPantry] = useState(false);
  const [showRecipeSuggestions, setShowRecipeSuggestions] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [userData, setUserData] = useState({
    name: 'Ananya Miriyala',
    email: 'ananya@example.com',
    phone: '9876543210',
    avatar: 'https://i.pravatar.cc/300',
  });
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleProfileSave = (updatedData) => {
    setUserData(updatedData);
    setShowProfile(false);
  };

  const menuItems = [
    { text: 'Saved Recipes', icon: <BookOpen size={20} />, action: () => setShowSavedRecipes(true) },
    { text: 'My Meal Plans', icon: <Calendar size={20} />, action: () => setShowMealPlan(true) },
    { text: 'Recipe Suggestions', icon: <Utensils size={20} />, action: () => setShowRecipeSuggestions(true) },
    { text: 'Pantry', icon: <ShoppingCart size={20} />, action: () => setShowPantry(true) },
  ];

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleMenuItemClick = (action) => {
    action();
    setDrawerOpen(false);
  };

  return (
    <>
      <AppBar position="sticky" color="default" elevation={1}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box display="flex" alignItems="center" gap={1}>
            <IconButton onClick={handleDrawerToggle} color="inherit">
              <Menu />
            </IconButton>
            <ChefHat size={32} color={theme.palette.success.main} />
            <Typography variant="h6" fontWeight="bold">
              Cooksy
            </Typography>
          </Box>

          <Stack direction="row" alignItems="center" spacing={1}>
            <IconButton color="inherit">
              <Badge badgeContent={3} color="error">
                <Bell size={20} />
              </Badge>
            </IconButton>
            <IconButton onClick={() => setShowProfile(true)}>
              <Avatar alt={userData.name} src={userData.avatar} sx={{ width: 32, height: 32 }} />
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            boxSizing: 'border-box',
            transition: 'transform 0.3s ease-in-out',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <ChefHat size={24} color={theme.palette.success.main} />
            <Typography variant="h6" fontWeight="bold">
              Cooksy
            </Typography>
          </Box>
          <Divider />
        </Box>
        <List>
          {menuItems.map((item, index) => (
            <ListItem 
              button 
              key={index} 
              onClick={() => handleMenuItemClick(item.action)}
              sx={{ 
                '&:hover': { 
                  bgcolor: 'action.hover',
                  transform: 'translateX(8px)',
                  transition: 'all 0.2s ease'
                },
                transition: 'all 0.2s ease'
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Dialog 
        open={showSavedRecipes} 
        onClose={() => setShowSavedRecipes(false)} 
        maxWidth="lg" 
        fullWidth
        TransitionProps={{
          style: { transition: 'all 0.3s ease-in-out' }
        }}
      >
        <DialogTitle>My Saved Recipes</DialogTitle>
        <DialogContent dividers sx={{ maxHeight: '80vh' }}>
          <SavedRecipes />
        </DialogContent>
      </Dialog>

      <Dialog 
        open={showMealPlan} 
        onClose={() => setShowMealPlan(false)} 
        maxWidth="xl" 
        fullWidth
        TransitionProps={{
          style: { transition: 'all 0.3s ease-in-out' }
        }}
      >
        <DialogTitle>My Meal Plans</DialogTitle>
        <DialogContent dividers sx={{ maxHeight: '80vh' }}>
          <MealPlansView />
        </DialogContent>
      </Dialog>

      <Dialog 
        open={showPantry} 
        onClose={() => setShowPantry(false)} 
        maxWidth="lg" 
        fullWidth
        TransitionProps={{
          style: { transition: 'all 0.3s ease-in-out' }
        }}
      >
        <DialogTitle>Pantry Management</DialogTitle>
        <DialogContent dividers sx={{ maxHeight: '80vh' }}>
          <Pantry />
        </DialogContent>
      </Dialog>

      <Dialog 
        open={showRecipeSuggestions} 
        onClose={() => setShowRecipeSuggestions(false)} 
        maxWidth="md" 
        fullWidth
        TransitionProps={{
          style: { transition: 'all 0.3s ease-in-out' }
        }}
      >
        <DialogTitle>Recipe Suggestions</DialogTitle>
        <DialogContent dividers sx={{ maxHeight: '80vh' }}>
          <VoiceRecipeAssistant />
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
