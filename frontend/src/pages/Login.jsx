import { Box, TextField, Button, Typography, Paper } from "@mui/material";

export default function Login() {
    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}
        >
            <Paper sx={{ p: 4, width: 400 }}>
                <Typography variant="h5" mb={3} textAlign="center">
                    Login
                </Typography>

                <Box component="form">
                    <TextField
                        fullWidth
                        label="Username"
                        name="username"
                        margin="normal"
                        required
                    />

                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        margin="normal"
                        required
                    />

                    <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type="password"
                        margin="normal"
                        required
                    />

                    <Button
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
    );
};