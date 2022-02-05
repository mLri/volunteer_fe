import { useEffect, useState } from 'react'
import axios from 'axios'
import { useHistory } from 'react-router'
import { connect } from 'react-redux'
import { URL_API } from '../../../global_variable'
import jwt_decode from "jwt-decode"

/* import components */
import Input from '../../../components/Input/Input.component'
import Button from '../../../components/Button/Button.component'

/* import css */
import './Login.view.css'

function Login(props) {

  let history = useHistory()

  const [state, setState] = useState({ username: '', password: '' })

  useEffect(() => {
    /* check auth */
    const get_token = localStorage.getItem('token')
    if (get_token) {
      let decode_token = jwt_decode(get_token)
      if (decode_token.permissions === 'admin') history.push('/admin')
      else history.push('/')
    }
  }, [])

  const loginFunc = async (e) => {
    e.preventDefault()

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
    const login = await axios.post(`${URL_API}/auth/signin`, { ...state }, { headers })

    localStorage.setItem('token', login.data.access_token)

    let decode_token = jwt_decode(login.data.access_token)

    props.dispatch({ 
      type: 'SIGNIN', 
      payload: {
        ...decode_token,
        isLogin: true
      } 
    })

    if (login.data.role === 'admin') history.push('/admin')
    else history.push('/')
  }

  const handleInputChangeFunc = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value
    });
  }

  return (
    <div className="login__container">
      <div className="login__header">
        <h1>Sing in to Voluteer register</h1>
      </div>
      <div className="login__content">
        <form onSubmit={loginFunc}>
          <label htmlFor="username">Username or email address</label>
          <Input
            name='username'
            placeholder='type your username'
            value={state.username}
            handleOnChangeFunc={handleInputChangeFunc} />
          <label htmlFor="password">Password</label>
          <Input
            name='password'
            placeholder='type your password'
            type='password'
            value={state.password}
            handleOnChangeFunc={handleInputChangeFunc} />
          <Button value='Login' bgc="#2da44e" color="#ffffff" />
        </form>
      </div>
    </div>

  )
}

const mapPropsToState = (state) => {
  return {
    auth: state.auth
  }
}

export default connect(mapPropsToState)(Login)