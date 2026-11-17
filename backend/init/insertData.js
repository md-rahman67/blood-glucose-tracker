import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { fileURLToPath } from 'node:url';
import User from '../models/user.model.js';
import Reading from '../models/readings.model.js';
import { createSampleReadings } from './data.js';

dotenv.config({ path: fileURLToPath(new URL('../.env', import.meta.url)) });

const requiredVariables = [
    'MONGODB_URI',
    'DEMO_USERNAME',
    'DEMO_EMAIL',
    'DEMO_PASSWORD'
];

const formatDate = (date) => date ? date.toISOString().slice(0, 10) : 'no current-month dates yet';

const addDemoUser = async () => {
    const { DEMO_USERNAME, DEMO_EMAIL, DEMO_PASSWORD } = process.env;
    let demoUser = await User.findOne({ username: DEMO_USERNAME });

    if (demoUser && demoUser.email !== DEMO_EMAIL) {
        throw new Error('The configured demo username already belongs to a different email.');
    }

    if (!demoUser) {
        demoUser = await User.register(
            new User({
                username: DEMO_USERNAME,
                email: DEMO_EMAIL
            }),
            DEMO_PASSWORD
        );
    } else {
        demoUser.email = DEMO_EMAIL;
        await demoUser.setPassword(DEMO_PASSWORD);
        await demoUser.save();
    }

    return demoUser;
};

const addMissingReadings = async (readings) => {
    let added = 0;
    let alreadyPresent = 0;

    for (const reading of readings) {
        const existingReading = await Reading.findOne({
            recordedBy: reading.recordedBy,
            date: reading.date,
            slot: reading.slot
        });

        if (existingReading) {
            alreadyPresent += 1;
            continue;
        }

        await Reading.create(reading);
        added += 1;
    }

    return { added, alreadyPresent };
};

const seed = async () => {
    const missingVariables = requiredVariables.filter((name) => !process.env[name]);

    if (missingVariables.length > 0) {
        throw new Error(`Missing required environment variables: ${missingVariables.join(', ')}`);
    }

    await mongoose.connect(process.env.MONGODB_URI);

    const demoUser = await addDemoUser();
    const sampleData = createSampleReadings(demoUser._id);
    const readingCounts = await addMissingReadings(sampleData.readings);

    console.log('Demo user is ready.');
    console.log(`Previous month: ${formatDate(sampleData.previousMonth.from)} to ${formatDate(sampleData.previousMonth.to)}.`);
    console.log(`Current month through yesterday: ${formatDate(sampleData.currentMonth.from)} to ${formatDate(sampleData.currentMonth.to)}.`);
    console.log(`Readings added: ${readingCounts.added}; already present: ${readingCounts.alreadyPresent}.`);
};

try {
    await seed();
} catch (error) {
    console.error(`Seed failed (${error.name}). Check the required environment variables and MongoDB connection.`);
    process.exitCode = 1;
} finally {
    await mongoose.disconnect();
}
