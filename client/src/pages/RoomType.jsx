import "../styles/room_types.scss"
import axios from "axios"
import React, { useState, useContext, useEffect } from 'react'
import { deleteDataWithTimeout, putDataWithTimeout, showErrorDialog, showWarningDialog, updateContainer, emptyContainer, postDataWithTimeout } from '../Misc';
import { AuthContext } from '../AuthContext.js';
import { useNavigate } from "react-router-dom";

const RoomType = () => {
  // Function to add a room type to the UI
  const addRoomType = (title, price, id) => {
    // Selecting the container for room types
    const roomsTypeContainer = document.querySelector('.room_types-container');

    // Generating HTML for the new room type
    const newRoomTypeHTML = `
    <div className="list-container">
    <div style="
      height: 60px;
      margin-top: 2%;
      width: 71%;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);
      padding: 20px;
      display: flex;
      align-items: center;
      position: relative; /* Add position: relative to the parent div */">
      <div style="
        font-size: 18px;
        font-weight: bold;
        position: relative; 
        left: 50px;">${title}</div>
      <div style="
        font-size: 16px;
        color: #333;
        width: 80px;
        position: absolute;
        left: 355px;">$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>        
        <div style="
          position: absolute;
          border-radius: 6px;
          background: #FFFFFF;
          display: flex;
          margin-left: 47vw;
          flex-direction: row;
          justify-content: center;
          cursor: pointer;
          padding: 8px 0.4px 8px 0;
          box-sizing: border-box;" id="delete-room_type-button-${id}">
          <img style="
            overflow-wrap: break-word;
            font-family: 'Poppins';
            font-weight: 400;
            width: 4.4vw;
            font-size: 15px;
            letter-spacing: 0.3px;
            cursor: pointer;
            line-height: 1.333;" src="${require("../assets/Bin.jpg")}">
          </img>
        </div>
      <div style="
          position: absolute;
          border-radius: 50px;
          margin-left: 41.4vw;
          border: solid 1.5px #045B78;
          display: flex;
          justify-content: center;
          padding-left: 0.7vw;
          padding-block: 2.5vh;
          width: 3.5vw;
          cursor: pointer;" id="modify-button-${id}">
          <img style="
            overflow-wrap: break-word;
            font-family: 'Poppins';
            font-weight: 400;
            width: 2vw;
            margin-left: -0.7vw;
            font-size: 15px;
            letter-spacing: 0.3px;
            color: #FFFFFF;" src="${require("../assets/Pencil.png")}">
          </img>
        </div>
    </div>
  </div>
  </div>
  `;

    // Inserting the new room type HTML into the container
    roomsTypeContainer.insertAdjacentHTML('beforeend', newRoomTypeHTML);

    // Adding event listener to the delete button
    const deleteButton = document.getElementById("delete-room_type-button-" + id);
    deleteButton.addEventListener('click', (e) => handleRoomTypeDelete(e, id, title));
    const modifyButton = document.getElementById("modify-button-" + id);
    modifyButton.addEventListener('click', (e) => handleModify(e, id));
  };

  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1 });

  const { userRol } = useContext(AuthContext);
  let logs = 3;
  const handleLoggingChange = e => {
    const newLimit = parseInt(e.target.value);
    fetchData(1, newLimit);
    console.log(newLimit)
  }
  const handlePageChange = (newPage) => {
    fetchData(newPage, pagination.limit);
  };


  const handleRoomTypeDelete = async (e, id, title) => {
    e.preventDefault();
    const warningResult = await showWarningDialog("Delete Confirmation", "Are you sure you would like to delete the room type <strong>" + title + "</strong>?")
    if (!warningResult) return;
    try {
      await deleteDataWithTimeout(`/categories/delete_room_type${id}`, 500);
      window.location.reload()
      fetchData();
    } catch (error) {
      showErrorDialog("An error occurred:", error);
    }
  }

  function displayModal() {
    var modal = document.getElementById("myFormModal");
    modal.style.display = "block";
  }

  const navigate = useNavigate()
  // Function to fetch data and populate UI
  const fetchData = async (page = 1, limit = 10) => {
    if (userRol !== "admin" && userRol !== "employee") {
      navigate("/home")
      return;
    }
    // Selecting containers for room types and cards
    const roomTypesContainer = document.querySelector('.room_types-container');

    try {
      // Fetching room types data
      const roomTypesResponse = await axios.get('/categories/room_types');

      // Clearing room types container
      emptyContainer(roomTypesContainer);

      // Adding room types to UI
      let logged = 0; let result = false;
      let start = ((page - 1) * limit) + 1;
      // Iterating through each reservation
      for (const room_type of roomTypesResponse.data) {
        if (logged >= limit * page) {
          break;
        }
        logged++;
        if (logged < start) {
          continue;
        }
        result = true;
        addRoomType(room_type.class_name, room_type.price, room_type.categoryid);
      };

      // Updating room types container
      updateContainer(roomTypesContainer);

      setPagination({
        page: page,
        limit: limit,
        totalPages: Math.ceil(roomTypesResponse.data.length / limit),
      });

      if (!result) {
        // No rooms to show
        document.getElementById("no-result-roomTypes").style.display = "flex";
        setPagination({
          page: page,
          limit: limit,
          totalPages: 1,
        });
      }
      return;
    } catch (error) {
      showErrorDialog("An error occurred:", error);
    }
  };

  const handleChange = e => {
    if (e.target.id === "room_type_price") {
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

  const [data, setData] = useState({
    room_type_name: "",
    room_type_price: "",
    desc: "",
    id: "",
  })

  // Function to handle modification of a room type
  const handleModify = async (e, id) => {
    try {
      e.preventDefault();
      const res = await axios.get(`categories/room_type_ByID${id}`)
      setData(prevData => ({
        ...prevData,
        room_type_name: res.data[0].class_name
      }));
      setData(prevData => ({
        ...prevData,
        room_type_price: res.data[0].price
      }));
      setData(prevData => ({
        ...prevData,
        id: res.data[0].categoryid
      }));
      displayModal2()
    } catch (error) {
      showErrorDialog("Error", error);
    }
  }


  // Function to handle room_type modify
  const handleUpdate = async e => {
    e.preventDefault(); // Preventing default form submission behavior
    try {
      // Update room_type on the database
      const req = {
        title: data.room_type_name,
        fee: data.room_type_price,
        categoryid: data.id
      }
      await putDataWithTimeout(`/categories/update_room_type`, req, 500);
      fetchData()
      closeModal2();
      window.location.reload()
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

  function displayModal2() {
    var modal = document.getElementById("myFormModal2");
    modal.style.display = "block";
  }

  // Function that handles room type submition
  const handleRoomTypeSubmit = async e => {
    e.preventDefault()
    if (!data.room_type_name) {
      showErrorDialog("An error occurred:", "Please add a room type name");
      return;
    }
    if (!data.room_type_price) {
      showErrorDialog("An error occurred:", "Please add a price");
      return;
    }
    try {
      await postDataWithTimeout("/categories/add_room_type", data, 500);
      fetchData();
      closeModal();
      window.location.reload()
      return;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        const errorMessage = error.response.data;
        showErrorDialog("An error occurred:", errorMessage);
      } else {
        showErrorDialog("An error occurred:", error);
      }
    }
  }
  
  const [fetched, setFetched] = useState(false);
  useEffect(() => {
    if (!fetched) {
      fetchData();
      setFetched(true);
    }
  });

  function closeModal() {
    var modal = document.getElementById("myFormModal");
    modal.style.display = "none";
  }

  function closeModal2() {
    var modal = document.getElementById("myFormModal2");
    modal.style.display = "none";
  }


  const handleGoBack = async e => {
    e.preventDefault()
    navigate("/home")
  }

  return (
    <div className='room_types_page'>
      <meta name="viewport" content="intial-scale=1"></meta>
      <img alt="back" onClick={handleGoBack} src={require("../assets/Image12.png")} className='image-12' />
      <div className="room_types">
        Room Types
      </div>
      <button className="add-room_type-button" onClick={displayModal}><center>Add Room Type</center></button>
      <hr className="solid"></hr>

      <div className="room_types-bar">
        <div className="room_types-info-bar">
          <span className="room_type">
            Room Type
          </span>
          <span className="price">
            Price
          </span>
          <span className="description">
            Actions
          </span>
        </div>
      </div>


      <div>
        <div className="room_types-container">

        </div>
        <label id="no-result-roomTypes" className='noResultRoomTypes'>No room types to show</label>
      </div>

      <div className="pagination-controls" style={{ textAlign: 'center', marginTop: '20px' }}>
        <button className='pagination-button' disabled={pagination.page === 1} onClick={() => handlePageChange(1)}>First</button>
        <button className='pagination-button' disabled={pagination.page === 1} onClick={() => handlePageChange(pagination.page - 1)}>Previous</button>
        <span>Page {pagination.page} of {pagination.totalPages}</span>
        <button className='pagination-button' disabled={pagination.page === pagination.totalPages} onClick={() => handlePageChange(pagination.page + 1)}>Next</button>
        <button className='pagination-button' disabled={pagination.page === pagination.totalPages} onClick={() => handlePageChange(pagination.totalPages)}>Last</button>
      </div>

      <label className='custom-show'>Show: </label>
      <select name="lazy-logger" className="custom-select" id="lazy-logger"
        onChange={handleLoggingChange}>
        <option key={5} value={5}>5</option>
        <option selected key={10} value={10}>10</option>
        <option key={15} value={15}>15</option>
        <option key={25} value={25}>25</option>
      </select>


      <div id="myFormModal" className="form-modal">
        <div className="form-modal-content">
          <span className="close" onClick={closeModal}>&times;</span>
          <form className="myForm" id="myForm">
            {/* Input field for room_type title */}
            <label htmlFor="room_type_name">Title</label><br />
            <input type="text" maxLength="28" onChange={handleChange} id="room_type_name" name="room_type_name" /><br />
            {/* Input field for room_type description */}
            {/* <label htmlFor="desc">Description</label><br />
            <input type="text" maxLength="28" id="desc" name="desc" /><br /> */}
            {/* Input field for room_type fee */}
            <label htmlFor="room_type_price">Fee</label><br />
            <input type="number" onChange={handleChange} min="0" id="room_type_price" name="room_type_price" /><br />
            {/* Button to add room_type */}
            <button className="add-room_type-button" onClick={handleRoomTypeSubmit}><center>Upload Room Type</center></button>
          </form>
        </div>
      </div>

      <div id="myFormModal2" className="form-modal">
        <div className="form-modal-content">
          <span className="close" onClick={closeModal2}>&times;</span>
          <form className="myForm">
            {/* Input field for room_type title */}
            <label htmlFor="room_type_name">Title</label><br />
            <input placeholder={data.room_type_name} maxLength="28" type="text" onChange={handleChange} id="title_modify" name="room_type_name" /><br />
            {/* Input field for room_type fee */}
            <label htmlFor="room_type_price">Fee</label><br />
            <input placeholder={data.room_type_price} step="0.01" min="0" type="number" onChange={handleChange} id="fee_modify" name="room_type_price" /><br />
            {/* Button to add room_type */}
            <button className="modify-room_type-button" onClick={handleUpdate}><center>Modify Room Type</center></button>
          </form>
        </div>
      </div>
    </div >
  )
}

export default RoomType;