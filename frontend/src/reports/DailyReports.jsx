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
        return <Typography sx={{ textAlign: 'center', mt: 5 }}> Loading report...</Typography>;
    }

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5, mb: 5 }}>
            <Paper elevation={3} sx={{ p: 4, width: 450 }}>

                <Typography variant="h4" fontWeight="bold" mb={4}>
                    Daily Report
                </Typography>

                <Typography fontWeight="bold" mb={3}>
                    Date: {date}
                </Typography>

                <Divider sx={{ mb: 3 }} />

                <Typography variant="h6" fontWeight="bold" mb={3}>
                    Report Summary
                </Typography>

                {report.count === 0 ? (
                    <Typography mb={3}>No readings found for this date.</Typography>
                ) : (
                    <>
                        <Typography fontWeight="bold" mb={2}>Maximum: <Typography component="span">{report.max} mg/dL</Typography></Typography>

                        <Typography fontWeight="bold" mb={2}>Minimum: <Typography component="span">{report.min} mg/dL</Typography></Typography>

                        <Typography fontWeight="bold" mb={2}>Average: <Typography component="span">{report.average} mg/dL</Typography></Typography>

                        <Typography fontWeight="bold" mb={3}>Total Readings: <Typography component="span">{report.count}</Typography></Typography>

                        <Divider sx={{ mb: 3 }} />

                        <Typography variant="h6" fontWeight="bold" mb={3}>
                            Reading Details
                        </Typography>

                        {report.readings.map((reading) => (
                            <Typography key={reading._id} mb={2}>
                                <Typography component="span" fontWeight="bold">
                                    {reading.slot}:
                                </Typography>
                                {' '}{reading.value} mg/dL
                            </Typography>
                        ))}
                    </>
                )}

            </Paper>
        </Box>
    );
}