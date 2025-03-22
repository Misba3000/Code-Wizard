import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import React from "react";
// import GoogleButton from "react-google-button";
import { auth, db } from "./Firebase";
import { toast } from "react-toastify";
import { setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Box,Button } from "@mui/material";
export default function SigninWithGoogle() {
  const navigate = new useNavigate();

  const GoogleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(async (result) => {
        console.log(result);
        toast.success("User Login Successfully.", { position: "top-center" });
        const user = result.user;
        if (user) {
          await setDoc(doc(db, "User", user.uid), {
            email: user.email,
            Username: user.displayName,
            Password: "",
            logo: user.photoURL,
          });
          navigate("/profile");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Box
    marginTop={"10px"}
    display={"flex"}
    justifyContent={"center"}
    alignItems={"center"}
    >
      <Button onClick={GoogleLogin} variant="contained">GoogleLogin</Button>
    </Box>
  );
}
