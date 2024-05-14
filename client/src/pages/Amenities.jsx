/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../AuthContext.js';
import { emptyContainer, showErrorDialog, postDataWithTimeout, putDataWithTimeout, updateContainer, deleteDataWithTimeout, showWarningDialog } from '../Misc';
import '../styles/amenities.scss';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Amenities = () => {
  // Function to add a new amenity to the UI
  const addAmenity = (title, fee, id, img) => {
    const newAmenityHTML = `
    <div className="list-container">
    <div style="
      height: 100px;
      margin-top: 2%;
      width: 71%;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);
      padding: 20px;
      display: flex;
      align-items: center;
      position: relative; /* Add position: relative to the parent div */">
      <img style="
        margin-left: 15px;
        max-width: 90px;
        max-height: 90px;
        margin-right: -5px;
        margin-bottom: 10px;" src=${img} alt="${title}-icon"/>
      <div style="
        font-size: 18px;
        font-weight: bold;
        position: relative; 
        width: 10vw;
        left: 4vw;">${title}</div>
      <div style="
        font-size: 16px;
        color: #333;
        position: relative;
        width: 10vw;
        left: 9vw;">$${fee}</div>
      <div style="
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        position: absolute;
        right: 20px;">
        <div style="
        margin-top: 20px;
        border-radius: 6px;
        background: #FFFFFF;
        display: flex;
        flex-direction: row;
        justify-content: center;
        cursor: pointer;
        padding: 8px 0.4px 8px 0;
        margin-left: 74vw;
        box-sizing: border-box;" id="delete-button-${id}">
        <img style="
          overflow-wrap: break-word;
          font-family: 'Poppins';
          font-weight: 400;
          width: 4vw;
          font-size: 15px;
          letter-spacing: 0.3px;
          cursor: pointer;
          line-height: 1.333;" src="${require("../assets/Bin.jpg")}">
        </img>
      </div>
    </div>
    <div style="
        border-radius: 50px;
        margin-left: 19vw;
        border: solid 1.5px #045B78;
        display: flex;
        justify-content: center;
        padding-inline: 0.4vw;
        margin-top: 3.5vh;
        padding-block: 2vh;
        width: 3vw;
        cursor: pointer;" id="modify-button-${id}">
        <img style="
          overflow-wrap: break-word;
          font-family: 'Poppins';
          font-weight: 400;
          width: 2vw;
          font-size: 15px;
          letter-spacing: 0.3px;
          color: #FFFFFF;" src="${require("../assets/Pencil.png")}">
        </img>
      </div>
    </div>
  </div>  
`;

    const amenities_table = document.querySelector('.amenities-container');
    amenities_table.insertAdjacentHTML('beforeend', newAmenityHTML);
    const deleteButton = document.getElementById("delete-button-" + id);
    deleteButton.addEventListener('click', (e) => handleDelete(e, id, title));
    const modifyButton = document.getElementById("modify-button-" + id);
    modifyButton.addEventListener('click', (e) => handleModify(e, title));
  }

  let logs = 3;
  const handleLoggingChange = e => {
    logs = e.target.value;
    fetchData()
    return;
  }

  // Function to handle deletion of a service
  const handleDelete = async (e, id, title) => {
    try {
      e.preventDefault();
      const warningResult = await showWarningDialog("Delete Confirmation", "Are you sure you would like to delete the amenity <strong>" + title + "</strong>?")
      if (!warningResult) return;
      await deleteDataWithTimeout(`/amenities/delete${id}`, 500);
      fetchData()
      window.location.reload();
    } catch (error) {
      showErrorDialog("Error", error);
    }
  }

  // Function to fetch services data from server
  const { userRol } = useContext(AuthContext);
  const navigate = useNavigate()
  const fetchData = async () => {
    if (userRol !== "admin" && userRol !== "employee") {
      // navigate("/home")
      // return;
    }
    const amenities_table = document.querySelector('.amenities-container');
    try {
      const res = await axios.get("/amenities");
      emptyContainer(amenities_table);
      // Add each service to the UI
      let logged = 0;
      res.data.forEach(service => {
        if (logged >= logs) {
          updateContainer(amenities_table);
          return;
        }
        addAmenity(service.service_name, service.service_price, service.serviceid, service.image_path);
        logged++;
      });
      updateContainer(amenities_table);
      return;
    } catch (error) {
      showErrorDialog("Error", error);
    }
  };

  const [inputs, setInputs] = useState({
    title: "",
    fee: "",
    file_path: "",
  })

  const [data, setData] = useState({
    title: "",
    fee: "",
    file_path: "",
    id: "",
  })

  const [file_changed, setFileChanged] = useState(false);

  // Function to handle modification of a service
  const handleModify = async (e, title) => {
    try {
      e.preventDefault();
      const res = await axios.get(`amenities/get_service${title}`)
      setData(prevData => ({
        ...prevData,
        title: res.data[0].service_name
      }));
      setData(prevData => ({
        ...prevData,
        fee: res.data[0].service_price
      }));
      setData(prevData => ({
        ...prevData,
        file_path: res.data[0].image_path
      }));
      setData(prevData => ({
        ...prevData,
        id: res.data[0].serviceid
      }));
      const imagePreview2 = document.getElementById('image-preview2');
      imagePreview2.src = res.data[0].image_path;
      imagePreview2.style.visibility = 'visible';
      displayModal2()
    } catch (error) {
      showErrorDialog("Error", error);
    }
  }

  const [file, setFile] = useState(null);

  const handleChange = e => {
    if (e.target.id === "fee") {
      const newValue = e.target.value;

      // Check if the entered value is negative
      if (parseFloat(newValue) < 0) {
        e.target.value = 0;
        showErrorDialog("Error", "Fee can't be negative")
        return;
      } else {
        setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }))
      }
    } else {
      setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }
  }

  const handleModifyChange = e => {
    if (e.target.id === "fee_modify") {
      const newValue = e.target.value;

      // Check if the entered value is negative
      if (parseFloat(newValue) < 0) {
        e.target.value = 0;
        showErrorDialog("Error", "Fee can't be negative")
        return;
      } else {
        setData(prev => ({ ...prev, [e.target.name]: e.target.value }))
      }
    } else {
      setData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }
  }

  // Function to handle form submission
  const handleSubmit = async e => {
    e.preventDefault()
    let isError = false;
    const title = inputs.title.trim();
    const fee = inputs.fee.trim();

    if (title === '') {
      document.getElementById("warning-title").style.display = "block";
      isError = true;
    } else {
      document.getElementById("warning-title").style.display = "none";
    }

    if (fee === '') {
      document.getElementById("warning-fee").style.display = "block";
      isError = true;
    } else {
      document.getElementById("warning-fee").style.display = "none";
    }

    if (!file) {
      document.getElementById("warning-photo").style.display = "block";
      isError = true;
    } else {
      document.getElementById("warning-photo").style.display = "none";
    }

    if (isError) return;

    try {
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

      // Setting file_path in inputs
      if (filename.data !== undefined) {
        setInputs(prevData => ({
          ...prevData,
          file_path: "./upload/" + filename.data
        }));
        inputs.file_path = "./upload/" + filename.data
      }

      // Adding room data to database
      await postDataWithTimeout("/amenities/add_amenity", inputs, 500);
      fetchData();
      closeModal();
      setFileChanged(false);
      window.location.reload();
      return;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Handling specific error response
        const errorMessage = error.response.data;
        showErrorDialog("Error", errorMessage);
      } else {
        // Handling generic error
        showErrorDialog("Error", error);
      }
    }
  }

  // Function to handle amenity modify
  const handleUpdate = async e => {
    e.preventDefault(); // Preventing default form submission behavior
    try {
      var file_path = data.file_path;
      if (file_changed) {
        // Creating FormData object for form data
        const formData = new FormData();
        formData.append('image', file);

        // Uploading image file
        const filename = await axios.post('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        // Setting file_path
        file_path = "./upload/" + filename.data
      }

      // Update amenity on the database
      const req = {
        title: data.title,
        fee: data.fee,
        file_path: file_path,
        service_id: data.id
      }
      await putDataWithTimeout(`/amenities/update_amenity`, req, 500);
      fetchData()
      closeModal2();
      setFileChanged(false);
      return;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Handling specific error response
        const errorMessage = error.response.data;
        showErrorDialog("Error", errorMessage);
      } else {
        // Handling generic error
        showErrorDialog("Error", error);
      }
    }
  }

  // Function to handle file input change
  const handleFileChange = (e) => {
    // Getting the file input element
    const fileInput = e.target;

    // Setting file_changed
    setFileChanged(true);

    // Getting the selected file
    const file = fileInput.files[0];

    // Getting the image preview element
    const imagePreview = document.getElementById('image-preview');
    const imagePreview2 = document.getElementById('image-preview2');

    if (file) {
      // If a file is selected
      const reader = new FileReader();

      // Function to handle when file reading is completed
      reader.onload = function (e) {
        // Displaying the image preview
        imagePreview.src = e.target.result;
        imagePreview.style.visibility = 'visible';
        imagePreview2.src = e.target.result;
        imagePreview2.style.visibility = 'visible';
      };

      // Reading the selected file as data URL
      reader.readAsDataURL(file);

      // Setting the file state
      setFile(e.target.files[0]);
    } else {
      // If no file is selected, reset the image preview
      imagePreview.src = '#';
      imagePreview.style.visibility = 'hidden';
      imagePreview2.src = '#';
      imagePreview2.style.visibility = 'hidden';
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  function closeModal() {
    var modal = document.getElementById("myFormModal");
    setFileChanged(false);
    const imagePreview = document.getElementById('image-preview');
    const imagePreview2 = document.getElementById('image-preview2');
    imagePreview.src = '#';
    imagePreview.style.visibility = 'hidden';
    imagePreview2.src = '#';
    imagePreview2.style.visibility = 'hidden';
    modal.style.display = "none";
  }

  function closeModal2() {
    var modal = document.getElementById("myFormModal2");
    setFileChanged(false);
    const imagePreview = document.getElementById('image-preview');
    const imagePreview2 = document.getElementById('image-preview2');
    imagePreview.src = '#';
    imagePreview.style.visibility = 'hidden';
    imagePreview2.src = '#';
    imagePreview2.style.visibility = 'hidden';
    modal.style.display = "none";
  }

  function displayModal() {
    var modal = document.getElementById("myFormModal");
    modal.style.display = "block";
  }

  function displayModal2() {
    var modal = document.getElementById("myFormModal2");
    modal.style.display = "block";
  }

  return (
    <div className='amenities_page'>
      <meta name="viewport" content="intial-scale=1"></meta>
      <div className="amenities">
        Amenities
      </div>
      <hr className="solid"></hr>

      <div className="amenities-bar">
        <div className="amenities-info-bar">
          <span className="amenity">
            Amenity
          </span>
          <span className="price">
            Price
          </span>
          <span className="amenity-actions">
            Actions
          </span>
        </div>
      </div>


      <label style={{ "marginLeft": "20vw" }}>Show: </label>
      <select name="lazy-logger" style={{ "marginLeft": "25vw", "marginTop": "-3vh" }} className="custom-select" id="lazy-logger"
        onChange={handleLoggingChange}>
        <option key={3} value={3}>3</option>
        <option key={10} value={10}>10</option>
        <option key={25} value={25}>25</option>
        <option key={50} value={50}>50</option>
      </select>
      <button className="add-amenity-button" onClick={displayModal}><center>Add Amenity</center></button>
      <div>
        <div className="amenities-container">

        </div>
      </div>

      <div id="myFormModal" className="form-modal">
        <div className="form-modal-content">
          <span className="close" onClick={closeModal}>&times;</span>
          <form className="myForm" id="myForm">
            {/* File input for uploading image */}
            <div className="file-input-container">
              <input type="file" id="file-input" className="file-input" onChange={handleFileChange} />
              <label htmlFor="file-input" className="file-input-label">Choose an icon</label>
              <img id="image-preview" className="image-preview" src={data.file_path} alt="Preview" />
            </div>
            <label id="warning-photo" className='red-label-a'>Please provide an image</label>
            {/* Input field for amenity title */}
            <label htmlFor="title">Title</label><br />
            <input required type="text" maxLength="28" id="title" name="title" onChange={handleChange} /><br />
            <label id="warning-title" className='red-label-a'>Please provide a title</label>
            {/* Input field for amenity fee */}
            <label htmlFor="fee">Fee</label><br />
            <input required type="number" step="0.01" min="0" id="fee" name="fee" onChange={handleChange} /><br />
            <label id="warning-fee" className='red-label-a'>Please provide a fee</label>
            {/* Button to add amenity */}
            <button type="submit" className="add-amenity-button" onClick={handleSubmit}><center>Upload Amenity</center></button>
          </form>
        </div>
      </div>

      <div id="myFormModal2" className="form-modal">
        <div className="form-modal-content">
          <span className="close" onClick={closeModal2}>&times;</span>
          <form className="myForm">
            {/* File input for uploading image */}
            <div className="file-input-container">
              <input type="file" id="file-input2" className="file-input" onChange={handleFileChange} />
              <label htmlFor="file-input" className="file-input-label2">Choose an icon</label>
              <img id="image-preview2" className="image-preview2" src={data.file_path} alt="Preview" />
            </div>
            {/* Input field for amenity title */}
            <label htmlFor="title">Title</label><br />
            <input placeholder={data.title} maxLength="28" type="text" id="title_modify" name="title" onChange={handleModifyChange} /><br />
            {/* Input field for amenity fee */}
            <label htmlFor="fee">Fee</label><br />
            <input placeholder={data.fee} step="0.01" min="0" type="number" id="fee_modify" name="fee" onChange={handleModifyChange} /><br />
            {/* Button to add amenity */}
            <button className="modify-amenity-button" onClick={handleUpdate}><center>Modify Amenity</center></button>
          </form>
        </div>
      </div>
    </div >
  )
}
export default Amenities;
