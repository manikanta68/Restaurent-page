import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {AiOutlineShoppingCart} from 'react-icons/ai'
import CartContext from '../../context/CartContext'
import './index.css'

const Header = props => {
  const onLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <CartContext.Consumer>
      {value => {
        const {cartList} = value

        return (
          <nav className="nav-bar">
            <Link className="link" to="/">
              <h1 className="main-heading">UNI Resto Cafe</h1>
            </Link>

            {/* {restDetails.type !== 'undefined' && (
              <Link className="link" to="/">
                <h1 className="main-heading">{restDetails.restaurant_name}</h1>
              </Link>
            )} */}

            <div className="cart-container-with-count">
              <p className="my-orders">My Orders</p>
              <Link to="/cart">
                <button
                  data-testid="cart"
                  className="cartIconButton"
                  type="button"
                >
                  <AiOutlineShoppingCart size={30} />
                </button>
              </Link>
              <p className="cart-count-background">{cartList.length}</p>

              <button onClick={onLogout} className="logout" type="button">
                Logout
              </button>
            </div>
          </nav>
        )
      }}
    </CartContext.Consumer>
  )
}

export default withRouter(Header)
