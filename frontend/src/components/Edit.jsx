import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    MenuItem,
    Paper
} from '@mui/material';

export default function EditReading() {
    const location = useLocation();
    const { readingId, data } = location.state;

    const single = data.find((r) => r.id === readingId);

    const [formData, setFormData] = useState({
        date: single.date,
        slot: single.slot,
        value: single.value
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`/api/readings/${readingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...formData,
                    value: Number(formData.value)
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Update failed');
            }

            console.log('Updated successfully:', result);
            alert('Reading updated successfully!');

        } catch (error) {
            console.error('Error deleting reading:', error);
        }
    }

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
                    Edit Blood Glucose Reading
                </Typography>

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
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
                        label="Time Slot"
                        name="slot"
                        value={formData.slot}
                        onChange={handleChange}
                    >
                        <MenuItem value="Morning">Morning (Fasting)</MenuItem>
                        <MenuItem value="After breakfast">After breakfast</MenuItem>
                        <MenuItem value="After lunch">After lunch</MenuItem>
                        <MenuItem value="After dinner">After dinner</MenuItem>
                    </TextField>

                    <TextField
                        label="Blood Glucose (mg/dL)"
                        type="number"
                        name="value"
                        value={formData.value}
                        onChange={handleChange}
                        slotProps={{
                            htmlInput: {
                                min: 40,
                                max: 600,
                                step: 1
                            }
                        }}
                        required
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                    >
                        Update Reading
                    </Button>

                </Box>
            </Paper>
        </Box>
    );
}
