import { Button, Box } from "@mui/material";
import app from "../firebase/firebase";
import provider from "../firebase/googleAuthProvider"
import { getAuth , signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";




const Home = () => {
  const navigate = useNavigate();

  const auth = getAuth(app);
  const logout = () => {
    console.log("Logout in clicked");
    const auth = getAuth();
    signOut(auth).then(() => {
      navigate("/");
      // Sign-out successful.
    }).catch((error) => {
      // An error happened.
    });
  };



  return (
    <Button onClick={logout}>
      Hey Miriyala
    </Button>





























































  );
};

export default Home;