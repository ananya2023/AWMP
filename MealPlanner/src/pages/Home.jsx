import React from 'react';
import Header from '../components/Header';
import YourImpact from '../components/YourImpact';
import ReceiptScanner from '../components/ReceiptsScanner';
import AIRecipeGenerator from '../components/AIRecipeGenerator';
import InventoryTracker from '../components/InventoryTracker';
import MealPlanner from '../components/MealPlanner';
import SmartShoppingList from '../components/SmartShoppingList';
// import Achievements from '../components/Achievements'; from '../components/SmartShoppingList';
import { Container, Box, Typography ,Grid} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Optional theme customization
const theme = createTheme({
  palette: {
    background: {
      default: '#f9fafb', // similar to Tailwind's bg-gray-50
    },
  },
});

const Index = () => {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Header />
        <YourImpact />
        {/* <ReceiptScanner />
        <AIRecipeGenerator /> */}

        {/* Section: Your Impact */}


        {/* Uncomment and convert the rest as needed: */}
        
        <Box sx={{ py: 8, bgcolor: 'grey.50' }}>
          <Container maxWidth="lg">
            <Box mb={4}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Smart Pantry Management
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Add items quickly and get AI-powered recipe suggestions
              </Typography>
            </Box>
            <Grid container spacing={4}>
              <Grid item xs={12} lg={6}>
                <ReceiptScanner />
              </Grid>
              <Grid item xs={12} lg={6}>
                <AIRecipeGenerator />
              </Grid>
            </Grid>
          </Container>
        </Box>

        <Box sx={{ py: 8, bgcolor: 'white' }}>
          <Container maxWidth="lg">
            <Grid container spacing={4}>
              <Grid item xs={12} lg={8}>
                <Box display="flex" flexDirection="column" gap={4}>
                  <InventoryTracker />
                  {/* <RecipeSuggestions /> */}
                </Box>
              </Grid>
              <Grid item xs={12} lg={4}>
                <Box display="flex" flexDirection="column" gap={4}>
                  <MealPlanner />
                  <SmartShoppingList />
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>
         {/*

        <Box sx={{ py: 8, bgcolor: 'grey.50' }}>
          <Container maxWidth="lg">
            <Box mb={4}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Your Journey
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Celebrate your food waste reduction achievements
              </Typography>
            </Box>
            <Achievements />
          </Container>
        </Box>
        */}
      </Box>
    </ThemeProvider>
  );
};

export default Index;



// const Home = () => {
//   const navigate = useNavigate();

//   const auth = getAuth(app);
//   const logout = () => {
//     console.log("Logout in clicked");
//     const auth = getAuth();
//     signOut(auth).then(() => {
//       navigate("/");
//       // Sign-out successful.
//     }).catch((error) => {
//       // An error happened.
//     });
//   };



