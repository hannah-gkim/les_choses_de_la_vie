import axios from "axios";

//ACTION NAME
const GOT_PRODUCTS = "GOT_PRODUCTS";
//const UPDATED_QUANTITY

//ACTION CREATORS
const gotProducts = (products) => {
  return {
    type: GOT_PRODUCTS,
    products,
  };
};

export const getProducts = () => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get("/api/products");
      dispatch(gotProducts(data));
    } catch (error) {
      return error;
    }
  };
};

const intialState = [];

//Reducer
export default function allProductsReducer(state = intialState, action) {
  switch (action.type) {
    case GOT_PRODUCTS:
      return action.products;
    default:
      return state;
  }
}
