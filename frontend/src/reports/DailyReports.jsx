
import {
    Box,
    Paper,
    Typography,
    Divider
} from '@mui/material';

import { useEffect, useState } from 'react';

const date = new Date().toLocaleDateString('en-CA', {
    timeZone: 'Asia/Kolkata'
});

export default function DailyReports() {

    const [report, setReport] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/reports/daily?date=${date}`);
                const jsonData = await response.json();

                setReport(jsonData);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();

    }, []);

    if (!report) {
        return <Typography sx={{ textAlign: 'center', mt: 5 }} mt={5}>Loading report...</Typography>;
    }

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5, mb: 5 }}>
            <Paper elevation={3} sx={{ p: 3, width: 450 }}>

                <Typography variant="h5" mb={3}>
                    Daily Report
                </Typography>

                <Typography mb={2}>
                    Date: {date}
                </Typography>

                <Divider sx={{ mb: 2 }} />

                <Typography variant="h6" mb={2}>
                    Report Summary
                </Typography>

                {report.count === 0 ? (
                    <Typography mb={2}>No readings found for this date.</Typography>
                ) : (
                    <>
                        <Typography mb={1}>Maximum: {report.max} mg/dL</Typography>
                        <Typography mb={1}>Minimum: {report.min} mg/dL</Typography>
                        <Typography mb={1}>Average: {report.average} mg/dL</Typography>
                        <Typography mb={2}>Total Readings: {report.count}</Typography>

                        <Divider sx={{ mb: 2 }} />

                        <Typography variant="h6" mb={2}>
                            Reading Details
                        </Typography>

                        {report.readings.map((reading) => (
                            <Typography key={reading._id} mb={1}>
                                {reading.slot} - {reading.value} mg/dL
                            </Typography>
                        ))}
                    </>
                )}

            </Paper>
        </Box>
    );
}
