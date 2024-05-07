import React, { useState, useContext, useEffect } from 'react'
import axios from "axios"
import { AuthContext } from '../AuthContext.js';
import { DateObject } from "react-multi-date-picker"
import { Calendar } from "react-multi-date-picker"
import { showErrorDialog, showWarningDialog, calculateNumberOfDays, emptyContainer, updateContainer, deleteDataWithTimeout, putDataWithTimeout } from '../Misc.js';
import "../styles/reservation_list.scss"
import { useNavigate } from 'react-router-dom';

const ReservationsList = () => {
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
      width: 1040px;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);
      padding: 20px;
      padding-bottom: 30px;
      display: flex;
      align-items: center;
      position: relative; /* Add position: relative to the parent div */">
      <img style="
        margin-left: 15px;
        max-width: 90px;
        max-height: 90px;
        margin-right: 24px;
        margin-bottom: 10px;" src=${filename} alt="${title}-icon"/>
      <div style="
        font-size: 18px;
        font-weight: bold;
        position: relative; 
        left: 10px;
        margin-top: -50px;">${title}</div>
      <div style="
        font-size: 16px;
        position: relative;
        margin-left: -44px;
        color: #545454;
        margin-top: 15px;">Guests: 3 (2 adults, 1 child)</div>
      <div style="
        font-size: 16px;
        position: relative;
        margin-left: -180px;
        color: #545454;
        margin-top: 100px;">• Extra Services</div>
      <div style="
        font-size: 16px;
        color: #333;
        position: relative;
        left: 200px;">${check_in.substring(0, 10)}</div>
      <div style="
      font-size: 16px;
      color: #333;
      position: relative;
      left: 320px;">${check_out.substring(0, 10)}</div>
      <div style="
      font-size: 16px;
      color: #333;
      position: relative;
      left: 446px;">Active</div>
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
      margin-left: 100px;
      box-sizing: border-box;" id="delete-button-${id}">
        <span style="
        overflow-wrap: break-word;
        font-family: 'Poppins';
        font-weight: 400;
        font-size: 15px;
        letter-spacing: 0.3px;
        line-height: 1.333;
        color: #1E91B6;">
          Delete Reservation
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
      cursor: pointer;" id="modify-button-${id}">
        <span style="
        overflow-wrap: break-word;
        font-family: 'Poppins';
        font-weight: 400;
        font-size: 15px;
        letter-spacing: 0.3px;
        line-height: 1.333;
        color: #FFFFFF;">
          Modify Reservation
        </span>
      </div>
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

      // Delete reservation data with timeout
      await deleteDataWithTimeout(`/reservations/delete${reservationId}`, 500);

      // Fetch updated data
      fetchData();

      return;
    } catch (error) {
      // Show error dialog if an error occurs
      showErrorDialog("An error occurred:", error);
    }
  }

  const [reservation, setReservation] = useState([]);
  const displayModal = async (id) => {
    const response = await axios.get(`/reservations/get_reservation_by_id${id}`);
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
  }

  function closeModal() {
    var modal = document.getElementById("calendar-modal-modify");
    modal.style.display = "none";
  }

  const [selectedRoomID, setSelectedRoomID] = useState(0);
  const { userId } = useContext(AuthContext);
  const [fetched, setFetched] = useState(false);
  let reservations = [];
  const fetchData = async () => {
    // Selecting the services container
    const servicesContainer = document.querySelector('.reservations-container');

    try {
      // Clearing the services container
      emptyContainer(servicesContainer);

      // Fetching reservations data for the current user
      const res = await axios.get(`/reservations/by_userID${userId}`);

      // Iterating through each reservation
      for (const reservation of res.data) {
        // Formatting check-in and check-out dates
        const checkIn = new Date(reservation.check_in).toISOString().slice(0, 19).replace('T', ' ');
        const checkOut = new Date(reservation.check_out).toISOString().slice(0, 19).replace('T', ' ');

        // Fetching room data for the reservation
        const res2 = await axios.get(`/rooms/by_roomID${reservation.id_room}`);

        // Fetching image data for the room
        const image = await axios.get(`/files/get_image_by_id${res2.data[0].image_id}`);
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
  };

  const navigate = useNavigate()
  const { isLoggedIn } = useContext(AuthContext)
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
  };

  // State variable for room ID
  const handleModifyConfirm = async (e) => {
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
        console.log(old_price, new_price)
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
  };

  const [reserved, setReserved] = useState([]);

  function isReserved(strDate) {
    return reserved.some(([start, end]) => strDate >= start && strDate <= end);
  }

  const [activeButton, setActiveButton] = useState(false)
  const handleCalendarChange = (newDatesRange, event) => {
    setSelectedDateRange(newDatesRange)
    if (newDatesRange.length > 1) {
      setActiveButton(true)
    } else {
      setActiveButton(false)
    }
  }

  return (
    <div>
      <div className="my-reservations">
        <div className="my-reservations-1">
          <div className="my-reservations">
            My Reservations
          </div>
          <div className="line-2">
          </div>
        </div>
      </div>

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
        </div>
      </div>

      <div>
        <div className="reservations-container">

        </div>
      </div>

      <div id="calendar-modal-modify" className="form-modal-2">
        <div className="form-modal-content-2">
        <span className="close-modal-x" onClick={closeModal}>&times;</span>
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
  )
}

export default ReservationsList;