import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "./Firebase";
import { setDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import { Box, Button, Card, TextField, Typography, AppBar, Toolbar, Container } from "@mui/material";
import { getUserName, Registor } from "../lib/api-wizard";

export default function Registration() {
  const [error, setError] = useState("");
  const [usernameList, setUserNameList] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    mobile: "",
  });

  const handleInput = (value, field) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const navigate = useNavigate();

  const fetchUsername = async () => {
    try {
      const response = await getUserName();
      console.log("Response: ", response.data.result);
      setUserNameList(response.data.result);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUsername();
  }, []);

  const handleSubmit = async (e) => {
    fetchUsername();
    const { name, mobile, email, username, password, confirmPassword } = formData;

    if (!name || !mobile || !email || !username || !password || !confirmPassword) {
      setError("Please fill out all required fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(mobile)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    let userExists = usernameList.some((u) => u.username.trim() === username.trim());
    if (userExists) {
      setError("Username already exists.");
      return;
    }

    try {
      const updatedFormData = { ...formData, username: formData.username.trim() };
      const response = await Registor(updatedFormData);
      console.log("Response: ", response.data.message);

      if (response.data.success) {
        navigate("/");
        toast.success("User Registration Successful.", { position: "bottom-center" });
      } else {
        toast.error("User Registration Failed.", { position: "top-center" });
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message, { position: "bottom-center" });
    }
  };

  return (
    <Box sx={{ bgcolor: "whitesmoke", minHeight: "100vh" }}>
      {/* App Bar (Header) */}
      <AppBar position="static" sx={{ bgcolor: "#2E3B55", boxShadow: 3 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "white", flexGrow: 1 }}>
            Register New Account
          </Typography>
          <Button variant="contained" color="warning" onClick={() => navigate("/")}>
            Back to Login
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "85vh" }}>
        <Card sx={{ width: 400, p: 4, borderRadius: 3, boxShadow: 5 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2, textAlign: "center" }}>
            Create an Account
          </Typography>

          <TextField
            fullWidth
            size="small"
            type="text"
            label="Full Name"
            value={formData.name}
            onChange={(e) => handleInput(e.target.value, "name")}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            size="small"
            type="text"
            label="Username"
            value={formData.username}
            onChange={(e) => handleInput(e.target.value, "username")}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            size="small"
            type="email"
            label="Email"
            value={formData.email}
            onChange={(e) => handleInput(e.target.value, "email")}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            size="small"
            type="text"
            label="Mobile Number"
            value={formData.mobile}
            onChange={(e) => handleInput(e.target.value, "mobile")}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            size="small"
            type="password"
            label="Set Password"
            value={formData.password}
            onChange={(e) => handleInput(e.target.value, "password")}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            size="small"
            type="password"
            label="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e) => handleInput(e.target.value, "confirmPassword")}
            sx={{ mb: 2 }}
          />

          {/* Error Message */}
          {error && (
            <Typography color="error" sx={{ mb: 2, textAlign: "center", fontSize: "0.9rem" }}>
              {error}
            </Typography>
          )}

          {/* Buttons */}
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button variant="contained" color="success" onClick={handleSubmit}>
              Register
            </Button>
            <Button variant="contained" color="primary" onClick={() => navigate("/")}>
              Login
            </Button>
          </Box>
        </Card>
      </Container>
    </Box>
  );
}
