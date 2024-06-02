import axios from "axios";
import { AuthContext } from '../AuthContext.js';
import { IconButton } from '@mui/material';
import { showErrorDialog } from "../Misc.js";
import { useNavigate } from "react-router-dom";
import emailjs from '@emailjs/browser';
import React, { useContext, useEffect, useState } from 'react';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import '../styles/change_pass.scss'

const ChangePass = () => {
  const { isLoggedIn } = useContext(AuthContext);

  // State to manage form inputs
  const [inputs, setInputs] = useState({
    email: "",
    pass: "",
    password: "",
    confirmPass: ""
  });

  // Function to handle input changes
  const handleChange = e => {
    setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Hook for navigating between pages
  const navigate = useNavigate();

  // Current Password Toggle
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // New Password Toggle
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleClickShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  // Confirmation New Password Toggle
  const [showConfPassword, setShowConfPassword] = useState(false);

  const handleClickShowConfPassword = () => {
    setShowConfPassword(!showConfPassword);
  };

  // Send Email
  useEffect(() => emailjs.init("paFNUOkm_RVctv3GH"), []);
  const sendEmail = async () => {
    const serviceId = "service_dvvjgue";
    const templateId = "template_hb4ie6n";

    const email = inputs.email.trim();
    const password = inputs.password.trim();
    // send email
    await emailjs.send(serviceId, templateId, {
        email: email,
        password: password
    })
    .then(
      () => {
        alert('Email sent successfully!');
      },
      (error) => {
        alert('Error sending email');
        console.log('FAILED EMAIL SEND', error.text);
      },
    );
  }

  // Function to handle form submission
  const handleSubmitChangeP = async e => {
    // if (isLoggedIn) {
      // Set inputs
      const email = inputs.email.trim();
      const password = inputs.pass.trim();
      const newPassword = inputs.password.trim();
      const confirmPassword = inputs.confirmPass.trim();

      let isError = false;

      // Check if inputs are filled
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

      if (newPassword === '') {
        document.getElementById("warning-newPass").style.display = "block";
        isError = true;
      } else {
        document.getElementById("warning-newPass").style.display = "none";
      }

      if (confirmPassword === '') {
        document.getElementById("warning-confPass").style.display = "block";
        isError = true;
      } else {
        document.getElementById("warning-confPass").style.display = "none";
      }
      
      if(isError) return;

      // Regex to check if password is allowed
      const passwordRegEx = /^^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

      // Check if passwords match
      if (inputs.password !== inputs.confirmPass) {
        showErrorDialog("An error occurred:", "Passwords don't match");
        return;
      }

      // If password is valid
      if (passwordRegEx.test(newPassword)) {
        try {
          e.preventDefault()
          // Search if email exists in DB
          const userID = await axios.get(`/auth/getUserID${inputs.email}`);
          if (userID) {
            // Change user password
            await axios.post(`/auth/changePassword`, inputs);
            // sends message confirming change, via email
            sendEmail();
            // Go to profile page
            // navigate("/reservations_list");
          } else {
            showErrorDialog(inputs.email, "User does not exists");
          }
        } catch (error) {
          showErrorDialog("An error occurred:", error);
        }
      } else {
        showErrorDialog("An error occurred:", "Password must be minimum eight characters, have at least one letter and one number");
        return;
      }
    // } else {
    //   showErrorDialog("Error: ", "Login to access");
    //   return;
    // }
  };

  // Function to return to last page (profile page)
  const handleGoBack = async e => {
    e.preventDefault()
    navigate("/reservations_list")
  }

  return (/* (isLoggedIn ?  // Show page (html) if user is logged in */
    <div className="changePass">
      <div className='image'>
        {/* Image */}
        <img src={require("../assets/change_pass.png")} alt="" className='imageChangePass'/> 
      </div>
      <div className='containerChangePass'>
        {/* Title */}
        <div className="changePassTitle">
          <p>Change Password</p>
        </div>
        <div>
          {/* Email */}
          <div className="emailChangePass" id="emailChangePass">
            <div className="emailTextChangePass">
              <p style={{display: 'inline-block', padding: 2}}>Email address</p>
            </div>
            <div className="inputEmailChangePass">
              <input type="email-login" id="inputEmailChangePass" name="email" required onChange={handleChange}></input>
            </div>
            <label id="warning-email" className='warningChangePass'>Please provide an email</label>
          </div>
          {/* Current Password */}
          <div className="passwordChangeP">
            <div className="passwordTextChangeP">
              <p>Current Password</p>
            </div>
            <div className="inputPasswordChangeP">
              <input type={showPassword ? "text" : "password"} name="pass"
                required onChange={handleChange} className={`pass ${showPassword ? 'visible': '' }`} id="pass"></input>
              <div className="showPassChangePass">
                {/* Password Toggle */}
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOffOutlinedIcon style={{height: '1.2vi', width: '1.2vi'}} />
                  : <VisibilityOutlinedIcon style={{height: '1.2vi', width: '1.2vi'}} />}
                </IconButton>
              </div>
            </div>
          </div>
          <label id="warning-pass" className='warningChangePass'>Please provide your password</label>
          {/* New Password */}
          <div className="passwordChangeP">
            <div className="passwordTextChangeP">
              <p>New Password</p>
            </div>
            <div className="inputPasswordChangeP">
              <input type={showNewPassword ? "text" : "password"} name="password"
                required onChange={handleChange} className={`password ${showNewPassword ? 'visible': '' }`} id="password"></input>
              <div className="showPassChangePass">
                {/* Password Toggle */}
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowNewPassword}
                  edge="end"
                >
                  {showNewPassword ? <VisibilityOffOutlinedIcon style={{height: '1.2vi', width: '1.2vi'}}/>
                  : <VisibilityOutlinedIcon style={{height: '1.2vi', width: '1.2vi'}}/>}
                </IconButton>
              </div>
            </div>
          </div>
          <label id="warning-newPass" className='warningChangePass'>Please provide a password</label>
          {/* Confirm New Password */}
          <div className="passwordChangeP">
            <div className="passwordTextChangeP">
              <p>Confirm New Password</p>
            </div>
            <div className="inputPasswordChangeP">
              <input type={showConfPassword ? "text" : "password"} name="confirmPass"
                required onChange={handleChange} className={`confirmPass ${showConfPassword ? 'visible': '' }`} id="confirmPass"></input>
              <div className="showPassChangePass">
                {/* Password Toggle */}
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowConfPassword}
                  edge="end"
                >
                  {showConfPassword ? <VisibilityOffOutlinedIcon style={{height: '1.2vi', width: '1.2vi'}}/>
                  : <VisibilityOutlinedIcon style={{height: '1.2vi', width: '1.2vi'}}/>}
                </IconButton>
              </div>
            </div>
          </div>
          <label id="warning-confPass" className='warningChangePass'>Please provide a password</label>
          {/* Button */}
          <button type="submit" onClick={handleSubmitChangeP} className='changePassButton'>Change Password</button>
        </div>
        <hr className="separatorChangePass" />
        {/* Go to Profile Page - Return - Cancel */}
        <div className="cancelQuestion">
          <img alt="back" onClick={handleGoBack} src={require("../assets/Image12.png")} className='backArrowImage' />
          <p className="questionCancel">
            <a href="/reservations_list" className="linkCancel">Cancel</a>
          </p>
        </div>
      </div>
    </div>
    // Show error to user, that hasnt logged in
    // : <div>{showErrorDialog("Error: ", "Login to access", true, navigate)}</div>)
  );
};

export default ChangePass;
