import { useState } from 'react'
import axios from 'axios'
import { useHistory } from 'react-router'
import { connect } from 'react-redux'
import { URL_API } from '../../../global_variable'
import jwt_decode from "jwt-decode"

/* import components */
import Input from '../../../components/Input/Input.component'
import Button from '../../../components/Button/Button.component'

/* import css */
import './Signup.view.css'

function SignUp(props) {

  let history = useHistory()

  const [state, setState] = useState({
    employee_id: '',
    prefix: '',
    first_name: '',
    last_name: '',
    institution: '',
    tel: '',
    username: '',
    password: '',
    email: '',
    role: 'user'
  })
  const [passwordCon, setPasswordCon] = useState('')
  const [validateInput, setValidateInput] = useState({
    employee_id: {
      isError: false,
      errMsg: ''
    },
    prefix: {
      isError: false,
      errMsg: ''
    },
    first_name: {
      isError: false,
      errMsg: ''
    },
    last_name: {
      isError: false,
      errMsg: ''
    },
    institution: {
      isError: false,
      errMsg: ''
    },
    tel: {
      isFocus: false,
      isError: false,
      errMsg: ''
    },
    username: {
      isError: false,
      errMsg: ''
    },
    password: {
      isError: false,
      errMsg: ''
    },
    password_confirm: {
      isError: false,
      errMsg: ''
    },
    email: {
      isError: false,
      errMsg: ''
    }
  })

  /* set once scroll */
  let isFocus = false

  const handleInputChangeFunc = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value
    })

    let newObj = Object.assign(validateInput, { [e.target.name]: { isError: false, errMsg: '' } })
    setValidateInput({ ...newObj })

    isFocus = false
    // setClickSubmit(false)
  }

  const handlePasswordConfirm = (e) => {
    setPasswordCon(e.target.value)

    let newObj = Object.assign(validateInput, { [e.target.name]: { isError: false, errMsg: '' } })
    setValidateInput({ ...newObj })

    isFocus = false
    // setClickSubmit(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {

      if (
        state.username === '' ||
        state.password === '' ||
        passwordCon === '' ||
        state.employee_id === '' ||
        state.prefix === '' ||
        state.first_name === '' ||
        state.last_name === '' ||
        state.institution === '' ||
        state.tel === '' ||
        state.email === ''
      ) {
        if (state.username === '') {

          let newObj = Object.assign(validateInput, { username: { isError: true, errMsg: 'Require this field!' } })
          setValidateInput({ ...newObj })

          if (!isFocus) {
            document.querySelector(`input[name='username']`).focus()
            isFocus = true
          }
        }

        if (state.password === '') {

          let newObj = Object.assign(validateInput, { password: { isError: true, errMsg: 'Require this field!' } })
          setValidateInput({ ...newObj })

          if (!isFocus) {
            document.querySelector(`input[name='password']`).focus()
            isFocus = true
          }
        }

        if (passwordCon === '') {

          let newObj = Object.assign(validateInput, { password_confirm: { isError: true, errMsg: 'Require this field!' } })
          setValidateInput({ ...newObj })

          if (!isFocus) {
            document.querySelector(`input[name='password_confirm']`).focus()
            isFocus = true
          }
        }

        if (state.employee_id === '') {

          let newObj = Object.assign(validateInput, { employee_id: { isError: true, errMsg: 'Require this field!' } })
          setValidateInput({ ...newObj })

          if (!isFocus) {
            document.querySelector(`input[name='employee_id']`).focus()
            isFocus = true
          }
        }

        if (state.prefix === '') {

          let newObj = Object.assign(validateInput, { prefix: { isError: true, errMsg: 'Require this field!' } })
          setValidateInput({ ...newObj })

          if (!isFocus) {
            document.querySelector(`input[name='prefix']`).focus()
            isFocus = true
          }
        }

        if (state.first_name === '') {

          let newObj = Object.assign(validateInput, { first_name: { isError: true, errMsg: 'Require this field!' } })
          setValidateInput({ ...newObj })

          if (!isFocus) {
            document.querySelector(`input[name='first_name']`).focus()
            isFocus = true
          }
        }

        if (state.last_name === '') {

          let newObj = Object.assign(validateInput, { last_name: { isError: true, errMsg: 'Require this field!' } })
          setValidateInput({ ...newObj })

          if (!isFocus) {
            document.querySelector(`input[name='last_name']`).focus()
            isFocus = true
          }
        }

        if (state.institution === '') {

          let newObj = Object.assign(validateInput, { institution: { isError: true, errMsg: 'Require this field!' } })
          setValidateInput({ ...newObj })

          if (!isFocus) {
            document.querySelector(`input[name='institution']`).focus()
            isFocus = true
          }
        }

        if (state.tel === '') {

          let newObj = Object.assign(validateInput, { tel: { isError: true, errMsg: 'Require this field!' } })
          setValidateInput({ ...newObj })

          if (!isFocus) {
            document.querySelector(`input[name='tel']`).focus()
            isFocus = true
          }
        }

        if (state.email === '') {

          let newObj = Object.assign(validateInput, { email: { isError: true, errMsg: 'Require this field!' } })
          setValidateInput({ ...newObj })

          if (!isFocus) {
            document.querySelector(`input[name='email']`).focus()
            isFocus = true
          }
        }

      } else if (state.password === passwordCon) {
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }

        const signup = await axios.post(`${URL_API}/auth/signup`, { ...state }, { headers })

        if (signup.status === 200) {
          const login = await axios.post(`${URL_API}/auth/signin`, { username: state.username, password: state.password }, { headers })

          localStorage.setItem('token', login.data.access_token)

          let decode_token = jwt_decode(login.data.access_token)

          props.dispatch({
            type: 'SIGNIN',
            payload: {
              ...decode_token,
              isLogin: true
            }
          })

          history.push('/')
        }
      } else {
        /* password !== password_coonfirm */

        let newObj = Object.assign(validateInput, { password_confirm: { isError: true, errMsg: 'Password confirm must have the same password!' } })
        setValidateInput({ ...newObj })

        if (!isFocus) {
          document.querySelector(`input[name='password_confirm']`).focus()
          isFocus = true
        }
      }

    } catch (error) {
      console.log(error.response)
      console.log(typeof error.response.data.message)
      if (Array.isArray(error.response.data.message)) {
        const key_name = error.response.data.message[0].param
        const msg_err = error.response.data.message[0].msg
        let newObj = Object.assign(validateInput, { [key_name]: { isError: true, errMsg: msg_err } })
        setValidateInput({ ...newObj })
        document.querySelector(`input[name='${key_name}']`).focus()
      }

      if (error.response.data.message && error.response.data.message === 'user has already exists!') {
        let newObj = Object.assign(validateInput, { username: { isFocus: true, isError: true, errMsg: 'User has already exists!' } })
        setValidateInput({ ...newObj })
        document.querySelector(`input[name='username']`).focus()
      }
    }

  }

  return (
    <div className="login__container">
      <div className="login__header">
        <h1>Sing up to Voluteer register</h1>
      </div>
      <div className="login__content">
        <form onSubmit={handleSubmit}>

          {
            validateInput.username.isError &&
            <label className='wrong_input'>{validateInput.username.errMsg}</label>
          }
          <label htmlFor="username">Username*</label>
          <Input
            name='username'
            placeholder='type your username'
            value={state.username}
            // onFocus={focus.username}
            handleOnChangeFunc={handleInputChangeFunc} />

          {
            validateInput.password.isError &&
            <label className='wrong_input'>{validateInput.password.errMsg}</label>
          }
          <label htmlFor="password">Password*</label>
          <Input
            name='password'
            placeholder='type your password'
            type='password'
            value={state.password}
            // onFocus={focus.password}
            handleOnChangeFunc={handleInputChangeFunc} />

          {
            validateInput.password_confirm.isError &&
            <label className='wrong_input'>{validateInput.password_confirm.errMsg}</label>
          }
          <label htmlFor="password_confirm">Password confirm*</label>
          <Input
            name='password_confirm'
            placeholder='type your password again'
            type='password'
            value={passwordCon}
            // onFocus={focus.password_confirm}
            handleOnChangeFunc={handlePasswordConfirm}
          />

          {
            validateInput.employee_id.isError &&
            <label className='wrong_input'>{validateInput.employee_id.errMsg}</label>
          }
          <label htmlFor="username">รหัสพนักงาน*</label>
          <Input
            name='employee_id'
            placeholder='รหัสพนักงาน'
            value={state.employee_id}
            // onFocus={focus.employee_id}
            handleOnChangeFunc={handleInputChangeFunc} />

          {
            validateInput.prefix.isError &&
            <label className='wrong_input'>{validateInput.prefix.errMsg}</label>
          }
          <label htmlFor="employee_id">คำนำหน้า*</label>
          <Input
            name='prefix'
            placeholder='คำนำหน้า'
            value={state.prefix}
            // onFocus={focus.prefix}
            handleOnChangeFunc={handleInputChangeFunc} />

          {
            validateInput.first_name.isError &&
            <label className='wrong_input'>{validateInput.first_name.errMsg}</label>
          }
          <label htmlFor="prefix">ชื่อ*</label>
          <Input
            name='first_name'
            placeholder='ชื่อ'
            value={state.first_name}
            // onFocus={focus.first_name}
            handleOnChangeFunc={handleInputChangeFunc} />

          {
            validateInput.last_name.isError &&
            <label className='wrong_input'>{validateInput.last_name.errMsg}</label>
          }
          <label htmlFor="last_name">นามสกุล*</label>
          <Input
            name='last_name'
            placeholder='นามสกุล'
            value={state.last_name}
            // onFocus={focus.last_name}
            handleOnChangeFunc={handleInputChangeFunc} />

          {
            validateInput.institution.isError &&
            <label className='wrong_input'>{validateInput.institution.errMsg}</label>
          }
          <label htmlFor="institution">สังกัด*</label>
          <Input
            name='institution'
            placeholder='นามสกุล'
            value={state.institution}
            // onFocus={focus.institution}
            handleOnChangeFunc={handleInputChangeFunc} />

          {
            validateInput.tel.isError &&
            <label className='wrong_input'>{validateInput.tel.errMsg}</label>
          }
          <label htmlFor="tel">โทร*</label>
          <Input
            name='tel'
            placeholder='โทร'
            value={state.tel}
            // onFocus={focus.tel}
            handleOnChangeFunc={handleInputChangeFunc} />

          {
            validateInput.email.isError &&
            <label className='wrong_input'>{validateInput.email.errMsg}</label>
          }
          <label htmlFor="email">อีเมล*</label>
          <Input
            name='email'
            placeholder='อีเมล'
            value={state.email}
            // onFocus={focus.email}
            handleOnChangeFunc={handleInputChangeFunc} />

          <Button value='Sign up' bgc="#2da44e" color="#ffffff" />
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

export default connect(mapPropsToState)(SignUp)