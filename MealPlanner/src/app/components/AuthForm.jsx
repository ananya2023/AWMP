import { useState } from "react";
import { Box, Button, Paper, ToggleButton, ToggleButtonGroup } from "@mui/material";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";

const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  const handleToggle = (
    event,
    newValue
  ) => {
    if (newValue !== null) {
      setIsSignUp(newValue === "signup");
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 2, maxWidth: 400, mx: "auto" }}>
      {/* Toggle Buttons */}
      <ToggleButtonGroup
        value={isSignUp ? "signup" : "login"}
        exclusive
        onChange={handleToggle}
        fullWidth
        sx={{
          mb: 3,
          bgcolor: "grey.100",
          borderRadius: 2,
          "& .MuiToggleButton-root": {
            flex: 1,
            fontWeight: 500,
            fontSize: "0.875rem",
            border: "none",
            borderRadius: 1,
            px: 2,
            py: 1,
            transition: "all 0.2s",
          },
          "& .Mui-selected": {
            bgcolor: "primary.main",
            color: "#fff",
            boxShadow: 1,
            "&:hover": {
              bgcolor: "primary.dark",
            },
          },
        }}
      >
        <ToggleButton value="login">Login</ToggleButton>
        <ToggleButton value="signup">Sign Up</ToggleButton>
      </ToggleButtonGroup>

      {/* Form Content */}
      <Box sx={{ transition: "all 0.3s ease-in-out" }}>
        {isSignUp ? <SignUpForm /> : <LoginForm />}
      </Box>
    </Paper>
  );
};

export default AuthForm;
