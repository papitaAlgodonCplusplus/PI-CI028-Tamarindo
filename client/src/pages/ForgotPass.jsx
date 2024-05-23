import axios from "axios";
import { AuthContext } from '../AuthContext.js';
import { showErrorDialog } from "../Misc.js";
import { useNavigate } from "react-router-dom";
import React, { useState, useContext } from 'react';
import '../styles/forgot_pass.scss'

const ForgotPass = () => {
  const { login, logout } = useContext(AuthContext);
  logout()

  // State to manage form inputs
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  // Hook for navigating between pages
  const navigate = useNavigate();

  // Function to handle input changes
  const handleChange = e => {
    setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Function to handle form submission
  const handleSubmit = async e => {
    try {
      e.preventDefault()
      const email = inputs.email.trim();
      const password = '454fdsaf*';

      let isError = false;

      if (email === '') {
        document.getElementById("warning-email").style.display = "block";
        isError = true;
      } else {
        document.getElementById("warning-email").style.display = "none";
      }

      if (password === '') {
        document.getElementById("warning-pass").style.display = "block";
        isError = true;
      } else {
        document.getElementById("warning-pass").style.display = "none";
      }

      if(isError) return;

      // Attempt to log in using Axios
      await axios.post(`/auth/login`, inputs);

      // Retrieve user ID after successful login
      const userID = await axios.get(`/auth/getUserID${inputs.email}`);

      // Login the user using the AuthContext
      login(userID.data[0].userid);
      navigate("/reservations_list");
    } catch (error) {
      // showErrorDialog("An error occurred:", "Wrong email or password");
      logout()
    }
  };

  const handleGoBack = async e => {
    e.preventDefault()
    navigate("/")
  }

  return (
    <div className="forgetPass">
      <div className='image'>
        {/* Image */}
        <img src={require("../assets/forgot_pass.jpg")} alt="" className='imageForgotPass'/> 
      </div>
      <div className='containerForgotPass'>
        {/* Title */}
        <div className="forgotPassTitle">
          <p>Forgot Password</p>
        </div>
        {/* Description */}
        <div className="Description">
          <p>No Problem,<br/> let's reset it</p>
        </div>
        {/* Instruction */}
        <div className="Instruction">
          <p>Please enter your email address, you will receive an email to complete the proccess</p>
        </div>
        <div>
          {/* Email */}
          <div className="email">
            <div className="emailText">
              <p style={{display: 'inline-block', margin: 0, padding: 0}}>Email address</p>
              <p style={{display: 'inline-block', fontSize: '14px', padding: 2}}>*</p>
            </div>
            <div className="inputEmail">
              <input type="email-login" id="email" name="email" required onChange={handleChange}></input>
            </div>
            <label id="warning-email" className='red-label'>Please provide an email</label>
          </div>
          {/* Button */}
          <button type="submit" onClick={handleSubmit} className='resetButton'>Reset Password</button>
        </div>
        <hr class="separatorForgotPass" />
        {/* Go to Register Page */}
        <div className="loginQuestion">
          <img alt="back" onClick={handleGoBack} src={require("../assets/Image12.png")} className='backArrowImage' />
          <p className="questionLogin">Back to
            <a href="/" className="linkLogin">Log In</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPass;
