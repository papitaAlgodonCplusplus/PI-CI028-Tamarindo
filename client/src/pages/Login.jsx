import React, { useState, useContext } from 'react';
import { Checkbox } from '@mui/material';
import { FormControlLabel } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../AuthContext.js';
import { showErrorDialog } from "../Misc.js";
import axios from "axios";
import '../styles/login.scss'
import eye from "../assets/passVisible.png";

import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    allVariants: {
      fontFamily: 'Poppins',
      textTransform: 'none',
      fontSize: 18,
      color: '#4F4F4F'
    },
  },
});

const Login = () => {
  const { login } = useContext(AuthContext);

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
    e.preventDefault();
    try {
      // Attempt to log in using Axios
      await axios.post(`/auth/login`, inputs);

      // Retrieve user ID after successful login
      const userID = await axios.get(`/auth/getUserID${inputs.email}`);

      // Login the user using the AuthContext
      login(userID.data[0].userid);
      navigate("/home");
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Show error message if user is not found
        const errorMessage = error.response.data;
        showErrorDialog("An error occurred:", errorMessage);
      } else {
        // Show any other error obtained
        showErrorDialog("An error occurred:", error);
      }
    }
  };
  
  // Render login form
  return (
    <div className="loginPage">
      {/* <p style={{marginLeft: "50%"}}>Nav-Bar</p> */}
      <div className="login">
        <div className='formBg'></div>
        {/* Title */}
        <div className="loginTitle">
          <p>Log In</p>
        </div>
        {/* Email */}
        <div className="email">
          <div className="emailText">
            <p>Email address</p>
          </div>
          <div className="inputEmail">
            <input type="email-login" id="email" required onChange={handleChange}></input>
          </div>
        </div>
        {/* Password */}
        <div className="password">
          <div className="passwordText">
            <p>Password</p>
          </div>
          <div className="inputPassword">
            <input type="password" className="inputPass1" id="password"></input>
            <div className="showPass">
              <img src={eye} alt="An eye open" className="passEye" />
            </div>
          </div>
        </div>
        {/* Questions: Checkbox - Forgot Pass */}
        <div className="containerQuestions">
          <div className="checkbox">
            <ThemeProvider theme={theme}>
              <FormControlLabel control={<Checkbox />} label="Keep me signed in" />
            </ThemeProvider>
          </div>
          <a href="#pass_recover" className='forgotPass'>Forgot password?</a>
        </div>
        {/* Button */}
        <button type="submit" onClick={handleSubmit} className='loginButton'>Log In</button>
        <hr class="separator" />
        {/* Go to Register Page */}
        <div className="register">
          <p className="question">Don't have an account?
            <a href="#pass_recover" className="linkRegister">Register</a>
          </p>
        </div>
      </div>
      {/* <p style={{marginLeft: "50%"}}>Footer</p> */}
    </div>
  );
};

export default Login;
