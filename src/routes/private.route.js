import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import jwt_decode from "jwt-decode"

const PrivateRoute = ({ component: Component, ...rest }) => {
  let isLogin
  const token = localStorage.getItem('token')
  if (token) {
    const decode = jwt_decode(token)
    isLogin = (decode.principal) ? true : false 
  } else {
    isLogin = false
  }
  return (
    <Route {...rest} render={props => (
      isLogin ?
        <Component {...props} />
        : <Redirect to="/login" />
    )} />
  );
};

export default PrivateRoute