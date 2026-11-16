
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

import './AddForm.css';

const slots = [
    'Morning',
    'After breakfast',
    'After lunch',
    'After dinner'
];

const today = new Date().toLocaleDateString('en-CA', {
    timeZone: 'Asia/Kolkata'
});

export default function AddForm({ data, setData, setSuccess }) {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        date: '',
        slot: '',
        value: ''
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

    // Check whether all 4 readings are added
    const isDayFull = usedSlots.length >= 4;

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));


    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isDayFull) {
            console.log('You have already added all 4 readings for this date.');
            return;
        }

        if (usedSlots.includes(formData.slot)) {
            console.log('You have already added a reading for this slot.');
            return;
        }

        try {
            const response = await fetch('/api/readings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            console.log('Backend response:', result);

            if (response.ok) {

                setData((prevData) => [...prevData, result.newReading]);

                // alert('Reading added successfully!');

                setFormData({
                    date: '',
                    slot: '',
                    value: ''
                });

                navigate('/');
                setSuccess(result.message);
            }

        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <Box
            className="reading-form-page reading-form-page--add"
            sx={{
                display: 'flex',
                justifyContent: 'center',
                mt: 5
            }}
        >
            <Paper
                className="reading-form-paper"
                elevation={3}
                sx={{ p: 4, width: 400 }}
            >
                <Typography
                    className="reading-form-title"
                    variant="h5"
                    mb={3}
                >
                    Add Blood Glucose Reading
                </Typography>

                <Box
                    className="reading-form"
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
                        onChange={(e) => {
                            handleChange(e);
                            setFormData((prev) => ({
                                ...prev,
                                date: e.target.value,
                                slot: ''
                            }));
                        }}
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
                        label="Slot"
                        name="slot"
                        value={formData.slot}
                        onChange={handleChange}
                        required
                        disabled={!formData.date || isDayFull}
                    >
                        <MenuItem value="">Select a slot</MenuItem>

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

                    {isDayFull && (
                        <Typography color="error">
                            All 4 readings for this date have been added.
                        </Typography>
                    )}

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
                        disabled={!formData.date || !formData.slot || isDayFull}
                    >
                        Save Reading
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}
