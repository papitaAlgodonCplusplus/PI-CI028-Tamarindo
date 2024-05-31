import axios from "axios";
import { AuthContext } from '../AuthContext.js';
import { IconButton } from '@mui/material';
import { showErrorDialog } from "../Misc.js";
import { useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from 'react';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

const ChangePass = () => {

  // Hook for navigating between pages
  const navigate = useNavigate();

  // Password Toggle
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleGoBack = async e => {
    e.preventDefault()
    // navigate("/")
  }

  return (
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
              <p style={{display: 'inline-block', margin: 0, padding: 0}}>Email address</p>
              <p style={{display: 'inline-block', fontSize: '14px', padding: 2}}>*</p>
            </div>
            <div className="inputEmailChangePass">
              <input type="email-login" id="inuptEmailChangePass" name="email" required /* onChange={handleChange} */></input>
            </div>
            <label id="warning-email" className='warningChangePass'>Please provide an email</label>
          </div>
          {/* Current Password */}
          <div className="password">
            <div className="passwordText">
              <p>Current Password</p>
            </div>
            <div className="inputPassword">
              <input type={showPassword ? "text" : "password"} name="password"
                required /* onChange={handleChange} */ className="inputPass1" id="password"></input>
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
          <label id="warning-pass" className='warningChangePass'>Please provide your password</label>
          {/* New Password */}
          <div className="password">
            <div className="passwordText">
              <p>New Password</p>
            </div>
            <div className="inputPassword">
              <input type={showPassword ? "text" : "password"} name="password"
                required /* onChange={handleChange} */ className="inputPass1" id="password"></input>
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
          <label id="warning-pass" className='warningChangePass'>Please provide a password</label>
          {/* Confirm New Password */}
          <div className="password">
            <div className="passwordText">
              <p>Confirm New Password</p>
            </div>
            <div className="inputPassword">
              <input type={showPassword ? "text" : "password"} name="password"
                required /* onChange={handleChange} */ className="inputPass1" id="password"></input>
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
          <label id="warning-pass" className='warningChangePass'>Please provide a password</label>
          {/* Button */}
          <button type="submit" /* onClick={handleSubmitFP} */ className='changePassButton'>Change Password</button>
        </div>
        <hr className="separatorChangePass" />
        {/* Go to Profile Page */}
        <div className="cancelQuestion">
          <img alt="back" onClick={handleGoBack} src={require("../assets/Image12.png")} className='backArrowImage' />
          <p className="questionCancel">
            <a href="/reservations_list" className="linkCancel">Cancel</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChangePass;
