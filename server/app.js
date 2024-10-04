const express = require("express");
const versionRouter = require("./routes/version.js");
const getFlights = require("./data-access/data.js");
const fs = require("fs").promises;
const flightRouter = require("./routes/flights.js");

const PORT = process.env.PORT || 3000;

const app = express();
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

async function getFlightData() {
  const data = await getFlights();
  return data;
}

function calculateDuration(departureTime, arrivalTime) {
  return arrivalTime - departureTime;
}

/**
 *
 * @param {*} duration hours
 * @param {*} carrier is 0.9
 * @param {*} distance miles
 */
function calculateScore(duration, carrier, distance) {
  return duration * carrier + distance;
}

function getDistanceBetweenAirports() {
  return 2;
}

app.use(versionRouter);

app.get("/flights", async (req, res) => {
  const flightData = await getFlightData();

  const { duration, carrier, minDepartureDateTime, maxDepartureDateTime } =
    req.query;
  if (!req.query.minDepartureDateTime) {
    res.status(404).json({
      success: false,
      msg: "Must Input minDepartureDateTime",
    });
  }
  if (!req.query.maxDepartureDateTime) {
    res.status(404).json({
      success: false,
      msg: "Must Input maxDepartureDateTime",
    });
  }
  if (!req.query.carrier) {
    res.status(404).json({
      success: false,
      msg: "Must Input Carrier",
    });
  }
  if (!req.query.duration) {
    res.status(404).json({
      success: false,
      msg: "Must Input Duration",
    });
  }

  for (let i = 0; i < flightData.length; i++) {
    let carrierScore = 1.0;
    if (flightData[i].carrier === carrier) {
      carrierScore = 0.9;
    }

    // calculate duration
    const departureDateTime = new Date(flightData[i].departureTime);
    const arrivalDateTime = new Date(flightData[i].arrivalTime);

    const durationMS = arrivalDateTime - departureDateTime;
    const durationHrs = Math.floor((durationMS / (1000 * 60 * 60)) % 24);

    const score = calculateScore(
      durationHrs,
      carrierScore,
      getDistanceBetweenAirports()
    );
    flightData[i].score = score;
  }

  flightData.sort(function (a, b) {
    return a.score - b.score;
  });
  // filter by departure max and departure min datetimes

  const result = flightData.filter((flight) => {
    return (
      flight.departureTime <= maxDepartureDateTime &&
      flight.departureTime >= minDepartureDateTime
    );
  });

  res.status(200).json({
    success: true,
    data: result,
  });
});

app.get("/domain", (req, res) => {
  const domain = req.hostname;
  res.send(`Domain: ${domain}`);
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}!`));
