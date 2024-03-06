import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {username: '', password: '', showSubmitError: false, errorMsg: ''}

  onUsername = event => {
    this.setState({username: event.target.value})
  }

  onPassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  submitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    console.log(username, password)
    const userData = {
      username,
      password,
    }
    const options = {
      method: 'POST',
      body: JSON.stringify(userData),
    }
    const url = 'https://apis.ccbp.in/login'
    const response = await fetch(url, options)
    const data = await response.json()
    console.log(response)
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const {username, password, showSubmitError, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="loginPage">
        <div className="loginContainer">
          <h1 className="loginHeading">Restaurant App</h1>
          <form onSubmit={this.submitForm}>
            <div className="inputBox">
              <label className="label" htmlFor="username">
                USERNAME
              </label>
              <input
                value={username}
                onChange={this.onUsername}
                className="userName"
                placeholder="username"
                type="text"
                id="username"
              />
            </div>
            <div className="inputBox">
              <label className="label" htmlFor="password">
                PASSWORD
              </label>
              <input
                onChange={this.onPassword}
                value={password}
                className="password"
                placeholder="password"
                type="password"
                id="password"
              />
            </div>
            <button className="loginButton" type="submit">
              Login
            </button>
            {showSubmitError && <p className="loginErrorMsg">*{errorMsg}</p>}
          </form>
        </div>
      </div>
    )
  }
}

export default Login
