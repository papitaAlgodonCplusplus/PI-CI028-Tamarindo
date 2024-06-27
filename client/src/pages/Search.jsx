import axios from "axios";
import { AuthContext } from "../AuthContext.js"
import { Calendar } from "react-multi-date-picker"
import { Context } from '../Context.js';
import { DateObject } from "react-multi-date-picker"
import { useNavigate } from "react-router-dom";
import { emptyContainer, updateContainer, showErrorDialog } from "../Misc.js";
import React, { useRef, useState, useEffect, useContext } from 'react';
import '../styles/search_page.scss'

const Search = () => {
  // Bool that checks if user has logged in with valid user (client-worker-administrator)
  const { isLoggedIn } = useContext(AuthContext);

  let cardsContainer;
  const navigate = useNavigate();
  const [sort, setSort] = useState('Recommended')
  const [modalVisible, setModalVisible] = useState(false);
  const [values, setValues] = useState([
    new DateObject(),
    new DateObject()
  ])
  const [nRooms, setNRooms] = useState(0);
  const [totalRooms, setTotalRooms] = useState(0);
  const { changeLastRoomClickedID } = useContext(Context);
  var inDate = useRef('--/--/----');
  var outDate = useRef('--/--/----');
  const { homeDates, homeSearch } = useContext(Context)
  const { changeHomeDates, changeHomeSearch } = useContext(Context)

  const handleFilterCalendarChange = async (newDatesRange, event) => {
    if (isLoggedIn) {
      cardsContainer = document.querySelector('.container-2');
      // Update selected dates
      setValues(newDatesRange);
      let requestParams;
      if (newDatesRange[0]) inDate.current = newDatesRange[0].toString()
      if (newDatesRange[1]) outDate.current = newDatesRange[1].toString()
      if (newDatesRange[1]) {
        // Set default time for check-in and check-out dates
        const checkInDateTime = newDatesRange[0].set({
          hour: 7,
          minute: 0,
          second: 0,
        }).format('YYYY-MM-DD HH:mm:ss');

        const checkOutDateTime = newDatesRange[1].set({
          hour: 18,
          minute: 0,
          second: 0,
        }).format('YYYY-MM-DD HH:mm:ss');

        // Assign to requestParams
        requestParams = {
          check_in_date: checkInDateTime,
          check_out_date: checkOutDateTime,
        };
        try {
          // Fetch available rooms based on the selected dates
          const availableRoomsResponse = await axios.get('/filters/search_available_rooms', { params: requestParams });
          emptyContainer(cardsContainer);
          setNRooms(availableRoomsResponse.data.length);
          for (const room of availableRoomsResponse.data) {
            // Fetch room details by room ID
            const roomDetailsResponse = await axios.get(`/rooms/by_roomID${room.roomid}`);
            // Fetch room image by image ID
            console.log(roomDetailsResponse)
            const roomImage = await axios.get(`/files/get_image_by_id${roomDetailsResponse.data[0].imageid}`);
            // Construct room image path
            const roomImagePath = "/upload/" + roomImage.data[0].filename;
            // Add room card to the UI
            addCardToUI(room.title, room.description, roomImagePath, room.roomid);
          }
          // Update UI container with new room cards
          updateContainer(cardsContainer);
          changeHomeDates([]);
          return;
        } catch (error) {
          showErrorDialog("An error occurred:", error, false, navigate);
        }
      }
    } else {
      return;
    }
  }

  const addCardToUI = (title, description, imageSrc, roomId) => {
    if (isLoggedIn) {
      // Construct HTML for a new card dynamically
      const newCardHTML = `
      <div style="
      box-shadow: 0px 3px 4px 4px rgba(59, 59, 59, 0.25);
      width: 420px;
      height: 180px;
      border: 1px solid #dcdcdc;
      border-radius: 6px;
      background: #FFFFFF;
      position: relative;
      display: flex;
      flex-direction: row;
      padding: 15px 7.2px  0px 10px;
      margin-left: -1vw;
      margin-bottom: 5vh;
      box-sizing: border-box;">
        <img alt="undefined graphic" src="${imageSrc}" style="
        border-radius: 6px;
        margin-right: 18px;
        width: 200px;
        height: 150px;" />
        <div style="
        margin-left: 0px;
        display: inline-block;
        overflow-wrap: break-word;
        font-family: 'Poppins';
        font-weight: bold;
        font-size: 22px;
        text-align: center;
        letter-spacing: 0.2px;
        color: #1A1A1A;">
        ${title}
        </div>
        <span style="
        position: absolute;
        margin-top: 7%;
        text-align: left;
        width: 13vw;
        margin-left: 17.1vw;
        align-self: flex-start;
        overflow-wrap: break-word;
        font-family: 'Poppins';
        font-weight: 500;
        font-size: 14px;
        padding-top: 5px;
        text-align: justify;
        letter-spacing: 0.1px;
        color: #000000;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;">
        ${description}<br /><br />
        </span>
        <div id="room-details-button-${title}" style="
        position: absolute;
        margin-top: 105px;
        margin-left: 217px;
        width: 120px;
        height: 30px;
        padding-top: 16px;
        padding-inline: 10px;
        border-radius: 4px;
        background: #1E91B6;
        cursor: pointer;">
          <div style="
          overflow-wrap: break-word;
          font-family: 'Poppins';
          font-weight: 500;
          font-size: 16px;
          text-align: center;
          // margin-left: 21px;
          color: #FFFFFF;">
            View Details
          </div>
        </div>
      </div>`;

      // Append the new card to the cards container
      cardsContainer = document.querySelector('.container-2');
      cardsContainer.insertAdjacentHTML('beforeend', newCardHTML);
      const detailsButton = document.getElementById("room-details-button-" + title);
      detailsButton.addEventListener('click', (e) => handleOpenDetails(e, roomId));
    } else {
      return;
    }
  };

  const [inputs, setInputs] = useState({
    name: "",
    desc: "",
    searchQuery: "",
    delete: "",
    filename: "",
  });

  const handleChange = e => {
    if (isLoggedIn) {
      // Update input state when input values change
      setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
    } else {
      return;
    }
  }

  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1 });
  const handleSearch = async (e) => {
    if (isLoggedIn) {
      if (e) {
        e.preventDefault();
      }
      const searchTerm = inputs.searchQuery;
      if (searchTerm.trim() === '') {
        window.location.reload();
        return;
      } else {
        try {
          cardsContainer = document.querySelector('.container-2');
          // Retrieve rooms search results using Axios
          const searchResults = await axios.get(`/filters/search_by_title${searchTerm}`);
          // Retrieve image files using Axios
          const imageFiles = await axios.get(`/files/retrieve_images`);
          // Filter image files array to include only images of rooms matching search results
          imageFiles.data = imageFiles.data.filter(image => {
            return searchResults.data.some(resImage => resImage.image_id === image.imageid);
          });
          emptyContainer(cardsContainer);
          setNRooms(searchResults.data.length);

          for (const room of searchResults.data) {
            // Fetch room details by room ID
            const roomDetailsResponse = await axios.get(`/rooms/by_roomID${room.roomid}`);
            // Fetch room image by image ID
            const roomImage = await axios.get(`/files/get_image_by_id${roomDetailsResponse.data[0].imageid}`);
            // Construct room image path
            const roomImagePath = "/upload/" + roomImage.data[0].filename;
            // Add room card to the UI
            addCardToUI(room.title, room.description, roomImagePath, room.roomid);
          }
          updateContainer(cardsContainer);
          return;
        } catch (error) {
          showErrorDialog("An error occurred:", error, false, navigate);
        }
      }
    } else {
      return;
    }
  }

  const toggleModal = (e) => {
    if (isLoggedIn) {
      e.preventDefault();
      setModalVisible(!modalVisible);
    } else {
      return;
    }
  };

  const handleOpenDetails = async (e, roomId) => {
    if (isLoggedIn) {
      // Handle click event to open details page for a room
      e.preventDefault();
      changeLastRoomClickedID(roomId);
      navigate("/details");
    } else {
      return;
    }
  }

  const fetchDataFromServer = async (page = 1, limit = 10) => {
    if (isLoggedIn) {
      cardsContainer = document.querySelector('.container-2');
      // Fetch data from the server to display rooms
      try {
        if (homeSearch) {
          var inputElement = document.querySelector('input[name="searchQuery"]');
          inputs.searchQuery = homeSearch;
          inputElement.value = homeSearch;
          handleSearch();
          const roomsResponse = await axios.get("/rooms");
          setTotalRooms(roomsResponse.data.length);
          return;
        }

        if (homeDates.length > 0) {
          handleFilterCalendarChange(homeDates)
          if (homeDates[0]) inDate.current = homeDates[0].toString()
          if (homeDates[1]) outDate.current = homeDates[1].toString()
          const roomsResponse = await axios.get("/rooms");
          setTotalRooms(roomsResponse.data.length);
          return;
        }

        if (sort === 'Cheapest') {
          const roomsResponse = await axios.get("/rooms");
          emptyContainer(cardsContainer);

          const roomsData = [];
          let logged = 0;
          let start = ((page - 1) * limit) + 1;
          for (const room of roomsResponse.data) {
            if (logged >= limit*page) {
              break;
            }
            logged++;
            if (logged < start) {
              continue;
            }
            const roomTypeResponse = await axios.get(`/categories/room_type_ByID${room.type_of_room}`);
            const price = roomTypeResponse.data[0].price;

            const roomDetailsResponse = await axios.get(`/rooms/by_roomID${room.roomid}`);
            const roomImageResponse = await axios.get(`/files/get_image_by_id${roomDetailsResponse.data[0].imageid}`);
            const roomImagePath = "/upload/" + roomImageResponse.data[0].filename;

            roomsData.push({
              title: room.title,
              description: room.description,
              imagePath: roomImagePath,
              roomId: room.roomid,
              price: price
            });
          }

          roomsData.sort((a, b) => b.price - a.price);

          setNRooms(roomsData.length);
          setTotalRooms(roomsData.length);

          for (const room of roomsData) {
            addCardToUI(room.title, room.description, room.imagePath, room.roomId);
          }

          updateContainer(cardsContainer);
          return;
        }

        const roomsResponse = await axios.get("/rooms");
        emptyContainer(cardsContainer);
        setNRooms(roomsResponse.data.length);
        setTotalRooms(roomsResponse.data.length);
        let logged = 0;
        let start = ((page - 1) * limit) + 1;
        for (const room of roomsResponse.data) {
          if (logged >= limit*page) {
            break;
          }
          logged++;
          if (logged < start) {
            continue;
          }
          // Fetch room details by room ID
          const roomDetailsResponse = await axios.get(`/rooms/by_roomID${room.roomid}`);
          // Fetch room image by image ID
          const roomImage = await axios.get(`/files/get_image_by_id${roomDetailsResponse.data[0].imageid}`);
          // Construct room image path
          const roomImagePath = "/upload/" + roomImage.data[0].filename;
          // Add room card to the UI
          addCardToUI(room.title, room.description, roomImagePath, room.roomid);
        }
        setPagination({
          page: page,
          limit: limit,
          totalPages: Math.ceil(roomsResponse.data.length / limit),
        });
        updateContainer(cardsContainer);
        return;
      } catch (error) {
        showErrorDialog("An error occurred:", error, false, navigate);
      }
    } else {
      return;
    }
  };

  cardsContainer = document.querySelector('.container-2');

  const [dataLoaded, setDataLoaded] = useState(false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // Fetch data when component mounts
    if (!isLoggedIn) {
      navigate("/")
      return;
    }
    if (!dataLoaded) {
      fetchDataFromServer();
      setDataLoaded(true)
    }
  });

  const handleSort = e => {
    e.preventDefault()
    setSort(e.target.value)
    fetchDataFromServer()
  }


  let logs = 3;
  const handleLoggingChange = e => {
    const newLimit = parseInt(e.target.value);
    fetchDataFromServer(1, newLimit);
    console.log(newLimit)
  }
  const handlePageChange = (newPage) => {
    fetchDataFromServer(newPage, pagination.limit);
  };

  const handleGoBack = async e => {
    if (isLoggedIn) {
      e.preventDefault()
      navigate("/home")
    } else {
      return;
    }
  }

  return ((isLoggedIn ?  // Show page (html) if user is logged in
    <div className="search">
      <img alt="back" onClick={handleGoBack} src={require("../assets/Image12.png")} className='image-12' />
      <meta name="viewport" content="intial-scale=1"></meta>
      <div className="rooms">
        Rooms
      </div>
      <div className="frame-40">
        <div className="check-in">
          <div className="text-field">
            <img alt="undefined graphic" className="vector-bed" src={require("../assets/Bed.png")} />
          </div>
          <div className="label-text-rooms">
            <span className="label-text-3">
              Rooms
            </span>
          </div>
          <input autoComplete="new-password" placeholder="Search Room by Name" type="text" name="searchQuery" maxLength={33} onChange={handleChange} className='input_searchQuery'></input>
        </div>
        <div className="check-in">
          <div className="text-field-1">
            <img alt="undefined graphic" className="vector-1" src={require("../assets/Calendar.png")} />
          </div>
          <div className="label-text-2">
            <span className="label-text-3">
              Check-in
            </span>
            <p style={{ position: "absolute", marginTop: "4.3vh" }}>{inDate.current}</p>
          </div>
        </div>
        <div onClick={toggleModal} className="check_in_icon"></div>
        <div className="check-out">
          <div className="text-field-2">
            <img alt="undefined graphic" className="vector-2" onClick={toggleModal} src={require("../assets/Calendar.png")} />
          </div>
          <div className="label-text-4">
            <span className="label-text-5">
              Check-out
            </span>
            <p style={{ position: "absolute", marginTop: "4.3vh" }}>{outDate.current}</p>
          </div>
        </div>
        {/* Modal for filter options, visible if modalVisible is true */}
        {modalVisible && (
          <Calendar className="calendar"
            value={values}
            onChange={(newDatesRange, event) => handleFilterCalendarChange(newDatesRange, event)}
            range
            numberOfMonths={2}
            showOtherDays
          />
        )}
        <div className="style-layer" onClick={handleSearch}>
          <div className="material-symbolssearch-rounded">
            <img alt="undefined graphic" className="vector" src={require("../assets/Zoom.png")} />
          </div>
          <span className="button">
            Search
          </span>
        </div>
      </div>

      <div className="results">

        <div className="frame-201">
          <p className="showing-4-of-108-places">
          </p>
        </div>
        <div className="container-2">
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

      </div>
    </div>
    // Show error to user, that hasnt logged in
    : <div>{showErrorDialog("Error: ", "Login to access", true, navigate)}</div>)
  )
}

export default Search;