import { useState, useEffect } from 'react'
import axios from 'axios'
import { useHistory } from 'react-router'

import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import { URL_API } from '../../../global_variable'

/* import css */
import './CreateEvent.view.css'

/* import components */
import Input from '../../../components/Input/Input.component'
import Calendar from '../../../components/Calendar/Calendar.component'
import Button from '../../../components/Button/Button.component'
import CalendarPreview from '../../../components/CalendarPreview/CalendarPreview.component'
import Upload from '../../../components/Upload/Upload.component'

function CreateEvent() {

  let history = useHistory()

  const [state, setState] = useState({
    name: '',
    detail: EditorState.createEmpty(),
    start_date: '',
    end_date: '',
    unit_per_day: 1,
    calendars: [],
    image: ''
  })

  const [editorState, setEditorState] = useState(EditorState.createEmpty())

  const [img, setImg] = useState(null)
  const [previewImg, setPreviewImg] = useState(null)
  const [showStartCalendar, setShowStartCalendar] = useState(false)
  const [showEndCalendar, setShowEndCalendar] = useState(false)

  useEffect(() => {
    if (state.start_date && state.end_date) {
      const diff_month = monthDiff(state.start_date, state.end_date)
      let arr = []
      for (let i = 0; i < diff_month; i++) {
        arr.push({
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

        //TODO:: change date to '2021-10-14' format every new Date()
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
          date: d,
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
    // console.log('year -> ', date.getFullYear())
    // console.log('month -> ', date.getMonth())
    // console.log('date => ', date.getDate())
    // console.log('start_date -> ', new Date(`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`))
    setState({
      ...state,
      // start_date: new Date(`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`)
      start_date: date
    })
    setShowStartCalendar(!showStartCalendar)
  }

  const handleClickCalendarEndDateFunc = (date) => {
    setState({
      ...state,
      // end_date: new Date(`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`)
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

  const handleClickCalendarReviewFunc = (date, index) => {
    let find_month = state.calendars.find(val => {
      return val.date.getMonth() === date.getMonth()
    })
    find_month.date_of_month[index].dayoff_status = !find_month.date_of_month[index].dayoff_status
    setState({
      ...state,
      calendars: state.calendars
    })
  }

  const createEvent = async (e) => {
    e.preventDefault()

    const formData = new FormData()

    if (img) formData.append('image', img, img.name)

    formData.append('name', state.name)
    formData.append('detail', JSON.stringify(convertToRaw(state.detail.getCurrentContent())))
    // formData.append('detail', state.detail)
    formData.append('start_date', state.start_date)
    formData.append('end_date', state.end_date)
    formData.append('unit_per_day', state.unit_per_day)
    formData.append('calendars', JSON.stringify(state.calendars))

    const headers = {
      "Content-Type": 'multipart/form-data',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
    await axios.post(`${URL_API}/events`, formData, { headers })

    history.push('/admin')
  }

  const cancelEvent = (e) => {
    e.preventDefault()

    setState({
      name: '',
      detail: '',
      start_date: '',
      end_date: '',
      unit_per_day: 0,
      calendars: [],
      image: ''
    })
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }

  const handleOnUploadImg = async (e) => {
    setPreviewImg(URL.createObjectURL(e.target.files[0]))
    setImg(e.target.files[0])
  }

  const onEditorStateChange = (edit) => {
    setState({
      ...state,
      detail: edit
    })
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
            <Editor
              editorStyle={{ border: "1px solid #F1F1F1" }}
              editorState={state.detail}
              wrapperClassName="wrapper-class"
              editorClassName="editor-class"
              toolbarClassName="toolbar-class"
              onEditorStateChange={onEditorStateChange}
            />
            <textarea
              disabled
              value={draftToHtml(convertToRaw(state.detail.getCurrentContent()))}
            />
            {/* <textarea
              onChange={handleInputChangeFunc}
              value={state.detail}
              name="detail"
              cols="30"
              rows="5"></textarea> */}

            <label htmlFor="image">รูปกิจกรรม</label>
            <Upload
              handleOnChangeFunc={handleOnUploadImg} />
            {
              previewImg &&
              <img className="preview__img" src={previewImg} />
            }

            <label htmlFor="start_date">วันที่เริ่มกิจกรรม</label>
            <input
              type="text"
              readOnly
              // value={state.start_date}
              value={state.start_date.toLocaleString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
            />
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
              // value={state.end_date}
              value={state.end_date.toLocaleString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
            />
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
                    handleClickFunc={handleClickCalendarReviewFunc} />
                )
              })
            }

            <div className="create__event__btn">
              <div>
                <Button value="บันทึก" bgc="#2da44e" color="#ffffff" />
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

export default CreateEvent
