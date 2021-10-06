import { useState, useEffect } from 'react'
import axios from 'axios'
import { useHistory } from 'react-router'

import { URL } from '../../global_variable'

/* import css */
import './CreateEvent.view.css'

/* import components */
import Input from '../../components/Input/Input.component'
import Calendar from '../../components/Calendar/Calendar.component'
import Button from '../../components/Button/Button.component'
import CalendarPreview from '../../components/CalendarPreview/CalendarPreview.component'

function CreateEvent() {

  let history = useHistory()

  const [state, setState] = useState({
    name: '',
    detail: '',
    start_date: '',
    end_date: '',
    unit_per_day: 0,
    calendars: [],
    image: ''
  })

  const [showStartCalendar, setShowStartCalendar] = useState(false)
  const [showEndCalendar, setShowEndCalendar] = useState(false)

  useEffect(() => {
    if (state.start_date && state.end_date) {
      const diff_month = monthDiff(state.start_date, state.end_date)
      console.log('diff -> ', diff_month)
      let arr = []
      for (let i = 0; i < diff_month; i++) {
        arr.push({
          muid: Math.random().toString(36).substr(2),
          date: new Date(state.start_date.getFullYear(), state.start_date.getMonth() + i, 1),
          date_of_month: genCalendarReview(state.start_date.getFullYear(), state.start_date.getMonth() + i)
        })
      }
      setState({
        ...state,
        calendars: arr
      })
    }
  }, [state.start_date, state.end_date])

  const monthDiff = (start_date, end_date) => {
    let months;
    months = (end_date.getFullYear() - start_date.getFullYear()) * 12;
    months -= start_date.getMonth();
    months += end_date.getMonth();
    console.log('months -> ', months)
    return months < 0 ? 0 : months + 1;
  }

  const genCalendarReview = (year, month) => {

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
            dayoff_status: true,
            handle_click: false
          }
        )
      }
    }

    const end_day_of_month = new Date(year, month + 1, 0)
    const day_of_month = end_day_of_month.getDate()

    for (let i = 1; i <= day_of_month; i++) {
      const d = new Date(year, month, i)
      calendar.push(
        {
          duid: Math.random().toString(36).substr(2),
          date: new Date(year, month, i),
          dayoff_status: (state.end_date - d >= 0) ? false : true,
          handle_click: true
        }
      )
    }

    /* if not Saturday calculate next month */
    if (end_day_of_month.getDay() !== 6) {
      for (let i = 0; i < 6 - end_day_of_month.getDay(); i++) {
        calendar.push(
          {
            date: new Date(year, month + 1, i + 1),
            dayoff_status: true,
            handle_click: false
          }
        )
      }
    }

    return calendar
  }

  const handleInputChangeFunc = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value
    });
  }

  const handleClickCalendarStartDateFunc = (date) => {
    setState({
      ...state,
      start_date: date
    })
    setShowStartCalendar(!showStartCalendar)
  }

  const handleClickCalendarEndDateFunc = (date) => {
    setState({
      ...state,
      end_date: date
    })
    setShowEndCalendar(!showEndCalendar)
  }

  const handleToggleStartCalendar = () => {
    setShowStartCalendar(!showStartCalendar)
  }

  const handleToggleEndCalendar = () => {
    setShowEndCalendar(!showEndCalendar)
  }

  const handleClickCalendarReviewFunc = (muid, duid) => {
    let calendars = state.calendars
    let m = calendars.find(val => val.muid === muid)
    let d = m.date_of_month.find(val => val.duid === duid)
    d.dayoff_status = !d.dayoff_status
    setState({
      ...state,
      calendars: calendars
    })
  }

  const createEvent = async (e) => {
    e.preventDefault()

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
    await axios.post(`${URL}/events`, { ...state }, { headers })

    history.push('/')
  }

  return (
    <div className="create__event__container">
      <div className="create__event__content">
        <div className="create__event__header">
          <h1>Create event</h1>
        </div>
        <div className="create__event__body">
          <form onSubmit={createEvent}>
            <label htmlFor="name">ชื่อกิจกรรม</label>
            <Input
              name='name'
              placeholder='type event name'
              value={state.name}
              handleOnChangeFunc={handleInputChangeFunc} />
            <label htmlFor="detail">รายละเอียดกิจกรรม</label>
            <textarea onChange={handleInputChangeFunc} name="detail" id="" cols="30" rows="5"></textarea>

            <label htmlFor="start_date">วันที่เริ่มกิจกรรม</label>
            <input
              type="text"
              readOnly
              value={state.start_date.toLocaleString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })} />
            <span className="calendar__toggle" onClick={handleToggleStartCalendar}>&#128197;</span>
            {
              showStartCalendar
              &&
              <Calendar handleClickCalendarFunc={handleClickCalendarStartDateFunc} />
            }

            <label htmlFor="end_date">วันที่สิ้นสุดกิจกรรม</label>
            <input
              type="text"
              readOnly
              value={state.end_date.toLocaleString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })} />
            <span className="calendar__toggle" onClick={handleToggleEndCalendar}>&#128197;</span>
            {
              showEndCalendar
              &&
              <Calendar handleClickCalendarFunc={handleClickCalendarEndDateFunc} />
            }

            <label htmlFor="unit_per_day">จำนวนคนต่อวัน</label>
            <Input
              name="unit_per_day"
              placeholder="type unit per day"
              value={state.unit_per_day}
              handleOnChangeFunc={handleInputChangeFunc} />


            {
              state.calendars.length
              &&
              state.calendars.map((val, index) => {
                return (
                  <CalendarPreview
                    key={index}
                    muid={val.muid}
                    date={val.date}
                    date_of_month={val.date_of_month}
                    handleClickFunc={handleClickCalendarReviewFunc} />
                )
              })
            }

            <Button value="บันทึก" />
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateEvent
