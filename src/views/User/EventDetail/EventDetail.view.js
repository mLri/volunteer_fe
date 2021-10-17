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
import ModalAlert from '../../../components/ModalAlert/ModalAlert.component'

function EventDetail() {

  const { event_id } = useParams()

  const monthStringArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  const [event, setEvent] = useState('')
  const [calendarIdx, setCalendarIdx] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [showModalAlertError, setShowModalAlertError] = useState(false)
  const [showModalAlertSuccess, setShowModalAlertSuccess] = useState(false)
  const [messageAlert, setMessageAlert] = useState('')


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

  const handleCalendarPreviewClick = (month, index, date, amont) => {
    let date_obj = new Date(date)
    setState({
      ...state,
      event_id: event._id,
      date_time: `${date_obj.getFullYear()}-${date_obj.getMonth() + 1}-${date_obj.getDate()}`
    })

    if (amont === 0) {
      //set full madal
    } else {
      setShowModal(true)
    }
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

  const handleCloseModalAlertFn = () => {
    setShowModalAlertError(false)
    setShowModalAlertSuccess(false)
    setMessageAlert('')
  }

  const handleSubmitBookEvent = async (e) => {
    e.preventDefault()
    try {
      const headers = {
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
      await axios.post(`${URL}/book_events`, { ...state }, { headers })

      getEvent()

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
      setShowModalAlertSuccess(true)
      setMessageAlert('Book success.')

      setTimeout(function(){
        setShowModalAlertSuccess(false)
        setMessageAlert('')
      }, 2000)
    } catch (error) {
      setMessageAlert(error.response.data.message)
      setShowModalAlertError(true)
    }
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
              amont={event.unit_per_day}
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

      {
        showModalAlertError &&
        <ModalAlert message={messageAlert} handleCloseModalFn={handleCloseModalAlertFn} />
      }

      {
        showModalAlertSuccess &&
        <ModalAlert type="success" message={messageAlert} handleCloseModalFn={handleCloseModalAlertFn} />
      }

    </div >
  )
}

export default EventDetail
