import { useEffect } from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router'
import axios from 'axios'
import { Link } from 'react-router-dom'

import { URL } from '../../global_variable'

/* import css */
import './Home.view.css'

function Home(props) {

  console.log('render Home')

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
            <Link to="/create/event">+</Link>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Detail</th>
              <th>Edit</th>
              <th>Delete</th>
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
                    <td>edit</td>
                    <td><span onClick={() => deleteEvent(val._id)}>delete</span></td>
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