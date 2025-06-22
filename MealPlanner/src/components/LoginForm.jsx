import { useState } from "react";
import {
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
  InputAdornment,
  Paper,
} from "@mui/material";
import { Mail, Lock } from "lucide-react";
import GoogleButton from "./GoogleButton";
import app from "../firebase/firebase";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = getAuth(app);


  const handleSubmit = (e) => {
    e.preventDefault();
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log(user);
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };

  return (
    <Box>
      <Typography variant="h5" align="center" fontWeight="600" gutterBottom>
        Login
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stack spacing={3}>
          <TextField
            type="email"
            label="Email"
            variant="outlined"
            required
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Mail size={18} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            type="password"
            label="Password"
            variant="outlined"
            required
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock size={18} />
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            sx={{
              py: 1.5,
              textTransform: "none",
              fontWeight: 500,
              boxShadow: 2,
              ":hover": {
                boxShadow: 4,
              },
            }}
          >
            Sign In
          </Button>
        </Stack>
      </Box>

      {/* OR Divider */}
      <Box sx={{ mt: 5 }}>
        <Divider sx={{ fontSize: "0.875rem", color: "gray" }}>OR</Divider>
      </Box>

      {/* Google Button */}
      <Box mt={3}>
        <GoogleButton />
      </Box>
    </Box>
  );
};

export default LoginForm;
