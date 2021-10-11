import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

import { URL } from '../../../global_variable'
import img_default from '../../../img_default.png'

/* import css */
import './EventDetail.view.css'

/* import components */
import CalendarEventPreview from '../../../components/CalendarEventPreview/CalendarEventPreview.component'

function EventDetail() {

  const { event_id } = useParams()

  const monthStringArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  const [event, setEvent] = useState('')
  const [calendarIdx, setCalendarIdx] = useState(0)

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

  const handleCalendarPreviewClick = (date) => {
    console.log(new Date(date))
  }

  const handleClickTap = (index) => {
    setCalendarIdx(index)
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
    </div>
  )
}

export default EventDetail
