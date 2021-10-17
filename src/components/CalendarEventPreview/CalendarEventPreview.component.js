/* import css */
import './CalendarEventPreview.component.css'

function CalendarPreview({ date, amont, date_of_month, handleClickFunc = () => null }) {

  const monthCalendar = new Date(date)
  const monthStringArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  const monthToString = (index) => {
    return monthStringArr[index]
  }

  return (
    <div className="calendar__review__container">
      <div className="calendar__header">
        <div className="calendar__header__month">
          <span>{monthToString(monthCalendar.getMonth())}</span>
        </div>
        <div className="calendar__header__year">
          <span>{monthCalendar.getFullYear()}</span>
        </div>
      </div>
      <div className="calendar__weekday">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>
      <div className="calendar__date">
        {
          date_of_month.length
          &&
          date_of_month.map((val, index) => {
            return (
              <div
                className={val.dayoff_status ? 'dayoff__noclick' : 'day'}
                key={index}
                onClick={() => !val.dayoff_status ? handleClickFunc(date, index, val.date, val.amont) : null}>
                {new Date(val.date).getDate()}
                {
                  !val.dayoff_status &&
                  <div className="day__amont">
                    {
                      !val.amont && val.amont !== 0
                      ?
                      <p className="empty">ว่าง {amont} คน</p>
                      :
                      val.amont === 0 ?
                        <p className="full">เต็ม</p>
                        :
                        <p className="empty">ว่าง {val.amont} คน</p>
                      
                    }
                  </div>
                }
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default CalendarPreview
