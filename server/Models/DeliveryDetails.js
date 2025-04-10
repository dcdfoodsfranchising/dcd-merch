const mongoose = require('mongoose');

const deliveryDetailsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    addresses: [
        {
            firstName: { type: String, required: true },
            lastName: { type: String, required: true },
            email: { type: String, required: true },
            contactNumber: { type: String, required: true },
            houseNumber: { type: String, required: true },
            street: { type: String, required: true },
            barangay: { type: String, required: true },
            municipality: { type: String, required: true },
            city: { type: String, required: true },
            postalCode: { type: String, required: true },
        },
    ],
});

module.exports = mongoose.model('DeliveryDetails', deliveryDetailsSchema);
