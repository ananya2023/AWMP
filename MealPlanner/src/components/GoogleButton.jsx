import { useEffect } from "react";
import { Button, Box } from "@mui/material";
import app from "../firebase/firebase";
import provider from "../firebase/googleAuthProvider";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";

const GoogleButton = (email) => {
  const navigate = useNavigate();
  const auth = getAuth(app);

  // This effect still handles navigation if the user is already authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // You might want to add a check here to ensure the user document
        // is created in Firestore before navigating, or handle it in your home page component.
        navigate("/home");
      }
    });
    return () => unsubscribe();
  }, [auth, navigate]);

  const handleGoogleSignIn = () => {
    console.log("Google sign in clicked");
    signInWithPopup(auth, provider)
      .then(async (result) => { // Added async here to use await
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken; // This is the Google Access Token, not the Firebase ID token

        // The signed-in user info.
        const user = result.user;
        console.log(user , "userrrrrrrrrr")

        // *** Get the Firebase ID token ***
        const idToken = await user.getIdToken();
        console.log("Firebase ID Token:", idToken);

        // *** Call your backend API ***
        try {
          const backendResponse = await fetch(`http://localhost:5000/api/auth/postLogin`, { // Replace with your backend URL
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              // Include the Firebase ID token in the Authorization header
              'Authorization': `Bearer ${idToken}`,
            },
            body: JSON.stringify({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              // Include any other initial user data you need on the backend
            }),
            credentials: 'include',
          
          });

          const backendData = await backendResponse.json();

          if (backendResponse.ok) {
            console.log('Backend processed user login:', backendData);
            // Now that the backend has processed the user, navigate
            navigate("/home");
          } else {
            console.error('Backend error processing user login:', backendData.message);
            // Handle backend errors (e.g., display an error message to the user)
          }

        } catch (backendError) {
          console.error('Error calling backend API:', backendError);
          // Handle errors during the backend API call
        }

      }).catch((error) => {
        console.log(error)
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData?.email; // Use optional chaining in case customData is null
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
        // Display error message to the user
      });
  };

  return (
    <Button
      onClick={handleGoogleSignIn}
      variant="outlined"
      fullWidth
      size="large"
      sx={{
        py: 1.5,
        textTransform: 'none',
        fontSize: '1rem',
        borderColor: '#dadce0',
        color: '#3c4043',
        '&:hover': {
          backgroundColor: '#f8f9fa',
          borderColor: '#dadce0',
        }
      }}
      startIcon={
        <Box component="svg" sx={{ width: 20, height: 20 }} viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </Box>
      }
    >
      Sign Up with Google
    </Button>
  );
};

export default GoogleButton;
