import React, { Component } from "react";
import { getCart, removeItem, updateCartItem } from "../store/cart";
import { getProducts } from "../store/allProducts";
import { connect } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";
import { ShoppingBag, Trash2 } from "react-feather";
import {
  CartContainer,
  List,
  LeftColumn,
  RightColumn,
  ButtonContainer,
  Button,
  LargeText,
  Text,
  QuantityButton,
  SmallText,
  Input,
} from "../style";

let finalTotal = 0;
class CheckoutCart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      items: [],
      products: [],

      /*
       userId: state.auth.id,
    isLoggedIn: !!state.auth.id,
    items: state.cart.items,
    products: state.cart.products,
      */
    };
    this.findProduct = this.findProduct.bind(this);
    this.handleDelete = this.handleDelete.bind(this);

    this.handleCheckout = this.handleCheckout.bind(this);
    this.handleQuantityUpdate = this.handleQuantityUpdate.bind(this);
    //this.handleTotal = this.handleTotal.bind(this);
  }

  componentDidMount() {
    this.props.loadCart(this.props.userId, this.props.isLoggedIn);
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.setState(this.props);
    }
  }

  async handleCheckout() {
    if (this.props.isLoggedIn) {
      const id = this.state.userId;
      const token = window.localStorage.getItem("token");

      await axios.put(
        `/api/users/${id}/confirmation`,
        { total: finalTotal },

        {
          headers: {
            authorization: token,
          },
        }
      );
    } else {
      window.localStorage.setItem("cart", JSON.stringify([]));
    }
  }

  // handleAdd(productId, currQty, product) {
  //   this.propsdQuantity(productId, 1, product);
  // }

  // handleSubtract(productId, currQty, product) {
  //   this.props.updatedQuantity(productId, -1, product);
  // }

  handleQuantityUpdate(event) {
    event.preventDefault();
    let orderId;
    let productId;
    let currentPrice;
    let quantity;
    let newItems = this.state.items.map((item) => {
      orderId = item.orderId;
      productId = item.productId;
      if (item.productId == event.target.name) {
        item.quantity = Number(event.target.value);
        let productDisplay = this.findProduct(item.productId);
        let price = (productDisplay.price * item.quantity) / 100;
        item.currentPrice = Number(price);
        currentPrice = parseInt(Number(price));
        quantity = Number(event.target.value);
        return item;
      }
      return item;
    });

    console.log("newitem-->", this.state.items);
    this.setState({ ...this.state, items: newItems });

    this.handleUpdate(
      this.props.userId,
      currentPrice,
      quantity,
      orderId,
      productId
    );
  }

  //************************** */
  handleUpdate(id, currentPrice, quantity, orderId, productId) {
    if (this.props.isLoggedIn) {
      this.state.items.map((item) => {
        this.props.updatedQuantity(
          id,
          currentPrice,
          quantity,
          orderId,
          productId
        );
      });
      // let cart = JSON.parse(window.localStorage.getItem("cart"));
      // console.log("what is cart-->", cart);
    }
  }

  handleDelete(id, orderId, productId) {
    //Deletes an item from the cart
    if (this.props.isLoggedIn) {
      this.props.deleteItem(id, orderId, productId);
      //generate new array to store into state
      const updatedItemsList = this.state.items.filter((item) => {
        if (item.productId !== productId) {
          return item;
        }
      });

      const updatedProductsList = this.state.products.filter((product) => {
        if (product.id !== productId) {
          return product;
        }
      });

      //set state
      this.setState({
        ...this.state,
        items: updatedItemsList,
        products: updatedProductsList,
      });

      let cart = JSON.parse(window.localStorage.getItem("cart"));
      console.log("what is cart-->", cart);
    } else {
      // let cart = JSON.parse(window.localStorage.getItem("cart")).filter(
      //   (item) => {
      //     if (item.productId !== productId) return item;
      //   }
      // );
      // window.localStorage.setItem("cart", JSON.stringify(cart));
      // console.log(this.state.items);
      // console.log(cart);
      // this.setState({ items: cart });
    }
  }

  findProduct(productId) {
    if (this.props.isLoggedIn) {
      return this.state.products.filter(
        (item) => item.id == parseInt(productId)
      )[0];
    } else {
      return this.props.products.filter((item) => {
        return item.id == parseInt(productId);
      })[0];
    }
  }

  render() {
    let { items } = this.state;
    const { findProduct } = this;
    let total = 0;

    finalTotal = total;
    let subtotal = {};

    // if (!this.props.isLoggedIn) {
    //   products = this.props.products || [];
    // }
    // console.log("items-->", items);
    return (
      <div>
        <CartContainer>
          <h1 className="shopping-bag">Shopping bag</h1>
          {items.lenght !== 0 &&
            items.map((item) => {
              console.log("item!!!-->", item);
              let productDisplay = findProduct(item.productId);
              let price = (productDisplay.price * item.quantity) / 100;

              subtotal[productDisplay.id] = Number(
                (productDisplay.price * item.quantity) / 100
              );
              total += Number(productDisplay.price * item.quantity) / 100;

              return (
                <div className="cartItem" key={item.productId}>
                  <List>
                    <Link to={`/products/${item.id}`}>
                      <LeftColumn>
                        <img
                          width="160"
                          height="160"
                          src={productDisplay.imageUrl}
                          alt={productDisplay.name}
                        />
                      </LeftColumn>
                    </Link>
                    <RightColumn>
                      <LargeText>{productDisplay.name}</LargeText>
                      <div className="edit-cart">
                        <h3>${price} </h3>
                        <div className="cart-input">
                          <form>
                            <input
                              type="number"
                              name={item.productId}
                              value={item.quantity}
                              onChange={this.handleQuantityUpdate}
                            />
                          </form>
                        </div>
                        <Trash2
                          className="delete-item"
                          onClick={() =>
                            this.handleDelete(
                              this.props.userId,
                              item.orderId,
                              item.productId
                            )
                          }
                        />
                      </div>
                    </RightColumn>
                  </List>
                </div>
              );
            })}

          {items && items.length > 0 ? (
            <div>
              <ButtonContainer>
                <LargeText>
                  Total: $
                  {items && Math.round((total + Number.EPSILON) * 100) / 100}
                </LargeText>
              </ButtonContainer>
              <br />

              <ButtonContainer>
                <Link to="/confirmation">
                  <Button onClick={this.handleCheckout}>CHECKOUT</Button>
                </Link>
              </ButtonContainer>
            </div>
          ) : (
            <CartContainer>
              <Link to="/products">
                <SmallText>
                  <ShoppingBag /> Back to Shopping
                </SmallText>
              </Link>
              <br />
              <LargeText>
                Oh no! Your cart is empty!
                <br />
              </LargeText>
            </CartContainer>
          )}
        </CartContainer>
      </div>
    );
  }
}

const mapDispatch = (dispatch) => {
  return {
    loadCart: (id, isLoggedIn) => dispatch(getCart(id, isLoggedIn)),

    updatedQuantity: (id, currentPrice, quantity, orderId, productId) =>
      dispatch(updateCartItem(id, currentPrice, quantity, orderId, productId)),

    loadAllProducts: (productId, quantity, product) => dispatch(getProducts()),
    deleteItem: (id, orderId, productId) =>
      dispatch(removeItem(id, orderId, productId)),
  };
};

const mapState = (state) => {
  return {
    userId: state.auth.id,
    isLoggedIn: !!state.auth.id,
    items: state.cart.items,
    products: state.cart.products,
  };
};

export default connect(mapState, mapDispatch)(CheckoutCart);
