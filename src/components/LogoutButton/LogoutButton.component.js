import React from 'react'

/* import css */
import './LogoutButton.component.css'

import { useHistory } from 'react-router'

function LogoutButton({ title = 'logout', isLogin = false, logout_to = '/', handleLogout }) {

  let history = useHistory()

  const logoutFunction = () => {
    handleLogout()
    history.push(logout_to)
  }

  return (
    <div className="logout">
      {
        isLogin
        &&
        <span onClick={logoutFunction}>{title}</span>
      }
    </div>
  )
}

export default LogoutButton