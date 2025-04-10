const express = require('express');
const router = express.Router();
const { createOrUpdateDeliveryDetails, getDeliveryDetails, getDeliveryDetailsByAdmin } = require('../controllers/deliveryDetails');
const { verify, verifyAdmin } = require('../middlewares/auth');

// Route to create or update delivery details (for logged-in user)
router.post('/delivery-details', verify, createOrUpdateDeliveryDetails);

// Route to get delivery details of the logged-in user
router.get('/delivery-details', verify, getDeliveryDetails);

// Route to get delivery details by userId (for admin)
router.get('/delivery-details/:userId', verify, verifyAdmin, getDeliveryDetailsByAdmin);

module.exports = router;
