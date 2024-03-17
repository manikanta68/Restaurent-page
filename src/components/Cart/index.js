import {AiFillCloseCircle} from 'react-icons/ai'
import Header from '../Header'
import CartContext from '../../context/CartContext'

import './index.css'

const Cart = () => (
  <div>
    <Header />

    <CartContext.Consumer>
      {value => {
        const {
          cartList,
          removeCartItem,
          removeAllCartItems,
          incrementCartItemQuantity,
          decrementCartItemQuantity,
        } = value

        return (
          <div>
            {cartList.length < 1 ? (
              <div className="empty-cart-container">
                <img
                  className="empty-cart-image"
                  src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-empty-cart-img.png"
                  alt="cart"
                />
                <h1 className="empty-cart-description">Your Cart is Empty</h1>
              </div>
            ) : (
              <div className="full-cart">
                <h1 className="my-cart-heading">My Cart</h1>
                <button
                  onClick={() => {
                    removeAllCartItems()
                  }}
                  className="removeAllButton"
                  type="button"
                >
                  Remove All
                </button>
                <ul className="cartUlList">
                  {cartList.map(each => (
                    <li className="eachCartItem" key={each.dishId}>
                      <img
                        className="cart-item-image"
                        src={each.dishImage}
                        alt={each.dishName}
                      />
                      <div className="cart-item-final">
                        <h1 className="cart-item-final-name">
                          {each.dishName}
                        </h1>{' '}
                        <div className="cart-item-final-price">
                          <div className="increment-decrement-buttons">
                            <button
                              onClick={() => {
                                decrementCartItemQuantity(each)
                              }}
                              className="minus-button"
                              type="button"
                            >
                              -
                            </button>
                            <p className="cart-count">{each.count}</p>
                            <button
                              onClick={() => {
                                incrementCartItemQuantity(each)
                              }}
                              className="plus-button"
                              type="button"
                            >
                              +
                            </button>
                          </div>{' '}
                          <p className="cart-dish-price">
                            SAR {each.dishPrice * each.count}
                            {/* Rs {}
                            {Math.ceil(each.dishPrice) * 30 * each.count} */}
                          </p>
                        </div>
                      </div>
                      <button
                        className="delete-button"
                        type="button"
                        onClick={() => {
                          removeCartItem(each)
                        }}
                      >
                        {}
                        <AiFillCloseCircle color="#616E7C" size={23} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )
      }}
    </CartContext.Consumer>
  </div>
)

export default Cart
