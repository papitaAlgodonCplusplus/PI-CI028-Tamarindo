import React, { useState } from 'react'
import "../styles/register.scss"
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
    password_input: "",
    password_confirm: "",
    rol: "client",});

  const [err] = useState(null)
  const navigate = useNavigate()

  const handleChange = e => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  // Modifies the value when the user selects the checkbox
  const handleCheckbox = () => {
    setChecked(!isChecked);
  }

  // Handles user-supplied information
  const handleSubmit = async e => {
    e.preventDefault();
    // Error, when the user does not enter his name
    if(!inputs.name) {
      showErrorDialog("An error occurred:", "Please enter your name.");
      return;
    }

    // Error, when the user does not enter his last name
    if(!inputs.last_name) {
      showErrorDialog("An error occurred:", "Please enter your last name.");
      return;
    }

    // Error, when the user does not enter his email
    if(!inputs.email) {
      showErrorDialog("An error occurred:", "Please enter your email address.");
      return;
    }

    // Verify that the email is formatted correctly
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inputs.email)) {
      showErrorDialog("An error occurred:", "Please enter a valid email address.");
      return;
    }

    // Error, when the user does not enter his phone number
    if(!inputs.phone) {
      showErrorDialog("An error occurred:", "Please enter your phone number.");
      return;
    }

    // Error, when the user does not enter his password
    if(!inputs.password_input) {
      showErrorDialog("An error occurred:", "Please enter your password.");
      return;
    }

    // To verify that the password and the confirm password are the same
    const password = inputs.password_input;
    const passwordRegEx = /^^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (inputs.password_input !== inputs.password_confirm) {
      showErrorDialog("An error occurred:", "Passwords don't match");
      return;
    }

    // Error, when the user does select the checkbox of the terms and conditions
    if(!isChecked) {
      showErrorDialog("An error occurred:", "It is necessary to accept our terms and conditions.");
      return;
    }
    
    // Verify that the password have the suitable characteristics
    if (passwordRegEx.test(password)) {
      e.preventDefault()
      try {
        // Send the information of the user to the db
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

  return (
    <div className='register-window'>
      <div className='container-sign-up'>
        <div className="sign-up">
          Sign Up
        </div>

        <div className="create-an-account">
          Create an account!
        </div>

        <form  className='form'>
          <div className='name-user'>
            <label htmlFor="name"> Name </label>
            <br />
            <input type="name" id="name" name="name" onChange={handleChange} required />
          </div>
          
          <div className='last-name-user'>
            <label htmlFor="last_name"> Last name </label>
            <br />
            <input type="last_name" id="last_name" name="last_name" onChange={handleChange} required />
          </div>
          
            <div className='email-user'>
              <label htmlFor="email_reg"> Email address </label>
              <br />
              <input type="email" id="email_reg" name="email" onChange={handleChange} required />
            </div>

            <div className='phone-user'>
              <label htmlFor="phone"> Phone number </label>
              <br />
              <input type="number" id="phone" name="phone" onChange={handleChange} required />
            </div>
          
          

          <div className='password-user'>
            <label htmlFor="password-user"> Password </label>
            <br />
            <input type="password" id="password_input" name="password_input" className='password_input' onChange={handleChange} required />
          </div>

          <div className='password-confirm-user'>
            <label htmlFor="password_confirm"> Confirm password </label>
            <br />
            <input type="password" id="password_confirm" name="password_confirm" className='password_confirm ' onChange={handleChange} required />
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