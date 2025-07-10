import React from 'react';
import { Box,  Typography, Card, CardContent, Stack } from '@mui/material';
import { TrendingDown, Leaf, DollarSign, Award } from 'lucide-react';

const stats = [
  {
    title: 'Food Saved',
    value: '12.5 kg',
    change: '+15% this month',
    icon: <Leaf size={28} color="#16a34a" />, // green-600
    changeColor: 'success.main',
  },
  {
    title: 'Money Saved',
    value: '$156',
    change: '+22% this month',
    icon: <DollarSign size={28} color="#2563eb" />, // blue-600
    changeColor: 'info.main',
  },
  {
    title: 'Waste Reduction',
    value: '85%',
    change: '+8% this month',
    icon: <TrendingDown size={28} color="#7c3aed" />, // purple-600
    changeColor: 'secondary.main',
  },
  {
    title: 'Eco Score',
    value: '94/100',
    change: '+5% this month',
    icon: <Award size={28} color="#ea580c" />, // orange-600
    changeColor: 'warning.main',
  },
];

const YourImpact = () => {
  return (
    <Box py={6} width="100%">
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Your Impact
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Track your progress in reducing food waste
      </Typography>

      <Stack direction="row" container gap="2rem" justifyContent="space-between" >
        {stats.map((stat, index) => (
          <Stack key={index} sx={{ width : '100%'}}>
            <Card elevation={2}>
              <CardContent>
                <Box sx={{display: 'flex', flexDirection: 'row' , gap : "2rem", alignItems:"center"}}>
                  <Box textAlign="left">
                    <Typography variant="subtitle2" color="text.secondary" mb={0.5}>
                      {stat.title}
                    </Typography>
                    <Typography variant="h5" fontWeight="bold" mb={0.5}>
                      {stat.value}
                    </Typography>
                    <Typography variant="caption" color={stat.changeColor}>
                      {stat.change}
                    </Typography>
                  </Box>
                  <Box>
                    {stat.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
};

export default YourImpact;
