import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import Header from '../Header'

import CartContext from '../../context/CartContext'

import './index.css'

class RestaurantPage extends Component {
  state = {activeTab: '11', categoryList: []}

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
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
      })
    }
  }

  render() {
    const {activeTab, categoryList} = this.state

    const activeObj = categoryList.filter(
      each => each.menuCategoryId === activeTab,
    )
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken === undefined) {
      return <Redirect to="/login" />
    }

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

                    const addToCartButtonCheck =
                      each.count > 0 ? (
                        <button
                          onClick={addItemToCart}
                          className="addToCartButton addButton"
                          type="button"
                        >
                          Add To Cart
                        </button>
                      ) : (
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
                                          return {...tem, count: tem.count - 1}
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
                                        return {...tem, count: tem.count + 1}
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
                      )

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
                          {each.dishAvailability && addToCartButtonCheck}

                          {each.addonCat.length > 0 && (
                            <p className="addon-cat">
                              Customizations available
                            </p>
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
}

export default RestaurantPage
