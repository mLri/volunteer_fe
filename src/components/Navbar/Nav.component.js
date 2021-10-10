import React from 'react'
import { Link } from 'react-router-dom'

/* import css */
import './Nav.component.css'

function Navbar({ logo, title }) {
  return (
    <div className="nav__container">
      <div className="nav__logo">
        <img src={logo} className="nav__logo__img" alt="logo" />
      </div>
      <div className="nav__title"><Link to="/admin">{title}</Link></div>
    </div >
  )
}

export default Navbar
