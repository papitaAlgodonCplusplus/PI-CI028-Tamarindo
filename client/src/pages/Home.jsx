import "../styles/home_page.scss"
import { DateObject } from "react-multi-date-picker"
import { Calendar } from "react-multi-date-picker"
import { Context } from '../Context.js';
import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { showErrorDialog } from "../Misc.js";
import { AuthContext } from "../AuthContext.js"
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate()
  const { changeHomeDates, changeHomeSearch } = useContext(Context)
  const [modalVisible, setModalVisible] = useState(false);
  var inDate = useRef('--/--/----');
  var outDate = useRef('--/--/----');
  const [values, setValues] = useState([
    new DateObject(),
    new DateObject()
  ])

  const handleFilterCalendarChange = async (newDatesRange, event) => {
    try {
      setValues(newDatesRange);
      changeHomeDates(newDatesRange)
      if (newDatesRange[0]) {
        inDate.current = newDatesRange[0].toString()
      }
      if (newDatesRange[1]) {
        outDate.current = newDatesRange[1].toString()
      }
    } catch (error) {
      showErrorDialog("An error occurred:", error, false, navigate);
    }
  }

  const handleChange = e => {
    // Update input state when input values change
    setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const [inputs, setInputs] = useState({
    name: "",
    desc: "",
    searchQuery: "",
    delete: "",
    filename: "",
  });

  const handleSearch = async (e) => {
    e.preventDefault();
    const searchTerm = inputs.searchQuery;
    if (searchTerm.trim() === '') {
      navigate("/search")
    } else {
      try {
        changeHomeSearch(searchTerm)
        navigate("/search")
      } catch (error) {
        showErrorDialog("An error occurred:", error, false, navigate);
      }
    }
  }

  const { userId } = useContext(AuthContext)
  const fetchData = async e => {
    const image = await axios.get(`/files/get_image_by_userID${userId}`);
    setImg("/upload/" + image.data[0].filename)
  }

  const { isLoggedIn } = useContext(AuthContext)
  useEffect(() => {
    let fetch = true;
    if (!isLoggedIn) {
      navigate("/")
    }
    if (userId === null) {
      navigate("/")
      fetch = false;
    }
    console.log(userId === null)
    if (fetch) fetchData()
  });

  const toggleModal = (e) => {
    e.preventDefault();
    setModalVisible(!modalVisible);
  };

  const { userRol } = useContext(AuthContext)
  const [img_source, setImg] = useState('');

  return (
    <div className="homepage">
      {(userRol === 'admin' || userRol === 'employee' ?
        <div className="homepage-navbar2">
          <h1>Hotel</h1>
          <img alt="logo" className='logo' src={require("../assets/Logo.PNG")}></img>
          <ul>
            <li><a href="/amenities">Amenities</a></li>
            <li><a href="/rooms">Rooms</a></li>
            <li><a href="/room_type">Room Types</a></li>
          </ul>
        </div>
        :
        <div className="homepage-navbar">
          <h1>Hotel</h1>
          <img alt="logo" className='logo' src={require("../assets/Logo.PNG")}></img>
          <ul>
            <li><a href="/services">Services</a></li>
            <li><a href="/search">Hotel Rooms</a></li>
            <li><a href="/about_us">About Us</a></li>
          </ul>
        </div>)}
      <div className="image-8">
      </div>
      <span className="discover-the-extraordinary-comfort-of-the-hotel-tamarindo">
        Discover the extraordinary<br />
        comfort of the Hotel Tamarindo
      </span>


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
          <input type="text" autoComplete="new-password" placeholder="Search Room by Name" name="searchQuery" maxLength={33} onChange={handleChange} className='input_1'></input>
        </div>
        <div className="check-in">
          <div className="text-field-2">
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
            <img alt="undefined graphic" onClick={toggleModal} className="vector-2" src={require("../assets/Calendar.png")} />
          </div>
          <div className="label-text-4">
            <span className="label-text-5">
              Check-out
            </span>
            <p style={{ position: "absolute", marginTop: "4.3vh", marginLeft: "0.1vw" }}>{outDate.current}</p>
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

      <div className="homepage-2">
        <div className="title">
          <span className="facilities">
            Facilities
          </span>
        </div>
        <div className="facilities-1">
          <div className="room">
            <span className="rooms">
              Rooms
            </span>
          </div>
          <div className="service-facilities-1">
            <span className="service-facilities">
              Service &amp; Facilities
            </span>
          </div>
          <div className="dining">
            <span className="dining-1">
              Dining
            </span>
          </div>
          <div className="conferences-meetings">
            <span className="conferences-meetings-1">
              Conferences &amp;
              Meetings
            </span>
          </div>
          <div className="wedding-package">
            <span className="parking-lot">
              Parking Lot
            </span>
          </div>
        </div>


        <label className="facilities">Testimonies</label>
        <br></br>
        <br></br>
        <br></br>
        <div className="testimony-pedro">
          <img alt="undefined graphic" src={require("../assets/Bg.png")} className="pedro"></img>
          <div className="info-pedro">
            <p className="p-pedro">"The staff members who handle the front office,
              reservations and parking did a wonderful job for us."</p>
            <p className="pedro-name">Pedro Campos</p>
          </div>
        </div>


        <div className="testimony-sandra">
          <img alt="undefined graphic" src={require("../assets/Bg1.png")} className="sandra"></img>
          <div className="info-sandra">
            <p className="p-pedro">“From the initial contact with the
              hotel to the moment we left, there was nothing at all we could fault” </p>
            <p className="pedro-name">Sandra Morales</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;