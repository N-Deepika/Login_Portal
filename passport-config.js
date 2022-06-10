const LocalStrategy = require("passport-local").Strategy;
const { pool } = require("./database");
const bcrypt = require("bcrypt");

async function initialize(passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" , passwordField: "password" },
      async (email, password, done) => {
          console.log(email, password);
          pool.query(
              `SELECT * FROM "public.Users" WHERE email = $1`,
              [email],
              (err, results) => {
                  if (err) {
                      throw err;
                  }
                  console.log(results.rows);

                  if (results.rows.length > 0) {
                      const user = results.rows[0];

                      bcrypt.compare(password, user.password, (err, isMatch) => {
                          if (err) {
                              console.log(err);
                          }
                          if (isMatch) {
                              return done(null, user);
                          } else {
                              //password is incorrect
                              return done(null, false, {message: "Password is incorrect"});
                          }
                      });
                  } else {
                      // No user
                      return done(null, false, {
                          message: "No user with that email address"
                      });
                  }
              }
          );
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });
  passport.deserializeUser((user, done) =>{
          return done(null, user)
  });
}

module.exports = initialize;
