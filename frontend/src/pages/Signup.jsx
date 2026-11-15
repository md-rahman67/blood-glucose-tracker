import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import { useState } from "react";
import './Signup.css';
import { useNavigate } from "react-router-dom";

export default function Signup() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    const handleSignUpSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("/api/signup", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Signup failed");
            }

            console.log(result);
            navigate("/");

            setFormData({
                username: '',
                email: '',
                password: ''
            });

        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <Box
            className="auth-page auth-page--signup"
            sx={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}
        >
            <Paper className="auth-paper" sx={{ p: 4, width: 400 }}>
                <Typography className="auth-title" variant="h5" mb={3} sx={{ textAlign: "center" }}>
                    Sign Up
                </Typography>

                <Box
                    className="auth-form"
                    component="form"
                    onSubmit={handleSignUpSubmit}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2
                    }}>


                    <TextField
                        fullWidth
                        label="Username"
                        name="username"
                        margin="normal"
                        onChange={handleChange}
                        required
                    />

                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        margin="normal"
                        onChange={handleChange}
                        required
                    />

                    <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type="password"
                        margin="normal"
                        onChange={handleChange}
                        required
                    />

                    <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                        sx={{ mt: 2 }}
                    >
                        Sign Up
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};
