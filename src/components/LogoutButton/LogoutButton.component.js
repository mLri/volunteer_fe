import React from 'react'
import { Link } from 'react-router-dom'


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
        !isLogin ?
          <>
            <span className="signin"><Link to="/login">Signin</Link></span>
            <span className="signup"><Link to="/signup">singup</Link></span>
          </>
          :
          <span className="logout" onClick={logoutFunction}>{title}</span>
      }
    </div>
  )
}

export default LogoutButton