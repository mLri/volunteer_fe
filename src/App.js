import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { connect } from 'react-redux'

/* import css */
import './App.css'

/* import logo */
import logo from './logo.png'

/* import views */
import Home from './views/Home/Home.view'
import Login from './views/Login/Login.view'
import CreateEvent from './views/CreateEvent/CreateEvent.view'

/* import components */
import Navbar from './components/Navbar/Nav.component'
import LogoutButton from './components/LogoutButton/LogoutButton.component'

function App(props) {

  console.log('render App')

  useEffect(() => {
    const get_token = localStorage.getItem('token')
    if (get_token) props.dispatch({ type: 'SIGNIN' })
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    props.dispatch({ type: 'SIGNOUT' })
  }

  return (
    <div className="app__container">
      <Router>
        <div className="navbar__container">
          <Navbar logo={logo} title='Volunteer register' />
          <LogoutButton title='Logout' logout_to='/login' isLogin={props.auth.isLogin} handleLogout={handleLogout} />
        </div>
        <Switch>
          <Route path="/" exact render={() => (<Home />)} />
          <Route path="/login" render={() => (<Login />)} />
          <Route path="/create/event" render={() => (<CreateEvent />)} /> 
          <Route path="*" render={() => <h1>Page not found</h1>} />
        </Switch>
      </Router>
    </div>
  );
}

const mapPropsToState = (state) => {
  return {
    auth: state.auth
  }
}

export default connect(mapPropsToState)(App)
