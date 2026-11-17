import { Router } from "express";
import passport from "passport";
import User from "../models/user.model.js";

const router = Router();

//* USER MODAL API ENDPOINTS ----------------------------------------------------------
router.post("/signup", async (req, res) => {
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


router.post("/login", passport.authenticate("local"), (req, res) => {
  res.json({
    message: "Login Successful",
    user: req.user
  });
})

router.post("/logout", (req, res) => {
  req.logout((err) => {

    if (err) {
      return res.status(500).json({ message: err.message });
    }

    res.status(200).json({ message: "Logout successful" });
  })
})

router.get("/curr-user", (req, res) => {
  res.json({
    user: req.user || null,
  });
})

export default router;
