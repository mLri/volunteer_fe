import { useEffect, useState } from 'react'
// import { connect } from 'react-redux'
import { useHistory } from 'react-router'
import axios from 'axios'
import { Link } from 'react-router-dom'

import { faTrashAlt, faEdit, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { URL_API } from '../../../global_variable'

/* import css */
import './Home.view.css'

function Home(props) {

  let history = useHistory()

  const [state, setState] = useState([])

  useEffect(() => {
    getEvents()
  }, [])

  const getEvents = async () => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
      const get_events = await axios.get(`${URL_API}/events?fields=_id,name,success_status`, { headers })

      // props.dispatch({ type: 'SET_EVENTS', payload: get_events.data })
      setState(get_events.data)
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
      await axios.delete(`${URL_API}/events/${event_id}`, { headers })

      const delete_event = props.event.filter(val => val._id !== event_id)
      setState(delete_event)
      // props.dispatch({ type: 'SET_EVENTS', payload: delete_event })
    }
  }

  const toggleSuccessStatus = async (index) => {
    const clone_state = state
    clone_state[index].success_status = !state[index].success_status
    setState(clone_state)

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
    await axios.patch(`${URL_API}/events/${state[index]._id}`, { success_status: state[index].success_status }, { headers })
  }

  return (
    <div className="event__container">
      <div className="event__content">
        <div className="event__header">
          <h1>Menage event</h1>
          <div className="event__create">
            <Link to="/admin/events/create">
              <FontAwesomeIcon icon={faPlus} color="#00e676"></FontAwesomeIcon>
            </Link>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Detail</th>
              <th style={{ textAlign: 'center' }}>status</th>
              <th style={{ textAlign: 'center' }}>Edit</th>
              <th style={{ textAlign: 'center' }}>Delete</th>
            </tr>
          </thead>
          <tbody>
            {
              // props.event.length
              state.length
                ?
                state.map((val, index) => (
                  <tr key={index}>
                    <td>{val.name}</td>
                    <td>
                      <Link to={`/admin/events/${val._id}/book`}>
                        รายชื่อผู้ลงทะเบียน
                      </Link>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <label className="switch">
                        <input type="checkbox"
                          defaultChecked={val.success_status}
                          onChange={() => toggleSuccessStatus(index)} />
                        <span className="slider round"></span>
                      </label>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className="event__edit">
                        <Link to={`/admin/events/${val._id}/edit`}>
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

// const mapPropsToState = (state) => {
//   return {
//     event: state.event
//   }
// }

// export default connect(mapPropsToState)(Home)
export default Home