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
} from '@mui/material';
import { ChefHat, Menu, Bell, User, BookOpen, Calendar } from 'lucide-react';
import SavedRecipes from './SavedRecipes';
import MealPlansView from './MealPlansView';

const Header = () => {
  const [showSavedRecipes, setShowSavedRecipes] = useState(false);
  const [showMealPlan, setShowMealPlan] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box display="flex" alignItems="center" gap={1}>
            <ChefHat size={32} color={theme.palette.success.main} />
            <Typography variant="h6" fontWeight="bold">
              FreshPlanner
            </Typography>
          </Box>

          {!isMobile ? (
            <Box display="flex" alignItems="center" gap={2}>
              <Button
                variant="text"
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
              <Button variant="text" startIcon={<User size={18} />}>
                Profile
              </Button>
            </Box>
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
    </>
  );
};

export default Header;
