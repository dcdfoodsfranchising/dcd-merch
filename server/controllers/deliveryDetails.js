const DeliveryDetails = require('../Models/DeliveryDetails');

// Create or Update Delivery Details
exports.createOrUpdateDeliveryDetails = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      contactNumber,
      barangay,
      city,
      postalCode,
      completeAddress,
      tag,
      notesForRider
    } = req.body;

    const existingDetails = await DeliveryDetails.findOne({ user: req.user.id });

    if (existingDetails) {
      existingDetails.firstName = firstName;
      existingDetails.lastName = lastName;
      existingDetails.contactNumber = contactNumber;
      existingDetails.barangay = barangay;
      existingDetails.city = city;
      existingDetails.postalCode = postalCode;
      existingDetails.completeAddress = completeAddress;
      existingDetails.tag = tag;
      existingDetails.notesForRider = notesForRider;

      const updated = await existingDetails.save();
      return res.status(200).json({ message: 'Delivery details updated', deliveryDetails: updated });
    } else {
      const newDetails = new DeliveryDetails({
        user: req.user.id,
        firstName,
        lastName,
        contactNumber,
        barangay,
        city,
        postalCode,
        completeAddress,
        tag,
        notesForRider
      });

      const savedDetails = await newDetails.save();
      return res.status(201).json({ message: 'Delivery details created', deliveryDetails: savedDetails });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Get own delivery details (User)
exports.getUserDeliveryDetails = async (req, res) => {
  try {
    const details = await DeliveryDetails.findOne({ user: req.user.id });

    if (!details) {
      return res.status(404).json({ message: 'Delivery details not found' });
    }

    res.status(200).json(details);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete own delivery details (User)
exports.deleteDeliveryDetails = async (req, res) => {
  try {
    const deleted = await DeliveryDetails.findOneAndDelete({ user: req.user.id });

    if (!deleted) {
      return res.status(404).json({ message: 'No delivery details found to delete' });
    }

    res.status(200).json({ message: 'Delivery details deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all delivery details (Admin only)
exports.getDeliveryDetailsForAdmin = async (req, res) => {
  try {
    const details = await DeliveryDetails.find().populate('user', 'firstName lastName email');

    if (!details.length) {
      return res.status(404).json({ message: 'No delivery details found' });
    }

    res.status(200).json(details);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get delivery details by ID (Admin only)
exports.getDeliveryDetailsByIdForAdmin = async (req, res) => {
  try {
    const details = await DeliveryDetails.findById(req.params.id).populate('user', 'firstName lastName email');

    if (!details) {
      return res.status(404).json({ message: 'Delivery details not found' });
    }

    res.status(200).json(details);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
