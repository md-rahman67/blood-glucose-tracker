import express from "express";
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const readings = [
  { id: 1, date: "2026-11-14", slot: "Morning", value: 110 },
  { id: 2, date: "2026-11-14", slot: "After breakfast", value: 145 },
  { id: 3, date: "2026-11-14", slot: "After lunch", value: 130 },
  { id: 4, date: "2026-11-14", slot: "After dinner", value: 120 },
  { id: 5, date: "2026-11-15", slot: "Morning", value: 105 },
  { id: 6, date: "2026-11-15", slot: "After breakfast", value: 138 },
];

app.get("/readings", (req, res) => {
  res.send(readings);
});

app.post("/readings", (req, res) => {
  const { date, slot, value } = req.body;
  const newReading = {
    id: readings.length + 1,
    date,
    slot,
    value
  };
  readings.push(newReading);
  res.status(201).send(newReading);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});     