const express = require('express');
const router = express.Router();
const deliveryDetailsController = require('../controllers/deliveryDetails');
const { verify, verifyUser, verifyAdmin } = require("../middlewares/auth");

// Create or update delivery details
router.post('/delivery-details', verify, verifyUser, deliveryDetailsController.createOrUpdateDeliveryDetails);

// Get delivery details
router.get('/delivery-details', verify, verifyAdmin,  deliveryDetailsController.getDeliveryDetails);

module.exports = router;
