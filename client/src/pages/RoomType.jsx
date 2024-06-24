import React, { useState, useContext, useEffect, useCallback } from 'react';
import axios from "axios";
import { showErrorDialog, updateContainer, emptyContainer, postDataWithTimeout, putDataWithTimeout } from '../Misc';
import { AuthContext } from '../AuthContext.js';
import { useNavigate } from 'react-router-dom';
import '../styles/rooms.scss';

const RoomType = () => {
  const navigate = useNavigate();
  const { isLoggedIn, userRol } = useContext(AuthContext);
  const [room_types, setRoomTypes] = useState([]);
  const [inputs, setInputs] = useState({
    room_type_name: "",
    room_type_price: 0,
  });
  const [data, setData] = useState({
    room_type_name: "",
    room_type_price: 0,
    id: "",
  });

  const fetchData = useCallback(async () => {
    if ((userRol !== "admin" && userRol !== "employee") || !isLoggedIn) {
      navigate("/reservations_list"); // Redirigir si no tiene permisos
      return;
    }

    const roomTypesContainer = document.querySelector('.room-types-container');
    try {
      const roomTypesResponse = await axios.get('/api/room_types');
      setRoomTypes(roomTypesResponse.data);
      emptyContainer(roomTypesContainer);

      roomTypesResponse.data.forEach(room_type => {
        addRoomType(room_type.class_name, room_type.price, room_type.categoryid);
      });

      updateContainer(roomTypesContainer);
      return;
    } catch (error) {
      showErrorDialog("An error occurred:", error);
    }
  });

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addRoomType = (title, price, id) => {
    const roomTypesContainer = document.querySelector('.room-types-container');
    const newRoomTypeHTML = `
      <div class="list-item">
        <div style="display: flex; justify-content: space-between; align-items: center; width: 70%; padding: 10px;">
          <div style="font-size: 18px; font-weight: bold; position:absolute; left: 200px;">${title}</div>
          <div style="font-size: 16px; color: #333; position:absolute; left: 450px;">${price}</div>
        </div>
        <div style="display: flex; align-items: center;">
          <div style="margin-top: 20px; margin-left: 20%; border-radius: 6px; border: 1px solid #1E91B6; background: #FFFFFF; display: flex; flex-direction: row; justify-content: center; cursor: pointer; padding: 8px 0.4px 8px 0; width: 169px; box-sizing: border-box;" id="delete-room_type-button-${id}">
            <span style="overflow-wrap: break-word; font-family: 'Poppins'; font-weight: 400; font-size: 15px; letter-spacing: 0.3px; line-height: 1.333; color: #1E91B6;">Delete Room Type</span>
          </div>
          <div style="margin-top: 20px; margin-left: 1%; border-radius: 6px; background: #1E91B6; display: flex; justify-content: center; padding: 9px 0.3px 9px 0; width: 169px; cursor: pointer;" id="modify-button-${id}">
            <span style="overflow-wrap: break-word; font-family: 'Poppins'; font-weight: 400; font-size: 15px; letter-spacing: 0.3px; line-height: 1.333; color: #FFFFFF;">Modify Room Type</span>
          </div>
        </div>
      </div>
    `;

    roomTypesContainer.insertAdjacentHTML('beforeend', newRoomTypeHTML);
    const deleteButton = document.getElementById("delete-room_type-button-" + id);
    const modifyButton = document.getElementById("modify-button-" + id);

    deleteButton.addEventListener('click', (e) => handleRoomTypeDelete(e, id));
    modifyButton.addEventListener('click', (e) => handleModify(e, id));
  };

  const handleRoomTypeDelete = async (e, id) => {
    e.preventDefault();
    try {
      await axios.delete(`/api/room_types/delete_room_type${id}`);
      fetchData();
    } catch (error) {
      showErrorDialog("An error occurred:", error);
    }
  };

  const handleModify = async (e, id) => {
    if (isLoggedIn) {
      try {
        e.preventDefault();
        const res = await axios.get(`/api/room_types/room_type_ByID${id}`);
        setData(prevData => ({
          ...prevData,
          room_type_name: res.data[0].class_name,
          room_type_price: res.data[0].price,
          id: res.data[0].categoryid
        }));
        displayModal2();
      } catch (error) {
        showErrorDialog("Error", error);
      }
    } else {
      return;
    }
  };

  const handleUpdate = async (e) => {
    if (isLoggedIn) {
      try {
        const req = {
          class_name: data.room_type_name,
          price: data.room_type_price,
          categoryid: data.id
        };
        await putDataWithTimeout(`/api/room_types/update_room_type`, req, 500);
        fetchData();
        closeModal2();
        return;
      } catch (error) {
        if (error.response && error.response.status === 404) {
          const errorMessage = error.response.data;
          showErrorDialog("Error", errorMessage);
        } else {
          showErrorDialog("Error", error);
        }
      }
    } else {
      return;
    }
  };

  const handleRoomTypeSubmit = async e => {
    e.preventDefault();
    if (!inputs.room_type_name) {
      showErrorDialog("An error occurred:", "Please add a room type name");
      return;
    }
    if (!inputs.room_type_price) {
      showErrorDialog("An error occurred:", "Please add a price");
      return;
    }
    try {
      await postDataWithTimeout("/api/room_types/add_room_type", inputs, 500);
      fetchData();
      closeRoomTypeModal();
      return;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        const errorMessage = error.response.data;
        showErrorDialog("An error occurred:", errorMessage);
      } else {
        showErrorDialog("An error occurred:", error);
      }
    }
  };

  const handleChange = e => {
    setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleModifyChange = e => {
    if (isLoggedIn) {
      setData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    } else {
      return;
    }
  };

  function displayRoomTypeModal() {
    var modal = document.getElementById("roomTypeModal");
    modal.style.display = "block";
  }

  function closeRoomTypeModal() {
    var modal = document.getElementById("roomTypeModal");
    modal.style.display = "none";
  }

  function displayModal2() {
    if (isLoggedIn) {
      var modal = document.getElementById("myFormModal2");
      modal.style.display = "block";
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

  return ((isLoggedIn && (userRol === "admin" || userRol === "employee")) ? (
    <div className='room-types'>
      <meta name="viewport" content="intial-scale=1"></meta>
      <div className='admin-container'>
        <div>
          <div className='room-types-title'>Room Types</div>
          <hr className="solid"></hr>
          <button className="add-room-button" onClick={displayRoomTypeModal}><center>Add Room Type</center></button>
          <div className="rooms-bar">
            <span className="roomT">Room Type</span>
            <span className="priceT">Price</span>
            <span className="actions">Actions</span> {/* Añadido para las acciones */}
          </div>
          <div className="room-types-container"></div>
        </div>
      </div>

      <div id="roomTypeModal" className="form-modal">
        <div className="form-modal-content">
          <span className="close" onClick={closeRoomTypeModal}>&times;</span>
          <form id="myForm">
            <label htmlFor="room_type_name">Room Type Name</label><br />
            <input type="text" id="room_type_name" name="room_type_name" onChange={handleChange} /><br />
            <label htmlFor="room_type_price">Room Type Price</label><br />
            <input type="number" id="room_type_price" name="room_type_price" onChange={handleChange} /><br />
            <button type='submit' className="MODAL-BUTTON" onClick={handleRoomTypeSubmit}><center>Add</center></button>
          </form>
        </div>
      </div>

      <div id="myFormModal2" className="form-modal">
        <div className="form-modal-content">
          <span className="close" onClick={closeModal2}>&times;</span>
          <form id="myForm">
            <label htmlFor="room_type_name">New Room Type Name</label><br />
            <input placeholder={data.room_type_name} type="text" id="room_type_name" name="room_type_name" onChange={handleModifyChange} /><br />
            <label htmlFor="room_type_price">New Room Type Price</label><br />
            <input placeholder={data.room_type_price} type="number" id="room_type_price" name="room_type_price" onChange={handleModifyChange} /><br />
            <button type="submit" className="MODAL-BUTTON" onClick={handleUpdate}>
              Update Room Type
            </button>
          </form>
        </div>
      </div>
    </div>
  ) : <div></div>);
};

export default RoomType;
