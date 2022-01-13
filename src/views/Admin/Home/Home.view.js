import { useEffect, useState } from 'react'
// import { connect } from 'react-redux'
import { useHistory } from 'react-router'
import axios from 'axios'
import { Link } from 'react-router-dom'

import { faTrashAlt, faEdit, faPlus, faCommentSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { URL_API } from '../../../global_variable'

/* import css */
import './Home.view.css'

/* import components */
import Pagination from '../../../components/Pagination/Pagination.component'

function Home(props) {

  let history = useHistory()

  const [state, setState] = useState([])

  const [totalPage, setTotalPage] = useState(0)
  const [pageCurent, setPageCurent] = useState(1)

  const limit = 2

  useEffect(() => {
    getEvents()
  }, [pageCurent])

  const getEvents = async () => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
      const get_events = await axios.get(`${URL_API}/events?fields=_id,name,success_status&limit=${limit}&page=${pageCurent}&sorted_order=desc`, { headers })
      setState(get_events.data)
      // props.dispatch({ type: 'SET_EVENTS', payload: get_events.data })

      /* set pagination */
      const get_events_total = await axios.get(`${URL_API}/events?total=true`, { headers })
      if (get_events_total && get_events_total.data > 0) setTotalPage(Math.ceil(get_events_total.data / limit))
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

      const delete_event = state.filter(val => val._id !== event_id)
      setState(delete_event)

      getEvents()
  
      if (pageCurent === 1 && delete_event.length === 0) {
        getEvents()
      } else if (pageCurent !== 1 && delete_event.length === 0) {
        setPageCurent(pageCurent - 1)
      }
      // props.dispatch({ type: 'SET_EVENTS', payload: delete_event })
    }
  }

  const toggleSuccessStatus = async (index) => {
    state[index].success_status = !state[index].success_status
    setState([...state])

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
                        <span className={val.success_status ? 'slider round checked' : 'slider round'}></span>
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
                  <td colSpan="5" style={{ textAlign: 'center' }}>empty data</td>
                </tr>
            }
          </tbody>
        </table>

        <br/>

        {(state.length != 0) && <Pagination totalPage={totalPage} pageCurent={pageCurent} setPageCurent={setPageCurent} />}

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