import express from "express";
import mongoose from "mongoose";
import Reading from "./models/readings.model.js";
import passport from "passport";
import LocalStrategy from "passport-local";
import User from "./models/user.model.js";
import session from "express-session";
const app = express();
const PORT = 3000;

//*DB connection
main().then(() => console.log("connected")).catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/sweety');
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//* -SESSION INFO---------------------------------------------------------
const sessionOptions = {
  secret: "secretsdjciv8vnvri",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true
  }
}

app.use(session(sessionOptions))

//* PASSPORT CONFIG CODE ----------------------------------------------------------------------------------
app.use(passport.initialize()); //* use passport we configure this
app.use(passport.session()); //* if we using session write this
passport.use(new LocalStrategy(User.authenticate())); //* authenticate() generates a function that is used in passport's LocalStrategy;
passport.serializeUser(User.serializeUser()); //* track session / save s_id
passport.deserializeUser(User.deserializeUser()); //* session finished / delete s_id

//* -API ENDPOINTS-----------------------------------------------------------------------------
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