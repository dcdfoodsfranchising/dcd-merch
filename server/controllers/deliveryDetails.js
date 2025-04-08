const DeliveryDetails = require('../Models/DeliveryDetails');
const Order = require('../Models/Order');

// Create or update delivery details for the user
module.exports.createOrUpdateDeliveryDetails = async (req, res) => {
    try {
        const { userId } = req.user; // Get userId from authenticated user
        const { firstName, lastName, email, contactNumber, houseNumber, street, barangay, municipality, city, postalCode } = req.body;

        // Check if the user already has delivery details
        let deliveryDetails = await DeliveryDetails.findOne({ userId });

        // If delivery details exist, update them
        if (deliveryDetails) {
            deliveryDetails.firstName = firstName;
            deliveryDetails.lastName = lastName;
            deliveryDetails.email = email;
            deliveryDetails.contactNumber = contactNumber;
            deliveryDetails.houseNumber = houseNumber;
            deliveryDetails.street = street;
            deliveryDetails.barangay = barangay;
            deliveryDetails.municipality = municipality;
            deliveryDetails.city = city;
            deliveryDetails.postalCode = postalCode;
            
            await deliveryDetails.save();
            return res.status(200).json({ message: 'Delivery details updated successfully', deliveryDetails });
        }

        // If no existing details, create new delivery details
        deliveryDetails = new DeliveryDetails({
            userId,
            firstName,
            lastName,
            email,
            contactNumber,
            houseNumber,
            street,
            barangay,
            municipality,
            city,
            postalCode
        });

        await deliveryDetails.save();
        return res.status(201).json({ message: 'Delivery details saved successfully', deliveryDetails });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

// Fetch delivery details for the logged-in user
module.exports.getDeliveryDetails = async (req, res) => {
    try {
        const { userId } = req.user;
        
        const deliveryDetails = await DeliveryDetails.findOne({ userId });

        if (!deliveryDetails) {
            return res.status(404).json({ message: 'No delivery details found for this user' });
        }

        return res.status(200).json({ deliveryDetails });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};
