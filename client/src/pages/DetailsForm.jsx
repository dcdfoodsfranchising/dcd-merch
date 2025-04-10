import React, { useEffect, useState } from 'react';
import { getOwnDeliveryDetails, saveDeliveryDetails } from '../services/deliveryDetailsService';
import Swal from 'sweetalert2';
import { FaEdit } from 'react-icons/fa'; // Import edit icon
import Modal from 'react-modal';

const DeliveryDetails = () => {
    const [deliveryDetails, setDeliveryDetails] = useState(null);
    const [formData, setFormData] = useState({
        fullName: '',
        mobileNo: '',
        street: '',
        barangay: '',
        city: '',
        province: '',
        zipCode: '',
    });
    const [isEditMode, setIsEditMode] = useState(false); // State to toggle between add/edit mode
    const [currentAddressId, setCurrentAddressId] = useState(null); // To track which address is being edited
    const [isModalOpen, setIsModalOpen] = useState(false); // To control modal visibility

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const details = await getOwnDeliveryDetails();
                setDeliveryDetails(details);

                // Handle the case where details are loaded but no addresses are available
                if (details && details.length > 0) {
                    setFormData(details[0]); // Assuming the first address is the one we are editing
                }
            } catch (error) {
                console.error(error.message);
            }
        };

        fetchDetails();
    }, []);

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await saveDeliveryDetails(formData); // Save delivery details (add or update based on logic)
            Swal.fire('Success!', 'Delivery details saved successfully!', 'success');
            setIsModalOpen(false); // Close modal after saving
        } catch (error) {
            Swal.fire('Error', error.message || 'Something went wrong', 'error');
        }
    };

    const handleEdit = (addressId) => {
        setIsEditMode(true);
        setCurrentAddressId(addressId); // Set the address ID to edit
        const addressToEdit = deliveryDetails.find(address => address._id === addressId);
        setFormData(addressToEdit);
        setIsModalOpen(true); // Open modal in edit mode
    };

    const handleAdd = () => {
        setIsEditMode(false);
        setFormData({
            fullName: '',
            mobileNo: '',
            street: '',
            barangay: '',
            city: '',
            province: '',
            zipCode: '',
        });
        setIsModalOpen(true); // Open modal for adding a new address
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 px-6">
            <h2 className="text-2xl font-semibold text-center mb-6">Delivery Details</h2>

            {/* Display existing address if any */}
            {deliveryDetails && deliveryDetails.length > 0 ? (
                <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
                    <h3 className="text-xl font-medium mb-4">Saved Address</h3>
                    <div className="flex justify-between items-center">
                        <div>
                            <p><strong>Name:</strong> {deliveryDetails[0].fullName}</p>
                            <p><strong>Mobile:</strong> {deliveryDetails[0].mobileNo}</p>
                            <p><strong>Address:</strong> {`${deliveryDetails[0].street}, ${deliveryDetails[0].barangay}, ${deliveryDetails[0].city}, ${deliveryDetails[0].province}, ${deliveryDetails[0].zipCode}`}</p>
                        </div>
                        <button
                            onClick={() => handleEdit(deliveryDetails[0]._id)} // Trigger edit mode
                            className="text-blue-500 hover:text-blue-600"
                        >
                            <FaEdit />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="bg-white shadow-lg rounded-lg p-6 mb-6 text-center">
                    <p>No delivery address saved yet.</p>
                    <button
                        onClick={handleAdd} // Show modal to add a new address
                        className="text-blue-500 hover:text-blue-600"
                    >
                        + Add New Address
                    </button>
                </div>
            )}

            {/* Modal for Add/Edit Address */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                contentLabel={isEditMode ? 'Edit Address' : 'Add New Address'}
                className="modal-content"
                overlayClassName="modal-overlay"
            >
                <h5 className="text-lg font-medium mb-4">{isEditMode ? 'Update Address' : 'Add New Address'}</h5>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full px-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                            <input
                                type="text"
                                name="mobileNo"
                                value={formData.mobileNo}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full px-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Street</label>
                        <input
                            type="text"
                            name="street"
                            value={formData.street}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Barangay</label>
                            <input
                                type="text"
                                name="barangay"
                                value={formData.barangay}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full px-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">City</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full px-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Province</label>
                            <input
                                type="text"
                                name="province"
                                value={formData.province}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full px-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
                        <input
                            type="text"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="text-center">
                        <button
                            type="submit"
                            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                        >
                            {isEditMode ? 'Update Address' : 'Save Address'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default DeliveryDetails;
