import React from 'react';
import { useDispatch } from 'react-redux';
import { deleteProduct } from '../../redux/actions/bidAction';
import styles from '../../styles/styles';
import { toast } from 'react-toastify';

const ShopProducts = ({ product }) => {
  const dispatch = useDispatch();

  const handleDelete = (id) => {
    if(window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(id))
        .then(() => {
          toast.success("Product deleted successfully!");
          // You might want to refresh the products list here
        })
        .catch((error) => {
          toast.error(error?.response?.data?.message || "Error deleting product");
        });
    }
  };

  return (
    <div className={`${styles.section}`}>
      <div className="w-full bg-white rounded-lg shadow-sm p-3 relative">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <h5 className="text-[15px] font-[600]">{product?.name}</h5>
            <p className="text-[#00000091]">{product?.description}</p>
            <div className="flex justify-between mt-2">
              <p className="text-[18px] font-[600]">Rs.{product?.price}</p>
              <button
                onClick={() => handleDelete(product?._id)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopProducts;
