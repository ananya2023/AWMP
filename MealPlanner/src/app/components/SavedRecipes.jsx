import React, { useState } from 'react';
import {
  BookOpen,
  Clock,
  Users,
  Plus,
  Heart,
} from 'lucide-react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  IconButton,
  Chip,
  Divider,
} from '@mui/material';
import MealPlanDialog from './MealPlanDialog';

const SavedRecipes = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState('');

  const savedRecipes = [
    {
      id: '1',
      name: 'Creamy Chicken & Broccoli Rice Bowl',
      cookTime: '25 min',
      servings: 4,
      ingredients: ['Chicken Breast', 'Broccoli', 'Rice', 'Milk'],
      category: 'Main Course',
      dateAdded: '2024-01-15',
      isAIGenerated: true,
    },
    {
      id: '2',
      name: 'Veggie Stir Fry',
      cookTime: '15 min',
      servings: 2,
      ingredients: ['Mixed Vegetables', 'Soy Sauce', 'Garlic'],
      category: 'Quick Meals',
      dateAdded: '2024-01-14',
      isAIGenerated: false,
    },
    {
      id: '3',
      name: 'Banana Bread',
      cookTime: '60 min',
      servings: 8,
      ingredients: ['Bananas', 'Flour', 'Sugar', 'Eggs'],
      category: 'Dessert',
      dateAdded: '2024-01-13',
      isAIGenerated: true,
    },
  ];

  const handleAddToMealPlan = (recipeName) => {
    setSelectedRecipe(recipeName);
    setIsDialogOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader
          title={
            <Box display="flex" alignItems="center">
              <BookOpen size={20} style={{ marginRight: 8 }} />
              <Typography variant="h6">My Saved Recipes</Typography>
            </Box>
          }
          subheader={
            <Typography variant="body2" color="text.secondary">
              Your collection of favorite recipes
            </Typography>
          }
        />
        <CardContent>
          <Box display="flex" flexDirection="column" gap={3}>
            {savedRecipes.map((recipe) => (
              <Box
                key={recipe.id}
                sx={{
                  border: '1px solid',
                  borderColor: 'grey.300',
                  borderRadius: 2,
                  p: 2,
                  '&:hover': {
                    boxShadow: 2,
                  },
                }}
              >
                <Box display="flex" justifyContent="space-between" mb={1.5}>
                  <Box flex={1}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography fontWeight={500} variant="subtitle1">
                        {recipe.name}
                      </Typography>
                      {recipe.isAIGenerated && (
                        <Chip label="AI Generated" size="small" color="secondary" />
                      )}
                    </Box>
                    <Typography variant="body2" color="text.secondary" mt={0.5}>
                      Uses: {recipe.ingredients.join(', ')}
                    </Typography>

                    <Box display="flex" gap={2} mt={1} color="text.secondary" fontSize="0.8rem">
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <Clock size={14} />
                        {recipe.cookTime}
                      </Box>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <Users size={14} />
                        {recipe.servings} servings
                      </Box>
                      <Chip label={recipe.category} size="small" variant="outlined" />
                    </Box>
                  </Box>

                  <IconButton size="small" sx={{ color: 'error.main' }}>
                    <Heart size={16} />
                  </IconButton>
                </Box>

                <Divider sx={{ my: 1.5 }} />

                <Box display="flex" gap={2}>
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={() => handleAddToMealPlan(recipe.name)}
                    startIcon={<Plus size={16} />}
                  >
                    Add to Meal Plan
                  </Button>
                  <Button variant="outlined" size="small">
                    View Recipe
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>

          <Box mt={4} textAlign="center">
            <Button variant="outlined" fullWidth>
              View All Recipes ({savedRecipes.length})
            </Button>
          </Box>
        </CardContent>
      </Card>

      <MealPlanDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        suggestedRecipe={selectedRecipe}
      />
    </>
  );
};

export default SavedRecipes;
