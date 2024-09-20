const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const encoder = bodyParser.urlencoded();
const port = 8080;

const app = express();

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "VqTjj9B8!",
  database: "userinfo"
});

// connect to the database
connection.connect(function (error) {
  if (error) throw error
  else console.log("Connected to the database successfully")
});


app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html")

});

app.post("/", encoder, function (req, res) {
  var username = req.body.username;
  var password = req.body.password;

  connection.query("select * from logininfo where username = ? and password = ?", [username, password], function (error, results, fields) {
    if (results.length > 0) {
      res.redirect("/profile")
    } else {
      res.redirect("/profile")
    }
    res.end();
  })
});


// successful login
app.get("/profile", function (req, res) {
  res.sendFile(__dirname + "/profile.html")
});


// set app port
app.listen(port, '0.0.0.0', () => {
  console.log('Server is running on ${port}')
});