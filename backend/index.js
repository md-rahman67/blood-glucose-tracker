import express from "express";
import mongoose from "mongoose";
import Reading from "./models/readings.model.js";
const app = express();
const PORT = 3000;

//*DB connection
main().then(() => console.log("connected")).catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/sweety');
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const readings = [
//   { id: 1, date: "2026-11-14", slot: "Morning", value: 110 },
//   { id: 2, date: "2026-11-14", slot: "After breakfast", value: 145 },
//   { id: 3, date: "2026-11-14", slot: "After lunch", value: 130 },
//   { id: 4, date: "2026-11-14", slot: "After dinner", value: 120 },
//   { id: 5, date: "2026-11-15", slot: "Morning", value: 105 },
//   { id: 6, date: "2026-11-15", slot: "After breakfast", value: 138 },
// ];

//* display all readings
app.get("/readings", async (req, res) => {
  const reading = await Reading.find();
  res.send(reading);
});

//* Add new readings
app.post("/readings", async (req, res) => {
  try {
    const { date, slot, value } = req.body;

    const newReading = await Reading.create({
      date,
      slot,
      value: Number(value)
    });

    res.status(201).json(newReading);

  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});


//* Delete readings
app.delete("/readings/:id", async (req, res) => {
  try {
    const readingsId = req.params.id;

    const deleted = await Reading.findByIdAndDelete(readingsId);

    if (!deleted) {
      return res.status(404).json({
        message: "Reading not found"
      });
    }

    res.status(200).json({
      message: "Reading deleted successfully"
    });

  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

//* View Single readings
app.get("/readings/:id", async (req, res) => {
  const readingsId = req.params.id;
  const single = await Reading.findById(readingsId);

  if (single) {
    res.status(200).json(single);
  } else {
    res.status(404).json({ message: "Reading not found" });
  }
});

//* edit readings
app.put("/readings/:id", async (req, res) => {
  try {
    console.log("PUT route hit!");
    const readingsId = req.params.id;
    const { date, slot, value } = req.body;
    console.log("ID received:", readingsId);
    const updated = await Reading.findByIdAndUpdate(
      readingsId,
      {
        $set: {
          date,
          slot,
          value: Number(value)
        }
      },
      {
        returnDocument: "after"
      }
    );

    if (!updated) {
      return res.status(404).json({
        message: "Reading not found"
      });
    }

    res.status(200).json({
      message: "Successfully updated reading",
      updated
    });

  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});     