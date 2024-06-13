import React, { useState, useRef, useContext, useEffect } from 'react'
import axios from "axios"
import { AuthContext } from '../AuthContext.js';
import { DateObject } from "react-multi-date-picker"
import { Calendar } from "react-multi-date-picker"
import { showErrorDialog, showWarningDialog, calculateNumberOfDays, emptyContainer, updateContainer, deleteDataWithTimeout, putDataWithTimeout } from '../Misc.js';
import "../styles/reservation_list.scss";
import { useNavigate } from 'react-router-dom';

const ReservationsList = () => {
  const { isLoggedIn } = useContext(AuthContext)

  const [selectedDateRange, setSelectedDateRange] = useState([
    new DateObject({ hour: 7 }),
    new DateObject({ hour: 18 })
  ]);

  // Function to add a reservation to the UI
  const addReservation = (title, check_in, check_out, filename, status, id) => {
    const newReservationHTML = `
    <div className="reservations-container">
    <div style="
      height: 100px;
      margin-left: 100px;
      margin-top: 2%;
      width: 81vw;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);
      padding: 20px;
      padding-bottom: 30px;
      display: flex;
      align-items: center;
      position: relative; /* Add position: relative to the parent div */">
      <img style="
        margin-left: 35px;
        max-width: 90px;
        max-height: 90px;
        margin-right: 24px;
        margin-bottom: 10px;" src=${filename} alt="${title}-icon"/>
      <div style="
        font-size: 18px;
        font-weight: bold;
        position: relative;
        word-break: break-all;
        width: 10vw;
        left: 1.2vw;
        margin-top: -10px;">${title}</div>
      <div style="
        font-size: 16px;
        color: #333;
        position: relative;
        left: 15vw;">${check_in.substring(0, 10)}</div>
      <div style="
      font-size: 16px;
      color: #333;
      position: relative;
      left: 20vw;">${check_out.substring(0, 10)}</div>
      <div style="
      font-size: 16px;
      color: #333;
      position: relative;
      left: 24vw;">Active</div>
      <!-- Buttons Container -->
      <div style="
            margin-top: 20px;
            background: #FFFFFF;
            margin-left: 36vw;
            display: flex;
            flex-direction: row;
            justify-content: center;
            cursor: pointer;
            padding: 8px 0.4px 8px 0;
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
          <div style="
            border-radius: 50px;
            margin-top: 3.6vh;
            margin-left: -9vw;
            border: solid 1.5px #045B78;
            display: flex;
            justify-content: center;
            padding-left: 0vw;
            padding-block: 2vh;
            padding-inline: 0.15vw;
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
  `;

    const reservations_table = document.querySelector('.reservations-container');
    reservations_table.insertAdjacentHTML('beforeend', newReservationHTML);
    const deleteButton = document.getElementById("delete-button-" + id);
    deleteButton.addEventListener('click', (e) => handleDelete(e, id));
    const modifyButton = document.getElementById("modify-button-" + id);
    modifyButton.addEventListener('click', (e) => handleModify(e, id));
  };

  // Function to handle deletion of reservation
  const handleDelete = async (e, reservationId) => {
    if (isLoggedIn) {
      e.preventDefault(); // Prevent default form submission behavior
      try {
        // Fetch reservation data by ID
        const reservationResponse = await axios.get(`/reservations/get_reservation_by_id${reservationId}`);

        // Extract check-in date from response
        const checkInDate = new Date(reservationResponse.data[0].check_in);

        // Get current date
        const currentDate = new Date();

        // Calculate time difference between check-in date and current date
        const timeDifference = checkInDate.getTime() - currentDate.getTime();

        // Calculate days difference
        const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

        // If check-in is within 7 days, show warning
        if (daysDifference <= 7) {
          // Fetch payment data by payment ID
          const paymentResponse = await axios.get(`/payments/payment_byPaymentID${reservationResponse.data[0].payment_id}`);

          // Calculate refund amount
          const refundAmount = Math.round(paymentResponse.data[0].price * 0.8);

          // Show warning dialog
          const warningResult = await showWarningDialog("Warning", `Deleting reservation within 7 days of check-in, you'll only receive ${refundAmount} back.`);

          // If user cancels deletion, return
          if (!warningResult) {
            return;
          }
        }

        // Show warning dialog
        const warningConf = await showWarningDialog("Confirm", "Are you sure you want to delete this reservation? (Cannot be undone)");
        if (!warningConf) {
          return;
        }

        // Delete reservation data with timeout
        await deleteDataWithTimeout(`/reservations/delete${reservationId}`, 500);

        showErrorDialog("Success", "Reservation was cancelled succesfully")

        // Fetch updated data
        fetchData();

        return;
      } catch (error) {
        // Show error dialog if an error occurs
        showErrorDialog("An error occurred:", error);
      }
    } else {
      return;
    }
  }

  const [reservation, setReservation] = useState([]);
  const [title, setTitle] = useState('')
  const [check_in, setCheckIn] = useState('')
  const [check_out, setCheckOut] = useState('')
  const [desc, setDesc] = useState('')
  const [type, setType] = useState('')
  const [totalPrice, setTotalPrice] = useState()
  const [imgPath, setImg] = useState()
  const [amenitiesList, setList] = useState([])
  const displayModal = async (id) => {
    if (isLoggedIn) {
      const response = await axios.get(`/reservations/get_reservation_by_id${id}`);
      const response2 = await axios.get(`/rooms/by_roomID${response.data[0].id_room}`)
      const responseImg = await axios.get(`/files/get_image_by_roomid${response.data[0].id_room}`)
      const response3 = await axios.get(`/categories/room_type_ByID${response2.data[0].type_of_room}`)
      const response4 = await axios.get(`/payments/payment_byPaymentID${response.data[0].payment_id}`)
      const response5 = await axios.get(`/amenities/get_all${id}`)
      setTitle(response2.data[0].title)
      setCheckIn(response.data[0].check_in)
      setCheckOut(response.data[0].check_out)
      setDesc(response2.data[0].description)
      setType(response3.data[0].class_name)
      setTotalPrice(response4.data[0].price)
      setImg("upload/" + responseImg.data[0].filename)
      const promises = response5.data.results.map(async (res) => {
        const response6 = await axios.get(`/filters/get_serviceByID${res.service_id}`);
        return [response6.data[0].image_path, response6.data[0].service_name];
      });
      const names = await Promise.all(promises);
      setList(names);
      console.log(names)
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
      var modal = document.getElementById("calendar-modal-modify");
      modal.style.display = "block";
    } else {
      return;
    }
  }

  function closeModal() {
    if (isLoggedIn) {
      var modal = document.getElementById("calendar-modal-modify");
      modal.style.display = "none";
    } else {
      return;
    }
  }

  const [selectedRoomID, setSelectedRoomID] = useState(0);
  const { userId } = useContext(AuthContext);
  const [fetched, setFetched] = useState(false);
  let reservations = [];
  const fetchData = async () => {
    if (isLoggedIn) {
      // Selecting the services container
      const servicesContainer = document.querySelector('.reservations-container');

      try {
        // Clearing the services container
        emptyContainer(servicesContainer);

        // Fetching reservations data for the current user
        const res = await axios.get(`/reservations/by_userID${userId}`);

        let logged = 0;
        // Iterating through each reservation
        for (const reservation of res.data) {
          if (logged >= logs) {
            break;
          }
          // Formatting check-in and check-out dates
          const checkIn = new Date(reservation.check_in).toISOString().slice(0, 19).replace('T', ' ');
          const checkOut = new Date(reservation.check_out).toISOString().slice(0, 19).replace('T', ' ');

          // Fetching room data for the reservation
          const res2 = await axios.get(`/rooms/by_roomID${reservation.id_room}`);

          // Fetching image data for the room
          const image = await axios.get(`/files/get_image_by_id${res2.data[0].imageid}`);
          const filepath = "/upload/" + image.data[0].filename;

          // Fetching payment data for the reservation
          const res3 = await axios.get(`/payments/payment_byPaymentID${reservation.payment_id}`);

          // Adding reservation to the services container
          addReservation(res2.data[0].title, checkIn, checkOut, filepath, res3.data[0].price, reservation.reservationid);

          // Updating the services container
          updateContainer(servicesContainer);
        }
        return;
      } catch (error) {
        showErrorDialog("An error occurred:", error);
      }
    } else {
      return;
    }
  };

  const navigate = useNavigate()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/")
    }
    if (!fetched) {
      fetchData();
      setFetched(true);
    }
  });

  // Function to handle modification of reservation
  const handleModify = async (e, reservationId) => {
    if (isLoggedIn) {
      e.preventDefault(); // Preventing default form submission behavior
      try {
        // Fetching reservation details by ID
        const reservationResponse = await axios.get(`/reservations/get_reservation_by_id${reservationId}`);

        // Extract room ID from the response data and set it
        const roomId = reservationResponse.data[0].id_room;
        setSelectedRoomID(roomId);

        // Fetch reservations for the specific room
        const roomReservationsResponse = await axios.get(`/reservations/get_reservations_by_room_id${roomId}`);

        // Set reservations state with the fetched data
        reservations = roomReservationsResponse.data;
        setReservation(reservations)

        // Display modal for modification
        displayModal(reservationId);
        return;
      } catch (error) {
        // Displaying error dialog if an error occurs
        showErrorDialog("An error occurred:", error);
      }
    } else {
      return;
    }
  };

  let logs = 3;
  const handleLoggingChange = e => {
    if (isLoggedIn) {
      logs = e.target.value;
      fetchData()
      return;
    } else {
      return;
    }
  }

  // State variable for room ID
  const handleModifyConfirm = async (e) => {
    if (isLoggedIn) {
      // Preventing the default form submission behavior
      e.preventDefault();

      try {
        // Fetching room data based on room ID
        const res2 = await axios.get(`/rooms/by_roomID${selectedRoomID}`);

        // Fetching room type data based on room type ID
        const res3 = await axios.get(`/categories/room_type_ByID${res2.data[0].type_of_room}`);

        // Calculating new price based on selected dates and room type price
        let new_price = (res3.data[0].price * (calculateNumberOfDays(selectedDateRange[0], selectedDateRange[1]) - 1));

        // Fetching payment data based on payment ID
        const res4 = await axios.get(`/payments/payment_byPaymentID${reservation[0].payment_id}`);

        // Fetching total service price for the reservation
        const res5 = await axios.get(`/amenities/get_sum${reservation[0].reservationid}`);

        // Adding total service price to the new price
        new_price = Math.floor(new_price + res5.data.totalServicePrice);

        // Getting the old price from payment data
        const old_price = Math.floor(res4.data[0].price);

        // Checking if the new price is greater or lesser than the original
        if (Math.abs(old_price - new_price) > 1000) {
          // Showing error message if the new price is not valid
          showErrorDialog("Error: ", "Cannot select a range of dates greater or lesser than the original.");
          return;
        }

        // Creating request object with updated reservation data
        const req = {
          check_in: new Date(selectedDateRange[0]).toISOString().slice(0, 19).replace('T', ' '),
          check_out: new Date(selectedDateRange[1]).toISOString().slice(0, 19).replace('T', ' '),
          reservationID: reservation[0].reservationid,
        };

        // Updating reservation data on the server
        putDataWithTimeout("/reservations/updateReservation", req);

        // Closing modal
        closeModal();

        // Resetting date state
        setSelectedDateRange(null);

        // Fetching updated reservation data
        fetchData();


        // Reload Page
        window.location.reload()

        return;
      } catch (error) {
        // Handling errors
        showErrorDialog("An error occurred:", error);
      }
    } else {
      return;
    }
  };

  const [reserved, setReserved] = useState([]);

  function isReserved(strDate) {
    return reserved.some(([start, end]) => strDate >= start && strDate <= end);
  }

  const [activeButton, setActiveButton] = useState(false)
  const handleCalendarChange = (newDatesRange, event) => {
    if (isLoggedIn) {
      setSelectedDateRange(newDatesRange)
      if (newDatesRange.length > 1) {
        setActiveButton(true)
      } else {
        setActiveButton(false)
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
  const toggleModal = (e) => {
    if (isLoggedIn) {
      e.preventDefault();
      setModalVisible(!modalVisible);
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
      handleSearch()
    } else {
      return;
    }
  }

  const [nRooms, setNRooms] = useState(0);
  var inDate = useRef('--/--/----');
  var outDate = useRef('--/--/----');


  const handleSearch = async (e) => {
    if (isLoggedIn) {
      if (e) {
        e.preventDefault();
      }
      const servicesContainer = document.querySelector('.reservations-container');
      const searchTerm = inputs.searchQuery;
      if (searchTerm.trim() === '') {
        return;
      } else {
        try {
          // Clearing the services container
          emptyContainer(servicesContainer);

          // Fetching reservations data for the current user
          const res = await axios.get(`/reservations/by_userID${userId}`);

          let logged = 0;
          // Iterating through each reservation
          for (const reservation of res.data) {
            if (logged >= logs) {
              break;
            }
            // Formatting check-in and check-out dates
            const checkIn = new Date(reservation.check_in).toISOString().slice(0, 19).replace('T', ' ');
            const checkOut = new Date(reservation.check_out).toISOString().slice(0, 19).replace('T', ' ');

            // Fetching room data for the reservation
            const res2 = await axios.get(`/rooms/by_roomID${reservation.id_room}`);
            
            if (!res2.data[0].title.includes(inputs.searchQuery)){
              continue;
            }

            // Fetching image data for the room
            const image = await axios.get(`/files/get_image_by_id${res2.data[0].imageid}`);
            const filepath = "/upload/" + image.data[0].filename;

            // Fetching payment data for the reservation
            const res3 = await axios.get(`/payments/payment_byPaymentID${reservation.payment_id}`);

            // Adding reservation to the services container
            addReservation(res2.data[0].title, checkIn, checkOut, filepath, res3.data[0].price, reservation.reservationid);

            // Updating the services container
            updateContainer(servicesContainer);
          }
          return;
        } catch (error) {
          showErrorDialog("An error occurred:", error, false, navigate);
        }
      }
    } else {
      return;
    }
  }

  function isDateBetween(targetDate, startDate, endDate) {
    // Convert the date strings to Date objects
    const target = new Date(targetDate);
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    // Check if the target date is between the start and end dates
    return target >= start && target <= end;
  }

  const handleFilterCalendarChange = async (newDatesRange, event) => {
    if (isLoggedIn) {
      const servicesContainer = document.querySelector('.reservations-container');
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
          // Clearing the services container
          emptyContainer(servicesContainer);

          // Fetching reservations data for the current user
          const res = await axios.get(`/reservations/by_userID${userId}`);

          let logged = 0;
          // Iterating through each reservation
          for (const reservation of res.data) {
            if (logged >= logs) {
              break;
            }
            // Formatting check-in and check-out dates
            const checkIn = new Date(reservation.check_in).toISOString().slice(0, 19).replace('T', ' ');
            const checkOut = new Date(reservation.check_out).toISOString().slice(0, 19).replace('T', ' ');

            if (isDateBetween(requestParams.check_in_date, checkIn, checkOut) || isDateBetween(requestParams.check_out_date, checkIn, checkOut)) {
              continue;
            }

            // Fetching room data for the reservation
            const res2 = await axios.get(`/rooms/by_roomID${reservation.id_room}`);
            
            // Fetching image data for the room
            const image = await axios.get(`/files/get_image_by_id${res2.data[0].imageid}`);
            const filepath = "/upload/" + image.data[0].filename;

            // Fetching payment data for the reservation
            const res3 = await axios.get(`/payments/payment_byPaymentID${reservation.payment_id}`);

            // Adding reservation to the services container
            addReservation(res2.data[0].title, checkIn, checkOut, filepath, res3.data[0].price, reservation.reservationid);

            // Updating the services container
            updateContainer(servicesContainer);
          }
          return;
        } catch (error) {
          showErrorDialog("An error occurred:", error, false, navigate);
        }
      }
    } else {
      return;
    }
  }

  return ((isLoggedIn ?  // Show page (html) if user is logged in
    <div className='m-r'>
      <div className="my-reservations">
        <div className="my-reservations-1">
          <div className="my-reservations">
            My Reservations
          </div>
          <div className="line-2">
          </div>
        </div>
      </div>

      <label className='custom-filter'>Filter By: </label>
      <label className='custom-show'>Show: </label>
      <select name="lazy-logger" className="custom-select" id="lazy-logger"
        onChange={handleLoggingChange}>
        <option key={3} value={3}>3</option>
        <option key={10} value={10}>10</option>
        <option key={25} value={25}>25</option>
        <option key={50} value={50}>50</option>
      </select>
      <input autoComplete="new-password" 
      value={inputs.searchQuery}
      placeholder="Search Room by Name" 
      onChange={handleChange} maxLength={33} name="searchQuery" className='input_az'></input>

      <div className="frame-40">
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

      <div className="reservations-bar">
        <div className="reservations-info-bar">
          <span className="reservation">
            Room
          </span>
          <span className="check-in">
            Check-In
          </span>
          <span className="check-out">
            Check-Out
          </span>
          <span className="status">
            Status
          </span>
          <span className="actions-label">
            Actions
          </span>
        </div>
      </div>

      <div>
        <div className="reservations-container">

        </div>
      </div>

      <div id="calendar-modal-modify" className="form-modal-2">
        <div className="form-modal-content-2">
          <span className="close-modal-x" onClick={closeModal}>&times;</span>
          <div>
            <div className="MDtittle">
              {title}
            </div>

            <div>
              <img className="MDimages" src={imgPath} alt={title}></img>
              <br></br>

              <div className="MDtext">
                <div className="MDdata-check-inspace">
                  Check-In: {check_in.slice(0, 19).replace('T', ' ')}
                </div>
                <br></br>

                <div className="MDdata-ckeck-outspace">
                  Check-Out: {check_out.slice(0, 19).replace('T', ' ')}
                </div>
                <br></br>

                <div className="MDdata-descriptionspace">
                  Description: {desc}
                </div>
              </div>


              <div className="MDtext2">
                <div className="MDdata-typespace">
                  Type of room: {type}
                </div>
                <br></br>

                <div className="MDdata-totalspace">
                  Total: ${totalPrice}
                </div>
              </div>

              <div className="amenities-flex">
                {amenitiesList.map((dataAmenidades, index) => (
                  <div className="MDdata-amenitiesspace" key={index}>
                    <div>
                      {dataAmenidades[1]}
                      <p className='MDAP'>
                        <img className="MDPI" src={dataAmenidades[0]} alt={dataAmenidades[1]} />
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {(
            <Calendar className="modification-calendar"
              value={selectedDateRange}
              onChange={(newDatesRange, event) => handleCalendarChange(newDatesRange, event)}
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
          )}
          {/* Confirm button */}
          <center>
            <button className={`${(!activeButton) ? 'modal-disabled-button' : 'modal-calendar-button'}`} onClick={handleModifyConfirm} disabled={(!activeButton)}>
              <center>Confirm</center>
            </button>
          </center>
          <div className="overlay"></div>
        </div>
      </div>
    </div>
    // Show error to user, that hasnt logged in
    : <div>{showErrorDialog("Error: ", "Login to access", true, navigate)}</div>)
  )
}

export default ReservationsList;