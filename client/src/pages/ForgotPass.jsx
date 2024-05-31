import axios from "axios";
import { AuthContext } from '../AuthContext.js';
import { showErrorDialog } from "../Misc.js";
import { useNavigate } from "react-router-dom";
import React, { useContext, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import useState from 'react-usestateref';
import '../styles/forgot_pass.scss'

const ForgotPass = () => {
  const { login, logout } = useContext(AuthContext);
  logout()

  // State to manage form inputs
  const [inputs, setInputs] = useState({
    email: ""
  });

  const [userInfo, setInfo, infoRef] = useState({
    email: "",
    password: ""
  });

  // Hook for navigating between pages
  const navigate = useNavigate();

  // Function to handle input changes
  const handleChange = e => {
    setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Generate random password
  let newPassword = "";
  const generatePass = async () => {
    const passwordLength = 12;
    let charset = "";

    charset += "!@#$%&*_";
    charset += "0123456789";
    charset += "abcdefghijklmnopqrstuvwxyz";
    charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for (let i = 0; i < passwordLength; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }
  }

  // Send Email
  useEffect(() => emailjs.init("paFNUOkm_RVctv3GH"), []);
  const sendEmail = async () => {
    const serviceId = "service_dvvjgue";
    const templateId = "template_hb4ie6n";

    const email = inputs.email.trim();
    // send email
    await emailjs.send(serviceId, templateId, {
        email: email,
        password: newPassword
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
  const handleSubmitFP = async e => {
    e.preventDefault()

    const email = inputs.email.trim();

    let isError = false;

    if (email === '') {
      document.getElementById("warning-email").style.display = "block";
      isError = true;
    } else {
      document.getElementById("warning-email").style.display = "none";
    }
    
    if(isError) return;

    try {
      // Search if email exists in DB
      const userID = await axios.get(`/auth/getUserID${inputs.email}`);
      if (userID) {
        generatePass();
        // Update variables with user info (new password generated and input email)
        setInfo({...userInfo, email: email, password: newPassword});
        // Change user password
        await axios.post(`/auth/changePassword`, infoRef.current);
        // Generates new password and sends it via email
        sendEmail();
        // Go to login page
        // navigate("/");
      }
    } catch (error) {
      showErrorDialog(inputs.email, "Email does not belong to any user");
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
        <div className="descriptionFP">
          <p>No Problem,<br/> let's reset it</p>
        </div>
        {/* Instruction */}
        <div className="instruction">
          <p>Please enter your email address, you will receive an email to complete the proccess</p>
        </div>
        <div>
          {/* Email */}
          <div className="emailFP" id="emailFP">
            <div className="emailTextFP">
              <p style={{display: 'inline-block', margin: 0, padding: 0}}>Email address</p>
              <p style={{display: 'inline-block', fontSize: '14px', padding: 2}}>*</p>
            </div>
            <div className="inputEmailFP">
              <input type="email-login" id="inuptEmailFP" name="email" required onChange={handleChange}></input>
            </div>
            <label id="warning-email" className='warningFP'>Please provide an email</label>
          </div>
          {/* Button */}
          <button type="submit" onClick={handleSubmitFP} className='resetButton'>Reset Password</button>
        </div>
        <hr className="separatorForgotPass" />
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
