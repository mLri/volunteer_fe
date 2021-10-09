/* import css */
import './CalendarPreview.component.css'

function CalendarPreview({ date, date_of_month, handleClickFunc = () => null }) {

  const monthCalendar = new Date(date)
  const monthStringArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  const monthToString = (index) => {
    return monthStringArr[index]
  }

  return (
    <>
      <div className="note__dayoff">*คลิกวันที่ไม่ต้องการที่ปฏิทินด้านล่าง</div>
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
                  className={val.handle_click ? val.dayoff_status ? 'dayoff' : 'day' : 'dayoff__noclick'}
                  key={index}
                  onClick={() => val.handle_click ? handleClickFunc(monthCalendar, index) : null}>
                  {new Date(val.date).getDate()}
                </div>
              )
            })
          }
        </div>
      </div>
    </>
  )
}

export default CalendarPreview
