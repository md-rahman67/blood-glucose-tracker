import { Router } from "express";
import Reading from "../models/readings.model.js";

const router = Router();

//*------------ REPORTS --------------------------------------

router.get("/reports/daily", async (req, res) => {
  try {

    if (!req.user) {
      return res.status(401).json({ message: "please login first" });
    }

    const { date } = req.query;

    // Create date range
    const startDate = new Date(`${date}T00:00:00.000Z`);
    const endDate = new Date(startDate);
    endDate.setUTCDate(endDate.getUTCDate() + 1);

    // Fetch selected date readings of logged-in user
    const readings = await Reading.find({
      recordedBy: req.user._id,
      date: {
        $gte: startDate,
        $lt: endDate
      }
    });

    if (readings.length === 0) {
      return res.status(200).json({
        count: 0,
        max: null,
        min: null,
        average: null,
        readings: []
      });
    }

    const values = readings.map((reading) => reading.value);

    const min = Math.min(...values);
    const max = Math.max(...values);

    const average = Number(
      (values.reduce((sum, value) => sum + value) / values.length).toFixed(1)
    );

    res.status(200).json({
      count: readings.length,
      max,
      min,
      average,
      readings,
    });


  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
})

router.get("/reports/month-to-date", async (req, res) => {

  try {


    if (!req.user) {
      return res.status(400).json({ message: "Please login first" });
    }

    const { date } = req.query;

    console.log(date);

    const startDate = new Date(`${date.slice(0, 7)}-01T00:00:00.000Z`);
    const endDate = new Date(`${date}T00:00:00.000Z`);
    endDate.setUTCDate(endDate.getUTCDate() + 1);

    console.log(startDate);
    console.log(endDate);

    // Fetch selected date readings of logged-in user
    const readings = await Reading.find({
      recordedBy: req.user._id,
      date: {
        $gte: startDate,
        $lt: endDate
      }
    });
    if (readings.length === 0) {
      return res.status(200).json({
        from: startDate,
        to: endDate,
        count: 0,
        max: null,
        min: null,
        average: null,
        readings: []
      });
    }

    const values = readings.map((reading) => reading.value);

    const min = Math.min(...values);
    const max = Math.max(...values);

    const average = Number(
      (values.reduce((sum, value) => sum + value) / values.length).toFixed(1)
    );

    res.status(200).json({
      count: readings.length,
      max,
      min,
      average,
      readings,
      from: startDate,
      to: endDate
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }

})

router.get("/reports/previous-month", async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Please login first" });
    }

    const currentDate = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(new Date());

    const [year, month] = currentDate.split("-").map(Number);
    const from = new Date(Date.UTC(year, month - 2, 1));
    const endExclusive = new Date(Date.UTC(year, month - 1, 1));
    const to = new Date(endExclusive);
    to.setUTCDate(to.getUTCDate() - 1);

    const readings = await Reading.find({
      recordedBy: req.user._id,
      date: {
        $gte: from,
        $lt: endExclusive
      }
    });

    if (readings.length === 0) {
      return res.status(200).json({
        from,
        to,
        count: 0,
        max: null,
        min: null,
        average: null,
        readings: []
      });
    }

    const values = readings.map((reading) => reading.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const average = Number(
      (values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(1)
    );

    res.status(200).json({
      from,
      to,
      count: readings.length,
      max,
      min,
      average,
      readings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
