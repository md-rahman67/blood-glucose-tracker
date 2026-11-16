
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Divider
} from '@mui/material';

const today = new Date().toLocaleDateString('en-CA');

import { useState } from 'react';

export default function DailyReports() {
    const [date, setDate] = useState('');

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5, mb: 5 }}>
            <Paper elevation={3} sx={{ p: 3, width: 450 }}>

                <Typography variant="h5" mb={3}>
                    Daily Report
                </Typography>


                <Divider sx={{ mb: 2 }} />

                <Typography variant="h6" mb={2}>
                    Report Summary
                </Typography>

                <Typography mb={1}>Maximum: 160 mg/dL</Typography>
                <Typography mb={1}>Minimum: 100 mg/dL</Typography>
                <Typography mb={1}>Average: 130.0 mg/dL</Typography>
                <Typography mb={2}>Total Readings: 4</Typography>

                <Divider sx={{ mb: 2 }} />

                <Typography variant="h6" mb={2}>
                    Reading Details
                </Typography>

                <Typography mb={1}>Morning - 100 mg/dL</Typography>
                <Typography mb={1}>After breakfast - 140 mg/dL</Typography>
                <Typography mb={1}>After lunch - 120 mg/dL</Typography>
                <Typography>After dinner - 160 mg/dL</Typography>

            </Paper>
        </Box>
    );
}
