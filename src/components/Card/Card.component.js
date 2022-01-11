/* import css */
import './Card.component.css'

import img_default from '../../img_default.png'

/* import components */
import Button from '../Button/Button.component'

function Card({ img_url = null, title, show_status = false, status = true, handleClick = () => null }) {
  return (
    <div className="card__container">
      <div className="card__image">
        <img src={img_url || img_default} alt="image event" />
      </div>
      <div className="card__title">{title}</div>
      <div className="card__detail__btn">
        <Button
          handleSubmitFunc={handleClick}
          value="ดูรายละเอียด"
          bgc="rgb(63 131 255)"
          color="#ffffff" />
      </div>
      {
        show_status &&
        <div className="card__status">
          {
            status ?
              <span className="card__status__process">Process</span>
              :
              <span className="card__status__done">Done</span>
          }
        </div>
      }
      
    </div>
  )
}

export default Card
