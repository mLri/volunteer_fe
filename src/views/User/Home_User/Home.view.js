import { useState, useEffect } from 'react'
import { useHistory } from 'react-router'

import axios from 'axios'

import { URL } from '../../../global_variable'

/* import css */
import './Home.view.css'

/* import components */
import Card from '../../../components/Card/Card.component'

function Home() {

  let history = useHistory()

  const [events, setEvents] = useState('')

  useEffect(() => {
    getListEvent()
  }, [])

  const getListEvent = async () => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
      const get_events = await axios.get(`${URL}/events`, { headers })

      setEvents(get_events.data)
    } catch (error) {
      console.log('error -> ', error)
    }
  }

  const handleClickCard = (id) => {
    console.log('click card -> ', id)
    history.push(`/detail/${id}`)
  }

  return (
    <div className="home__container">
      <div className="home__content">
        {
          events &&
          events.map((val, index) => (
            <div className="card" key={index}>
              <Card title={val.name} handleClick={() => handleClickCard(val._id)} />
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Home