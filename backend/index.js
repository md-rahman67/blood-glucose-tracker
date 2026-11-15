import express from "express";
import mongoose from "mongoose";
const app = express();
const PORT = 3000;

//*DB connection
main().then(() => console.log("connected")).catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/sweety');
}

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

//* display all readings
app.get("/readings", (req, res) => {
  res.send(readings);
});

//* Add new readings
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

//* Delete readings
app.delete("/readings/:id", (req, res) => {
  const readingsId = parseInt(req.params.id);
  const index = readings.findIndex((reading) => reading.id === readingsId)

  if (index !== -1) {
    readings.splice(index, 1);
    res.status(200).send({ message: "reading deleted successfully" });
  } else {
    res.status(404).send({ message: "reading not found" });
  }
})

//* View Single readings
app.get("/readings/:id", (req, res) => {
  const readingsId = parseInt(req.params.id);
  const single = readings.find((r) => r.id === readingsId);

  if (single) {
    res.status(200).json(single);
  } else {
    res.status(404).json({ message: "Reading not found" });
  }
});

//* edit readings
app.put("/readings/:id", (req, res) => {
  const readingsId = parseInt(req.params.id);
  const { date, slot, value } = req.body;
  const index = readings.findIndex((reading) => reading.id === readingsId);


  if (index === -1) {
    return res.status(404).json({
      message: "Reading not found"
    });
  }

  readings[index] = {
    id: readingsId,
    date: date,
    slot: slot,
    value: value
  };

  res.status(200).json({ message: "Successfully Updated readings" });

})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});     