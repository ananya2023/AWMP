import React, { useEffect, useState } from 'react';
import {
  Calendar,
  Clock,
  Users,
  Plus,
} from 'lucide-react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  TextField,
  Grid,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  Box,
  Typography,
} from '@mui/material';

const MealPlanDialog = ({
  isOpen,
  onClose,
  selectedDay = 'Mon',
  mealType = 'dinner',
  suggestedRecipe = '',
}) => {
  const [recipeName, setRecipeName] = useState(suggestedRecipe);
  const [cookTime, setCookTime] = useState('');
  const [servings, setServings] = useState('');
  const [notes, setNotes] = useState('');
  const [plannedDay, setPlannedDay] = useState(selectedDay);
  const [plannedMealType, setPlannedMealType] = useState(mealType);

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const mealTypes = [
    { value: 'breakfast', label: 'Breakfast' },
    { value: 'lunch', label: 'Lunch' },
    { value: 'dinner', label: 'Dinner' },
  ];

  const handleSave = () => {
    if (!recipeName || !plannedDay || !plannedMealType) {
      alert('Please fill in recipe name, day, and meal type');
      return;
    }

    const mealPlan = {
      day: plannedDay,
      mealType: plannedMealType,
      recipeName,
      cookTime,
      servings,
      notes,
    };

    console.log('Saving meal plan:', mealPlan);
    onClose();

    // Reset
    setRecipeName('');
    setCookTime('');
    setServings('');
    setNotes('');
  };

  useEffect(() => {
    setRecipeName(suggestedRecipe);
    setPlannedDay(selectedDay);
    setPlannedMealType(mealType);
  }, [suggestedRecipe, selectedDay, mealType]);

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <Calendar size={20} style={{ marginRight: 8 }} />
          Plan Your Meal
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Box component="form" noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Recipe/Dish Name"
                value={recipeName}
                onChange={(e) => setRecipeName(e.target.value)}
                placeholder="Enter recipe or dish name"
              />
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth required>
                <InputLabel>Day</InputLabel>
                <Select
                  value={plannedDay}
                  label="Day"
                  onChange={(e) => setPlannedDay(e.target.value)}
                >
                  {days.map((day) => (
                    <MenuItem key={day} value={day}>
                      {day}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth required>
                <InputLabel>Meal Type</InputLabel>
                <Select
                  value={plannedMealType}
                  label="Meal Type"
                  onChange={(e) => setPlannedMealType(e.target.value)}
                >
                  {mealTypes.map((meal) => (
                    <MenuItem key={meal.value} value={meal.value}>
                      {meal.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Cook Time"
                placeholder="e.g., 30 min"
                value={cookTime}
                onChange={(e) => setCookTime(e.target.value)}
                InputProps={{
                  startAdornment: <Clock size={16} style={{ marginRight: 6 }} />,
                }}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Servings"
                placeholder="e.g., 4"
                value={servings}
                onChange={(e) => setServings(e.target.value)}
                InputProps={{
                  startAdornment: <Users size={16} style={{ marginRight: 6 }} />,
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes (optional)"
                placeholder="Any special notes or reminders"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          variant="contained"
          onClick={handleSave}
          sx={{
            backgroundColor: 'green',
            '&:hover': { backgroundColor: 'darkgreen' },
            flex: 1,
          }}
          startIcon={<Plus size={18} />}
        >
          Add to Plan
        </Button>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MealPlanDialog;
