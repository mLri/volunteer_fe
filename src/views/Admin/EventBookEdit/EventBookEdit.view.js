import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { useHistory } from 'react-router'

import { URL_API } from '../../../global_variable'

/* import css */
import './EventBookEdit.view.css'

/* import components */
import Input from '../../../components/Input/Input.component'
import Button from '../../../components/Button/Button.component'
import CalendarEventPreview from '../../../components/CalendarEventPreview/CalendarEventPreview.component'
import ModalAlert from '../../../components/ModalAlert/ModalAlert.component'

function EventBookEdit() {

  let history = useHistory()

  const { book_event_id, event_id } = useParams()

  const monthStringArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  const [state, setState] = useState('')
  const [event, setEvent] = useState('')

  const [calendarIdx, setCalendarIdx] = useState(0)
  const [showCalendar, setShowCalendar] = useState(false)

  const [showModalAlertSuccess, setShowModalAlertSuccess] = useState(false)
  const [messageAlert, setMessageAlert] = useState('')

  useEffect(() => {
    fetchDate()
  }, [])

  const monthToString = (index) => {
    return monthStringArr[index]
  }

  const getBookEvent = () => {
    try {
      return new Promise((resolve, reject) => {
        const headers = { 'Content-Type': 'application/json' }
        return axios({
          url: `${URL_API}/book_events/${book_event_id}`,
          headers: headers,
          timeout: 10000,
          method: 'GET'
        }).then((response) => {
          resolve(response.data)
        }).catch((error) => {
          resolve(null)
        })
      })
    } catch (error) {
      console.log('error -> ', error)
    }
  }

  const getCalendar = () => {
    try {
      return new Promise((resolve, reject) => {
        const headers = { 'Content-Type': 'application/json' }
        return axios({
          url: `${URL_API}/events/${event_id}`,
          headers: headers,
          timeout: 10000,
          method: 'GET'
        }).then((response) => {
          resolve(response.data)
        }).catch((error) => {
          resolve(null)
        })
      })
    } catch (error) {
      console.log('error -> ', error)
    }
  }

  const fetchDate = async () => {
    let promise1 = getBookEvent();
    let promise2 = getCalendar();

    let [book_event, event] = await Promise.all([promise1, promise2]);
    setState(book_event)
    setEvent(event)
  }

  const handleInputChange = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmitBookEvent = async (e) => {
    e.preventDefault()
    try {
      const headers = { 'Content-Type': 'application/json' }
      await axios.patch(`${URL_API}/book_events/${state._id}`, { ...state }, { headers })

      setShowModalAlertSuccess(true)
      setMessageAlert('Update data success.')

      setTimeout(function () {
        setShowModalAlertSuccess(false)
        setMessageAlert('')
        history.push(`/admin/events/${state.event_id}/book`)
      }, 1000)
    } catch (error) {
      console.log('error -> ', error)
    }
  }

  const handleClickTap = (index) => {
    setCalendarIdx(index)
  }

  const handleCalendarPreviewClick = (month, index, date, amont) => {
    setState({
      ...state,
      date_time: date
    })
    setShowCalendar(false)
  }

  const handleToggleCalendar = () => {
    setShowCalendar(!showCalendar)
  }

  return (
    <div className="event__book__edit__container">
      <div className="event__book__edit__content">
        <div className="event__book__edit__header">
          <h1>event book edit</h1>
        </div>
        <div className="event__book__edit__body">
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
            <input
              value={new Date(state.date_time).toLocaleString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
              readOnly
              name="date_time" />
            <span className="calendar__toggle" onClick={handleToggleCalendar}>&#128197;</span>

            {
              showCalendar &&
              <>
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
                      show_amount={false}
                      date={event.calendars[calendarIdx].date}
                      date_of_month={event.calendars[calendarIdx].date_of_month} />
                  }
                </div>
              </>
            }

            <div className="modal__book__event__btn">
              <div className="btn__submit">
                <Button value="บันทึก" bgc="#2da44e" color="#ffffff" />
              </div>
            </div>

          </form>
        </div>

        {
          showModalAlertSuccess &&
          <ModalAlert type="success" message={messageAlert} />
        }
      </div>
    </div>
  )
}

export default EventBookEdit
