import { useState } from 'react';


export default function Form({ setData }) {

    const [formData, setFormData] = useState({
        date: '',
        slot: '',
        value: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle form submission logic here
        try {
            const response = await fetch('/api/readings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            setData((prevData) => [...prevData, result]);
            setFormData({
                date: '',
                slot: '',
                value: ''
            });

        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>

            <label htmlFor="date">Date:</label>
            <input
                id="date"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
            />

            <br />

            <label htmlFor="slot">Slot:</label>
            <select
                id="slot"
                name="slot"
                value={formData.slot}
                onChange={handleChange}
                required
            >
                <option value="">Select a slot</option>
                <option value="Morning">Morning</option>
                <option value="After breakfast">After breakfast</option>
                <option value="After lunch">After lunch</option>
                <option value="After dinner">After dinner</option>
            </select>

            <br />

            <label htmlFor="value">Value:</label>
            <input
                type="number"
                name="value"
                placeholder="Glucose value (mg/dL)"
                value={formData.value}
                onChange={handleChange}
                min="40"
                max="600"
                step="1"
                required
            />

            <button type="submit">Save Reading</button>
        </form>
    );
}