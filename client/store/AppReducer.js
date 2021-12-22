export default function AppReducer(state, action) {
  switch (action.type) {
    case "GOT_PRODUCTS":
      return {
        ...state,
        products: action.payload,
      };
    case "GOT_NEW_CART_ITEM":
      return { ...state, cartItem: action.payload };
    case "GET_SINGLE_PRODUCT":
      return { ...state, singleProduct: action.payload };
    default:
      return state;
  }
}
