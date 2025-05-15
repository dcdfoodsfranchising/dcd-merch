import { Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { activateProduct } from "../../services/productService";

export default function ActivateProduct({ product, fetchData }) {
  const handleActivate = async () => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    if (!token) {
      Swal.fire({
        title: "Error",
        icon: "error",
        text: "No authentication token found. Please log in again."
      });
      return;
    }

    try {
      // Activate the product through the API call
      const response = await activateProduct(product._id, token);

      if (!response.ok) {
        throw new Error(`Error activating product: ${response.statusText}`);
      }

      Swal.fire({
        title: "Success",
        icon: "success",
        text: "Product activated successfully."
      });

      fetchData(); // Refresh the product list
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        title: "Error",
        icon: "error",
        text: "Failed to activate product. Please try again later."
      });
    }
  };

  return (
    <Button variant="success" onClick={handleActivate}>
      Activate
    </Button>
  );
}
