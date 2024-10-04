const express = require("express");
const service = require("../controllers/index.js");
const router = express.Router();

router.get("/version", async (req, res) => {
  try {
    const version = await service.getVersion();
    res.status(200).json({
      success: true,
      data: version,
    });
  } catch {
    res.status(404).json({
      success: false,
      msg: "Something happened, please try again later",
    });
  }
});

module.exports = router;
