import { useState } from "react";
import {
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";
import { Mail, Lock } from "lucide-react";
import GoogleButton from "./GoogleButton";
import app from "../firebase/firebase";
import { getAuth, createUserWithEmailAndPassword  } from "firebase/auth";
import { createUser } from "../api/userApi";




const SignUpForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = getAuth(app);

  const SignUpWithGoogle = () => {  
    console.log("hey")
  }

   const handleSubmit = async (e) => {
      e.preventDefault();
      console.log("Sign up attempt:", { email, password });

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("Firebase user created:", user);

        const userData = {
          user_id: user.uid,
          email: user.email,
          isEmailVerified: user.emailVerified
        };
        console.log(userData);

        const response = await createUser(userData);
        console.log("Backend Response:", response);

        // Assuming backend returns user_id and pantry_id in response.data
        if (response && response.data) {
          const user_data = response.data;
          const {user_id , pantry_id } = user_data?.user_data;

          const localUserData = {
            user_id,
            pantry_id
          };

          // Save as single object under 'userData'
          localStorage.setItem('user_data', JSON.stringify(localUserData));

          console.log("Saved userData in localStorage:", localUserData);
        } else {
          console.error("Failed to retrieve pantry_id from backend response");
        }

      } catch (error) {
        console.log(error.code, error.message);
      }
};



  return (
    <Box>
      <Typography variant="h5" align="center" fontWeight="600" gutterBottom>
        Sign Up
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
            Create Account
          </Button>
        </Stack>
      </Box>

      {/* OR Divider */}
      <Box sx={{ mt: 5 }}>
        <Divider sx={{ fontSize: "0.875rem", color: "gray" }}>OR</Divider>
      </Box>

      {/* Google Button */}
      <Box mt={3}>
        <GoogleButton email={email} />
      </Box>
    </Box>
  );
};

export default SignUpForm;
