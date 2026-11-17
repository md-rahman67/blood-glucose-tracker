const slots = [
    'Morning',
    'After breakfast',
    'After lunch',
    'After dinner'
];

const getCalendarDate = (date) => new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
}).format(date);

export const createSampleReadings = (userId, currentDate = new Date()) => {
    const [year, month, day] = getCalendarDate(currentDate).split('-').map(Number);
    const previousMonthStart = new Date(Date.UTC(year, month - 2, 1));
    const currentMonthStart = new Date(Date.UTC(year, month - 1, 1));
    const todayStart = new Date(Date.UTC(year, month - 1, day));
    const readings = [];

    const addDateRange = (startDate, endDate) => {
        for (let date = new Date(startDate); date < endDate; date.setUTCDate(date.getUTCDate() + 1)) {
            const dayNumber = date.getUTCDate();
            const monthNumber = date.getUTCMonth() + 1;
            const morningValue = 78 + ((dayNumber * 7 + monthNumber * 3) % 24);

            slots.forEach((slot, index) => {
                const mealAdjustment = [0, 25, 35, 28][index];
                readings.push({
                    date: new Date(date),
                    slot,
                    value: morningValue + mealAdjustment,
                    recordedBy: userId
                });
            });
        }
    };

    addDateRange(previousMonthStart, currentMonthStart);
    addDateRange(currentMonthStart, todayStart);

    const previousMonthEnd = new Date(currentMonthStart);
    previousMonthEnd.setUTCDate(previousMonthEnd.getUTCDate() - 1);

    const currentMonthEnd = new Date(todayStart);
    currentMonthEnd.setUTCDate(currentMonthEnd.getUTCDate() - 1);

    return {
        readings,
        previousMonth: {
            from: previousMonthStart,
            to: previousMonthEnd
        },
        currentMonth: {
            from: currentMonthStart,
            to: day === 1 ? null : currentMonthEnd
        }
    };
};
