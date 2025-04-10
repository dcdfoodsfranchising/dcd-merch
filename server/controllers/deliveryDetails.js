const DeliveryDetails = require('../Models/DeliveryDetails');
const Order = require('../Models/Order');

// Create or update delivery details for the user
module.exports.createOrUpdateDeliveryDetails = async (req, res) => {
    try {
        const userId = req.user.id; // Get userId from authenticated user
        if (!userId) {
            return res.status(400).json({ message: 'User ID is missing or invalid' });
        }

        const { addressId, firstName, lastName, email, contactNumber, houseNumber, street, barangay, municipality, city, postalCode } = req.body;

        // Find user’s delivery details
        let deliveryDetails = await DeliveryDetails.findOne({ userId });

        // If delivery details do not exist, create new deliveryDetails
        if (!deliveryDetails) {
            deliveryDetails = new DeliveryDetails({ userId, addresses: [] });
        }

        // If addressId is provided, find the address and update it
        if (addressId) {
            const addressIndex = deliveryDetails.addresses.findIndex(address => address._id.toString() === addressId);
            if (addressIndex !== -1) {
                // Update existing address
                deliveryDetails.addresses[addressIndex] = {
                    firstName,
                    lastName,
                    email,
                    contactNumber,
                    houseNumber,
                    street,
                    barangay,
                    municipality,
                    city,
                    postalCode,
                };
                await deliveryDetails.save();
                return res.status(200).json({ message: 'Delivery address updated successfully', deliveryDetails });
            } else {
                return res.status(404).json({ message: 'Address not found' });
            }
        } else {
            // If no addressId, create a new address
            deliveryDetails.addresses.push({
                firstName,
                lastName,
                email,
                contactNumber,
                houseNumber,
                street,
                barangay,
                municipality,
                city,
                postalCode,
            });
            await deliveryDetails.save();
            return res.status(201).json({ message: 'New delivery address added successfully', deliveryDetails });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};



// Fetch delivery details for the logged-in user
module.exports.getDeliveryDetails = async (req, res) => {
    try {
        const userId = req.user.id; // Get userId from authenticated user

        // Find delivery details for the logged-in user
        const deliveryDetails = await DeliveryDetails.findOne({ userId });

        if (!deliveryDetails || deliveryDetails.addresses.length === 0) {
            return res.status(404).json({ message: 'No delivery details found for this user' });
        }

        return res.status(200).json({ deliveryDetails: deliveryDetails.addresses });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};


// Admin: Get delivery details by user ID
module.exports.getDeliveryDetailsByAdmin = async (req, res) => {
    try {
        const { userId } = req.params; // Get userId from request params

        // Find delivery details by userId
        const deliveryDetails = await DeliveryDetails.findOne({ userId });

        if (!deliveryDetails || deliveryDetails.addresses.length === 0) {
            return res.status(404).json({ message: 'No delivery details found for this user' });
        }

        return res.status(200).json({ deliveryDetails: deliveryDetails.addresses });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

