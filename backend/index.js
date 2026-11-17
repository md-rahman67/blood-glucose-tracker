import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { fileURLToPath } from "node:url";
import readingsRoutes from "./routes/readings.js";
import userRoutes from "./routes/user.js";
import reportsRoutes from "./routes/reports.js";
import passport from "passport";
import LocalStrategy from "passport-local";
import User from "./models/user.model.js";
import session from "express-session";

dotenv.config({ path: fileURLToPath(new URL("./.env", import.meta.url)) });

const app = express();
const PORT = Number(process.env.PORT) || 3000;

//*DB connection
main().then(() => console.log("connected")).catch(() => console.error("MongoDB connection failed. Check MONGODB_URI."));
async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//* -SESSION INFO---------------------------------------------------------
const sessionOptions = {
  secret: process.env.SESSION_SECRET,
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
