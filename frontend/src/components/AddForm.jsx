import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    Box,
    TextField,
    Button,
    Typography,
    MenuItem,
    Paper
} from '@mui/material';

export default function AddForm({ setData }) {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        date: '',
        slot: '',
        value: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/readings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            setData((prevData) => [...prevData, result]);
            alert('Reading addedd successfully!');
            setFormData({
                date: '',
                slot: '',
                value: ''
            });

            navigate("/");


        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                mt: 5
            }}
        >
            <Paper elevation={3} sx={{ p: 4, width: 400 }}>

                <Typography variant="h5" mb={3}>
                    Add Blood Glucose Reading
                </Typography>

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2
                    }}
                >

                    <TextField
                        label="Date"
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        slotProps={{
                            inputLabel: {
                                shrink: true
                            }
                        }}
                        required
                    />

                    <TextField
                        select
                        label="Slot"
                        name="slot"
                        value={formData.slot}
                        onChange={handleChange}
                        required
                    >
                        <MenuItem value="">Select a slot</MenuItem>
                        <MenuItem value="Morning">Morning</MenuItem>
                        <MenuItem value="After breakfast">After breakfast</MenuItem>
                        <MenuItem value="After lunch">After lunch</MenuItem>
                        <MenuItem value="After dinner">After dinner</MenuItem>
                    </TextField>

                    <TextField
                        label="Value"
                        type="number"
                        name="value"
                        placeholder="Glucose value (mg/dL)"
                        value={formData.value}
                        onChange={handleChange}
                        slotProps={{
                            htmlInput: {
                                min: 40,
                                max: 600
                            }
                        }}
                        required
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                    >
                        Save Reading
                    </Button>

                </Box>
            </Paper>
        </Box>
    );
}
