import mongoose from 'mongoose';

const readingSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },

    slot: {
        type: String,
        required: true,
        enum: [
            'Morning',
            'After breakfast',
            'After lunch',
            'After dinner'
        ]
    },

    value: {
        type: Number,
        required: true,
        min: 40,
        max: 600,
        validate: {
            validator: Number.isInteger,
            message: 'Value must be a whole number'
        }
    }
});

const Reading = mongoose.model('Reading', readingSchema);

export default Reading;