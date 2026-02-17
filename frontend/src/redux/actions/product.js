import axios from "axios";
import { server } from "../../server";

// create request
export const createRequest = (requestData) => async (dispatch) => {
  try {
    dispatch({
      type: "productCreateRequest",
    });

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    };

    const { data } = await axios.post(
      `${server}/product/create-request`,
      requestData,
      config
    );

    dispatch({
      type: "productCreateSuccess",
      payload: data.product,
    });
  } catch (error) {
    dispatch({
      type: "productCreateFail",
      payload: error.response?.data?.message || "Error creating request",
    });
  }
};

// create product
export const createProduct = (productData) => async (dispatch) => {
  try {
    dispatch({
      type: "productCreateRequest",
    });

    // Log the data being sent
    console.log("Product Data being sent to server:");
    for (let [key, value] of productData.entries()) {
      console.log(`${key}: ${value}`);
    }

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    };

    console.log("Making request to:", `${server}/product/create-product`);

    const { data } = await axios.post(
      `${server}/product/create-product`,
      productData,
      config
    );

    console.log("Server response:", data);

    dispatch({
      type: "productCreateSuccess",
      payload: data.product,
    });
  } catch (error) {
    console.error("Error in createProduct action:", error);
    console.error("Response data:", error.response?.data);
    console.error("Status:", error.response?.status);

    dispatch({
      type: "productCreateFail",
      payload: error.response?.data?.message || "Error creating product. Please check console for details.",
    });
  }
};

// get All Products of a shop
export const getAllProductsShop = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "getAllProductsShopRequest",
    });

    const url = id
      ? `${server}/product/get-all-products/${id}`
      : `${server}/product/get-all-shop-products`;

    const { data } = await axios.get(url, { withCredentials: true });
    dispatch({
      type: "getAllProductsShopSuccess",
      payload: data.products,
    });
  } catch (error) {
    dispatch({
      type: "getAllProductsShopFailed",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// delete product of a shop
export const deleteProduct = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "deleteProductRequest",
    });

    const { data } = await axios.delete(
      `${server}/product/delete-shop-product/${id}`,
      {
        withCredentials: true,
      }
    );

    dispatch({
      type: "deleteProductSuccess",
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: "deleteProductFailed",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// get all products
export const getAllProducts = () => async (dispatch) => {
  try {
    dispatch({
      type: "getAllProductsRequest",
    });

    const { data } = await axios.get(`${server}/product/get-all-products`);
    dispatch({
      type: "getAllProductsSuccess",
      payload: data.products,
    });
  } catch (error) {
    dispatch({
      type: "getAllProductsFailed",
      payload: error.response?.data?.message || error.message,
    });
  }
};
// update product
export const updateProduct = (id, productData) => async (dispatch) => {
  try {
    dispatch({
      type: "productUpdateRequest",
    });

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    };

    const { data } = await axios.put(
      `${server}/product/update-product/${id}`,
      productData,
      config
    );

    dispatch({
      type: "productUpdateSuccess",
      payload: data.product,
    });
  } catch (error) {
    dispatch({
      type: "productUpdateFail",
      payload: error.response?.data?.message || "Error updating product",
    });
  }
};
