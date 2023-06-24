import { LoginCredentials, SignupCredentials } from "../types";
import { Dispatch, AnyAction } from "redux";
import {
  INVALID_TOKEN,
  LOGIN_ERROR_HANDLER,
  LOGIN_FAILED,
  LOGIN_SUCCESS,
  SIGNUP_ERROR_HANDLER,
  SIGNUP_FAILED,
  SIGNUP_SUCCESS,
  USER_LOADED_FAILED,
  USER_LOADED_SUCCESS,
} from "./Types";

export const load_user =
  () =>
  async (dispatch: Dispatch<AnyAction>): Promise<void> => {
    console.log("user loading");

    if (localStorage.getItem("access")) {
      await fetch("http://localhost:5000/protected/load_user", {
        method: "GET",
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      })
        .then((res) => res.json())
        .then((user) => {
          if (user.message === "Authorization denied") {
            //  INVALID_TOKEN
            //  remove existing token and redirect to login page
            dispatch({
              type: INVALID_TOKEN,
              payload: {
                message: "Something went wrong, Login Again",
              }
            })
          } else {
            // USER_LOADED_SUCCESS
            console.log("user loaded successfully");
            dispatch({
              type: USER_LOADED_SUCCESS, 
              payload: {
                newuser: user, 
              }
            })
          }
        })
        .catch((error) => {
          console.log(error);
          console.log("Failed to fetch details of user"); //USER_LOADED_FAILED
          dispatch({
            type: USER_LOADED_FAILED, 
            payload: {
              message: "something went wrong, try again after sometime"
            }
          })
        });
    }
  };

export const login_user =
  (logindetails: LoginCredentials) =>
  async (dispatch: Dispatch<AnyAction>): Promise<void> => {
    console.log("trying to login user");
    console.log(logindetails);
    try {
      await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(logindetails),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.message === "Invalid email or password") {
            //LOGIN_ERROR_HANDLER
            // case - invalid email or password
            dispatch({
              type: LOGIN_ERROR_HANDLER,
              payload: {
                message: "Invalid email or password",
              },
            });
          } else {
            //LOGIN_SUCCESS
            console.log(data);
            // localStorage.setItem("access", data.token);
            dispatch({
              type: LOGIN_SUCCESS,
              payload: {
                access: data.token,
              },
            });
            dispatch<any>(load_user());
          }
        });
    } catch (error) {
      console.log("error"); //LOGIN_FAILED

      console.log(error);
      dispatch({
        type: LOGIN_FAILED,
        payload: {
          message: "Login Failed try again after sometime",
        },
      });
    }
  };

export const signin_user =
  (details: SignupCredentials) =>
  async (dispatch: Dispatch<AnyAction>): Promise<void> => {
    try {
      await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify(details),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.message === "Registration failed") {
            // case to be handled at client
            // console.log("Password should be atleast 5 characters");
            dispatch({
              type: SIGNUP_ERROR_HANDLER,
              payload: {
                message: "Password should be atleast 5 characters",
              },
            });
            //SIGNUP_ERROR_HANDLER
          } else if (data.message === "Email already registered") {
            // case to be handled at client
            // console.log("Email already registered");
            dispatch({
              type: SIGNUP_ERROR_HANDLER,
              payload: {
                message: "Email already registered",
              },
            });
            //SIGNUP_ERROR_HANDLER
          } else {
            console.log("signup success"); //SIGNUP_SUCCESS
            dispatch({
              type: SIGNUP_SUCCESS,
              payload: {
                message: "signup success",
              },
            });
          }
        })
        .catch((error) => {
          console.log(error);
          // console.log("signup failed"); //SIGNUP_FAILED -- try again after sometime
          dispatch({
            type: SIGNUP_FAILED,
            payload: {
              message: "signup failed try again after sometime",
            },
          });
        });
    } catch (error) {
      // console.log("signin failed"); // SIGNUP_FAILED -- try again after sometime
      dispatch({
        type: SIGNUP_FAILED,
        payload: {
          message: "signup failed try again after sometime",
        },
      });
    }
  };
