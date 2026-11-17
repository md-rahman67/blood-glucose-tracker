import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Login.css';
import Success from "../components/Success";

export default function Login({ setCurrUser, setSuccess, success }) {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("/api/login", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            console.log();

            if (response.ok) {
                setCurrUser(result.user);
                navigate("/");
                setSuccess(result.message);
            }

        } catch (error) {
            console.error('Error deleting reading:', error);
        }
    }

    return (
        <>
            <Box
                className="auth-page auth-page--login"
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <Paper className="auth-paper" sx={{ p: 4, width: 400 }}>
                    <Typography
                        className="auth-title"
                        variant="h5"
                        mb={3}
                        sx={{ textAlign: "center" }}
                    >
                        Login
                    </Typography>

                    <Box
                        className="auth-form"
                        component="form"
                        onSubmit={handleLoginSubmit}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2
                        }}
                    >
                        <TextField
                            fullWidth
                            label="Username"
                            name="username"
                            onChange={handleChange}
                            required
                        />

                        <TextField
                            fullWidth
                            label="Password"
                            name="password"
                            type="password"
                            onChange={handleChange}
                            required
                        />

                        <Button
                            className="login-action-button"
                            fullWidth
                            variant="contained"
                            type="submit"
                            sx={{ mt: 2 }}
                        >
                            Login
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </>
    );
}
