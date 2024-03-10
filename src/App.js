import {Component} from 'react'
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import RestaurantPage from './components/RestaurantPage'
import Login from './components/Login'
import Cart from './components/Cart'
import CartContext from './context/CartContext'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

// write your code here

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class App extends Component {
  state = {
    cartList: [],

    activeTab: '11',
    categoryList: [],
    apiStatus: apiStatusConstants.initial,
    restDetails: {},
  }

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const url = 'https://run.mocky.io/v3/77a7e71b-804a-4fbd-822c-3e365d3482cc'
    const response = await fetch(url)
    const data = await response.json()

    if (response.ok === true) {
      const modifiedList = data[0].table_menu_list.map(each => ({
        categoryDishes: each.category_dishes.map(emo => ({
          addonCat: emo.addonCat,
          dishAvailability: emo.dish_Availability,
          dishType: emo.dish_Type,
          dishCalories: emo.dish_calories,
          dishCurrency: emo.dish_currency,
          dishDescription: emo.dish_description,
          dishId: emo.dish_id,
          dishImage: emo.dish_image,
          dishName: emo.dish_name,
          dishPrice: emo.dish_price,
          count: 0,
        })),
        menuCategory: each.menu_category,
        menuCategoryId: each.menu_category_id,
      }))
      this.setState({
        categoryList: modifiedList,
        apiStatus: apiStatusConstants.success,
        restDetails: data[0],
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

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

  activeTabFunction = tabId => {
    this.setState({activeTab: tabId})
  }

  categoryListChangeFunction = newList => {
    this.setState({categoryList: newList})
  }

  render() {
    const {
      cartList,
      activeTab,
      categoryList,
      apiStatus,
      restDetails,
    } = this.state
    return (
      <CartContext.Provider
        value={{
          cartList,
          removeAllCartItems: this.removeAllCartItems,
          addCartItem: this.addCartItem,
          removeCartItem: this.removeCartItem,
          incrementCartItemQuantity: this.incrementCartItemQuantity,
          decrementCartItemQuantity: this.decrementCartItemQuantity,
          addingData: this.addingData,
          activeTab,
          categoryList,
          apiStatus,
          restDetails,
          activeTabFunction: this.activeTabFunction,
          categoryListChangeFunction: this.categoryListChangeFunction,
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
