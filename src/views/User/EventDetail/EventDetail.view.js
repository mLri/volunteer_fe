import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { connect } from 'react-redux'


import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';

import { URL_API } from '../../../global_variable'
import { MdClear } from 'react-icons/md'

/* import css */
import './EventDetail.view.css'

/* import components */
import CalendarEventPreview from '../../../components/CalendarEventPreview/CalendarEventPreview.component'
import Input from '../../../components/Input/Input.component'
import Button from '../../../components/Button/Button.component'
import ModalAlert from '../../../components/ModalAlert/ModalAlert.component'

import img_default from '../../../img_default.png'

function EventDetail(props) {

  const { event_id } = useParams()

  const monthStringArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  const [event, setEvent] = useState('')
  const [calendarIdx, setCalendarIdx] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [showModalAlertError, setShowModalAlertError] = useState(false)
  const [showModalAlertSuccess, setShowModalAlertSuccess] = useState(false)
  const [messageAlert, setMessageAlert] = useState('')
  const [showModalLoginAlert, setShowModalLoginAlert] = useState(false)

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

  const [bookEvent, setBookEvent] = useState([])

  useEffect(() => {
    getEvent()
    if (props.auth.isLogin) {
      setState({
        ...state,
        employee_id: props.auth.principal.employee_id,
        prefix: props.auth.principal.prefix,
        firstname: props.auth.principal.first_name,
        lastname: props.auth.principal.last_name,
        institution: props.auth.principal.institution,
        tel: props.auth.principal.tel,
      })
    }
  }, [props])

  const monthToString = (index) => {
    return monthStringArr[index]
  }

  const getEvent = async () => {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
    const event = await axios.get(`${URL_API}/events/${event_id}`, { headers })

    if (event.data && !event.data.success_status) {
      const book_event = await axios.get(`${URL_API}/book_events?event_id=${event_id}`, { headers })
      setBookEvent(book_event.data)
    }
    setEvent(event.data)
  }

  const handleCalendarPreviewClick = (month, index, date, amont) => {
    if (!props.auth.isLogin) {
      setShowModalLoginAlert(true)
    } else {
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
    // setState({
    //   event_id: '',
    //   employee_id: '',
    //   prefix: '',
    //   firstname: '',
    //   lastname: '',
    //   institution: '',
    //   tel: '',
    //   date_time: ''
    // })
    setShowModal(false)
  }

  const handleCloseModalAlertFn = () => {
    setShowModalAlertError(false)
    setShowModalAlertSuccess(false)
    setShowModalLoginAlert(false)
    setMessageAlert('')
  }

  const handleSubmitBookEvent = async (e) => {
    e.preventDefault()
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
      await axios.post(`${URL_API}/book_events`, { ...state }, { headers })

      getEvent()

      // setState({
      //   event_id: '',
      //   employee_id: '',
      //   prefix: '',
      //   firstname: '',
      //   lastname: '',
      //   institution: '',
      //   tel: '',
      //   date_time: ''
      // })
      setShowModal(false)
      setShowModalAlertSuccess(true)
      setMessageAlert('Book success.')

      setTimeout(function () {
        setShowModalAlertSuccess(false)
        setMessageAlert('')
      }, 1500)
    } catch (error) {
      setMessageAlert(error.response.data.message)
      setShowModalAlertError(true)
    }
  }

  function createMarkup() {
    const ct = EditorState.createWithContent(
      convertFromRaw(JSON.parse(event.detail))
    )
    let plaintext = draftToHtml(convertToRaw(ct.getCurrentContent()))
    const regx = /<p><\/p>/gm
    let replace_p_to_br = plaintext.replace(regx, '<p><br></p>')
    return { __html: replace_p_to_br }
  }

  return (
    <div className="event__detail__container">
      <div className="event__detail__content">
        <div className="event__detail__img">
          {
            (event && event.image)
              ?
              <img src={`${URL_API}/events/files/img/${event.image.name}`} alt="" />
              :
              <img src={img_default} />
          }
        </div>
        <div className="event__detail__detail">
          {
            event.detail &&
            <div dangerouslySetInnerHTML={createMarkup()}></div>
          }
        </div>
        <div className="event__detail__period">
          <p>?????????????????????????????????????????????????????? : {new Date(event.start_date).toLocaleString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p>???????????????????????????????????????????????????????????? : {new Date(event.end_date).toLocaleString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        {
          event.success_status ?
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
                    date={event.calendars[calendarIdx].date}
                    date_of_month={event.calendars[calendarIdx].date_of_month} />
                }
              </div>
            </>
            :
            <>
              <h2>?????????????????????????????????????????????????????????</h2>
              <br />
              <table>
                <thead>
                  <tr>
                    <th>?????????????????????????????????</th>
                    <th>????????????????????????</th>
                    <th>????????????</th>
                    <th>?????????????????????</th>
                    <th>??????????????????</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    bookEvent.length ?
                      bookEvent.map((val, index) => (
                        <tr key={index}>
                          <td>{val.employee_id}</td>
                          <td>{val.prefix}</td>
                          <td>{val.firstname}</td>
                          <td>{val.lastname}</td>
                          <td>{val.institution}</td>
                        </tr>
                      ))
                      :
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center' }}>empty data</td>
                      </tr>
                  }
                </tbody>
              </table>
            </>
        }
      </div>

      {
        showModalLoginAlert ?
          <ModalAlert message='Please login!' handleCloseModalFn={handleCloseModalAlertFn} />
          :
          showModal &&
          < div className="modal__book__event">
            <div className="modal__book__content">
              <div onClick={handleClearModal} className="modal__book__clear">
                <MdClear color="red" size="2em" />
              </div>
              <div className="modal__book__event__head">
                <h2>????????????????????????????????????????????????</h2>
              </div>
              <div className="modal__book__event__body">
                <form onSubmit={handleSubmitBookEvent}>
                  <label htmlFor="employee_id">?????????????????????????????????</label>
                  <Input
                    handleOnChangeFunc={handleInputChange}
                    value={state.employee_id}
                    name="employee_id"
                    readOnly
                    placeholder="?????????????????????????????????" />

                  <label htmlFor="prefix">????????????????????????</label>
                  <Input
                    handleOnChangeFunc={handleInputChange}
                    value={state.prefix}
                    name="prefix"
                    readOnly
                    placeholder="????????? / ????????? / ??????????????????" />

                  <label htmlFor="firstname">????????????</label>
                  <Input
                    handleOnChangeFunc={handleInputChange}
                    value={state.firstname}
                    name="firstname"
                    readOnly
                    placeholder="????????????" />

                  <label htmlFor="lastname">?????????????????????</label>
                  <Input
                    handleOnChangeFunc={handleInputChange}
                    value={state.lastname}
                    name="lastname"
                    readOnly
                    placeholder="?????????????????????" />

                  <label htmlFor="institution">??????????????????</label>
                  <Input
                    handleOnChangeFunc={handleInputChange}
                    value={state.institution}
                    name="institution"
                    readOnly
                    placeholder="?????????" />

                  <label htmlFor="tel">????????????????????????</label>
                  <Input
                    handleOnChangeFunc={handleInputChange}
                    value={state.tel}
                    name="tel"
                    readOnly
                    placeholder="09x-xxxxxxx" />

                  <label htmlFor="date_time">??????????????????????????????</label>
                  <Input
                    handleOnChangeFunc={handleInputChange}
                    value={state.date_time.toLocaleString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
                    readOnly
                    name="date_time" />

                  <div className="modal__book__event__btn">
                    <div className="btn__submit">
                      <Button value="??????????????????" bgc="#2da44e" color="#ffffff" />
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

const mapPropsToState = (state) => {
  return {
    auth: state.auth
  }
}

export default connect(mapPropsToState)(EventDetail)
