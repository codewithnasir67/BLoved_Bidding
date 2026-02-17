// frontend/redux/reducers/bidReducer.js
const initialState = {
  bids: [],
  loading: false,
  error: null
};

export const bidReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'PLACE_BID_REQUEST':
    case 'GET_PRODUCT_BIDS_REQUEST':
    case 'GET_ALL_BIDS_REQUEST':
      return {
        ...state,
        loading: true
      };

    case 'PLACE_BID_SUCCESS':
      return {
        ...state,
        loading: false,
        bids: [...state.bids, action.payload]
      };

    case 'GET_PRODUCT_BIDS_SUCCESS':
    case 'GET_ALL_BIDS_SUCCESS':
      return {
        ...state,
        loading: false,
        bids: action.payload
      };

    case 'PLACE_BID_FAIL':
    case 'GET_PRODUCT_BIDS_FAIL':
    case 'GET_ALL_BIDS_FAIL':
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    default:
      return state;
  }
};