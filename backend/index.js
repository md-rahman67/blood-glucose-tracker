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

const allowedSlots = [
  "Morning",
  "After breakfast",
  "After lunch",
  "After dinner"
];

//* display user's all readings
app.get("/readings", async (req, res) => {

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
app.post("/readings", async (req, res) => {
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
    const readingsId = req.params.id;
    const { date, slot, value } = req.body;
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

//* USER MODAL API ENDPOINTS ----------------------------------------------------------
app.post("/signup", async (req, res) => {
  try {
    let { username, email, password } = req.body;

    let newUser = new User({
      username: username,
      email: email
    });

    let registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }

      res.status(201).json({
        message: "Signup successful",
        user: req.user
      });
    });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }

});


app.post("/login", passport.authenticate("local"), (req, res) => {
  res.json({
    message: "Login Successful",
    user: req.user
  });
})

app.post("/logout", (req, res) => {
  req.logout((err) => {

    if (err) {
      return res.status(500).json({ message: err.message });
    }

    res.status(200).json({ message: "Logout successful" });
  })
})

app.get("/curr-user", (req, res) => {
  res.json({
    user: req.user || null,
  });
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});     