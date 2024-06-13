import axios from "axios"
import { AuthContext } from '../AuthContext.js';
import { useNavigate } from 'react-router-dom';
import { showWarningDialog, showErrorDialog, putDataWithTimeout, updateContainer, emptyContainer, postDataWithTimeout, deleteDataWithTimeout } from '../Misc';
import React, { useState, useContext, useEffect, useCallback } from 'react'
import '../styles/rooms.scss';

const Rooms = () => {
  // Bool that checks if user has logged in with valid user (client-worker-administrator)
  const { isLoggedIn } = useContext(AuthContext);

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
    if (isLoggedIn) {
      logs = e.target.value;
      fetchData()
      return;
    } else {
      return;
    }
  }


  // Function to add a card to the UI
  const addCard = (title, description, room_type, filename, id) => {
    if (isLoggedIn) {
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
    } else {
      return;
    }
  };

  const handleRoomTypeChange = (e) => {
    if (isLoggedIn) {
      setRoomTypeOption(e.target.value);
    } else {
      return;
    }
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
    if (isLoggedIn) {
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
    } else {
      return;
    }
  }


  function displayModal2() {
    if (isLoggedIn) {
      var modal = document.getElementById("myFormModal2");
      modal.style.display = "block";
    } else {
      return;
    }
  }

  // Function to fetch data and populate UI
  const fetchData = useCallback(async () => {
    if ((userRol !== "admin" && userRol !== "employee") || !isLoggedIn) {
      navigate("/reservations_list") // TODO: ERROR PAGE, CANT ACCESS AS USER
      return;
    }
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
      console.log(roomsResponse)
      roomsResponse.data.forEach(room => {
        if (logged >= logs) {
          updateContainer(cardsContainer);
          return;
        }

        console.log(room)
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
    if (isLoggedIn) {
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
    } else {
      return;
    }
  }

  // Function to handle file input change
  const handleFileChange = (e) => {
    if (isLoggedIn) {
      // Getting the file input element
      const fileInput = e.target;

      // Getting the selected files
      const files = fileInput.files;

      // Getting the image previews container
      const imagePreviewsContainer = document.getElementById('image-previews');

      // Clear previous image previews
      imagePreviewsContainer.innerHTML = '';

      if (files.length > 5) {
        showErrorDialog("Error", "Max 5 images")
        imagePreviewsContainer.style.height = 100 + "vh";
        return;
      }
      if (files.length > 0) {
        let num = 10;
        let h = 100;
        Array.from(files).forEach((file, index) => {
          // Create a FileReader for each file
          const reader = new FileReader();

          // Function to handle when file reading is completed
          reader.onload = function (e) {
            // Create a new img element for each file
            const imagePreview = document.createElement('img');
            imagePreview.id = `image-preview-${index}`;
            imagePreview.className = 'image-preview';
            imagePreview.src = e.target.result;
            imagePreview.alt = 'Preview';
            imagePreview.style.marginBlock = num + "vh";
            imagePreviewsContainer.style.height = h + "vh";
            imagePreview.style.visibility = 'visible';
            imagePreviewsContainer.style.visibility = 'visible';
            num += 35;
            h += 40;

            // Append the img element to the container
            imagePreviewsContainer.appendChild(imagePreview);
          };

          // Read the selected file as a data URL
          reader.readAsDataURL(file);
        });

        // Setting the file state
        setFile(e.target.files);
        setFileChanged(true);
      } else {
        // If no file is selected, reset the image previews
        imagePreviewsContainer.innerHTML = '';
      }
    } else {
      return;
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    if (isLoggedIn) {
      e.preventDefault();
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

      if (!file || file.length === 0) {
        document.getElementById("warning-photo").style.display = "block";
        isError = true;
      } else {
        document.getElementById("warning-photo").style.display = "none";
      }

      if (isError) return;

      try {
        // Creating FormData object for form data
        const formData = new FormData();
        const fileNames = [];

        // Uploading image files
        for (const f of file) {
          formData.append('images', f);
        }

        const response = await axios.post('/upload_multiple', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        fileNames.push(...response.data.fileNames);

        // Appending other form data to FormData object
        Object.entries(inputs).forEach(([key, value]) => {
          formData.append(key, value);
        });

        // Setting filenames in inputs
        inputs.filenames = fileNames;
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
    } else {
      return;
    }
  };


  const handleModifyChange = e => {
    if (isLoggedIn) {
      setData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    } else {
      return;
    }
  }

  function displayModal() {
    if (isLoggedIn) {
      var modal = document.getElementById("myFormModal");
      modal.style.display = "block";
    } else {
      return;
    }
  }

  function closeModal() {
    if (isLoggedIn) {
      var modal = document.getElementById("myFormModal");
      modal.style.display = "none";
    } else {
      return;
    }
  }

  function closeModal2() {
    if (isLoggedIn) {
      var modal = document.getElementById("myFormModal2");
      modal.style.display = "none";
    } else {
      return;
    }
  }

  const handleChange = e => {
    if (isLoggedIn) {
      setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }))
    } else {
      return;
    }
  }

  const [file_changed, setFileChanged] = useState(false);
  // Function to handle amenity modify
  const handleUpdate = async e => {
    if (isLoggedIn) {
      try {
        const formData = new FormData();
        const fileNames = [];
        if (file_changed) {
          // Creating FormData object for form data
          formData.append('image', file);

          // Uploading image files
          for (const f of file) {
            formData.append('images', f);
          }

          const response = await axios.post('/upload_multiple', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });


          fileNames.push(...response.data.fileNames);

          // Appending other form data to FormData object
          Object.entries(inputs).forEach(([key, value]) => {
            formData.append(key, value);
          });

          // Setting filenames in inputs
          inputs.filenames = fileNames;
          inputs.room_type = roomTypeOption;
        }

        // Update amenity on the database
        const req = {
          title: data.title,
          description: data.description,
          filenames: fileNames,
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
    } else {
      return;
    }
  }

  return ((isLoggedIn && (userRol === "admin" || userRol === "employee") ?  // Show page (html) if user is logged in as an user with permissions
    <div className='rooms'>
      <meta name="viewport" content="intial-scale=1"></meta>
      {/* Form modal for adding rooms */}
      <div id="myFormModal" className="form-modal">
        <div className="form-modal-content">
          <span className="close" onClick={closeModal}>&times;</span>
          <form id="myForm">
            {/* File input for uploading image */}
            <div className="file-input-container">
              <input type="file" id="file-input" className="file-input" multiple onChange={handleFileChange} />
              <label htmlFor="file-input" className="file-input-label">Choose images (5 max)</label>
              <div id="image-previews" className="image-previews"></div>
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
            <label htmlFor="room_types_selector_1">Room Type</label><br />
            <select name="room_types_selector" className="custom-select-5" id="room_types_selector_1"
              onChange={handleRoomTypeChange} value={roomTypeOption} required>
              {/* Mapping room types to options */}
              {room_types.map(room_type => (
                <option key={room_type.categoryid} value={room_type.categoryid}>{room_type.class_name}</option>
              ))}
            </select>
            {/* Button to add room */}
            <button type='submit' className="MODAL-BUTTON" onClick={handleSubmit}><center>Add</center></button>
          </form>
        </div>
      </div>

      {/* Form modal for updating rooms */}
      <div id="myFormModal2" className="form-modal">
        <div className="form-modal-content">
          <span className="close" onClick={closeModal2}>&times;</span>
          <form id="myForm">
            {/* Input field for room title */}
            <label htmlFor="name">New Title</label><br />
            <input placeholder={data.title} type="text" id="title" name="title" onChange={handleModifyChange} /><br />
            {/* Textarea for room description */}
            <label htmlFor="desc">New Description</label><br />
            <textarea placeholder={data.description} id="description" name="description" onChange={handleModifyChange} ></textarea>
            {/* Dropdown for selecting room type */}
            <label htmlFor="room_types_selector">New Room Type</label><br />
            <select name="room_types_selector" className="custom-select-4"
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
          <label className="custom-show">Show: </label>
          <select name="lazy-logger" className="custom-select" id="lazy-logger"
            onChange={handleLoggingChange}>
            <option key={3} value={3}>3</option>
            <option key={10} value={10}>10</option>
            <option key={25} value={25}>25</option>
            <option key={50} value={50}>50</option>
          </select>
          {/* Button to display add room modal */}
          <button style={{ "marginBottom": "-15vh" }} className="add-room-button" onClick={displayModal}><center>Add Room</center></button>
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
          <div className="list-container">
          </div>
        </div>
      </div></center>
    </div >
    : <div></div>))
};

export default Rooms;