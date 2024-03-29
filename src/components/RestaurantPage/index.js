import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'

import CartContext from '../../context/CartContext'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class RestaurantPage extends Component {
  state = {
    activeTab: '11',
    categoryList: [],
    apiStatus: apiStatusConstants.initial,
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
    console.log(data[0])

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
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderSuccessView = () => {
    const {activeTab, categoryList} = this.state

    const activeObj = categoryList.filter(
      each => each.menuCategoryId === activeTab,
    )
    return (
      <div className="restaurant-page">
        {categoryList.length > 0 && <Header />}

        {categoryList.length > 0 && (
          <ul className="tabs_menu">
            {categoryList.map(tab => (
              <li key={tab.menuCategoryId}>
                <button
                  onClick={() => {
                    this.setState({activeTab: tab.menuCategoryId})
                  }}
                  className={
                    activeTab === tab.menuCategoryId ? 'tab extra' : 'tab'
                  }
                  type="button"
                >
                  {tab.menuCategory}
                </button>
              </li>
            ))}
          </ul>
        )}
        {activeObj.length > 0 && (
          <ul className="dishes-container">
            {activeObj[0].categoryDishes.map(each => (
              <li className="dish-list-item" key={each.dishId}>
                <CartContext.Consumer>
                  {value => {
                    const {addCartItem} = value

                    const addItemToCart = () => {
                      addCartItem(each)
                    }

                    return (
                      <div className="dish-item">
                        {each.dishType === 2 ? (
                          <div className="veg-container">
                            <div className="veg-symbol">.</div>
                          </div>
                        ) : (
                          <div className="non-veg-container">
                            <div className="non-veg-symbol">.</div>
                          </div>
                        )}

                        <div className="item-details">
                          <h1 className="dish-name">{each.dishName}</h1>
                          <p className="dish-price">
                            {each.dishCurrency} {each.dishPrice}
                          </p>
                          <p className="dish-description">
                            {each.dishDescription}
                          </p>
                          {each.dishAvailability && (
                            <div className="increment-decrement-buttons">
                              <button
                                onClick={() => {
                                  const newList = categoryList.map(newItem => {
                                    if (
                                      newItem.menuCategoryId ===
                                      activeObj[0].menuCategoryId
                                    ) {
                                      const updateItem = newItem.categoryDishes.map(
                                        tem => {
                                          if (tem.dishId === each.dishId) {
                                            if (tem.count > 0) {
                                              return {
                                                ...tem,
                                                count: tem.count - 1,
                                              }
                                            }
                                            return tem
                                          }
                                          return tem
                                        },
                                      )
                                      return {
                                        ...newItem,
                                        categoryDishes: updateItem,
                                      }
                                    }
                                    return newItem
                                  })
                                  console.log(newList)

                                  this.setState({categoryList: newList})
                                }}
                                className="minus-button"
                                type="button"
                              >
                                -
                              </button>
                              <p className="cart-count">{each.count}</p>
                              <button
                                onClick={() => {
                                  const newList = categoryList.map(newItem => {
                                    if (
                                      newItem.menuCategoryId ===
                                      activeObj[0].menuCategoryId
                                    ) {
                                      const updateItem = newItem.categoryDishes.map(
                                        tem => {
                                          if (tem.dishId === each.dishId) {
                                            return {
                                              ...tem,
                                              count: tem.count + 1,
                                            }
                                          }
                                          return tem
                                        },
                                      )
                                      return {
                                        ...newItem,
                                        categoryDishes: updateItem,
                                      }
                                    }
                                    return newItem
                                  })
                                  console.log(newList)
                                  this.setState({categoryList: newList})
                                }}
                                className="plus-button"
                                type="button"
                              >
                                +
                              </button>
                            </div>
                          )}

                          {each.addonCat.length > 0 && (
                            <p className="addon-cat">
                              Customizations available
                            </p>
                          )}
                          {each.dishAvailability && each.count > 0 && (
                            <button
                              onClick={addItemToCart}
                              className="addToCartButton addButton"
                              type="button"
                            >
                              ADD TO CART
                            </button>
                          )}
                          {each.dishAvailability === false && (
                            <p className="dish-availability">Not available</p>
                          )}
                        </div>
                        <div className="calories-container">
                          <p className="calories">
                            {each.dishCalories} calories
                          </p>

                          <img
                            className="dish-image"
                            src={each.dishImage}
                            alt={each.dishName}
                          />
                        </div>
                      </div>
                    )
                  }}
                </CartContext.Consumer>
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }

  renderFailureView = () => <h1>We are unavailable to fetch your request</h1>

  renderLoadingView = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  callingResponseStatus = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken === undefined) {
      return <Redirect to="/login" />
    }
    return this.callingResponseStatus()
  }
}

export default RestaurantPage
