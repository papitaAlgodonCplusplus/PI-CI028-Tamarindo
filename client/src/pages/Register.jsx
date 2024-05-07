import React, { useState } from 'react'
import User from "../img/User.png"
import hotel_login from "../img/hotel_register.png"
import "../styles_register.scss"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import { showErrorDialog } from '../Misc'

const Register = () => {
  const [isChecked, setChecked] = useState(false);
  const [inputs, setInputs] = useState({
    name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    password_confirm: "",
    rol: "client",});

  const [err] = useState(null)
  const navigate = useNavigate()

  const handleChange = e => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleCheckbox = () => {
    setChecked(!isChecked);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!inputs.name) {
      showErrorDialog("An error occurred:", "Please enter your name.");
      return;
    }

    if(!inputs.last_name) {
      showErrorDialog("An error occurred:", "Please enter your last name.");
      return;
    }

    if(!inputs.email) {
      showErrorDialog("An error occurred:", "Please enter your email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inputs.email)) {
      showErrorDialog("An error occurred:", "Please enter a valid email address.");
      return;
    }

    if(!inputs.phone) {
      showErrorDialog("An error occurred:", "Please enter your phone number.");
      return;
    }

    if(!inputs.password) {
      showErrorDialog("An error occurred:", "Please enter your password.");
      return;
    }

    const password = inputs.password;
    const passwordRegEx = /^^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (inputs.password !== inputs.password_confirm) {
      showErrorDialog("An error occurred:", "Passwords don't match");
      return;
    }

    if(!isChecked) {
      showErrorDialog("An error occurred:", "It is necessary to accept our terms and conditions.");
      return;
    }

    if (passwordRegEx.test(password)) {
      e.preventDefault()
      try {
        await axios.post("/auth/register", inputs);
        navigate("/");
      } catch (error) {
        if (error.response && error.response.status === 409) {
          const errorMessage = error.response.data;
          showErrorDialog("An error occurred:", errorMessage);
        } else {
          showErrorDialog("An error occurred:", error);
        }
      }
    } else {
      showErrorDialog("An error occurred:", "Password must be minimum eight characters, have at least one letter and one number");
      return;
    }
  }

  const handleCancel = e => {
    navigate("/")
    return;
  }

  return (
    <div className='register-window'>
      <div className='container-sign-up'>
        <div className="sign-up">
          Sign Up
        </div>

        <div className="create-an-account">
          Create An Account!
        </div>

        <form  className='form'>
          <div className="container-name-lastname">
            <div className="upload-image">
              <img src={User} alt="User Upload" />
            </div>
 
            <div className='name-user'>
              <label htmlFor="name"> Name </label>
              <br />
              <input type="name" id="name" name="name" onChange={handleChange} required />
            </div>
            
            <div className='last-name-user'>
              <label htmlFor="last_name"> Last Name </label>
              <br />
              <input type="last_name" id="last_name" name="last_name" onChange={handleChange} required />
            </div>
          </div>

          <div className="container-email-number">
              <div className='email-user'>
                <label htmlFor="email_reg"> Email address </label>
                <br />
                <input type="email" id="email_reg" name="email" onChange={handleChange} required />
              </div>

              <div className='phone-user'>
                <label htmlFor="phone"> Phone Number </label>
                <br />
                <input type="number" id="phone" name="phone" onChange={handleChange} required />
              </div>
          </div>

          <div className="container-password">
            <div className='password-user'>
              <label htmlFor="password_reg">Password</label>
              <br />
              <input type="password" id="password" name="password" className='password' onChange={handleChange} required />
            </div>

            <div className='password-confirm-user'>
              <label htmlFor="password_confirm"> Confirm Password </label>
              <br />
              <input type="password" id="password_confirm" name="password_confirm" className='password_confirm ' onChange={handleChange} required />
            </div>
          </div>
        </form>

        <div className="container-terms">
            <input type="checkbox" id="checkbox" value="checkbox" checked={isChecked} onChange={handleCheckbox}/>
            <label for="checkbox">Accept Terms and Conditions</label>
        </div>

        <div className="sign-button">
          <button type="submit" className='create' onClick={handleSubmit}>Sign Up</button>
          {err && <p>{err}</p>}
        </div>

        <p className="already-account">
          <span> Already have an account? <Link to="/"> Log in</Link> 
          </span>
        </p>
      </div>
    
      <div className="ima_register">
      </div>
      
    </div>
    
    
  )
}

export default Register;