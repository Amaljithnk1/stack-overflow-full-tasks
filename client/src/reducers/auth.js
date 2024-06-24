const authReducer = (state = { data: null }, action) => {
  switch (action.type) {
    case "AUTH":
      localStorage.setItem("Profile", JSON.stringify({ ...action?.data }));
      return { ...state, data: action?.data };
    case "LOGOUT":
      localStorage.clear();
      return { ...state, data: null };
    case "RESET_PASSWORD_SUCCESS":
      return { ...state, resetPasswordMessage: action.payload };
    case "RESET_PASSWORD_FAILURE":
      return { ...state, resetPasswordError: action.payload };
    default:
      return state;
  }
};

export default authReducer;
