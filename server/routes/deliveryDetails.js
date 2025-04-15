const express = require('express');
const router = express.Router();
const deliveryDetailsController = require('../controllers/deliveryDetails');
const { verify, verifyUser, verifyAdmin } = require("../middlewares/auth");

// ----------- USER ROUTES -----------

// Create or update delivery details
router.post('/delivery-details', verify, verifyUser, deliveryDetailsController.createOrUpdateDeliveryDetails);

// Get own delivery details
router.get('/delivery-details/user', verify, verifyUser, deliveryDetailsController.getUserDeliveryDetails);

// Delete own delivery details
router.delete('/delivery-details', verify, verifyUser, deliveryDetailsController.deleteDeliveryDetails);

// ----------- ADMIN ROUTES -----------

// Get all delivery details
router.get('/delivery-details', verify, verifyAdmin, deliveryDetailsController.getDeliveryDetailsForAdmin);

// Get delivery details by ID
router.get('/delivery-details/:id', verify, verifyAdmin, deliveryDetailsController.getDeliveryDetailsByIdForAdmin);

module.exports = router;
