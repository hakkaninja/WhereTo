const express = require("express");
const service = require("../controllers/index.js");
const router = express.Router();

router.get("/flights", async (req, res) => {
  try {
    const flights = await service.getFlights();
    res.status(200).json({
      success: true,
      data: flights,
    });
  } catch {
    res.status(404).json({
      success: false,
      msg: "Something happened, please try again later",
    });
  }
});

module.exports = router;
