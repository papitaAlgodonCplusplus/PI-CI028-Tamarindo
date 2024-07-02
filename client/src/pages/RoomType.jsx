import "../styles/room_types.scss"
import axios from "axios"
import React, { useState, useContext, useEffect } from 'react'
import { deleteDataWithTimeout, putDataWithTimeout, showErrorDialog, showWarningDialog, updateContainer, emptyContainer, postDataWithTimeout } from '../Misc';
import { AuthContext } from '../AuthContext.js';
import { useNavigate } from "react-router-dom";

const RoomType = () => {
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1 });
  const { userRol } = useContext(AuthContext);
  const [data, setData] = useState({
    room_type_name: "",
    room_type_price: "",
    desc: "",
    id: "",
  });
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [fetched, setFetched] = useState(false);
  const navigate = useNavigate();

  const handleLoggingChange = e => {
    const newLimit = parseInt(e.target.value);
    fetchData(1, newLimit);
  };

  const handlePageChange = (newPage) => {
    fetchData(newPage, pagination.limit);
  };

  const renderPagination = () => {
    const { page, totalPages } = pagination;
    const pages = [];
  
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (page > totalPages - 3) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', page - 1, page, page + 1, '...', totalPages);
      }
    }
  
    return (
      <div className="pagination-controls">
        <button className="pagination-button" disabled={page === 1} onClick={() => handlePageChange(page - 1)}>&laquo; Previous</button>
        {pages.map((p, index) => (
          <button
            key={index}
            className={`pagination-button ${p === page ? 'active' : ''}`}
            onClick={() => typeof p === 'number' && handlePageChange(p)}
            disabled={typeof p !== 'number'}
          >
            {p}
          </button>
        ))}
        <button className="pagination-button" disabled={page === totalPages} onClick={() => handlePageChange(page + 1)}>Next &raquo;</button>
      </div>
    );
  };

  const validateFields = () => {
    let newErrors = {};
    if (!data.room_type_name) {
      newErrors.room_type_name = "Please add a room type name";
    }
    if (!data.room_type_price || parseFloat(data.room_type_price) < 0) {
      newErrors.room_type_price = "Please add a valid price";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  function displayModal2() {
    var modal = document.getElementById("myFormModal2");
    modal.style.display = "block";
  }

  const fetchData = async (page = 1, limit = 10) => {
    if (userRol !== "admin" && userRol !== "employee") {
      navigate("/home")
      return;
    }
    const roomTypesContainer = document.querySelector('.room_types-container');
    try {
      const roomTypesResponse = await axios.get('/categories/room_types');
      emptyContainer(roomTypesContainer);
      let logged = 0;
      let result = false;
      let start = ((page - 1) * limit) + 1;
      for (const room_type of roomTypesResponse.data) {
        if (logged >= limit * page) break;
        logged++;
        if (logged < start) continue;
        result = true;
        addRoomType(room_type.class_name, room_type.price, room_type.categoryid);
      }
      updateContainer(roomTypesContainer);
      setPagination({
        page: page,
        limit: limit,
        totalPages: Math.ceil(roomTypesResponse.data.length / limit),
      });
      if (!result) {
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
      if (parseFloat(newValue) < 0) {
        e.target.value = 0;
        showErrorDialog("Error", "Fee can't be negative");
        return;
      } else {
        setData(prev => ({ ...prev, [e.target.name]: e.target.value }));
      }
    } else {
      setData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }
  }

  const handleModify = async (e, id) => {
    try {
      e.preventDefault();
      const res = await axios.get(`categories/room_type_ByID${id}`);
      setData({
        room_type_name: res.data[0].class_name,
        room_type_price: res.data[0].price,
        id: res.data[0].categoryid
      });
      displayModal2();
    } catch (error) {
      showErrorDialog("Error", error);
    }
  }

  const handleUpdate = async e => {
    e.preventDefault();
    if (!validateFields()) return;
    try {
      const req = {
        title: data.room_type_name,
        fee: data.room_type_price,
        categoryid: data.id
      }
      await putDataWithTimeout(`/categories/update_room_type`, req, 500);
      fetchData();
      closeModal2();
      window.location.reload();
    } catch (error) {
      if (error.response && error.response.status === 404) {
        const errorMessage = error.response.data;
        showErrorDialog("Error", errorMessage);
      } else {
        showErrorDialog("Error", error);
      }
    }
  }

  const handleRoomTypeSubmit = async e => {
    e.preventDefault();
    if (!validateFields()) return;
    try {
      await postDataWithTimeout("/categories/add_room_type", data, 500);
      fetchData();
      closeModal();
      window.location.reload();
    } catch (error) {
      if (error.response && error.response.status === 404) {
        const errorMessage = error.response.data;
        showErrorDialog("An error occurred:", errorMessage);
      } else {
        showErrorDialog("An error occurred:", error);
      }
    }
  }

  useEffect(() => {
    if (!fetched) {
      fetchData();
      setFetched(true);
    }
  }, [fetched]);

  function closeModal() {
    var modal = document.getElementById("myFormModal");
    modal.style.display = "none";
  }

  function closeModal2() {
    var modal = document.getElementById("myFormModal2");
    modal.style.display = "none";
  }

  const handleGoBack = async e => {
    e.preventDefault();
    navigate("/home");
  }

  const addRoomType = (title, price, id) => {
    const roomsTypeContainer = document.querySelector('.room_types-container');
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
        position: relative;">
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
    `;
    roomsTypeContainer.insertAdjacentHTML('beforeend', newRoomTypeHTML);
    const deleteButton = document.getElementById("delete-room_type-button-" + id);
    deleteButton.addEventListener('click', (e) => handleRoomTypeDelete(e, id, title));
    const modifyButton = document.getElementById("modify-button-" + id);
    modifyButton.addEventListener('click', (e) => handleModify(e, id));
  };

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
        <div className="room_types-container"></div>
        <label id="no-result-roomTypes" className='noResultRoomTypes'>No room types to show</label>
      </div>

      {renderPagination()}  

      <label className='custom-show'>Show: </label>
      <select name="lazy-logger" className="custom-select" id="lazy-logger" onChange={handleLoggingChange}>
        <option key={5} value={5}>5</option>
        <option selected key={10} value={10}>10</option>
        <option key={15} value={15}>15</option>
        <option key={25} value={25}>25</option>
      </select>

      <div id="myFormModal" className="form-modal">
        <div className="form-modal-content">
          <span className="close" onClick={closeModal}>&times;</span>
          <form className="myForm" id="myForm">
            <label htmlFor="room_type_name">Title</label><br />
            <input type="text" maxLength="28" onChange={handleChange} id="room_type_name" name="room_type_name" /><br />
            {errors.room_type_name && <div className="error">{errors.room_type_name}</div>}
            <label htmlFor="room_type_price">Fee</label><br />
            <input type="number" onChange={handleChange} min="0" id="room_type_price" name="room_type_price" /><br />
            {errors.room_type_price && <div className="error">{errors.room_type_price}</div>}
            <button className="add-room_type-button" onClick={handleRoomTypeSubmit}><center>Upload Room Type</center></button>
          </form>
        </div>
      </div>

      <div id="myFormModal2" className="form-modal">
        <div className="form-modal-content">
          <span className="close" onClick={closeModal2}>&times;</span>
          <form className="myForm">
            <label htmlFor="room_type_name">Title</label><br />
            <input placeholder={data.room_type_name} maxLength="28" type="text" onChange={handleChange} id="title_modify" name="room_type_name" /><br />
            {errors.room_type_name && <div className="error">{errors.room_type_name}</div>}
            <label htmlFor="room_type_price">Fee</label><br />
            <input placeholder={data.room_type_price} step="0.01" min="0" type="number" onChange={handleChange} id="fee_modify" name="room_type_price" /><br />
            {errors.room_type_price && <div className="error">{errors.room_type_price}</div>}
            <button className="modify-room_type-button" onClick={handleUpdate}><center>Modify Room Type</center></button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RoomType;
