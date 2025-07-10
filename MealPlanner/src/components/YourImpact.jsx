import { Grid, Typography, Card, CardContent, Stack } from "@mui/material";
import { TrendingDown, Leaf, DollarSign, Award } from "lucide-react";

const stats = [
  {
    title: "Food Saved",
    value: "12.5 kg",
    change: "+15% this month",
    icon: <Leaf size={28} color="#16a34a" />, // green-600
    changeColor: "success.main",
  },
  {
    title: "Money Saved",
    value: "$156",
    change: "+22% this month",
    icon: <DollarSign size={28} color="#2563eb" />, // blue-600
    changeColor: "info.main",
  },
  {
    title: "Waste Reduction",
    value: "85%",
    change: "+8% this month",
    icon: <TrendingDown size={28} color="#7c3aed" />, // purple-600
    changeColor: "secondary.main",
  },
  {
    title: "Eco Score",
    value: "94/100",
    change: "+5% this month",
    icon: <Award size={28} color="#ea580c" />, // orange-600
    changeColor: "warning.main",
  },
];

/**
 * A React component that displays a summary of user's impact metrics
 * such as food saved, money saved, waste reduction, and eco score.
 * Each metric is presented in a card format with a title, value, percentage change,
 * and a representative icon.
 *
 * @returns {JSX.Element} A styled container with multiple cards displaying
 *                        various impact statistics.
 */

const YourImpact = () => {
  return (
    <Stack spacing={4} width="100%" mt={4}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Your Impact
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Track your progress in reducing food waste
      </Typography>

      <Grid container spacing={3} justifyContent="space-evenly">
        {stats.map((stat, index) => (
          <Stack item xs={12} sm={6} md={3} key={index}>
            <Card elevation={2} sx={{ width: "100%" }}>
              <CardContent>
                <Stack
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "2rem",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Stack textAlign="left">
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      mb={0.5}
                    >
                      {stat.title}
                    </Typography>
                    <Typography variant="h5" fontWeight="bold" mb={0.5}>
                      {stat.value}
                    </Typography>
                    <Typography variant="caption" color={stat.changeColor}>
                      {stat.change}
                    </Typography>
                  </Stack>
                  <Typography>{stat.icon}</Typography>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        ))}
      </Grid>
    </Stack>
  );
};

export default YourImpact;
