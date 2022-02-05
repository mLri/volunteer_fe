const authReducer = (state = { isLogin: false }, action) => {
  switch (action.type) {
    case 'SIGNIN':
      return { ...state, ...action.payload }
    case 'SIGNOUT':
      return { isLogin: false }
    default:
      return state
  }
}

export default authReducer