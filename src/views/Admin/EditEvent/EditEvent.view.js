import { useState, useEffect } from 'react'
import { useHistory } from 'react-router'
import { useParams } from 'react-router-dom'
import axios from 'axios'

import { URL } from '../../../global_variable'

/* import css */
import './EditEvent.view.css'

/* import components */
import Input from '../../../components/Input/Input.component'
import Calendar from '../../../components/Calendar/Calendar.component'
import Button from '../../../components/Button/Button.component'
import CalendarPreview from '../../../components/CalendarPreview/CalendarPreview.component'

function EditEvent() {

  let history = useHistory()

  const { event_id } = useParams()

  const [state, setState] = useState({
    name: '',
    detail: '',
    start_date: '',
    end_date: '',
    unit_per_day: 0,
    calendars: [],
    image: ''
  })
  const [initState, setInitState] = useState('')

  const [isEditCalendar, setIsEditCalendar] = useState(false)
  const [showStartCalendar, setShowStartCalendar] = useState(false)
  const [showEndCalendar, setShowEndCalendar] = useState(false)

  useEffect(() => {
    getEvent()
  }, [])

  useEffect(() => {
    if (isEditCalendar) {
      const start_date = new Date(state.start_date)
      const end_date = new Date(state.end_date)
      const diff_month = monthDiff(start_date, end_date)
      let arr = []
      for (let i = 0; i < diff_month; i++) {
        arr.push({
          date: new Date(start_date.getFullYear(), start_date.getMonth() + i, 1),
          date_of_month: genCalendarReview(start_date.getFullYear(), start_date.getMonth() + i)
        })
      }
      setState({
        ...state,
        calendars: [...arr]
      })
    }
  }, [state.start_date, state.end_date])

  const getEvent = async () => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
      const get_event = await axios.get(`${URL}/events/${event_id}`, { headers })

      setState(get_event.data)
      /* clone data for cancel event */
      setInitState(JSON.parse(JSON.stringify(get_event.data)))
    } catch (error) {
      if (error.response.data.message === 'jwt expired' || error.response.data.message === 'jwt malformed' || error.response.data.message === 'invalid signature' || error.response.data.message === 'Unauthorized') {
        localStorage.removeItem('token')
        history.push('/login')
      }
    }
  }

  const monthDiff = (start_date, end_date) => {
    let months;
    months = (end_date.getFullYear() - start_date.getFullYear()) * 12;
    months -= start_date.getMonth();
    months += end_date.getMonth();
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
          date: new Date(year, month, i),
          dayoff_status: (new Date(state.start_date) - d <= 0 && new Date(state.end_date) - d >= 0) ? false : true,
          handle_click: (new Date(state.start_date) - d <= 0 && new Date(state.end_date) - d >= 0) ? true : false
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
    setIsEditCalendar(true)
    setShowStartCalendar(!showStartCalendar)
  }

  const handleClickCalendarEndDateFunc = (date) => {
    setState({
      ...state,
      end_date: date
    })
    setIsEditCalendar(true)
    setShowEndCalendar(!showEndCalendar)
  }

  const handleToggleStartCalendar = () => {
    setShowStartCalendar(!showStartCalendar)
  }

  const handleToggleEndCalendar = () => {
    setShowEndCalendar(!showEndCalendar)
  }

  const handleClickCalendarReviewFunc = (date, index) => {
    let find_month = state.calendars.find(val => {
      return new Date(val.date).getMonth() === date.getMonth()
    })
    find_month.date_of_month[index].dayoff_status = !find_month.date_of_month[index].dayoff_status
    setState({
      ...state,
      calendars: state.calendars
    })
  }

  const updateEvent = async (e) => {
    e.preventDefault()

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
    await axios.patch(`${URL}/events/${event_id}`, { ...state }, { headers })

    history.push('/admin')
  }

  const cancelEvent = (e) => {
    e.preventDefault()

    setIsEditCalendar(false)
    /* clone data cuz we don't want relation object */
    setState(JSON.parse(JSON.stringify(initState)))
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }

  return (
    <div className="edit__event__container">
      <div className="edit__event__content">
        <div className="edit__event__header">
          <h1>Edit event</h1>
        </div>
        <div className="create__event__body">
          <form onSubmit={updateEvent}>
            <label htmlFor="name">ชื่อกิจกรรม</label>
            <Input
              name='name'
              placeholder='type event name'
              value={state.name}
              handleOnChangeFunc={handleInputChangeFunc} />

            <label htmlFor="detail">รายละเอียดกิจกรรม</label>
            <textarea
              onChange={handleInputChangeFunc}
              value={state.detail}
              name="detail"
              cols="30"
              rows="5"></textarea>

            <label htmlFor="start_date">วันที่เริ่มกิจกรรม</label>
            <input
              type="text"
              readOnly
              value={new Date(state.start_date).toLocaleString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })} />
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
              value={new Date(state.end_date).toLocaleString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })} />
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
              state.calendars
              &&
              state.calendars.map((val, index) => {
                return (
                  <CalendarPreview
                    key={index}
                    date={val.date}
                    date_of_month={val.date_of_month}
                    handleClickFunc={handleClickCalendarReviewFunc}
                  />
                )
              })
            }

            <div className="edit__event__btn">
              <div>
                <Button
                  value="แก้ไข"
                  bgc="#3f83ff"
                  color="#ffffff" />
                <Button
                  handleSubmitFunc={cancelEvent}
                  value="ยกเลิก"
                  bgc="red"
                  color="#ffffff" />
              </div>
            </div>
          </form>

        </div>
      </div>
    </div>
  )
}

export default EditEvent
