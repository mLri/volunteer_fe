import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'

import axios from 'axios'


import { FaEdit } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'

import { URL } from '../../../global_variable'

/* import css */
import './EventBook.view.css'

function EventBook() {

  const { event_id } = useParams()

  const [state, setState] = useState('')

  useEffect(() => {
    getBookEventList()
  }, [])

  const getBookEventList = async () => {
    try {
      const headers = {
        'Content-Type': 'application/json',
      }
      const get_book_events = await axios.get(`${URL}/book_events?event_id=${event_id}`, { headers })
      setState(get_book_events.data)
    } catch (error) {
      console.log('error -> ', error)
    }
  }

  const deleteEvent = async (event_id) => {
    if (window.confirm('Are you sure you wish to delete this item?')) {
      const headers = {
        'Content-Type': 'application/json',
      }
      await axios.delete(`${URL}/book_events/${event_id}`, { headers })

      const delete_event = state.filter(val => val._id !== event_id)
      setState(delete_event)
    }
  }

  return (
    <div className="event__book__container">
      <div className="event__book__content">
        <div className="event__book__header">
          <h1>Event name</h1>
        </div>

        <div className="event__book__body">
          <div className="event__book__table">

            <div className="event__book__table__head">
              <div className="event__book__table__head__colum">
                Prefix
              </div>
              <div className="event__book__table__head__colum">
                Name
              </div>
              <div className="event__book__table__head__colum">
                Edit
              </div>
              <div className="event__book__table__head__colum">
                Delete
              </div>
            </div>

            <div className="event__book__table__body">
              {
                state.length ?
                state.map((val, index) => (
                  <div className="event__book__table__body__row" key={index}>
                    <div className="event__book__table__body__colum">
                      {val.prefix}
                    </div>
                    <div className="event__book__table__body__colum">
                      {val.firstname} {val.lastname}
                    </div>
                    <div className="event__book__table__body__colum">
                      <div className="event__book__table__edit">
                        <Link to={`/admin/events/${val.event_id}/book/${val._id}/edit`}>
                          <FaEdit color="blue" size="1.5em" />
                        </Link>
                      </div>
                    </div>
                    <div className="event__book__table__body__colum">
                      <div className="event__book__table__body__colum__delete">
                        <span onClick={() => deleteEvent(val._id)} className="event__book__table__delete">
                          <MdDelete color="#ff6565" size="1.5em" />
                        </span>
                      </div>
                    </div>
                  </div>
                ))
                :
                <div className="event__book__table__body__colum__empty">empty data</div>
              }
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}

export default EventBook
