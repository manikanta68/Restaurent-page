import {Component} from 'react'
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import RestaurantPage from './components/RestaurantPage'
import Login from './components/Login'
import Cart from './components/Cart'
import CartContext from './context/CartContext'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

// write your code here
class App extends Component {
  state = {cartList: []}

  removeAllCartItems = () => {
    this.setState({cartList: []})
  }

  addCartItem = item => {
    const {cartList} = this.state
    const itemCheck = cartList.find(each => each.dishId === item.dishId)

    if (itemCheck === undefined) {
      const newList = [...cartList, item]
      this.setState({cartList: newList})
    } else {
      const newList = cartList.map(each => {
        if (each.dishId === item.dishId) {
          return {...each, count: each.count + 1}
        }
        return each
      })
      this.setState({cartList: newList})
    }
  }

  removeCartItem = delItem => {
    const {cartList} = this.state
    const newList = cartList.filter(each => each.dishId !== delItem.dishId)
    this.setState({cartList: newList})
  }

  incrementCartItemQuantity = plusItem => {
    const {cartList} = this.state
    const newList = cartList.map(each => {
      if (each.dishId === plusItem.dishId) {
        return {...each, count: each.count + 1}
      }
      return each
    })
    this.setState({cartList: newList})
  }

  decrementCartItemQuantity = minusItem => {
    if (minusItem.count <= 1) {
      this.removeCartItem(minusItem)
    } else {
      this.setState(prevState => ({
        cartList: prevState.cartList.map(eachCartItem => {
          if (eachCartItem.dishId === minusItem.dishId) {
            const updateQuantity = eachCartItem.count - 1
            return {...eachCartItem, count: updateQuantity}
          }
          return eachCartItem
        }),
      }))
    }
  }

  render() {
    const {cartList} = this.state
    console.log(cartList)
    return (
      <CartContext.Provider
        value={{
          cartList,
          removeAllCartItems: this.removeAllCartItems,
          addCartItem: this.addCartItem,
          removeCartItem: this.removeCartItem,
          incrementCartItemQuantity: this.incrementCartItemQuantity,
          decrementCartItemQuantity: this.decrementCartItemQuantity,
        }}
      >
        <BrowserRouter>
          <Switch>
            <Route exact path="/login" component={Login} />
            <ProtectedRoute exact path="/" component={RestaurantPage} />
            <ProtectedRoute exact path="/cart" component={Cart} />
          </Switch>
        </BrowserRouter>
      </CartContext.Provider>
    )
  }
}

export default App
