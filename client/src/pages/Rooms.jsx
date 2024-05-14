/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useContext, useEffect, useCallback } from 'react'
import '../styles/rooms.scss';
import axios from "axios"
import { showWarningDialog, showErrorDialog, putDataWithTimeout, updateContainer, emptyContainer, postDataWithTimeout, deleteDataWithTimeout } from '../Misc';
import { AuthContext } from '../AuthContext.js';
import { useNavigate } from 'react-router-dom';

const Rooms = () => {
  const navigate = useNavigate()
  const { userRol } = useContext(AuthContext);
  const [roomTypeOption, setRoomTypeOption] = useState('');
  const [file, setFile] = useState(null);
  const [room_types, setRoomTypes] = useState([]);
  let logs = 3;
  const [inputs, setInputs] = useState({
    name: "",
    desc: "",
    search: "",
    delete: "",
    filename: "",
    room_type: 0,
    room_type_name: "",
    room_type_price: 0,
  })

  const handleLoggingChange = e => {
    logs = e.target.value;
    fetchData()
    return;
  }


  // Function to add a card to the UI
  const addCard = (title, description, room_type, filename, id) => {
    // Truncating description to fit into card display
    description = description.substring(0, 90);

    // Selecting the container for cards
    const cardsContainer = document.querySelector('.list-container');

    // Generating HTML for the new card
    const newCardHTML = `
    <!-- Delete button for the card 
    <button class="delete-button" id="delete-room-button-${title}">
    </button>
  -->
  <div class="list-item">
    <div style="display: flex; justify-content: space-between; align-items: center; width: 70%; padding: 10px;">
      <img style="width: 150px; height: 100px; border-radius: 7px; " src="${filename}" alt="${filename}"/>
      <div style="font-size: 18px; width: 100px; font-weight: bold; position:absolute; left: 200px;">${title}</div>
      <div style="font-size: 16px; width: 200px; color: #333; position:absolute; left: 25vw;">${description}</div>
      <div style="font-size: 16px; color: #333; position:absolute; left: 45vw;">${room_type}</div>
      <div style="
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        position: absolute;
        right: 1vw;
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
          box-sizing: border-box;" id="delete-room-button-${id}">
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
          margin-left: 7.6vw;
          border: solid 1.5px #045B78;
          display: flex;
          justify-content: center;
          padding-left: 0.8vw;
          padding-block: 2.5vh;
          width: 3.5vw;
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
  <div style="padding-bottom: 20px;"></div>
  
  `;

    // Inserting the new card HTML into the container
    cardsContainer.insertAdjacentHTML('beforeend', newCardHTML);

    // Adding event listener to the delete button
    const deleteButton = document.getElementById("delete-room-button-" + id);
    deleteButton.addEventListener('click', (e) => handleDelete(e, id, title));
    const modifyButton = document.getElementById("modify-button-" + id);
    modifyButton.addEventListener('click', (e) => handleModify(e, id, title));
  };

  const handleRoomTypeChange = (e) => {
    setRoomTypeOption(e.target.value);
  };

  const [data, setData] = useState({
    title: "",
    description: "",
    image_id: "",
    id: "",
    type_of_room: ""
  })

  // Function to handle modification of a room
  const handleModify = async (e, id, title) => {
    try {
      e.preventDefault();
      const res = await axios.get(`rooms/by_roomID${id}`)
      setData(prevData => ({
        ...prevData,
        title: res.data[0].title
      }));
      setData(prevData => ({
        ...prevData,
        description: res.data[0].description
      }));
      setData(prevData => ({
        ...prevData,
        image_id: res.data[0].image_id
      }));
      setData(prevData => ({
        ...prevData,
        type_of_room: res.data[0].type_of_room
      }));
      setData(prevData => ({
        ...prevData,
        id: res.data[0].roomid
      }));
      displayModal2()
    } catch (error) {
      showErrorDialog("Error", error);
    }
  }


  function displayModal2() {
    var modal = document.getElementById("myFormModal2");
    modal.style.display = "block";
  }

  // Function to fetch data and populate UI
  const fetchData = useCallback(async () => {
    // if (userRol !== "admin" && userRol !== "employee") {
    //   return;
    // }
    // Selecting containers for room types and cards
    const cardsContainer = document.querySelector('.list-container');

    try {
      // Fetching room types data
      const roomTypesResponse = await axios.get('/categories/room_types');

      // Setting room types state and default room type option
      if (roomTypesResponse.data[0]) {
        setRoomTypes(roomTypesResponse.data);
        setRoomTypeOption(roomTypesResponse.data[0].categoryid);
      }

      // Fetching rooms data
      const roomsResponse = await axios.get("/rooms");

      // Clearing cards container
      emptyContainer(cardsContainer);

      // Counter for lazy logging
      let logged = 0;
      // Adding cards for each room to UI
      roomsResponse.data.forEach(room => {
        if (logged >= logs) {
          updateContainer(cardsContainer);
          return;
        }
        const filepath = "/upload/" + room.filename;

        let selectedRoomType;
        // Retrieve categoryid that equals room's room type
        for (let i = 0; i < roomTypesResponse.data.length; i++) {
          if (roomTypesResponse.data[i].categoryid === room.type_of_room) {
            selectedRoomType = roomTypesResponse.data[i];
            break;
          }
        }

        // Increment logged cards
        logged++;
        // Adding card for the room to UI
        addCard(room.title, room.description, selectedRoomType.class_name, filepath, room.roomid);
      });

      // Updating cards container
      updateContainer(cardsContainer);

      return;
    } catch (error) {
      showErrorDialog("An error occurred:", error);
    }
  });


  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (e, id, title) => {
    e.preventDefault()
    try {
      e.preventDefault();
      const warningResult = await showWarningDialog("Delete Confirmation", "Are you sure you would like to delete the room <strong>" + title + "</strong>?")
      if (!warningResult) return;
      await deleteDataWithTimeout(`/rooms/delete${id}`, 500);
      fetchData()
      window.location.reload();
    } catch (error) {
      showErrorDialog("An error occurred:", error);
    }
    fetchData();
  }

  // Function to handle file input change
  const handleFileChange = (e) => {
    // Getting the file input element
    const fileInput = e.target;

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
      setFileChanged(true)
    } else {
      // If no file is selected, reset the image preview
      imagePreview.src = '#';
      imagePreview.style.visibility = 'none';
      imagePreview.src = '#';
      imagePreview2.style.visibility = 'none';
    }
  };

  // Function to handle form submission
  const handleSubmit = async e => {
    e.preventDefault()
    let isError = false;
    const title = inputs.name.trim();
    const description = inputs.desc.trim();

    if (title === '') {
      document.getElementById("warning-title").style.display = "block";
      isError = true;
    } else {
      document.getElementById("warning-title").style.display = "none";
    }

    if (description === '') {
      document.getElementById("warning-desc").style.display = "block";
      isError = true;
    } else {
      document.getElementById("warning-desc").style.display = "none";
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

      // Setting filename in inputs
      inputs.filename = filename;
      inputs.room_type = roomTypeOption;

      // Adding room data to database
      await postDataWithTimeout("/rooms/add_room", inputs, 500);
      setFileChanged(false);
      fetchData();
      closeModal();
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

  const handleModifyChange = e => {
    setData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function displayModal() {
    var modal = document.getElementById("myFormModal");
    modal.style.display = "block";
  }

  function closeModal() {
    var modal = document.getElementById("myFormModal");
    modal.style.display = "none";
  }

  function closeModal2() {
    var modal = document.getElementById("myFormModal2");
    modal.style.display = "none";
  }

  const handleChange = e => {
    setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const [file_changed, setFileChanged] = useState(false);
  // Function to handle amenity modify
  const handleUpdate = async e => {
    try {
      let image_id = data.image_id;
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

        const img_req = {
          filename: filename.data
        }

        await postDataWithTimeout(`/files/`, img_req, 500);
        const res_img = await axios.get(`/files/get_image_by_filename${filename.data}`)
        image_id = res_img.data[0].imageid
      }

      // Update amenity on the database
      const req = {
        title: data.title,
        description: data.description,
        image_id: image_id,
        id: data.id,
        type_of_room: roomTypeOption
      }

      await putDataWithTimeout(`/rooms/update_room`, req, 500);
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

  // userRol === "admin" || userRol === "employee" ?
  return (
    <div className='body'>
      <meta name="viewport" content="intial-scale=1"></meta>
      {/* Form modal for adding rooms */}
      <div id="myFormModal" className="form-modal">
        <div className="form-modal-content">
          <span className="close" onClick={closeModal}>&times;</span>
          <form id="myForm">
            {/* File input for uploading image */}
            <div className="file-input-container">
              <input type="file" id="file-input" className="file-input" onChange={handleFileChange} />
              <label htmlFor="file-input" className="file-input-label">Choose an image</label>
              <img id="image-preview" className="image-preview" src="#" alt="Preview" />
            </div>
            <label id="warning-photo" className='red-label-r'>Please provide a photo</label>
            {/* Input field for room title */}
            <label htmlFor="name">Title</label><br />
            <input required type="text" id="name" name="name" onChange={handleChange} /><br />
            <label id="warning-title" className='red-label-r'>Please provide a title</label>
            {/* Textarea for room description */}
            <label htmlFor="desc">Description</label><br />
            <textarea required id="desc" name="desc" onChange={handleChange} ></textarea>
            <label id="warning-desc" className='red-label-r'>Please provide a description</label>
            {/* Dropdown for selecting room type */}
            <label htmlFor="room_types_selector">Room Type</label><br />
            <select name="room_types_selector" className="custom-select-2" id="room_types_selector_1"
              onChange={handleRoomTypeChange} value={roomTypeOption} required>
              {/* Mapping room types to options */}
              {room_types.map(room_type => (
                <option key={room_type.categoryid} value={room_type.categoryid}>{room_type.class_name}</option>
              ))}
            </select>
            {/* Button to add room */}
            <button type='submit' className="MODAL-BUTTON" onClick={handleSubmit}><center>Add Room</center></button>
          </form>
        </div>
      </div>

      {/* Form modal for updating rooms */}
      <div id="myFormModal2" className="form-modal">
        <div className="form-modal-content">
          <span className="close" onClick={closeModal2}>&times;</span>
          <form id="myForm">
            {/* File input for uploading image */}
            <div className="file-input-container">
              <input type="file" id="file-input" className="file-input" onChange={handleFileChange} />
              <label htmlFor="file-input" className="file-input-label">Choose an image</label>
              <img id="image-preview2" className="image-preview" src="#" alt="Preview" />
            </div>
            {/* Input field for room title */}
            <label htmlFor="name">Title</label><br />
            <input placeholder={data.title} type="text" id="title" name="title" onChange={handleModifyChange} /><br />
            {/* Textarea for room description */}
            <label htmlFor="desc">Description</label><br />
            <textarea placeholder={data.description} id="description" name="description" onChange={handleModifyChange} ></textarea>
            {/* Dropdown for selecting room type */}
            <label htmlFor="room_types_selector">Room Type</label><br />
            <select name="room_types_selector" className="custom-select" id="room_types_selector_1"
              onChange={handleRoomTypeChange} value={roomTypeOption} required>
              {/* Mapping room types to options */}
              {room_types.map(room_type => (
                <option key={room_type.categoryid} value={room_type.categoryid}>{room_type.class_name}</option>
              ))}
            </select>
            {/* Button to update room */}
            <button type="submit" className="MODAL-BUTTON" onClick={handleUpdate}>
              Update Room
            </button>
          </form>
        </div>
      </div>
      {/* Admin container */}
      <center><div className='admin-container'>
        {/* Section for rooms */}
        <div>
          <div className='rooms-title'>Rooms</div>
          <hr className="solid"></hr>
          <div className="rooms-bar">
            <span className="room">
              Rooms
            </span>
            <span className="description">
              Description
            </span>
            <span className="typeR">
              Type
            </span>
            <span className="actions">
              Actions
            </span>
          </div>
          <label style={{"marginLeft": "-65.5vw"}}>Show: </label>
          <select  style={{"marginTop": "-3.2vh"}} name="lazy-logger" className="custom-select" id="lazy-logger"
            onChange={handleLoggingChange}>
            <option key={3} value={3}>3</option>
            <option key={10} value={10}>10</option>
            <option key={25} value={25}>25</option>
            <option key={50} value={50}>50</option>
          </select>
          {/* Button to display add room modal */}
          <button className="add-room-button" onClick={displayModal}><center>Add Room</center></button>
          <div className="list-container">
          </div>
        </div>
      </div></center>
    </div >)
  // : <div>{showErrorDialog("Error: ", "You must login as admin or employee to access this page", true, navigate)}</div>);
};

export default Rooms;