const express = require("express");
const router = express.Router();
const dashboardController = require('../controllers/dashboard');
const { verify, verifyAdmin } = require("../middlewares/auth"); 

router.get("/summary", verify, verifyAdmin, dashboardController.getDashboardSummary); 

module.exports = router;
