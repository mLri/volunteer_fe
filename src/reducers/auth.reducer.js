const authReducer = (state = { isLogin: false }, action) => {
  switch (action.type) {
    case 'SIGNIN':
      return { ...state, isLogin: true }
    case 'SIGNOUT':
      return { ...state, isLogin: false }
    default:
      return state
  }
}

export default authReducer