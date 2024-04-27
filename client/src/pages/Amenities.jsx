/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { emptyContainer, showErrorDialog, postDataWithTimeout, putDataWithTimeout, updateContainer, deleteDataWithTimeout, showWarningDialog } from '../Misc';
import '../amenities_page_styles.scss';
import axios from 'axios';

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
      margin-right: 24px;
      margin-bottom: 10px;" src=${img} alt="${title}-icon"/>
    <div style="
      font-size: 18px;
      font-weight: bold;
      position: absolute; 
      left: 180px; /">${title}</div>
    <div style="
      font-size: 16px;
      color: #333;
      position: absolute;
      left: 540px;">₡${fee}</div>
  </div>
</div>

  <div style="
  display: flex;
  align-items: center;">
    <div style="
    margin-top: 20px;
    border-radius: 6px;
    border: 1px solid #1E91B6;
    background: #FFFFFF;
    display: flex;
    flex-direction: row;
    justify-content: center;
    cursor: pointer;
    padding: 8px 0.4px 8px 0;
    width: 169px;
    box-sizing: border-box;">
      <span style="
      overflow-wrap: break-word;
      font-family: 'Poppins';
      font-weight: 400;
      font-size: 15px;
      letter-spacing: 0.3px;
      line-height: 1.333;
      color: #1E91B6;" id="delete-button-${title}">
        Delete Amenity
      </span>
    </div>

    <div style="
    margin-top: 20px;
    margin-left: 1%;
    border-radius: 6px;
    background: #1E91B6;
    display: flex;
    justify-content: center;
    padding: 9px 0.3px 9px 0;
    width: 169px;
    cursor: pointer;">
      <span style="
      overflow-wrap: break-word;
      font-family: 'Poppins';
      font-weight: 400;
      font-size: 15px;
      letter-spacing: 0.3px;
      line-height: 1.333;
      color: #FFFFFF;" id="modify-button-${title}">
        Modify Amenity
      </span>
    </div>
  </div>
  
</div>
`;

    const amenities_table = document.querySelector('.amenities-container');
    amenities_table.insertAdjacentHTML('beforeend', newAmenityHTML);
    const deleteButton = document.getElementById("delete-button-" + title);
    deleteButton.addEventListener('click', (e) => handleDelete(e, id, title));
    const modifyButton = document.getElementById("modify-button-" + title);
    modifyButton.addEventListener('click', (e) => handleModify(e, title));
  }

  // Function to handle deletion of a service
  const handleDelete = async (e, id, title) => {
    try {
      e.preventDefault();
      const warningResult = await showWarningDialog("Delete Confirmation", "Are you sure you would like to delete the amenity " + title + "?")
      if (!warningResult) return;
      await deleteDataWithTimeout(`/amenities/delete${id}`, 500);
      fetchData()
    } catch (error) {
      showErrorDialog("An error occurred:", error);
    }
  }

  // Function to fetch services data from server
  const fetchData = async () => {
    // if (userRol !== "admin" && userRol !== "employee") {
    //   return;
    // }
    const amenities_table = document.querySelector('.amenities-container');
    try {
      const res = await axios.get("/amenities");
      emptyContainer(amenities_table);
      // Add each service to the UI
      res.data.forEach(service => {
        addAmenity(service.service_name, service.service_price, service.serviceid, service.image_path);
      });
      updateContainer(amenities_table);
      return;
    } catch (error) {
      showErrorDialog("An error occurred:", error);
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
      displayModal2()
    } catch (error) {
      showErrorDialog("An error occurred:", error);
    }
  }

  const [file, setFile] = useState(null);

  const handleChange = e => {
    setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleModifyChange = e => {
    setData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  // Function to handle form submission
  const handleSubmit = async e => {
    e.preventDefault(); // Preventing default form submission behavior

    // Validating file upload
    if (!file) {
      showErrorDialog("An error occurred:", "Please upload an image");
      return;
    }

    // Validating title
    if (!inputs.title) {
      showErrorDialog("An error occurred:", "Please add a title");
      return;
    }

    // Validating fee
    if (!inputs.fee) {
      showErrorDialog("An error occurred:", "Please add a fee");
      return;
    }

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
      inputs.file_path = "./upload/" + filename.data;

      // Adding room data to database
      await postDataWithTimeout("/amenities/add_amenity", inputs, 500);
      fetchData();
      closeModal();
      setFileChanged(false);
      return;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Handling specific error response
        const errorMessage = error.response.data;
        showErrorDialog("An error occurred:", errorMessage);
      } else {
        // Handling generic error
        showErrorDialog("An error occurred:", error);
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
      console.log("Setting: ", req)
      await putDataWithTimeout(`/amenities/update_amenity`, req, 500);
      fetchData()
      closeModal2();
      setFileChanged(false);
      return;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Handling specific error response
        const errorMessage = error.response.data;
        showErrorDialog("An error occurred:", errorMessage);
      } else {
        // Handling generic error
        showErrorDialog("An error occurred:", error);
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
        imagePreview.style.display = 'block';
        imagePreview2.src = e.target.result;
        imagePreview2.style.display = 'block';
      };

      // Reading the selected file as data URL
      reader.readAsDataURL(file);

      // Setting the file state
      setFile(e.target.files[0]);
    } else {
      // If no file is selected, reset the image preview
      imagePreview.src = '#';
      imagePreview.style.display = 'none';
      imagePreview2.src = '#';
      imagePreview2.style.display = 'none';
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  function closeModal() {
    var modal = document.getElementById("myFormModal");
    modal.style.display = "none";
  }

  function closeModal2() {
    var modal = document.getElementById("myFormModal2");
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
    <div>
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
        </div>
      </div>


      <div>
        <div className="amenities-container">

        </div>
        <button className="add-amenity-button" onClick={displayModal}><center>Add Amenity</center></button>
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
            {/* Input field for amenity title */}
            <label htmlFor="title">Title</label><br />
            <input type="text" id="title" name="title" onChange={handleChange} /><br />
            {/* Input field for amenity fee */}
            <label htmlFor="fee">Fee</label><br />
            <input type="number" id="fee" name="fee" onChange={handleChange} /><br />
            {/* Button to add amenity */}
            <button className="add-amenity-button" onClick={handleSubmit}><center>Add Amenity</center></button>
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
              <label htmlFor="file-input" className="file-input-label">Choose an icon</label>
              <img id="image-preview2" className="image-preview2" src={data.file_path} alt="Preview" />
            </div>
            {/* Input field for amenity title */}
            <label htmlFor="title">Title</label><br />
            <input placeholder={data.title} type="text" id="title_modify" name="title" onChange={handleModifyChange} /><br />
            {/* Input field for amenity fee */}
            <label htmlFor="fee">Fee</label><br />
            <input placeholder={data.fee} type="number" id="fee_modify" name="fee" onChange={handleModifyChange} /><br />
            {/* Button to add amenity */}
            <button className="modify-amenity-button" onClick={handleUpdate}><center>Modify Amenity</center></button>
          </form>
        </div>
      </div>
    </div >
  )
}
export default Amenities;