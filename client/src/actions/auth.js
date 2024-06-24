import * as api from "../api";
import { setCurrentUser } from "./currentUser";
import { fetchAllUsers } from "./users";

export const signup = (authData, navigate) => async (dispatch) => {
  try {
    const { data } = await api.signUp(authData);
    dispatch({ type: "AUTH", data });
    dispatch(setCurrentUser(JSON.parse(localStorage.getItem("Profile"))));
    dispatch(fetchAllUsers());
    navigate("/");
  } catch (error) {
    dispatch({ type: "AUTH_ERROR", payload: error.response.data.message });
  }
};

export const login = (authData, navigate) => async (dispatch) => {
  try {
    const { data } = await api.logIn(authData);
    dispatch({ type: "AUTH", data });
    dispatch(setCurrentUser(JSON.parse(localStorage.getItem("Profile"))));
    navigate("/");
  } catch (error) {
    dispatch({ type: "AUTH_ERROR", payload: error.response.data.message });
  }
};

export const forgotPassword = (email) => async (dispatch) => {
  try {
    await api.forgotPassword(email);
  } catch (error) {
    console.log(error);
  }
};

export const resetPassword = (token, newPassword) => async (dispatch) => {
  try {
    await api.resetPassword(token, newPassword);
  } catch (error) {
    console.log(error);
  }
};
