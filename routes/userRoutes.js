const express = require("express");
const passport = require("passport");

const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const User = require("../mongodb/models/user");

const app = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Facebook login route with Passport.js configuration
app.get("/facebook", (req, res, next) => {
  passport.use(
    new FacebookStrategy(
      {
        clientID: "985004899523460",
        clientSecret: "82e15cc40021bc23c4b2156a1337cccc",
        callbackURL: "/auth/facebook/callback",
      },
      (accessToken, refreshToken, profile, done) => {
        // Find or create a user based on the Facebook profile
        User.findOne({ "facebook.id": profile.id }, (err, user) => {
          if (err) return done(err);
          if (user) return done(null, user);

          // Create a new user with Facebook details
          const newUser = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            facebook: {
              id: profile.id,
              token: accessToken,
              email: profile.emails[0].value,
              name: profile.displayName,
            },
          });

          // Save the user
          newUser.save((err) => {
            if (err) return done(err);
            return done(null, newUser);
          });
        });
      }
    )
  );

  // Authenticate with Facebook
  passport.authenticate("facebook")(req, res, next);
});

// Google login route with Passport.js configuration
app.get("/google", (req, res, next) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
      },
      (accessToken, refreshToken, profile, done) => {
        // Find or create a user based on the Google profile
        User.findOne({ "google.id": profile.id }, (err, user) => {
          if (err) return done(err);
          if (user) return done(null, user);

          // Create a new user with Google details
          const newUser = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            google: {
              id: profile.id,
              token: accessToken,
              email: profile.emails[0].value,
              name: profile.displayName,
            },
          });

          // Save the user
          newUser.save((err) => {
            if (err) return done(err);
            return done(null, newUser);
          });
        });
      }
    )
  );

  // Authenticate with Google
  passport.authenticate("google", { scope: ["profile", "email"] })(
    req,
    res,
    next
  );
});

// Email signup route without Passport.js configuration
app.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if a user with the provided email already exists
    const existingUser = await User.findOne({ email });

    // If a user with the email already exists, return an error
    if (!existingUser) {
      return res.status(404).json({ message: "No user" });
    }
    console.log(existingUser)
    if (bcrypt.compareSync(password, existingUser.password)
    ) {
      const JWTtoken = jwt.sign(
        {
          userId: existingUser._id,
          email: existingUser.email,

        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );
      // Return the newly created user
      return res.send({ user: { firstName: existingUser.firstName, email: existingUser.email }, token: JWTtoken });
    }
    else {
      return res.status(404).send({ message: "User not found" });

    }

  } catch (err) {
    return next(err);
  }
});
app.post("/signup", async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if a user with the provided email already exists
    const existingUser = await User.findOne({ email });

    // If a user with the email already exists, return an error
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }
    const hash = bcrypt.hashSync(password, 10);
    // Create a new user with the provided email and password
    console.log(hash);
    const newUser = new User({ firstName, lastName, email, password: hash });

    // Save the new user to the database
    await newUser.save();
    const JWTtoken = jwt.sign(
      {
        userId: newUser._id,
        email: newUser.email,

      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    // Return the newly created user
    return res.send({ user: { firstName: newUser.firstName, email: newUser.email }, token: JWTtoken });
  } catch (err) {
    return next(err);
  }
});
app.get("/count", async (req, res) => {
  try {
    const count = await User.countDocuments({});
    // console.log(count)
    res.json({ count: count });
  } catch (error) {
    console.error("Error getting user count:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = app;