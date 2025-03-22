import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "./Firebase";
import { toast } from "react-toastify";
import SigninWithGoogle from "./SigninWithGoogle";
import { Box, TextField, Typography, Button, Card, CardContent, AppBar, Toolbar, Container } from "@mui/material";
import { login } from "../lib/api-wizard";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!username || !password) {
      setError("Please fill all fields.");
      return;
    }
    try {
      const response = await login({ username, password });
      if (response.data.success) {
        console.log("Response:", response.data);
        const username = response.data.result.username;
        const uid = response.data.result.uid;

        toast.success("User Login Successful", { position: "top-center" });
        localStorage.setItem("login", true);
        localStorage.setItem("username", username);
        localStorage.setItem("uid", uid);
        navigate("/profile");
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.log(error.message);
      toast.error("User not found", { position: "top-center" });
    }
  };

  return (
    <Box sx={{ bgcolor: "whitesmoke", minHeight: "100vh" }}>
      {/* AppBar Header */}
      <AppBar position="static" sx={{ bgcolor: "#2E3B55", boxShadow: 3 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "white", flexGrow: 1 }}>
            Login to Your Account
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "85vh" }}>
        <Card sx={{ width: 380, p: 4, borderRadius: 3, boxShadow: 5 }}>
          <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center", mb: 2 }}>
              Login
            </Typography>

            {/* Username Field */}
            <TextField
              fullWidth
              size="small"
              type="text"
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{ mb: 1 }}
            />

            {/* Password Field */}
            <TextField
              fullWidth
              size="small"
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* Error Message */}
            {error && (
              <Typography color="error" sx={{ mt: 1, textAlign: "center", fontSize: "0.9rem" }}>
                {error}
              </Typography>
            )}

            {/* Login Button */}
            <Button variant="contained" fullWidth color="success" onClick={handleSubmit} sx={{ mt: 2 }}>
              Login
            </Button>

            {/* Register Link */}
            <Typography sx={{ textAlign: "center", mt: 2 }}>
              New User? <Link to={"/Register"}>Register</Link>
            </Typography>

            {/* Google Sign-In */}
            <SigninWithGoogle />
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
