import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    MenuItem,
    Paper
} from '@mui/material';
import './Edit.css';

const today = new Date().toLocaleDateString('en-CA');

const slots = [
    'Morning',
    'After breakfast',
    'After lunch',
    'After dinner'
];

export default function EditReading({ setSuccess }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { readingId, data } = location.state;

    const single = data.find((r) => r._id === readingId);

    const [formData, setFormData] = useState({
        date: single.date.split('T')[0],
        slot: single.slot,
        value: single.value
    });

    // Selected date ki readings
    const selectedDateReadings = data.filter(
        (reading) =>
            new Date(reading.date).toISOString().slice(0, 10) === formData.date
    );

    // Selected date par already used slots
    const usedSlots = selectedDateReadings.map(
        (reading) => reading.slot
    );

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
            // alert('Reading updated successfully!');
            navigate("/");
            setSuccess(result.message);

        } catch (error) {
            console.error('Error deleting reading:', error);
        }
    }

    return (
        <Box
            className="reading-form-page reading-form-page--edit"
            sx={{
                display: 'flex',
                justifyContent: 'center',
                mt: 5
            }}
        >
            <Paper className="reading-form-paper" elevation={3} sx={{ p: 4, width: 400 }}>

                <Typography className="reading-form-title" variant="h5" mb={3}>
                    Edit Blood Glucose Reading
                </Typography>

                <Box
                    className="reading-form"
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
                            },
                            htmlInput: {
                                min: today,
                                max: today
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
                        {slots.map((slot) => (
                            <MenuItem
                                key={slot}
                                value={slot}
                                disabled={usedSlots.includes(slot)}
                            >
                                {slot}
                                {usedSlots.includes(slot)
                                    ? ' (Already Added)'
                                    : ''}
                            </MenuItem>
                        ))}
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
