import React, { useState } from 'react';
import { Calendar, Plus } from 'lucide-react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  IconButton,
  Paper,
} from '@mui/material';
import MealPlanDialog from './MealPlanDialog';

const MealPlanner = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedMealType, setSelectedMealType] = useState('');

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const meals= {
    'Mon': { breakfast: 'Banana Smoothie', lunch: 'Chicken Salad', dinner: 'Spinach Pasta' },
    'Tue': { breakfast: '', lunch: 'Leftover Pasta', dinner: '' },
    'Wed': { breakfast: 'Toast', lunch: '', dinner: 'Stir Fry' },
    'Thu': { breakfast: '', lunch: '', dinner: '' },
    'Fri': { breakfast: '', lunch: '', dinner: '' },
    'Sat': { breakfast: '', lunch: '', dinner: '' },
    'Sun': { breakfast: '', lunch: '', dinner: '' },
  };

  const handlePlanMeal = (day) => {
    setSelectedDay(day);
    setSelectedMealType(mealType);
    setIsDialogOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader
          title={
            <Box display="flex" alignItems="center">
              <Calendar size={20} style={{ marginRight: 8 }} />
              <Typography variant="h6">This Week's Plan</Typography>
            </Box>
          }
          action={
            <Button size="small" variant="outlined">
              View Full Calendar
            </Button>
          }
        />
        <CardContent>
          <Box display="flex" flexDirection="column" gap={2}>
            {weekDays.map((day) => (
              <Paper key={day} variant="outlined" sx={{ p: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="subtitle1">{day}</Typography>
                  <Button
                    size="small"
                    variant="text"
                    color="success"
                    startIcon={<Plus size={14} />}
                    onClick={() => handlePlanMeal(day, 'dinner')}
                  >
                    Plan
                  </Button>
                </Box>

                <Grid container spacing={2}>
                  {(['breakfast', 'lunch', 'dinner']).map((mealType) => (
                    <Grid item xs={12} sm={4} key={mealType}>
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 1,
                          textAlign: 'center',
                          cursor: 'pointer',
                          bgcolor:
                            mealType === 'breakfast'
                              ? '#fef9c3'
                              : mealType === 'lunch'
                              ? '#dbeafe'
                              : '#ede9fe',
                          '&:hover': {
                            bgcolor:
                              mealType === 'breakfast'
                                ? '#fef08a'
                                : mealType === 'lunch'
                                ? '#bfdbfe'
                                : '#c4b5fd',
                          },
                        }}
                        onClick={() => handlePlanMeal(day, mealType)}
                      >
                        <Typography variant="caption" color="textSecondary">
                          {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                        </Typography>
                        <Typography variant="body2" noWrap>
                          {meals[day]?.[mealType] || 'Not planned'}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            ))}
          </Box>
        </CardContent>
      </Card>

      <MealPlanDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        selectedDay={selectedDay}
        mealType={selectedMealType}
      />
    </>
  );
};

export default MealPlanner;
