import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

import { URL } from '../../../global_variable'
import img_default from '../../../img_default.png'

import { MdClear } from 'react-icons/md'

/* import css */
import './EventDetail.view.css'

/* import components */
import CalendarEventPreview from '../../../components/CalendarEventPreview/CalendarEventPreview.component'
import Input from '../../../components/Input/Input.component'
import Button from '../../../components/Button/Button.component'

function EventDetail() {

  const { event_id } = useParams()

  const monthStringArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  const [event, setEvent] = useState('')
  const [calendarIdx, setCalendarIdx] = useState(0)
  const [showModal, setShowModal] = useState(false)

  const [dateSelectedIndex, setDateSelectedIndex] = useState(null)
  const [monthSelected, setMonthSelected] = useState(null)

  const [state, setState] = useState({
    event_id: '',
    employee_id: '',
    prefix: '',
    firstname: '',
    lastname: '',
    institution: '',
    tel: '',
    date_time: ''
  })

  useEffect(() => {
    getEvent()
  }, [])

  const monthToString = (index) => {
    return monthStringArr[index]
  }

  const getEvent = async () => {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
    const event = await axios.get(`${URL}/events/${event_id}`, { headers })
    setEvent(event.data)
  }

  const handleCalendarPreviewClick = (month, index, date) => {
    // let date_obj = new Date(date)
    setState({
      ...state,
      event_id: event._id,
      date_time: new Date(date)
      // date_time: `${date_obj.getFullYear()}-${date_obj.getMonth()}-${date_obj.getDate()}`
    })
    setDateSelectedIndex(index)
    setMonthSelected(new Date(month))
    setShowModal(true)
  }

  const handleClickTap = (index) => {
    setCalendarIdx(index)
  }

  const handleInputChange = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value
    })
  }

  const handleClearModal = () => {
    setState({
      event_id: '',
      employee_id: '',
      prefix: '',
      firstname: '',
      lastname: '',
      institution: '',
      tel: '',
      date_time: ''
    })
    setShowModal(false)
  }

  const handleSubmitBookEvent = async (e) => {
    e.preventDefault()

    const headers = {
      'Content-Type': 'application/json',
      // 'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
    await axios.post(`${URL}/book_events`, { ...state }, { headers })

    /* decrease amont */
    let find_month = event.calendars.find(val => {
      return new Date(val.date).getMonth() === monthSelected.getMonth()
    })
    --find_month.date_of_month[dateSelectedIndex].amont
    setEvent({
      ...event,
      calendars: event.calendars
    })

    await axios.patch(`${URL}/events/${event_id}`, { ...event }, { headers })

    setState({
      event_id: '',
      employee_id: '',
      prefix: '',
      firstname: '',
      lastname: '',
      institution: '',
      tel: '',
      date_time: ''
    })
    setDateSelectedIndex(null)
    setMonthSelected(null)
    setShowModal(false)
  }

  return (
    <div className="event__detail__container">
      <div className="event__detail__content">
        <div className="event__detail__img">
          <img src={img_default} alt="" />
        </div>
        <div className="event__detail__detail">
          <p>
            {
              event.detail
            }
          </p>
        </div>
        <div className="event__detail__period">
          <p>กิจกรรมเริ่มวันที่ : {new Date(event.start_date).toLocaleString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p>กิจกรรมสิ้นสุดวันที่ : {new Date(event.end_date).toLocaleString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="event__detail__calendar__tap">
          {
            event.calendars &&
            event.calendars.map((val, index) => {
              return (
                <div
                  onClick={() => handleClickTap(index)}
                  key={index}
                  className="tap">
                  {monthToString(new Date(val.date).getMonth())}
                </div>
              )
            })
          }
        </div>
        <div className="event__detail__calendar">
          {
            event.calendars &&
            <CalendarEventPreview
              handleClickFunc={handleCalendarPreviewClick}
              date={event.calendars[calendarIdx].date}
              date_of_month={event.calendars[calendarIdx].date_of_month} />
          }
        </div>
      </div>

      {
        showModal &&
        < div className="modal__book__event">
          <div className="modal__book__content">
            <div onClick={handleClearModal} className="modal__book__clear">
              <MdClear color="red" size="2em" />
            </div>
            <div className="modal__book__event__head">
              <h2>ลงทะเบียนจิตอาสา</h2>
            </div>
            <div className="modal__book__event__body">
              <form onSubmit={handleSubmitBookEvent}>
                <label htmlFor="employee_id">รหัสพนักงาน</label>
                <Input
                  handleOnChangeFunc={handleInputChange}
                  value={state.employee_id}
                  name="employee_id"
                  placeholder="รหัสพนักงาน" />

                <label htmlFor="prefix">คำนำหน้า</label>
                <Input
                  handleOnChangeFunc={handleInputChange}
                  value={state.prefix}
                  name="prefix"
                  placeholder="นาย / นาง / นางสาว" />

                <label htmlFor="firstname">ชื่อ</label>
                <Input
                  handleOnChangeFunc={handleInputChange}
                  value={state.firstname}
                  name="firstname"
                  placeholder="ชื่อ" />

                <label htmlFor="lastname">นามสกุล</label>
                <Input
                  handleOnChangeFunc={handleInputChange}
                  value={state.lastname}
                  name="lastname"
                  placeholder="นามสกุล" />

                <label htmlFor="institution">สังกัด</label>
                <Input
                  handleOnChangeFunc={handleInputChange}
                  value={state.institution}
                  name="institution"
                  placeholder="ศคบ" />

                <label htmlFor="tel">เบอร์โทร</label>
                <Input
                  handleOnChangeFunc={handleInputChange}
                  value={state.tel}
                  name="tel"
                  placeholder="09x-xxxxxxx" />

                <label htmlFor="date_time">วันที่อาสา</label>
                <Input
                  handleOnChangeFunc={handleInputChange}
                  value={state.date_time.toLocaleString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
                  readOnly
                  name="date_time" />

                <div className="modal__book__event__btn">
                  <div className="btn__submit">
                    <Button value="บันทึก" bgc="#2da44e" color="#ffffff" />
                  </div>
                </div>

              </form>
            </div>
          </div>
        </div>
      }

    </div >
  )
}

export default EventDetail
