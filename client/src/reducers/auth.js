const authReducer = (state = { data: null, error: null }, action) => {
  switch (action.type) {
    case "AUTH":
      localStorage.setItem("Profile", JSON.stringify({ ...action?.data }));
      return { ...state, data: action?.data, error: null };
    case "LOGOUT":
      localStorage.clear();
      return { ...state, data: null, error: null };
    case "RESET_PASSWORD_SUCCESS":
      return { ...state, resetPasswordMessage: action.payload, error: null };
    case "RESET_PASSWORD_FAILURE":
      return { ...state, resetPasswordError: action.payload };
    case "AUTH_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

export default authReducer;
