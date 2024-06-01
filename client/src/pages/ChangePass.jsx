import axios from "axios";
import { AuthContext } from '../AuthContext.js';
import { IconButton } from '@mui/material';
import { showErrorDialog } from "../Misc.js";
import { useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from 'react';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import '../styles/change_pass.scss'

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
              <p style={{display: 'inline-block', padding: 2}}>Email address</p>
            </div>
            <div className="inputEmailChangePass">
              <input type="email-login" id="inputEmailChangePass" name="email" required /* onChange={handleChange} */></input>
            </div>
            <label id="warning-email" className='warningChangePass'>Please provide an email</label>
          </div>
          {/* Current Password */}
          <div className="passwordChangeP">
            <div className="passwordTextChangeP">
              <p>Current Password</p>
            </div>
            <div className="inputPasswordChangeP">
              <input type={showPassword ? "text" : "password"} name="password"
                required /* onChange={handleChange} */ className="inputPass1" id="passwordChangeP"></input>
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
              <p>Current Password</p>
            </div>
            <div className="inputPasswordChangeP">
              <input type={showPassword ? "text" : "password"} name="password"
                required /* onChange={handleChange} */ className="inputPass1" id="passwordChangeP"></input>
              <div className="showPassChangePass">
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
          <label id="warning-pass" className='warningChangePass'>Please provide a password</label>
          {/* Confirm New Password */}
          <div className="passwordChangeP">
            <div className="passwordTextChangeP">
              <p>Current Password</p>
            </div>
            <div className="inputPasswordChangeP">
              <input type={showPassword ? "text" : "password"} name="password"
                required /* onChange={handleChange} */ className="inputPass1" id="passwordChangeP"></input>
              <div className="showPassChangePass">
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
