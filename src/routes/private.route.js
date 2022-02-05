import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux'

const PrivateRoute = ({ component: Component, ...rest }) => {
  const isLogin = rest.auth.isLogin
  return (

    // Show the component only when the user is logged in
    // Otherwise, redirect the user to /signin page
    <Route {...rest} render={props => (
      isLogin ?
        <Component {...props} />
        : <Redirect to="/login" />
    )} />
  );
};

const mapPropsToState = (state) => {
  return {
    auth: state.auth
  }
}

export default connect(mapPropsToState)(PrivateRoute)