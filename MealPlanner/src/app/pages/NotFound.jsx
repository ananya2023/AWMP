import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "grey.100",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <Container>
        <Typography variant="h2" fontWeight="bold" gutterBottom>
          404
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Oops! Page not found
        </Typography>
        <Button
          component={RouterLink}
          to="/"
          variant="contained"
          color="primary"
        >
          Return to Home
        </Button>
      </Container>
    </Box>
  );
};

export default NotFound;
