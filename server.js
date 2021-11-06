if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const { pool }=require("./database");
const { urlencoded } = require("express");
const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const session = require("express-session");
const flash = require("express-flash");
const methodOverride = require("method-override");

const PORT = process.env.PORT || 4000;
const app = express();


const initializePassport = require("./passport-config");
initializePassport(
  passport
);

app.set("view-engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(flash());
app.use(methodOverride("_method"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.get("/", checkAuthenticated, async (req, res) => {
  res.render("index.ejs", { name: req.user.username });
});
app.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login.ejs");
});

app.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("register.ejs");
});
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
  })
);

app.post("/register", checkNotAuthenticated, async (req, res) => {
  let { username, email, password} = req.body;

  let errors = [];

  console.log({
    username,
    email,
    password,

  });

  if (!username || !email || !password ) {
    errors.push({ message: "Please enter all fields" });
  }

  if (password.length < 6) {
    errors.push({ message: "Password must be a least 6 characters long" });
  }


  let hashedPassword;
  if (errors.length > 0) {
    res.render("register", {errors, username, email, password});
  } else {
    hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    // Validation passed
    pool.query(
        `SELECT * FROM users
        WHERE email = $1`,
        [email],
        (err, results) => {
          if (err) {
            console.log(err);
          }
          console.log(results.rows);

          if (results.rows.length > 0) {
            return res.render("register", {
              message: "Email already registered"
            });
          } else {
            pool.query(
                `INSERT INTO users (username, email, password)
                VALUES ($1, $2, $3)
                RETURNING id, password`,
                [username, email, hashedPassword],
                (err, results) => {
                  if (err) {
                    throw err;
                  }
                  console.log(results.rows);
                  req.flash("success_msg", "You are now registered. Please log in");
                  res.redirect("/login");
                }
            );
          }
        }
    );
  }
});

app.delete("/logout", (req, res) => {
  req.logOut();
  res.redirect("/login");
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
