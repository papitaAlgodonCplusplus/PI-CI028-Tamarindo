import axios from "axios"
import React, { useState } from 'react'
import { useNavigate } from "react-router-dom"
import { showErrorDialog } from '../Misc'
import "../styles/register.scss"

const Register = () => {
  const [isChecked, setChecked] = useState(false);
  const [inputs, setInputs] = useState({
    name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    password_confirm: "",
    rol: "client",
    filename: ""
  });

  const navigate = useNavigate()

  const handleChange = e => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleCheckbox = () => {
    setChecked(!isChecked);
  }


  const handleSubmit = async (e) => {
    e.preventDefault()
    let isError = false;

    const name = inputs.name.trim();
    const lastName = inputs.last_name.trim();
    const email = inputs.email.trim();
    const phone = inputs.phone.trim();
    const password = inputs.password;
    const confirmPassword = inputs.password_confirm.trim();

    if (file === null) {
      document.getElementById("warning-user_image").style.display = "block";
      isError = true;
    } else {
      document.getElementById("warning-user_image").style.display = "none";
    }

    if (name === '') {
      document.getElementById("warning-name").style.display = "block";
      isError = true;
    } else {
      document.getElementById("warning-name").style.display = "none";
    }

    if (lastName === '') {
      document.getElementById("warning-last_name").style.display = "block";
      isError = true;
    } else {
      document.getElementById("warning-last_name").style.display = "none";
    }

    if (email === '') {
      document.getElementById("warning-email_reg").style.display = "block";
      isError = true;
    } else {
      document.getElementById("warning-email_reg").style.display = "none";
    }

    if (phone === '') {
      document.getElementById("warning-phone").style.display = "block";
      isError = true;
    } else {
      document.getElementById("warning-phone").style.display = "none";
    }

    if (password === '') {
      document.getElementById("warning-password_reg").style.display = "block";
      isError = true;
    } else {
      document.getElementById("warning-password_reg").style.display = "none";
    }

    if (confirmPassword === '') {
      document.getElementById("warning-password_confirm").style.display = "block";
      isError = true;
    } else {
      document.getElementById("warning-password_confirm").style.display = "none";
    }

    if (isError) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inputs.email)) {
      showErrorDialog("An error occurred:", "Please enter a valid email address.");
      return;
    }

    const passwordRegEx = /^^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (inputs.password !== inputs.password_confirm) {
      showErrorDialog("An error occurred:", "Passwords don't match");
      return;
    }

    if (!isChecked) {
      showErrorDialog("An error occurred:", "It is necessary to accept our terms and conditions.");
      return;
    }

    // Creating FormData object for form data
    const formData = new FormData();
    formData.append('image', file);
    var filename = "";

    // Uploading image file
    filename = await axios.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    // Appending other form data to FormData object
    Object.entries(inputs).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // Setting filename in inputs
    inputs.filename = filename.data;

    if (passwordRegEx.test(password)) {
      try {
        console.log("Register: ", inputs)
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

  const [file, setFile] = useState(null);
  const [, setFileChanged] = useState(false);
  // Function to handle file input change
  const handleFileChange = (e) => {
    // Getting the file input element
    const fileInput = e.target;

    // Getting the selected file
    const file = fileInput.files[0];

    // Getting the image preview element
    const imagePreview = document.getElementById('image-preview');
    const uploadIcon = document.getElementById('upload-icon');

    if (file) {
      // If a file is selected
      const reader = new FileReader();

      // Function to handle when file reading is completed
      reader.onload = function (e) {
        // Displaying the image preview
        imagePreview.src = e.target.result;
        imagePreview.style.visibility = 'visible';
        uploadIcon.style.display = 'none';
      };

      // Reading the selected file as data URL
      reader.readAsDataURL(file);

      // Setting the file state
      // setFile(e.target.files[0]);
      setFile(file);
      setFileChanged(true)

      // Hidding red label
      document.getElementById("warning-user_image").style.display = "none";
    } else {
      // If no file is selected, reset the image preview
      imagePreview.src = '#';
      // imagePreview.style.visibility = 'none';
      imagePreview.style.visibility = 'hidden';
      uploadIcon.style.display = 'block'
    }
  };

  return (
    <div className='register-window'>
      <div className='container-sign-up'>
          <div className="sign-up">
            - Sign Up -
          </div>
          <div className="create-an-account">
            Choose a profile picture!
          </div>

        <form className='form'>
        <div className="file-input-container">
            <input type="file" id="file-input" className="file-input" onChange={handleFileChange} />
            <label htmlFor="file-input" className="file-input-label">
            {/* <img id="image-preview" className="image-preview" src="#" alt="Preview" /> */}
            <img id="image-preview" className="image-preview image-preview-adjusted" src="/default-profile.png" alt="Preview" />
            <div id="upload-icon" className="upload-icon">+</div>
            </label>
          </div>
          <label id="warning-user_image" className='warning-user_image'>Please provide a user image</label>

          <div className='name-user'>
            <label htmlFor="name">Name</label>
            <br />
            <input type="name" id="name" name="name" onChange={handleChange} required />
            <label id="warning-name" className='red-label-3'>Please provide your name</label>
          </div>

          <div className='last-name-user'>
            <label htmlFor="last_name">Last Name</label>
            <br />
            <input type="name" id="last_name" name="last_name" onChange={handleChange} required />
            <label id="warning-last_name" className='red-label-3'>Please provide your last name</label>
          </div>

          <div className='email-user'>
            <label htmlFor="email_reg">Email address</label>
            <br />
            <input type="email" id="email_reg" name="email" onChange={handleChange} required />
            <label id="warning-email_reg" className='red-label-3'>Please provide your email address</label>
          </div>

          <div className='phone-user'>
            <label htmlFor="phone">Phone Number</label>
            <br />
            <input type="number" id="phone" name="phone" onChange={handleChange} required />
            <label id="warning-phone" className='red-label-3'>Please provide your phone number</label>
          </div>

          <div className='password-user'>
            <label htmlFor="password_reg">Password</label>
            <br />
            <input type="password" id="password_reg" name="password" onChange={handleChange} required />
            <label id="warning-password_reg" className='red-label-3'>Please provide a password</label>
          </div>

          <div className='password-confirm-user'>
            <label htmlFor="password_confirm">Confirm Password</label>
            <br />
            <input type="password" id="password_confirm" name="password_confirm" className='password_confirm' onChange={handleChange} required />
            <label id="warning-password_confirm" className='red-label-3'>Please confirm your password</label>
          </div>

          <div className="sign-button">
            <button type="submit" className='create' onClick={handleSubmit}>Sign Up</button>
          </div>
        </form>

        <div className="container-terms">
          <input type="checkbox" id="checkbox" value="checkbox" checked={isChecked} onChange={handleCheckbox} />
          <label htmlFor="checkbox">Accept Terms and Conditions</label>
        </div>

        <p className="already-account">
          <span href="/"> Already have an account? Log in
          </span>
        </p>
      </div>

      <div className="ima_register">
      </div>

    </div>
  )
}

export default Register;