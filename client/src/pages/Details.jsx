import axios from "axios";
import { AuthContext } from "../AuthContext.js"
import { Calendar } from "react-multi-date-picker"
import { Context } from '../Context';
import { DateObject } from "react-multi-date-picker"
import { useNavigate } from "react-router-dom";
import { showErrorDialog } from "../Misc.js";
import React, { useState, useEffect, useContext, useRef } from 'react';
import Vector from "../vectors/Vector_x2.svg";
import Vector1 from "../vectors/Vector1_x2.svg";
import Vector2 from "../vectors/Vector2_x2.svg";
import Vector4 from "../vectors/Vector4_x2.svg";
import Vector5 from "../vectors/Vector5_x2.svg";
import Vector6 from "../vectors/Vector6_x2.svg";
import Vector10 from "../vectors/Vector10_x2.svg";
import Vector11 from "../vectors/Vector11_x2.svg";
import Location from "../vectors/Location_x2.svg";
import GroupX2 from "../vectors/Group_x2.svg";
import Group1_X2 from "../vectors/Group1_x2.svg";
import Group2_X2 from "../vectors/Group2_x2.svg";
import Group3_X2 from "../vectors/Group3_x2.svg";
import Group4_X2 from "../vectors/Group4_x2.svg";
import Group5_X2 from "../vectors/Group5_x2.svg";
import emailjs from '@emailjs/browser';
import "../styles/details_page.scss"

const LocationIcon = () => <img alt="vector" className="location" src={Location} />;
const Star = () => <div className="star"><img alt="vector" className="vector" src={Vector6} /></div>;
const Star1 = () => <div className="star-1"><img alt="vector" className="vector-1" src={Vector2} /></div>;
const Star2 = () => <div className="star-2"><img alt="vector" className="vector-2" src={Vector4} /></div>;
const Star3 = () => <div className="star-3"><img alt="vector" className="vector-3" src={Vector1} /></div>;
const Star4 = () => <div className="star-4"><img alt="vector" className="vector-4" src={Vector10} /></div>;
const Vector7 = () => <div className="style-layer"><img alt="vector" className="vector-7" src={Vector} /></div>;
const Vector7Pink = () => <div className="style-layer-heart"><img alt="vector" className="vector-7" src={require("../vectors/Vector_x2 - Pink.png")} /></div>;
const Vector8 = () => <div className="style-layer-1"><img alt="vector" className="vector-8" src={Vector5} /></div>;
const Starb = () => <div className="star-b"><img alt="vector" className="vector-11" src={Vector11} /></div>;

const Car = () => (
  <div className="icon-with-text">
    <div className="icon-container">
      <div className="icon"><img className="vector-12" src={Group3_X2} alt="Car" /></div>
      <div className="text">Parking Lot</div>
    </div>
  </div>
);

const Like = () => (
  <div className="icon-with-text">
    <div className="icon-container">
      <div className="icon"><img className="vector-10" src={GroupX2} alt="Like" /></div>
      <div className="text">Most Liked</div>
    </div>
  </div>
);

const Lock = () => (
  <div className="icon-with-text">
    <div className="icon-container">
      <div className="icon"><img className="vector-14" src={Group5_X2} alt="Lock" /></div>
      <div className="text">Security</div>
    </div>
  </div>
);


const Pool = () => (
  <div className="icon-with-text">
    <div className="icon-container">
      <div className="icon"><img className="vector-11" src={Group2_X2} alt="Pool" /></div>
      <div className="text">Swimming Pool</div>
    </div>
  </div>
);

const Wifi = () => (
  <div className="icon-with-text">
    <div className="icon-container">
      <div className="icon"><img className="vector-9" src={Group1_X2} alt="Wifi" /></div>
      <div className="text">Wifi 5G</div>
    </div>
  </div>
);

const Wind = () => (
  <div className="icon-with-text">
    <div className="icon-container">
      <div className="icon"><img className="vector-13" src={Group4_X2} alt="Wind" /></div>
      <div className="text">Air Conditioner</div>
    </div>
  </div>
);

const Details = () => {
  // Bool that checks if user has logged in with valid user (client-worker-administrator)
  const { isLoggedIn } = useContext(AuthContext);

  const navigate = useNavigate()
  const [dataLoaded, setDataLoaded] = useState(false); // State to track if data is loaded
  const { lastRoomClickedID } = useContext(Context); // Context for the ID of the last clicked room
  const imgRef = useRef([]); // Ref for image 
  const titleRef = useRef(null); // Ref for title
  const descRef = useRef(null); // Ref for description
  const priceRef = useRef(null); // Ref for description 
  const { changeBookingDates } = useContext(Context) 
  const { changeAmenitiesList } = useContext(Context)
  const [selectedService, setServiceOption] = useState('');
  const [services, setServices] = useState([]);
  const [servicesList, setServicesList] = useState([]);
  const handleServiceChange = (e) => {
    setServiceOption(e.target.value);
  };

  // Function to handle the addition of a new service to the services list
  const handleAddService = (event) => {
    // Check if the services list already includes the selected service option
    if (servicesList.includes(selectedService)) {
      // If the service option already exists, show an error dialog
      showErrorDialog("Error: ", "Service option already exists in the list.", false, navigate);
    } else {
      // If the service option doesn't exist, add it to the services list
      setServicesList(previousList => [...previousList, selectedService]);

      // Fetch the price of the selected service from the backend
      axios.get(`amenities/get_service${selectedService}`)
        .then(response => {
          // Add the selected service as a new label to the amenities list
          const amenitiesList = document.querySelector('.amenities-list');
          const newLabel = document.createElement('label');
          newLabel.textContent = selectedService;
          newLabel.classList.add('amenity');

          const deleteButton = document.createElement('button');
          deleteButton.textContent = ' x';
          deleteButton.classList.add('delete-button');


          deleteButton.addEventListener('click', () => {
            amenitiesList.removeChild(newLabel);
            setServicesList(previousList => previousList.filter(service => service !== selectedService));
          });

          newLabel.appendChild(deleteButton);
          amenitiesList.appendChild(newLabel);
        })
        .catch(error => {
          // If there's an error fetching the service price, show an error dialog
          showErrorDialog('Error fetching service price:', error, false, navigate);
        });
    }
  }

  const handleFilterCalendarChange = async (newDatesRange, event) => {
    if (isLoggedIn) {
      try {
        setValues(newDatesRange);
      } catch (error) {
        showErrorDialog("An error occurred:", error, false, navigate);
      }
    } else {
      return;
    }
  }

  const [modalVisible, setModalVisible] = useState(false);
  const [values, setValues] = useState([
    new DateObject(),
    new DateObject()
  ])

  const toggleModal = async (e) => {
    if (isLoggedIn) {
      const response = await axios.get(`/reservations/get_reservations_by_room_id${lastRoomClickedID}`);
      setReserved(response.data.map(res => {
        const checkInString = res.check_in.slice(0, 19).replace('T', ' ');
        const checkOutString = res.check_out.slice(0, 19).replace('T', ' ');
        const [year, month, day] = [checkInString.substring(0, 4), checkInString.substring(5, 7), checkInString.substring(8, 10)]
        const [hour, minute, second] = [7, 0, 0];
        const date = new Date(year, month - 1, day, hour, minute, second);
        const formattedCheckIn = new DateObject(date).format();

        const [year2, month2, day2] = [checkOutString.substring(0, 4), checkOutString.substring(5, 7), checkOutString.substring(8, 10)]
        const [hour2, minute2, second2] = [18, 0, 0];
        const date2 = new Date(year2, month2 - 1, day2, hour2, minute2, second2);
        const formattedCheckOut = new DateObject(date2).format();

        return [formattedCheckIn, formattedCheckOut];
      }));
      setModalVisible(!modalVisible);
    } else {
      return;
    }
  };

  // Function to handle booking
  const handleBook = async e => {
    toggleModal()
  }

  // Function to handle pay
  const handlePay = async e => {
    if (values[1]) {
      changeBookingDates(values)
      changeAmenitiesList(servicesList)
      navigate("/pay")
    }
  }

  // Function to fetch data
  const fetchData = async () => {
    if (isLoggedIn) {
      try {
        // Fetch services data
        axios.get('/amenities').then(response => {
          console.log(response)
          // Set the services state with the fetched data
          setServices(response.data);
          // Set the default service option if any
          if (response.data[0]) {
            setServiceOption(response.data[0].service_name);
          }
        });

        const roomID = lastRoomClickedID; // Get the ID of the room
        const res = await axios.get(`/filters/retrieve_room${roomID}`); // Fetch room data
        // Fetch images for each item in res.data
        const imageRequests = res.data.map(async item => {
          const image = await axios.get(`/files/get_image_by_id${item.imageid}`);
          return {
            ...item,
            imagePath: "/upload/" + image.data[0].filename
          };
        });
        const itemsWithImages = await Promise.all(imageRequests);
        imgRef.current = itemsWithImages.map(item => item.imagePath);
        const price = await axios.get(`/categories/room_type_ByID${res.data[0].type_of_room}`) // Fetch price
        titleRef.current = res.data[0].title; // Set title reference
        descRef.current = res.data[0].description; // Set description reference
        priceRef.current = price.data[0].price // Set the price per night
        setDataLoaded(true); // Set data loaded to true
      } catch (error) {
        showErrorDialog("An error occurred:", error, false, navigate); // Show error dialog
      }
    } else {
      return;
    }
  };

  // Effect hook to fetch data on component mount
  const [fetched, setFetched] = useState(false)
  useEffect(() => {
    emailjs.init("SJ4OEzBWXm7Df5Ni-")
    if (!isLoggedIn) {
      navigate("/")
    }
    if (!fetched) {
      fetchData();
      setFetched(true)
    }
  });

  const handleGoBack = async e => {
    if (isLoggedIn) {
      e.preventDefault()
      navigate("/search")
    } else {
      return;
    }
  }

  const [isPink, setIsPink] = useState(false);

  const handleHeartClick = () => {
    setIsPink(!isPink);
  };

  const handleShareClick = () => {
    window.open('https://mail.google.com', '_blank');
  };

  const [reserved, setReserved] = useState([]);
  function isReserved(strDate) {
    return reserved.some(([start, end]) => strDate >= start && strDate <= end);
  }

  return ((isLoggedIn ?  // Show page (html) if user is logged in
    <div className="details_page">
      <meta name="viewport" content="intial-scale=1"></meta>
      <img alt="back" onClick={handleGoBack} src={require("../assets/Image12.png")} className='image-12' />

      <div className="details">
        <div className="frame-124">
          <div className="frame-123">
            <span className="master-suite-tropicana">
              {dataLoaded && titleRef.current}
            </span>
            <div className="frame-53">
              <div className="frame-52">
                <Star />
                <Star1 />
                <Star2 />
                <Star3 />
                <Star4 />
              </div>
              <span className="star-hotel">
                5 Star Room
              </span>
            </div>
          </div>
          <div className="frame-129">
            <div className="frame-54">
              <LocationIcon />
              <div className="tamarindo-costa-rica">
                Tamarindo, Costa Rica
              </div>
            </div>
            <div className="frame-57">
              <div className="button">
                <Starb />
                <div className="frame-1">
                  <span className="button-4">
                    4.7
                  </span>
                </div>
              </div>
              <p className="very-good-371-reviews">
                Very Good 371 reviews
              </p>
            </div>
          </div>
        </div>
        <div className="frame-135">
          <p className="night">
            <span className="night-sub-4"></span><span></span>
          </p>
          <label className="price">
            ${dataLoaded && priceRef.current.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {' '} / {' '} night
          </label>
          <div className="frame-134">
            <div className="button-1" onClick={handleHeartClick}>
              {isPink ? <Vector7Pink /> : <Vector7 />}
            </div>
            <div className="button-2" onClick={handleShareClick}>
              <Vector8 />
            </div>
            <div onClick={handleBook} className="button-3">
              <div className="style-layer-2">
                <span className="button-5">
                  Book now
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {dataLoaded && <img alt="Principal Reference" src={imgRef.current[0]} className="main-rectangle">
      </img>}
      <div className="frame-128">
        <div className="frame-126">
          <img alt="Second Reference" src={imgRef.current[1] ? imgRef.current[1] : require("../assets/white.png")} className="rectangle">
          </img>
          <img alt="Third Reference" src={imgRef.current[2] ? imgRef.current[2] : require("../assets/white.png")} className="rectangle">
          </img>
        </div>
        <div className="frame-127">
          <img alt="Fourth Reference" src={imgRef.current[3] ? imgRef.current[3] : require("../assets/white.png")} className="rectangle">
          </img>
          <img alt="Fifth Reference" src={imgRef.current[4] ? imgRef.current[4] : require("../assets/white.png")} className="rectangle">
          </img>
        </div>
      </div>

      <br></br>
      <br></br>
      <label className="overview">Overview</label>
      <p className="description">{dataLoaded && descRef.current}</p>
      <br></br>
      <div className="gray_line"></div>
      <br></br>
      <label className="overview">Top Facilities</label>
      <br></br>
      <br></br>
      <div className="icon-container">
        <div className="left-icons">
          <Wifi />
          <Wind />
          <Car />
        </div>
        <div className="right-icons">
          <Lock />
          <Pool />
          <Like />
        </div>
      </div>

      {/* Modal for booking dates, visible if modalVisible is true */}
      {modalVisible && (
        <div>
          <Calendar className="booking_calendar"
            value={values}
            onChange={(newDatesRange, event) => handleFilterCalendarChange(newDatesRange, event)}
            mapDays={({ date }) => {
              let className;
              const strDate = date.format();

              if (isReserved(strDate)) className = "reserved";
              if (className) return { className, disabled: true };
            }}
            range
            numberOfMonths={2}
            showOtherDays
          />

          <div className="white_yo">
            <div className="add-amenities">
              Add Amenities
            </div>
            <img alt="undefined graphic" onClick={handleAddService} src={require("../assets/Plus.png")} className='plus-img'></img>
            {/* Dropdown for selecting services */}
            <div className="custom-select">
              <select name="services_selector" onChange={handleServiceChange} value={selectedService} required>
                {/* Mapping services to options */}
                {services.map(service => (
                  <option key={service.serviceid} value={service.service_name}>
                    ~ {service.service_name} ~ [${service.service_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}]
                  </option>
                ))}
              </select>
              <div className="amenities-list">
              </div>
            </div>
          </div>
          <div onClick={handlePay}>
            <div className="style-layer-23">
              <span className="button-52">
                Book now
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
    // Show error to user, that hasnt logged in
    : <div>{showErrorDialog("Error: ", "Login to access", true, navigate)}</div>)
  )
}

export default Details;