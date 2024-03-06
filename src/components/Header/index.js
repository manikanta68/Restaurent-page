import {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {AiOutlineShoppingCart} from 'react-icons/ai'
import CartContext from '../../context/CartContext'
import './index.css'

class Header extends Component {
  state = {restaurantObj: {}}

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    const url = 'https://run.mocky.io/v3/77a7e71b-804a-4fbd-822c-3e365d3482cc'
    const response = await fetch(url)
    const data = await response.json()
    console.log(data[0])
    if (response.ok === true) {
      this.setState({
        restaurantObj: data[0],
      })
    }
  }

  onLogout = () => {
    const {history} = this.props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  render() {
    const {restaurantObj} = this.state
    return (
      <CartContext.Consumer>
        {value => {
          const {cartList} = value

          return (
            <nav className="nav-bar">
              {restaurantObj.type !== 'undefined' && (
                <Link className="link" to="/">
                  <h1 className="main-heading">
                    {restaurantObj.restaurant_name}
                  </h1>
                </Link>
              )}

              <div className="cart-container-with-count">
                <p className="my-orders">My Orders</p>
                <Link to="/cart">
                  <button className="cartIconButton" type="button">
                    <AiOutlineShoppingCart size={30} />
                  </button>
                </Link>
                <p className="cart-count-background">{cartList.length}</p>

                <button
                  onClick={this.onLogout}
                  className="logout"
                  type="button"
                >
                  Logout
                </button>
              </div>
            </nav>
          )
        }}
      </CartContext.Consumer>
    )
  }
}

export default withRouter(Header)
