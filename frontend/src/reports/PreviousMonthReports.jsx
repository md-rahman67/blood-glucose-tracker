import { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Divider
} from '@mui/material';
import BackButton from '../components/BackButton';

export default function PreviousMonthReports() {

    const [report, setReport] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/reports/previous-month');
                const jsonData = await response.json();

                if (!response.ok) {
                    throw new Error(jsonData.message || 'Unable to load report.');
                }

                setReport(jsonData);

            } catch (error) {
                setError(error.message);
                console.error('Error fetching data:', error);
            }
        };

        fetchData();

    }, []);

    if (error) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 5 }}>
                <BackButton fallbackTo="/" />
                <Typography sx={{ textAlign: 'center' }}>{error}</Typography>
            </Box>
        );
    }

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
                    Previous Whole Month Report
                </Typography>

                <Typography fontWeight="bold" mb={2}>
                    From: {report.from.split('T')[0]}
                </Typography>

                <Typography fontWeight="bold" mb={3}>
                    To: {report.to.split('T')[0]}
                </Typography>

                <Divider sx={{ mb: 3 }} />

                <Typography variant="h6" fontWeight="bold" mb={3}>
                    Report Summary
                </Typography>

                <Typography fontWeight="bold" mb={2}>
                    Maximum: {report.max === null ? '-' : `${report.max} mg/dL`}
                </Typography>

                <Typography fontWeight="bold" mb={2}>
                    Minimum: {report.min === null ? '-' : `${report.min} mg/dL`}
                </Typography>

                <Typography fontWeight="bold" mb={2}>
                    Average: {report.average === null ? '-' : `${report.average} mg/dL`}
                </Typography>

                <Typography fontWeight="bold" mb={3}>
                    Total Readings: {report.count}
                </Typography>

                <Divider sx={{ mb: 3 }} />

                <Typography variant="h6" fontWeight="bold" mb={3}>
                    Reading Details
                </Typography>

                {report.count === 0 ? (
                    <Typography mb={3}>
                        No readings found for the previous month.
                    </Typography>
                ) : (
                    report.readings.map((reading) => (
                        <Typography key={reading._id} mb={2}>
                            {reading.date.split('T')[0]} - {reading.slot}: {reading.value} mg/dL
                        </Typography>
                    ))
                )}

            </Paper>

        </Box>
    );
}
