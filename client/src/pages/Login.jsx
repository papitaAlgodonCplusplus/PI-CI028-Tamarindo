import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Checkbox, IconButton } from '@mui/material';
import { FormControlLabel } from '@mui/material';
import React, { useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../AuthContext.js';
import { showErrorDialog } from "../Misc.js";
import axios from "axios";
import '../styles/login.scss'

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

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
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
            <input type="email-login" id="email" name="email" required onChange={handleChange}></input>
          </div>
        </div>
        {/* Password */}
        <div className="password">
          <div className="passwordText">
            <p>Password</p>
          </div>
          <div className="inputPassword">
            <input type={showPassword ? "text" : "password"} name="password"
              required onChange={handleChange} className="inputPass1" id="password"></input>
            <div className="showPass">
              {/* Password Toggle */}
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
              </IconButton>
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
          <a href="/pass_recover" className='forgotPass'>Forgot password?</a>
        </div>
        {/* Button */}
        <button type="submit" onClick={handleSubmit} className='loginButton'>Log In</button>
        <hr class="separator" />
        {/* Go to Register Page */}
        <div className="register">
          <p className="question">Don't have an account?
            <a href="/register" className="linkRegister">Register</a>
          </p>
        </div>
      </div>
      {/* <p style={{marginLeft: "50%"}}>Footer</p> */}
    </div>
  );
};

export default Login;
