
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import  Home  from "./pages/Home";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {Box} from "@mui/material";


const queryClient = new QueryClient();
const theme = createTheme(
  () =>
    createTheme({
      palette: {
        mode: 'light', // or 'dark' for dark mode
        primary: {
          main: '#4CAF50', // A shade of green
        },
        secondary: {
          main: '#F57C00', // A shade of orange
        },
        background: {
          default: '#F1F8E9', // A light green background
        },
      },
    }),
  [],
);

const App = () => (
  <ThemeProvider theme={theme}>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Box sx={{ maxWidth: '100vw', overflowX: 'hidden' }}> {/* Added this Box */}
            <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/home" element={<Home />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
          </Box>
      </BrowserRouter>
  </QueryClientProvider>
  </ThemeProvider>
  
);

export default App;