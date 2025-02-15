import axios from "axios";
import history from "../history";

const TOKEN = "token";

/*ACTION TYPES*/
const SET_AUTH = "SET_AUTH";

/*ACTION CREATORS*/
//auth === res.data
const setAuth = (auth) => ({ type: SET_AUTH, auth });

/* THUNK CREATORS*/
export const me = () => async (dispatch) => {
  //get token from front...
  const token = window.localStorage.getItem(TOKEN);
  if (token) {
    const res = await axios.get("/auth/me", {
      headers: {
        authorization: token,
      },
    });
    //returns a verified user
    return dispatch(setAuth(res.data));
  }
};

//create user or login
export const authenticate =
  (username, email, password, method) => async (dispatch) => {
    try {
      const res = await axios.post(`/auth/${method}`, {
        username,
        email,
        password,
      });
      window.localStorage.setItem(TOKEN, res.data.token);
      dispatch(me());
      
    } catch (authError) {
      return dispatch(setAuth({ error: authError }));
    }
  };

export const logout = () => {
  window.localStorage.removeItem(TOKEN);
  history.push("/home");
  return {
    type: SET_AUTH,
    auth: {},
  };
};

/*REDUCER*/
export default function (state = {}, action) {
  switch (action.type) {
    case SET_AUTH:
      return action.auth;
    default:
      return state;
  }
}
