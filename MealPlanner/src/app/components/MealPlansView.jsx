import React, { useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  IconButton,
  Grid,
} from '@mui/material';
import {
  Calendar,
  Clock,
  Users,
  Utensils,
  Edit,
  Trash2,
  Plus,
} from 'lucide-react';
import MealPlanDialog from './MealPlanDialog';

const MealPlansView = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedMealType, setSelectedMealType] = useState('');

  const mealPlans = {
    Mon: {
      breakfast: { name: 'Banana Smoothie', cookTime: '5 min', servings: '1', notes: 'Add protein powder' },
      lunch: { name: 'Chicken Salad', cookTime: '15 min', servings: '2', notes: '' },
      dinner: { name: 'Spinach Pasta', cookTime: '25 min', servings: '4', notes: 'Use whole wheat pasta' }
    },
    Tue: {
      breakfast: null,
      lunch: { name: 'Leftover Pasta', cookTime: '5 min', servings: '2', notes: 'Reheat from yesterday' },
      dinner: null
    },
    Wed: {
      breakfast: { name: 'Toast & Avocado', cookTime: '5 min', servings: '1', notes: '' },
      lunch: null,
      dinner: { name: 'Vegetable Stir Fry', cookTime: '20 min', servings: '3', notes: 'Use seasonal vegetables' }
    },
    Thu: { breakfast: null, lunch: null, dinner: null },
    Fri: { breakfast: null, lunch: null, dinner: null },
    Sat: { breakfast: null, lunch: null, dinner: null },
    Sun: { breakfast: null, lunch: null, dinner: null }
  };

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const mealTypes = [
    { key: 'breakfast', label: 'Breakfast', bg: '#FFFDE7', color: '#FBC02D', icon: '🌅' },
    { key: 'lunch', label: 'Lunch', bg: '#E3F2FD', color: '#1E88E5', icon: '🌞' },
    { key: 'dinner', label: 'Dinner', bg: '#F3E5F5', color: '#8E24AA', icon: '🌙' }
  ];

  const handleAddMeal = (day, mealType) => {
    setSelectedDay(day);
    setSelectedMealType(mealType);
    setIsDialogOpen(true);
  };

  const handleEditMeal = (day, mealType) => {
    setSelectedDay(day);
    setSelectedMealType(mealType);
    setIsDialogOpen(true);
  };

  const handleDeleteMeal = (day, mealType) => {
    console.log(`Deleting ${mealType} for ${day}`);
  };

  return (
    <Box sx={{ px: 2, py: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h5" fontWeight="bold">This Week's Meal Plan</Typography>
          <Typography variant="body2" color="text.secondary">Manage your planned meals for the week</Typography>
        </Box>
        <Button
          onClick={() => setIsDialogOpen(true)}
          variant="contained"
          sx={{ backgroundColor: 'green', '&:hover': { backgroundColor: 'darkgreen' } }}
          startIcon={<Plus size={18} />}
        >
          Add Meal
        </Button>
      </Box>

      {/* Weekly Overview */}
      <Grid container spacing={2}>
        {weekDays.map((day) => (
          <Grid item xs={12} key={day}>
            <Card elevation={1}>
              <CardHeader
                title={
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" alignItems="center">
                      <Calendar size={16} style={{ marginRight: 8, color: 'green' }} />
                      <Typography fontWeight="bold">{day}</Typography>
                    </Box>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<Plus size={16} />}
                      onClick={() => handleAddMeal(day, 'dinner')}
                    >
                      Plan Meal
                    </Button>
                  </Box>
                }
              />
              <CardContent>
                <Grid container spacing={2}>
                  {mealTypes.map((mealType) => {
                    const meal = mealPlans[day]?.[mealType.key];
                    return (
                      <Grid item xs={12} md={4} key={mealType.key}>
                        <Box
                          sx={{
                            border: '2px solid',
                            borderColor: meal ? mealType.color : 'grey.300',
                            borderStyle: meal ? 'solid' : 'dashed',
                            borderRadius: 2,
                            p: 2,
                            bgcolor: meal ? mealType.bg : 'transparent',
                            opacity: meal ? 1 : 0.5,
                            cursor: 'pointer',
                            '&:hover': { boxShadow: 1 }
                          }}
                          onClick={() => meal ? handleEditMeal(day, mealType.key) : handleAddMeal(day, mealType.key)}
                        >
                          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                            <Typography fontSize={12} fontWeight={500}>
                              <span style={{ marginRight: 6 }}>{mealType.icon}</span>
                              {mealType.label}
                            </Typography>
                            {meal && (
                              <Box display="flex" gap={1}>
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditMeal(day, mealType.key);
                                  }}
                                >
                                  <Edit size={14} />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteMeal(day, mealType.key);
                                  }}
                                >
                                  <Trash2 size={14} />
                                </IconButton>
                              </Box>
                            )}
                          </Box>
                          {meal ? (
                            <>
                              <Typography variant="body2" fontWeight={500} noWrap>{meal.name}</Typography>
                              <Box display="flex" gap={2} mt={1} color="text.secondary">
                                {meal.cookTime && (
                                  <Box display="flex" alignItems="center" fontSize={12}>
                                    <Clock size={12} style={{ marginRight: 4 }} />
                                    {meal.cookTime}
                                  </Box>
                                )}
                                {meal.servings && (
                                  <Box display="flex" alignItems="center" fontSize={12}>
                                    <Users size={12} style={{ marginRight: 4 }} />
                                    {meal.servings}
                                  </Box>
                                )}
                              </Box>
                              {meal.notes && (
                                <Typography variant="caption" display="block" color="text.secondary" mt={1} noWrap>
                                  {meal.notes}
                                </Typography>
                              )}
                            </>
                          ) : (
                            <Box textAlign="center" mt={2}>
                              <Utensils size={24} color="#aaa" />
                              <Typography variant="caption" color="text.secondary">Not planned</Typography>
                            </Box>
                          )}
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Weekly Summary */}
      <Card sx={{ mt: 4 }}>
        <CardHeader title={<Typography variant="h6">Week Summary</Typography>} />
        <CardContent>
          <Grid container spacing={2} textAlign="center">
            <Grid item xs={6} md={3}>
              <Box p={2} borderRadius={2} bgcolor="#E8F5E9">
                <Typography variant="h6" color="green">12</Typography>
                <Typography variant="body2">Planned Meals</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box p={2} borderRadius={2} bgcolor="#E3F2FD">
                <Typography variant="h6" color="blue">9</Typography>
                <Typography variant="body2">Missing Plans</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box p={2} borderRadius={2} bgcolor="#FFF9C4">
                <Typography variant="h6" color="orange">3</Typography>
                <Typography variant="body2">Quick Meals</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box p={2} borderRadius={2} bgcolor="#F3E5F5">
                <Typography variant="h6" color="purple">57%</Typography>
                <Typography variant="body2">Week Complete</Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <MealPlanDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        selectedDay={selectedDay}
        mealType={selectedMealType}
      />
    </Box>
  );
};

export default MealPlansView;
