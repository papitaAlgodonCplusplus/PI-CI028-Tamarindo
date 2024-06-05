import axios from "axios";
import { AuthContext } from '../AuthContext.js';
import { Checkbox, IconButton } from '@mui/material';
import { FormControlLabel } from '@mui/material';
import { showErrorDialog } from "../Misc.js";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import React, { useState, useContext } from 'react';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
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
  const { login, logout } = useContext(AuthContext);
  logout()

  // State to manage form inputs
  const [inputs, setInputs] = useState({
    email: "",
    pass: "",
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
    e.preventDefault()
    try {
      const email = inputs.email.trim();
      const password = inputs.pass.trim();

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

      if (isError) return;

      // Attempt to log in using Axios
      const response = await axios.post('/auth/login', inputs);
      console.log(response.data); // Log the response from the server

      // Retrieve user ID after successful login
      const userID = await axios.get(`/auth/getUserID${inputs.email}`);

      // Login the user using the AuthContext
      login(userID.data[0].userid);
      navigate("/home");
    } catch (error) {
      showErrorDialog("An error occurred:", "Wrong email or password");
      logout()
    }
  };

  // Render login form
  return (
    <div className="login">
      <div className='formBg'></div>
      <form>
        <div className='formContainer'>
          {/* Title */}
          <center><div className="loginTitle">
            <p>Log In</p>
          </div></center>
          <center><div>
            {/* Email */}
            <div className="email">
              <div className="emailText">
                <p>Email address</p>
              </div>
              <div className="inputEmail">
                <input autoComplete="new-password" placeholder="Email" type="email-login" id="email" name="email" required onChange={handleChange}></input>
              </div>
              <label id="warning-email" className='red-label'>Please provide an email</label>
            </div>
            {/* Password */}
            <div className="password">
              <div className="passwordText">
                <p>Password</p>
              </div>
              <div className="inputPassword">
                <input autoComplete="new-password" placeholder="Password" type={showPassword ? "text" : "password"} name="password"
                  required onChange={handleChange} className={`inputPass1 ${showPassword ? 'visible' : ''}`} id="password"></input>
                <div className="showPass">
                  {/* Password Toggle */}
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOffOutlinedIcon style={{height: '1.2vi', width: '1.2vi'}}/>
                    : <VisibilityOutlinedIcon style={{height: '1.2vi', width: '1.2vi'}}/>}
                  </IconButton>
                </div>
              </div>
            </div>
            <label id="warning-pass" className='red-label-2'>Please provide a password</label>
            {/* Questions: Checkbox - Forgot Pass */}
            <div className="containerQuestions">
              <a href="/pass_recover" className='forgotPass'>Forgot password?</a>
            </div>
            {/* Button */}
            <button type="submit" onClick={handleSubmit} className='loginButton'>Log In</button>
          </div></center>
          <hr className="separator" />
          {/* Go to Register Page */}
          <center><div className="register">
            <p className="question">Don't have an account?
              <a href="/register" className="linkRegister">Register</a>
            </p>
          </div></center>
        </div>
      </form>
    </div>
  );
};

export default Login;
