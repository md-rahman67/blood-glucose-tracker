import { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Divider
} from '@mui/material';
import BackButton from '../components/BackButton';

const date = new Date().toLocaleDateString('en-CA', {
    timeZone: 'Asia/Kolkata'
});

export default function MonthToDateReports() {

    const [report, setReport] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/reports/month-to-date?date=${date}`);
                const jsonData = await response.json();
                console.log(jsonData);
                setReport(jsonData);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();

    }, []);

    if (!report) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 5 }}>
                <BackButton fallbackTo="/" />
                <Typography sx={{ textAlign: 'center' }}> Loading report...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: 5,
            mb: 5
        }}>

            <Paper elevation={3} sx={{ p: 4, width: 450 }}>
                <BackButton fallbackTo="/" />

                <Typography variant="h4" fontWeight="bold" mb={4}>
                    Month-to-Date Report
                </Typography>

                <Typography fontWeight="bold" mb={2}>
                    From: {report.from.split("T")[0]}
                </Typography>

                <Typography fontWeight="bold" mb={3}>
                    To: {report.to.split("T")[0]}
                </Typography>

                <Divider sx={{ mb: 3 }} />

                <Typography variant="h6" fontWeight="bold" mb={3}>
                    Report Summary
                </Typography>

                {report.count === 0 ? (

                    <Typography mb={3}>
                        No readings found for this period.
                    </Typography>

                ) : (

                    <>
                        <Typography fontWeight="bold" mb={2}>
                            Maximum: {report.max} mg/dL
                        </Typography>

                        <Typography fontWeight="bold" mb={2}>
                            Minimum: {report.min} mg/dL
                        </Typography>

                        <Typography fontWeight="bold" mb={2}>
                            Average: {report.average} mg/dL
                        </Typography>

                        <Typography fontWeight="bold" mb={3}>
                            Total Readings: {report.count}
                        </Typography>

                        <Divider sx={{ mb: 3 }} />

                        <Typography variant="h6" fontWeight="bold" mb={3}>
                            Reading Details
                        </Typography>

                        {report.readings.map((reading) => (
                            <Typography key={reading._id} mb={2}>
                                {reading.slot}: {reading.value} mg/dL
                            </Typography>
                        ))}
                    </>

                )}

            </Paper>

        </Box>
    );
}
