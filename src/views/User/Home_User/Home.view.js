import { useState, useEffect } from 'react'
import { useHistory } from 'react-router'

import { faSearch, faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import axios from 'axios'

import { URL_API } from '../../../global_variable'

/* import css */
import './Home.view.css'

/* import components */
import Card from '../../../components/Card/Card.component'

function Home() {

  let history = useHistory()

  const [events, setEvents] = useState('')
  const [limit, setLimit] = useState(10)
  const [sortOrder, setSortOrder] = useState('asc')
  const [showFilter, setShowFilter] = useState(false)
  const [search, setSearch] = useState('')
  const [successStatus, setSuccessStatus] = useState('both')

  useEffect(() => {
    getListEvent()
  }, [])

  const getListEvent = async () => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
      const get_events = await axios.get(`${URL_API}/events?limit=${limit}&sorted_order=${sortOrder}&search=${search}&success_status=${successStatus}`, { headers })

      setEvents(get_events.data)
    } catch (error) {
      console.log('error -> ', error)
    }
  }

  const handleClickCard = (id) => {
    history.push(`/detail/${id}`)
  }

  const handleOnChangeLimit = (e) => {
    setLimit(Number(e.target.value))
  }

  const handleToggleFilter = () => {
    setShowFilter(!showFilter)
  }

  const handleOnChangeSearch = (e) => {
    setSearch(e.target.value)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    getListEvent()
  }

  const handleFilterSubmit = () => {
    setShowFilter(false)
    getListEvent()
  }

  const handleChangeSortBy = (e) => {
    setSortOrder(e.target.value)
  }

  const handleChangeStatus = (e) => {
    setSuccessStatus(e.target.value)
  }

  return (
    <div className="home__container">
      <div className='home__filter'>
        <div className="home__search">
          <form action="#" onSubmit={handleSearchSubmit}>
            <input
              onChange={handleOnChangeSearch}
              value={search}
              className='home__search__input'
              type="text"
              placeholder='search' />
            <FontAwesomeIcon onClick={handleSearchSubmit} icon={faSearch} color="#c4cad4"></FontAwesomeIcon>
          </form>
        </div>
        <div className="filter" onClick={handleToggleFilter}>
          <FontAwesomeIcon icon={faFilter}></FontAwesomeIcon>
          FILTERS
        </div>
      </div>
      {
        showFilter &&
        <div className="filter__zone">
          <div className="filter__zone__head">
            <p>Sort by</p>
            <p>Limit</p>
            <p>Status</p>
            <p></p>
          </div>
          <div className="filter__zone__body">
            <div className="filter__checkbox__container">
              <div className='filter__checkbox'>
                <input
                  type="radio"
                  value="asc"
                  name="sortby"
                  checked={sortOrder === 'asc'}
                  onChange={handleChangeSortBy} />
                <label>Last create</label>
              </div>
              <div className='filter__checkbox'>
                <input
                  type="radio"
                  value="desc"
                  name="sortby"
                  checked={sortOrder === 'desc'}
                  onChange={handleChangeSortBy} />
                <label>Old create</label>
              </div>
            </div>
            <div className="filter__checkbox__container">
              <input
                onChange={handleOnChangeLimit}
                value={limit}
                className='filter__limit'
                type="text" />
            </div>
            <div className="filter__checkbox__container">
              <div className='filter__checkbox'>
                <input type="radio"
                  value={true}
                  name="successStatus"
                  checked={successStatus === 'true'}
                  onChange={handleChangeStatus} />
                <label>Process</label>
              </div>
              <div className='filter__checkbox'>
                <input type="radio"
                  value={false}
                  name="successStatus"
                  checked={successStatus === 'false'}
                  onChange={handleChangeStatus} />
                <label>Done</label>
              </div>
              <div className='filter__checkbox'>
                <input type="radio"
                  value='both'
                  name="successStatus"
                  checked={successStatus === 'both'}
                  onChange={handleChangeStatus} />
                <label>Both</label>
              </div>
            </div>
            <div className="filter__checkbox__container filter__controller">
              <div className="filter__buttom">
                <button onClick={handleFilterSubmit}>save</button>
              </div>
            </div>
          </div>
        </div>
      }

      {
        events.length ?
          <div className="home__content">
            {
              events.map((val, index) => (
                <div className="card" key={index}>
                  <Card
                    img_url={(val.image) && `${URL_API}/events/files/img/${val.image.name}`}
                    title={val.name}
                    handleClick={() => handleClickCard(val._id)}
                    show_status={true}
                    status={val.success_status} />
                </div>
              ))
            }
          </div>
          :
          <div className='empty__data'>Empty data</div>
      }

    </div>
  )
}

export default Home