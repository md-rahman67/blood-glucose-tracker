import { useLocation } from 'react-router-dom';
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
                    // onSubmit={handleSubmit}
                    sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                >

                    <TextField
                        label="Date"
                        type="date"
                        name="date"
                        value={single.date}
                        // onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        required
                    />

                    <TextField
                        select
                        label="Time Slot"
                        name="slot"
                        value={single.slot}
                    // onChange={handleChange}
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
                        value={single.value}
                        // onChange={handleChange}
                        inputProps={{ min: 40, max: 600, step: 1 }}
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
