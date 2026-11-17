import { Router } from "express";
import Reading from "../models/readings.model.js";

const router = Router();

const allowedSlots = [
  "Morning",
  "After breakfast",
  "After lunch",
  "After dinner"
];

//* display user's all readings
router.get("/readings", async (req, res) => {

  if (!req.user) {
    return res.status(401).json({ message: "Please login first" });
  }

  const readings = await Reading.find({
    recordedBy: req.user._id
  }).populate("recordedBy");

  // console.log(readings);
  res.json(readings);
});


//* Add new readings
router.post("/readings", async (req, res) => {
  try {

    // user must be login to create readings
    if (!req.user) {
      return res.status(401).json({ message: "please login first" });
    }

    // data from frontend
    const { date, slot, value } = req.body;

    //checking valid slots
    if (!allowedSlots.includes(slot)) {
      return res.status(400).json({ message: "Slots does not exist" });
    }

    //selected start date and end date
    const startDate = new Date(`${date}T00:00:00.000Z`);
    const endDate = new Date(startDate);
    endDate.setUTCDate(endDate.getUTCDate() + 1);

    //checking is date valid? or not
    if (isNaN(startDate.getTime())) {
      return res.status(400).json({ message: "Invalid date" });
    }

    // checking whether selected date is today
    const todayDate = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(new Date());

    if (date !== todayDate) {
      return res.status(400).json({
        message: "You can only add readings for today"
      });
    }

    //fetch users existings readings of the dat
    const existingReadings = await Reading.find({
      recordedBy: req.user._id,
      date: {
        $gte: startDate,
        $lt: endDate
      }
    });

    //check users todays slot limits
    if (existingReadings.length >= 4) {
      return res.status(400).json({ message: "Daily limit is reached" });
    }

    // check for duplicateSLots
    const duplicateSlot = existingReadings.some((reading) => reading.slot === slot);

    if (duplicateSlot) {
      return res.status(400).json({ message: "you already used this slot of the day" });
    }


    // save new readings
    const newReading = await Reading.create({
      recordedBy: req.user._id,
      date,
      slot,
      value: Number(value)
    });

    res.status(201).json({ message: "Readings added Succesfully", newReading });

  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});



//* Delete readings
router.delete("/readings/:id", async (req, res) => {
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
router.get("/readings/:id", async (req, res) => {
  const readingsId = req.params.id;
  const single = await Reading.findById(readingsId);

  if (single) {
    res.status(200).json(single);
  } else {
    res.status(404).json({ message: "Reading not found" });
  }
});

//* edit readings
router.put("/readings/:id", async (req, res) => {
  try {
    const readingsId = req.params.id;
    const { date, slot, value } = req.body;

    //selected start date and end date
    const startDate = new Date(`${date}T00:00:00.000Z`);
    const endDate = new Date(startDate);
    endDate.setUTCDate(endDate.getUTCDate() + 1);

    //checking is date valid? or not
    if (isNaN(startDate.getTime())) {
      return res.status(400).json({ message: "Invalid date" });
    }

    // checking whether selected date is today
    const todayDate = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(new Date());

    if (date !== todayDate) {
      return res.status(400).json({
        message: "You can only edit readings for today"
      });
    }

    //fetch users existings readings of the dat
    const existingReadings = await Reading.find({
      recordedBy: req.user._id,
      date: {
        $gte: startDate,
        $lt: endDate
      }
    });

    //check users todays slot limits
    if (existingReadings.length >= 4) {
      return res.status(400).json({ message: "Daily limit is reached" });
    }

    // check for duplicateSLots
    const duplicateSlot = existingReadings.some((reading) => reading.slot === slot);

    if (duplicateSlot) {
      return res.status(400).json({ message: "you already used this slot of the day" });
    }


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

export default router;
