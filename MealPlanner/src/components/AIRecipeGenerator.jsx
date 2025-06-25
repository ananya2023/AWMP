import React, { useState } from 'react';
import {
  Sparkles,
  Clock,
  Users,
  ChefHat,
  Plus,
  Heart,
} from 'lucide-react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Chip,
  Grid,
  TextField,
  IconButton,
  CircularProgress,
} from '@mui/material';
import MealPlanDialog from './MealPlanDialog';



const AIRecipeGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [recipe, setRecipe] = useState(null);
  const [constraints, setConstraints] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const availableIngredients = ['Chicken Breast', 'Broccoli', 'Rice', 'Milk'];

  const generateRecipe = async () => {
    setIsGenerating(true);
    setTimeout(() => {
      const mockRecipe = {
        name: 'Creamy Chicken & Broccoli Rice Bowl',
        cookTime: '25 minutes',
        servings: 4,
        ingredients: {
          have: ['Chicken Breast', 'Broccoli', 'Rice', 'Milk'],
          need: ['Garlic', 'Onion', 'Parmesan Cheese'],
        },
        instructions: [
          'Cook rice according to package instructions',
          'Season and cook chicken breast until golden',
          'Steam broccoli until tender-crisp',
          'Create a creamy sauce with milk and seasonings',
          'Combine all ingredients and serve hot',
        ],
      };
      setRecipe(mockRecipe);
      setIsGenerating(false);
      setIsSaved(false);
    }, 2000);
  };

  const addToMealPlan = () => {
    setIsDialogOpen(true);
  };

  const saveRecipe = () => {
    console.log('Saving recipe:', recipe);
    setIsSaved(true);
  };

  if (recipe) {
    return (
      <>
        <Card>
          <CardHeader
            title={
              <Box display="flex" alignItems="center">
                <Sparkles className="h-5 w-5 mr-2 text-purple-600" />
                <Typography variant="h6">{recipe.name}</Typography>
              </Box>
            }
            subheader={
              <Box mt={1} display="flex" gap={3}>
                <Box display="flex" alignItems="center">
                  <Clock size={14} style={{ marginRight: 6 }} />
                  <Typography variant="caption">{recipe.cookTime}</Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <Users size={14} style={{ marginRight: 6 }} />
                  <Typography variant="caption">
                    {recipe.servings} servings
                  </Typography>
                </Box>
              </Box>
            }
            action={
              <Chip
                label="AI Generated"
                sx={{ backgroundColor: '#f3e8ff', color: '#7e22ce' }}
              />
            }
          />
          <CardContent>
            <Box mb={2}>
              <Typography variant="subtitle2">You already have:</Typography>
              <Box mt={1} display="flex" gap={1} flexWrap="wrap">
                {recipe.ingredients.have.map((item, index) => (
                  <Chip
                    key={index}
                    label={item}
                    sx={{ backgroundColor: '#dcfce7', color: '#15803d' }}
                  />
                ))}
              </Box>
            </Box>

            <Box mb={2}>
              <Typography variant="subtitle2">You'll need to buy:</Typography>
              <Box mt={1} display="flex" gap={1} flexWrap="wrap">
                {recipe.ingredients.need.map((item, index) => (
                  <Chip key={index} label={item} variant="outlined" />
                ))}
              </Box>
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Instructions:
              </Typography>
              <ol style={{ paddingLeft: '1.2rem' }}>
                {recipe.instructions.map((step, index) => (
                  <li key={index}>
                    <Typography variant="body2">{step}</Typography>
                  </li>
                ))}
              </ol>
            </Box>

            <Box display="flex" gap={2} mt={4}>
              <Button
                fullWidth
                variant="contained"
                color="success"
                startIcon={<Plus size={16} />}
                onClick={addToMealPlan}
              >
                Add to Meal Plan
              </Button>
              <Button
                fullWidth
                variant="outlined"
                color={isSaved ? 'error' : 'primary'}
                startIcon={<Heart size={16} />}
                onClick={saveRecipe}
              >
                {isSaved ? 'Saved!' : 'Save Recipe'}
              </Button>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => setRecipe(null)}
              >
                Generate Another
              </Button>
            </Box>
          </CardContent>
        </Card>

        <MealPlanDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          suggestedRecipe={recipe.name}
        />
      </>
    );
  }

  return (
    <Card>
      <CardHeader
        title={
          <Box display="flex" alignItems="center">
            <ChefHat size={20} style={{ marginRight: 8 }} />
            <Typography variant="h6">AI Recipe Generator</Typography>
          </Box>
        }
        subheader="Create recipes with your available ingredients"
      />
      <CardContent>
        <Box mb={2}>
          <Typography variant="subtitle2" gutterBottom>
            Available ingredients:
          </Typography>
          <Box display="flex" gap={1} flexWrap="wrap">
            {availableIngredients.map((item, index) => (
              <Chip
                key={index}
                label={item}
                sx={{ backgroundColor: '#dbeafe', color: '#1e40af' }}
              />
            ))}
          </Box>
        </Box>

        <TextField
          fullWidth
          label="Any preferences or constraints?"
          placeholder="e.g., quick & easy, vegetarian, under 30 minutes"
          value={constraints}
          onChange={(e) => setConstraints(e.target.value)}
          variant="outlined"
          margin="normal"
        />

        <Button
          fullWidth
          variant="contained"
          color="secondary"
          onClick={generateRecipe}
          disabled={isGenerating}
          startIcon={isGenerating ? <CircularProgress size={16} color="inherit" /> : <Sparkles size={16} />}
        >
          {isGenerating ? 'Generating Recipe...' : 'Generate Recipe with AI'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AIRecipeGenerator;
