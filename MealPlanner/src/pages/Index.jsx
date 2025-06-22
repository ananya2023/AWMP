import AuthForm from "../components/AuthForm";
import { Box, Container, Typography } from "@mui/material";

const Index = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #f3f4f6, #e5e7eb)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" fontWeight="bold" color="text.primary" gutterBottom>
            Welcome to the Message Board!
          </Typography>
        </Box>
        <AuthForm />
      </Container>
    </Box>
  );
};

export default Index;
