import React from 'react'
import { Link } from 'react-router-dom'

import './Menu.component.css'

function Menu({ menu_list }) {
  return (
    <div className="menu__container">
      <ul>
        {
          menu_list.map((val, index) => {
            return <li key={index}><Link to={val.path}>{val.name}</Link></li>
          })
        }
      </ul>
    </div>
  )
}

export default Menu
