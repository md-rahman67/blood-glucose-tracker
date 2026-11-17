import express from "express";
import mongoose from "mongoose";
import readingsRoutes from "./routes/readings.js";
import userRoutes from "./routes/user.js";
import reportsRoutes from "./routes/reports.js";
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

//* -API ENDPOINTS

app.use(readingsRoutes);
app.use(userRoutes);
app.use(reportsRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
