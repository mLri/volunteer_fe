import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { connect } from 'react-redux'

/* import css */
import './App.css'

/* import logo */
import logo from './logo.png'

/* import views */
/* admin */
import Home from './views/Admin/Home/Home.view'
import Login from './views/Admin/Login/Login.view'
import CreateEvent from './views/Admin/CreateEvent/CreateEvent.view'
import EditEvent from './views/Admin/EditEvent/EditEvent.view'
import EventBook from './views/Admin/EventBook/EventBook.view'
import EventBookEdit from './views/Admin/EventBookEdit/EventBookEdit.view'
/* user */
import HomeUser from './views/User/Home_User/Home.view'
import EventDetail from './views/User/EventDetail/EventDetail.view'

/* import components */
import Navbar from './components/Navbar/Nav.component'
import LogoutButton from './components/LogoutButton/LogoutButton.component'

/* import private route */
import PrivateRoute from './routes/private.route'

function App(props) {

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
          <Route path="/" exact render={()=> (<HomeUser />)} />
          <PrivateRoute component={Home} path="/admin" exact />
          {/* <Route path="/admin" exact render={() => (<Home />)} /> */}
          <Route path="/login" render={() => (<Login />)} />
          <PrivateRoute component={CreateEvent} path="/admin/events/create" />
          {/* <Route path="/admin/events/create" render={() => (<CreateEvent />)} />  */}
          <PrivateRoute component={EditEvent} path="/admin/events/:event_id/edit" />
          {/* <Route path="/admin/events/:event_id/edit" render={() => (<EditEvent />)} />  */}
          <PrivateRoute component={EventBook} path="/admin/events/:event_id/book" exact />
          {/* <Route path="/admin/events/:event_id/book" exact render={() => (<EventBook />)} />  */}
          <PrivateRoute component={EventBookEdit} path="/admin/events/:event_id/book/:book_event_id/edit" />
          {/* <Route path="/admin/events/:event_id/book/:book_event_id/edit" render={() => (<EventBookEdit />)} />  */}
          <Route path="/detail/:event_id" render={() => (<EventDetail />)} />
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
