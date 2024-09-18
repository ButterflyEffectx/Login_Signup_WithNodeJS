const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const connection = require("./db");

const tempelatePath = path.join(__dirname, "../templates");

app.use(express.json());
app.set("view engine", "hbs");
app.set("views", tempelatePath);
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("login");
});
app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/signup", async (req, res) => {
  const { name, password } = req.body;

  if (password.length < 7) {
    return res.render("signup", {
      error: "Password must be at least 7 characters long.",
    });
  }

  const checkUserQuery = 'SELECT * FROM LogInCollection WHERE name = ?';
  connection.query(checkUserQuery, [name], (err, result) => {
    if (err) {
      console.error('Error checking username:', err);
      res.send("Error occurred, please try again.");
    } else if (result.length > 0) {
        res.send("Username already exists, please choose another one.");
      return res.render("signup", {
        error: "Username already exists, please choose another one.",
      });
    } else {
      const insertUser = (name, password) => {
        const query = 'INSERT INTO LogInCollection (name, password) VALUES (?, ?)';
        connection.query(query, [name, password], (err, result) => {
          if (err) {
            console.error('Failed to insert user:', err);
            res.send("Signup failed, please try again.");
          } else {
            console.log('User inserted successfully!');
            res.render("home");
          }
        });
      };

      insertUser(name, password);
    }
  });
});

app.all("/login", async (req, res) => {
  if (req.method === "GET") {
    res.render("login");
  } else if (req.method === "POST") {
    const { name, password } = req.body;

    const query = 'SELECT * FROM LogInCollection WHERE name = ?';
    connection.query(query, [name], (err, result) => {
      if (err) {
        res.send('Error occurred during login: ' + err.message);
      } else if (result.length > 0 && result[0].password === password) {
        res.render("home", { name });
        console.log(result);
      } else {
        res.render("loginErr");
      }
    });
  }
});

app.get("/logout", (req, res) => {
  res.redirect("/login");
});

app.listen(3000, () => {
  console.log("Port Connected at the following website http://localhost:3000/");
});
