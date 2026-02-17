import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./reducers/user";
import { sellerReducer } from "./reducers/seller";
import { productReducer } from "./reducers/product";
import { eventReducer } from "./reducers/event";
import { cartReducer } from "./reducers/cart";
import { wishlistReducer } from "./reducers/wishlist";
import { orderReducer } from "./reducers/order";
import { bidReducer } from "./reducers/bidReducer";  // ✅ Added bidReducer
import { notificationReducer } from "./reducers/notification";
import { messageReducer } from "./reducers/message";  // Import message reducer


const Store = configureStore({
  reducer: {
    user: userReducer,
    seller: sellerReducer,
    products: productReducer,
    events: eventReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    order: orderReducer,
    bids: bidReducer, 
    notifications: notificationReducer,
    messages: messageReducer,  // Add messages reducer to store
  },
});

export default Store;
