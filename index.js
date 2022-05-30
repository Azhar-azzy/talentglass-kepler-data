const fs = require("fs");
const express = require("express");
var router = express.Router();
const { parse } = require("csv-parse");
const csv = require("csv-parser");

const app = express();
app.set("view engine", "ejs");

app.get("/", function (req, res, next) {
  const data = [];
  const planets = [];
  fs.createReadStream("./kepler_data.csv")
    .pipe(csv())
    .on("data", function (row, index) {
      if (
        row["koi_disposition"] === "CONFIRMED" &&
        row["koi_insol"] >= 0.36 &&
        row["koi_insol"] <= 1.11 &&
        row["koi_prad"] < 1.6
      ) {
        data.push(row);
        planets.push(row["kepoi_name"]);
      }
    })
    .on("end", async function () {
      res.render("./data", { result: data });
      console.log(planets);
    })
    .on("error", function (error) {
      console.log(error.message);
    });
});

app.listen(5000, () => console.log("Server listening on port 5000!"));
