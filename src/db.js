const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "127.0.0.1",
  port: 3307,
  user: "root",
  password: "admin",
  database: "LoginSignup",
  connectionLimit: 10,
});

connection.connect((err) => {
    if (err) {
      console.error("Error connecting to the database:", err);
    } else {
      console.log("Connected to the MySQL server.");
    }
  });
  

const createTableQuery = `
        CREATE TABLE IF NOT EXISTS LogInCollection (
            id INTEGER PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL
        )
    `;

connection.query(createTableQuery, (err, result) => {
  if (err) {
    console.error("Failed to create table:", err);
  } else {
    console.log("Table created successfully!");
  }
});


module.exports = connection;
