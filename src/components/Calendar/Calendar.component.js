import { useState, useEffect } from 'react'

/* import css */
import './Calendar.component.css'

function Calendar({ handleClickCalendarFunc }) {

  const date_now = new Date()
  const monthStringArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  const [calendar, setCalendar] = useState([])
  const [month, setMonth] = useState(date_now.getMonth())
  const [year, setYear] = useState(date_now.getFullYear())

  useEffect(() => {
    const calendar = genCalendar()
    setCalendar(calendar)
  }, [year, month])

  const monthToString = (index) => {
    return monthStringArr[index]
  }

  const genCalendar = () => {

    let calendar = []

    const start_day_of_month = new Date(year, month, 1)

    /* if not Sunday calculate prev month */
    if (start_day_of_month.getDay() !== 0) {
      const day_of_prev_month = new Date(year, month, 0).getDate()
      const prev_day_start = day_of_prev_month - (start_day_of_month.getDay() - 1)

      for (let i = 0; i < start_day_of_month.getDay(); i++) {
        calendar.push(
          {
            date: new Date(year, month - 1, prev_day_start + i),
            dayoff_status: true
          }
        )
      }
    }

    const end_day_of_month = new Date(year, month + 1, 0)
    const day_of_month = end_day_of_month.getDate()

    for (let i = 1; i <= day_of_month; i++) {
      calendar.push(
        {
          date: new Date(year, month, i),
          dayoff_status: false
        }
      )
    }

    /* if not Saturday calculate next month */
    if (end_day_of_month.getDay() !== 6) {
      for (let i = 0; i < 6 - end_day_of_month.getDay(); i++) {
        calendar.push(
          {
            date: new Date(year, month + 1, i + 1),
            dayoff_status: true
          }
        )
      }
    }

    return calendar
  }

  const handleOnClickPrevMonth = () => {
    if (month === 0) {
      setMonth(11)
      setYear(year - 1)
    } else {
      setMonth(month - 1)
    }
  }

  const handleOnClickNextMonth = () => {
    if (month === 11) {
      setMonth(0)
      setYear(year + 1)
    } else {
      setMonth(month + 1)
    }
  }

  const handleOnClickNextYear = () => {
    setYear(year + 1)
  }

  const handleOnClickPrevYear = () => {
    setYear(year - 1)
  }

  return (
    <div className="calendar__container">
      <div className="calendar__header">
        <div className="calendar__header__month">
          <span className="prev__next__button" onClick={handleOnClickPrevMonth}>&#10094;</span>
          <span>{monthToString(month)}</span>
          <span className="prev__next__button" onClick={handleOnClickNextMonth}>&#10095;</span>
        </div>
        <div className="calendar__header__year">
          <span className="prev__next__button" onClick={handleOnClickPrevYear}>&#10094;</span>
          <span>{year}</span>
          <span className="prev__next__button" onClick={handleOnClickNextYear}>&#10095;</span>
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
          calendar.length
          &&
          calendar.map((val, index) => {
            return (
              <div
                className={val.dayoff_status ? 'dayoff' : 'day'}
                key={index}
                onClick={() => val.dayoff_status ? null : handleClickCalendarFunc(val.date)}>
                {val.date.getDate()}
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default Calendar
