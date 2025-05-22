import React, { useEffect, useState, Suspense, lazy, useCallback } from 'react';
import { getOwnDeliveryDetails, saveDeliveryDetails, deleteDeliveryDetails } from '../services/deliveryDetailsService';
import { getCartItems } from '../services/cartService'; // adjust path as needed
import Swal from 'sweetalert2';

const SavedAddresses = lazy(() => import('../components/Delivery/SavedAddresses'));
const DeliveryForm = lazy(() => import('../components/Delivery/DeliveryForm'));
const OrderSummary = lazy(() => import('../components/Delivery/OrderSummary'));

const MAX_ADDRESSES = 5;

const initialForm = {
  firstName: '',
  lastName: '',
  contactNumber: '',
  barangay: '',
  city: '',
  postalCode: '',
  completeAddress: '',
  tag: '',
  notesForRider: '',
};

const DeliveryDetails = () => {
  const [deliveryDetails, setDeliveryDetails] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentAddressId, setCurrentAddressId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState('₱0.00');

  useEffect(() => {
    fetchDetails();
    // eslint-disable-next-line
  }, []);

  const fetchDetails = useCallback(async () => {
    try {
      const response = await getOwnDeliveryDetails();
      // response is a single object, not an array
      setDeliveryDetails(response ? [response] : []);
      if (response && response._id) {
        setSelectedAddressId(response._id);
      }
    } catch (error) {
      console.error(error.message);
    }
  }, []);

  const handleChange = useCallback((e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    try {
      await saveDeliveryDetails(isEditMode ? { ...formData, _id: currentAddressId } : formData);
      Swal.fire('Success!', `Address ${isEditMode ? 'updated' : 'saved'} successfully!`, 'success');
      setIsModalOpen(false);
      setIsEditMode(false);
      setCurrentAddressId(null);
      setFormData(initialForm);
      fetchDetails();
    } catch (error) {
      Swal.fire('Error', error.message || 'Something went wrong', 'error');
    }
  }, [isEditMode, formData, currentAddressId, fetchDetails]);

  const handleEdit = useCallback((address) => {
    setIsEditMode(true);
    setCurrentAddressId(address._id);
    setFormData(address);
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback(async (addressId) => {
    const confirm = await Swal.fire({
      title: 'Delete Address?',
      text: 'Are you sure you want to delete this address?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });
    if (confirm.isConfirmed) {
      try {
        await deleteDeliveryDetails(addressId);
        Swal.fire('Deleted!', 'Address has been deleted.', 'success');
        fetchDetails();
      } catch (error) {
        Swal.fire('Error', error.message || 'Something went wrong', 'error');
      }
    }
  }, [fetchDetails]);

  const handleRadioChange = useCallback((addressId) => {
    setSelectedAddressId(addressId);
    const selected = deliveryDetails.find(addr => addr._id === addressId);
    if (selected) {
      setFormData(selected);
      setIsEditMode(false);
      setCurrentAddressId(null);
    }
  }, [deliveryDetails]);

  useEffect(() => {
    if (
      deliveryDetails.length === 1 &&
      Object.values(formData).every(val => val === '' || val == null)
    ) {
      setSelectedAddressId(deliveryDetails[0]._id);
      setFormData(deliveryDetails[0]);
    }
  }, [deliveryDetails]); // eslint-disable-line

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await getCartItems();
        if (data?.cart && Array.isArray(data.cart.cartItems)) {
          setCartItems(data.cart.cartItems);
          setCartTotal(
            data.cart.totalPrice !== undefined
              ? `₱${Number(data.cart.totalPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
              : '₱0.00'
          );
        } else {
          setCartItems([]);
          setCartTotal('₱0.00');
        }
      } catch {
        setCartItems([]);
        setCartTotal('₱0.00');
      }
    };
    fetchCart();
  }, []);

  return (
    <div className="bg-white sm:px-8 px-4 py-6">
      <div className="max-w-screen-xl max-md:max-w-xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8 lg:gap-x-12">
          <div className="lg:col-span-2">
            <h2 className="text-xl text-slate-900 font-semibold mb-6">Delivery Details</h2>
            <Suspense fallback={<div>Loading addresses...</div>}>
              <SavedAddresses
                deliveryDetails={deliveryDetails}
                selectedAddressId={selectedAddressId}
                handleRadioChange={handleRadioChange}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                maxAddresses={MAX_ADDRESSES}
              />
            </Suspense>
            <hr className="my-8" />
            <Suspense fallback={<div>Loading form...</div>}>
              <DeliveryForm
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                isEditMode={isEditMode}
                setFormData={setFormData}
              />
            </Suspense>
          </div>
          {/* Order Summary */}
          <Suspense fallback={<div>Loading order summary...</div>}>
            <OrderSummary items={cartItems} total={cartTotal} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default DeliveryDetails;
