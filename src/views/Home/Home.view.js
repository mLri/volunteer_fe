import { useEffect } from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router'
import axios from 'axios'
import { Link } from 'react-router-dom'

import { faTrashAlt, faEdit, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { URL } from '../../global_variable'

/* import css */
import './Home.view.css'

function Home(props) {

  let history = useHistory()

  useEffect(() => {
    getEvents()
  }, [])

  const getEvents = async () => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
      const get_events = await axios.get(`${URL}/events?fields=_id,name`, { headers })

      props.dispatch({ type: 'SET_EVENTS', payload: get_events.data })
    } catch (error) {
      if (error.response.data.message === 'jwt expired' || error.response.data.message === 'jwt malformed' || error.response.data.message === 'invalid signature' || error.response.data.message === 'Unauthorized') {
        localStorage.removeItem('token')
        history.push('/login')
      }
    }
  }

  const deleteEvent = async (event_id) => {
    if (window.confirm('Are you sure you wish to delete this item?')) {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
      await axios.delete(`${URL}/events/${event_id}`, { headers })

      const delete_event = props.event.filter(val => val._id !== event_id)
      props.dispatch({ type: 'SET_EVENTS', payload: delete_event })
    }
  }

  return (
    <div className="event__container">
      <div className="event__content">
        <div className="event__header">
          <h1>Menage event</h1>
          <div className="event__create">
            <Link to="/events/create">
              <FontAwesomeIcon icon={faPlus} color="#00e676"></FontAwesomeIcon>
            </Link>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Detail</th>
              <th style={{ textAlign: 'center' }}>Edit</th>
              <th style={{ textAlign: 'center' }}>Delete</th>
            </tr>
          </thead>
          <tbody>
            {
              props.event.length
                ?
                props.event.map((val, index) => (
                  <tr key={index}>
                    <td>{val.name}</td>
                    <td><a href="/test">รายละเอียด</a></td>
                    <td style={{ textAlign: 'center' }}>
                      <span className="event__edit">
                        <Link to={`/events/edit/${val._id}`}>
                          <FontAwesomeIcon icon={faEdit} color="blue"></FontAwesomeIcon>
                        </Link>
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span onClick={() => deleteEvent(val._id)} className="event__delete">
                        <FontAwesomeIcon icon={faTrashAlt} color="red"></FontAwesomeIcon>
                      </span>
                    </td>
                  </tr>
                ))
                :
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center' }}>empty data</td>
                </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}

const mapPropsToState = (state) => {
  return {
    event: state.event
  }
}

export default connect(mapPropsToState)(Home)