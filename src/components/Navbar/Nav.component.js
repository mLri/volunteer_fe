import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

/* import css */
import './Nav.component.css'

function Navbar({ logo, title, auth }) {
  return (
    <div className="nav__container">
      <div className="nav__logo">
        <img src={logo} className="nav__logo__img" alt="logo" />
      </div>
      <div className="nav__title">
        {
          auth.permissions === 'admin' ?
            <Link to="/admin">{title}</Link>
            :
            <Link to='/'>{title}</Link>
        }
      </div>
    </div >
  )
}

const mapPropsToState = (state) => {
  return {
    auth: state.auth
  }
}

export default connect(mapPropsToState)(Navbar)
