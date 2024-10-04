const getVersion = require("./getVersion.js");
const getFlights = require("./getFlights.js");

const service = Object.freeze({
  getVersion,
  getFlights,
});

module.exports = service;
