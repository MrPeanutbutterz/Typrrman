import "./Form.css"
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {NavLink, useNavigate} from 'react-router-dom';
import checkUsername from "../../components/helpers/checkUserName";
import checkEmail from "../../components/helpers/checkEmail";

export default function SignUp() {

  const [details, setDetails] = useState({email: "", username: "", password: ""})
  const [error, toggleError] = useState({
    emailInvalid: false,
    usernameInvalid: false,
    passwordInvalid: false,
    usernameInUse: false,
    emailInUse: false,
  })

  const source = axios.CancelToken.source();
  const navigate = useNavigate();

  useEffect(() => {
    return function cleanup() {
      source.cancel();
    }
  }, []);

  async function handleSubmit(e) {
    e.preventDefault()

    if (!checkUsername(details.username)) {
      toggleError({...error, usernameInvalid: true})
      console.log("1")

    } else if (!checkEmail(details.email)) {
      toggleError({...error, emailInvalid: true})
      console.log("2")

    } else if (details.password.length < 6) {
      toggleError({...error, passwordInvalid: true})
      console.log("3")

    } else {
      try {
        await axios.post('https://frontend-educational-backend.herokuapp.com/api/auth/signup', {
          "username": details.username,
          "email": details.email,
          "password": details.password,
          "role": ["user"],
        }, {
          cancelToken: source.token,
        });

        navigate('/signin');
      } catch (e) {
        console.error(e);

        if (e.response.status === 400) {

          if (e.response.data.message === "This email is already in use") {
            toggleError({...error, emailInUse: true})
          }

          if (e.response.data.message === "This username is already in use") {
            toggleError({...error, usernameInUse: true})
          }
        }
      }
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="form-container">

          <h1>Sign Up</h1>
          <p>Please fill in this form to create an account.</p>

          <label htmlFor="username-field">
            <input
              type="text"
              id="username-field"
              name="username"
              className="input-field"
              autoComplete="username"
              value={details.username}
              placeholder="username"
              onChange={(e) => {
                setDetails({...details, username: e.target.value})
                toggleError({...error, usernameInvalid: false, usernameInUse: false})
              }}
            />
            <div className="error-message-container">
              {error.usernameInvalid && <p className="error-message">Username may only contain numbers & character.</p>}
              {error.usernameInUse && <p className="error-message">This username is already in use.</p>}
            </div>
          </label>

          <label htmlFor="email-field">
            <input
              type="email"
              id="email-field"
              name="email"
              className="input-field"
              autoComplete="email"
              value={details.email}
              placeholder="email"
              onChange={(e) => {
                setDetails({...details, email: e.target.value})
                toggleError({...error, emailInvalid: false, emailInUse: false})
              }}
            />
            <div className="error-message-container">
              {error.emailInvalid && <p className="error-message">This email doesn't seem right.</p>}
              {error.emailInUse && <p className="error-message">This email is already in use.</p>}
            </div>
          </label>

          <label htmlFor="password-field">
            <input
              type="password"
              id="password-field"
              name="password"
              className="input-field"
              autoComplete="current-password"
              value={details.password}
              placeholder="password"
              onChange={(e) => {
                setDetails({...details, password: e.target.value})
                toggleError({...error, passwordInvalid: false})
              }}
            />
            <div className="error-message-container">
              {error.passwordInvalid && <p className="error-message">Create a password with at least 6 characters.</p>}
            </div>
          </label>

          <button
            type="submit"
            className="form-button form-button-space"
          >Register
          </button>

          <div className="link-container">
            <NavLink to="/signin"><p>Already got an account? <span>Sign in</span> here.</p></NavLink>
          </div>

        </div>
      </form>
    </>
  );
}