import React, { useState } from 'react'
import User from "../img/User.png"
import hotel_login from "../assets/hotel_register.png"
import "../styles/register.scss"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import { showErrorDialog } from '../Misc'

const Register = () => {
  const [isChecked, setChecked] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);
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

  const [err] = useState(null)
  const navigate = useNavigate()

  const handleChange = e => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleCheckbox = () => {
    setChecked(!isChecked);
  }

  const openModal = () => {
    setIsOpen(true);
  }

  const closeModal = () => {
    setIsOpen(false);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      showErrorDialog("An error occurred:", "Please upload an image");
      return;
    }

    if (!inputs.name) {
      showErrorDialog("An error occurred:", "Please enter your name.");
      return;
    }

    if (!inputs.last_name) {
      showErrorDialog("An error occurred:", "Please enter your last name.");
      return;
    }

    if (!inputs.email) {
      showErrorDialog("An error occurred:", "Please enter your email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inputs.email)) {
      showErrorDialog("An error occurred:", "Please enter a valid email address.");
      return;
    }

    if (!inputs.phone) {
      showErrorDialog("An error occurred:", "Please enter your phone number.");
      return;
    }

    if (!inputs.password) {
      showErrorDialog("An error occurred:", "Please enter your password.");
      return;
    }

    const password = inputs.password;
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
    inputs.filename = filename;

    if (passwordRegEx.test(password)) {
      e.preventDefault()
      try {
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

  const handleCancel = e => {
    navigate("/")
    return;
  }

  const [file, setFile] = useState(null);
  const [file_changed, setFileChanged] = useState(false);
  // Function to handle file input change
  const handleFileChange = (e) => {
    // Getting the file input element
    const fileInput = e.target;

    // Getting the selected file
    const file = fileInput.files[0];

    // Getting the image preview element
    const imagePreview = document.getElementById('image-preview');

    if (file) {
      // If a file is selected
      const reader = new FileReader();

      // Function to handle when file reading is completed
      reader.onload = function (e) {
        // Displaying the image preview
        imagePreview.src = e.target.result;
        imagePreview.style.visibility = 'visible';
      };

      // Reading the selected file as data URL
      reader.readAsDataURL(file);

      // Setting the file state
      setFile(e.target.files[0]);
      setFileChanged(true)
    } else {
      // If no file is selected, reset the image preview
      imagePreview.src = '#';
      imagePreview.style.visibility = 'none';
    }
  };

  return (
    <div className='register-window'>
      <div className='container-sign-up'>
        <div className="sign-up">
          Sign Up
        </div>

        <div className="create-an-account">
          Create An Account!
        </div>

        <form className='form'>
          {/* File input for uploading image */}
          <div className="file-input-container">
            <input type="file" id="file-input" className="file-input" onChange={handleFileChange} />
            <label htmlFor="file-input" className="file-input-label">Choose an image</label>
            <img id="image-preview" className="image-preview" src="#" alt="Preview" />
          </div>

          <div className='name-user'>
            <label htmlFor="name"> Name </label>
            <br />
            <input type="name" id="name" name="name" onChange={handleChange} required />
          </div>

          <div className='last-name-user'>
            <label htmlFor="last_name"> Last Name </label>
            <br />
            <input type="last_name" id="last_name" name="last_name" onChange={handleChange} required />
          </div>

          <div className='email-user'>
            <label htmlFor="email_reg"> Email address </label>
            <br />
            <input type="email" id="email_reg" name="email" onChange={handleChange} required />
          </div>

          <div className='phone-user'>
            <label htmlFor="phone"> Phone Number </label>
            <br />
            <input type="number" id="phone" name="phone" onChange={handleChange} required />
          </div>

          <div className='password-user'>
            <label htmlFor="password_reg">Password</label>
            <br />
            <input type="password" id="password_reg" name="password" onChange={handleChange} required />
          </div>

          <div className='password-confirm-user'>
            <label htmlFor="password_confirm"> Confirm Password </label>
            <br />
            <input type="password" id="password_confirm" name="password_confirm" className='password_confirm ' onChange={handleChange} required />
          </div>

        </form>

        <div className="container-terms">
          <input type="checkbox" id="checkbox" value="checkbox" checked={isChecked} onChange={handleCheckbox} />
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