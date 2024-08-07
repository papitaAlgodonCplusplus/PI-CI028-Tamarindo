/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import { AuthContext } from '../AuthContext.js';
import { DateObject } from "react-multi-date-picker"
import { emptyContainer, showErrorDialog, updateContainer } from '../Misc';
import React, { useEffect, useRef, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from "react-multi-date-picker"
import '../styles/billing.scss';

const Billing = () => {
  // Bool that checks if user has logged in with valid user (client-worker-administrator)
  const { isLoggedIn } = useContext(AuthContext);
  const { userId } = useContext(AuthContext);
  const navigate = useNavigate()

  // Function to add a new bill to the UI
  const addBill = (room_title, img, datetime, method, amount) => {
    const newAmenityHTML = `
    <div className="billing-container">
    <div style="
      height: 60px;
      margin-top: 2%;
      width: 65.5%;
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
        width: 10vw;
        left: 2.4vw;">${room_title}</div>
      <div style="
        font-size: 16px;
        color: #333;
        position: relative;
        width: 10vw;
        left: 5.5vw;">${datetime}</div>
      <div style="
        font-size: 16px;
        color: #333;
        position: relative;
        width: 10vw;
        left: 9.5vw;">${method}</div>
      <div style="
        font-size: 16px;
        color: #333;
        position: relative;
        width: 10vw;
        left: 10vw;">$${amount}</div>
  </div>
  <div style="padding-bottom: 20px;"></div>
`;

    const billing_table = document.querySelector('.billing-container');
    billing_table.insertAdjacentHTML('beforeend', newAmenityHTML);
  }

  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1 });
  let logs = 3;
  const handleLoggingChange = e => {
    const newLimit = parseInt(e.target.value);
    fetchData(1, newLimit);
    console.log(newLimit)
  }

  const [modalVisible, setModalVisible] = useState(false);
  const toggleModal = (e) => {
    if (isLoggedIn) {
      e.preventDefault();
      setModalVisible(!modalVisible);
    } else {
      return;
    }
  };


  function ASCIIChain(input) {
    let asciiChain = '';
    for (let i = 0; i < input.length; i++) {
      asciiChain += input.charCodeAt(i);
    }
    return asciiChain;
  }

  // Function to fetch bills data from server
  const fetchData = async (page = 1, limit = 10) => {
    const billing_table = document.querySelector('.billing-container');
    try {
      const res = await axios.get(`/payments/paymentsByUserId${userId}`);
      emptyContainer(billing_table);
      // Add each bill to the UI
      let logged = 0; let result = false;
      let start = ((page - 1) * limit) + 1;
      for (const bill of res.data) {
        if (logged >= limit * page) {
          updateContainer(billing_table);
          break;
        }
        logged++;
        if (logged < start) {
          continue;
        }
        result = true;
        axios.get(`rooms/by_roomID${bill.room_id}`)
          .then(res2 => {
            axios.get(`files/get_image_by_roomid${bill.room_id}`)
              .then(res3 => {
                let method = ''
                switch (bill.id_method) {
                  case 1:
                    method = "Card"
                    break
                  case 2:
                    method = "Transfer"
                    break
                  case 3:
                    method = "Cash"
                    break
                  default:
                    break
                }
                addBill(bill.paymentid + ASCIIChain(res2.data[0].title).slice(1, 10), "upload/" + res3.data[0].filename, bill.timestamp_column.slice(0, 19).replace('T', ' '), method, bill.price);
              });
          });
      };
      updateContainer(billing_table);
      setPagination({
        page: page,
        limit: limit,
        totalPages: Math.ceil(res.data.length / limit),
      });

      if (!result) {
        // No rooms to show
        document.getElementById("no-result").style.display = "flex";
      } else {
        document.getElementById("no-result").style.display = "none";
      }
      return;
    } catch (error) {
      showErrorDialog("Error", error);
    }
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
        <button
          className="pagination-button previous"
          disabled={page === 1}
          onClick={() => handlePageChange(page - 1)}
        >
          &laquo; Prev
        </button>
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
        <button
          className="pagination-button next"
          disabled={page === totalPages}
          onClick={() => handlePageChange(page + 1)}
        >
          Next &raquo;
        </button>
      </div>
    );
  };
  
  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  var inDate = useRef('--/--/----');
  var outDate = useRef('--/--/----');

  const [values, setValues] = useState([
    new DateObject(),
    new DateObject()
  ])

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
      const billing_table = document.querySelector('.billing-container');
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
          emptyContainer(billing_table);

          // Fetching bills data for the current user
          const res = await axios.get(`/payments/paymentsByUserId${userId}`);

          let logged = 0;
          // Iterating through each bill
          for (const bill of res.data) {
            if (logged >= logs) {
              break;
            }
            // Formatting check-in and check-out dates
            const date = new Date(bill.timestamp_column).toISOString().slice(0, 19).replace('T', ' ');
            console.log(requestParams.check_in_date.slice(0, 10), requestParams.check_out_date.slice(0, 10), date.slice(0, 10))
            if (!(isDateBetween(date, requestParams.check_in_date, requestParams.check_out_date))
              & !(date.slice(0, 10) === requestParams.check_in_date.slice(0, 10))
              & !(date.slice(0, 10) === requestParams.check_out_date.slice(0, 10))) {
              continue;
            }

            // Add each bill to the UI
            axios.get(`rooms/by_roomID${bill.room_id}`)
              .then(res2 => {
                axios.get(`files/get_image_by_roomid${bill.room_id}`)
                  .then(res3 => {
                    let method = ''
                    switch (bill.id_method) {
                      case 1:
                        method = "Card"
                        break
                      case 2:
                        method = "Transfer"
                        break
                      case 3:
                        method = "Cash"
                        break
                      default:
                        break
                    }
                    addBill(bill.paymentid + ASCIIChain(res2.data[0].title).slice(1, 10), "upload/" + res3.data[0].filename, bill.timestamp_column.slice(0, 19).replace('T', ' '), method, bill.price);
                  });
              });
            updateContainer(billing_table);
            logged++;
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

  const handleGoBack = async e => {
    if (isLoggedIn) {
      e.preventDefault()
      navigate("/home")
    } else {
      return;
    }
  }

  return ((isLoggedIn ?  // Show page (html) if user is logged in as an user with permissions
    <div className='billing_page'>
      <meta name="viewport" content="intial-scale=1"></meta>
      <img alt="back" onClick={handleGoBack} src={require("../assets/Image12.png")} className='image-12' />
      <div className="billing">
        Billing History
      </div>
      <hr className="solid"></hr>

      <label className='custom-filter'>Filter By: </label>
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

      <div className="billing-bar">
        <div className="billing-info-bar">
          <span className="bill">
            #Invoice
          </span>
          <span className="price">
            DateTime
          </span>
          <span className="bill-actions">
            Method
          </span>
          <span className="bill-room">
            Amount
          </span>
        </div>
      </div>

      <div>
        <div className="billing-container">
        </div>
        <label id="no-result" className='noResult'>Couldn't find a billing history</label>

      {renderPagination()} 

      </div>
      <label className='custom-show'>Show: </label>
      <select name="lazy-logger" className="custom-select" id="lazy-logger"
        onChange={handleLoggingChange}>
        <option key={5} value={5}>5</option>
        <option selected key={10} value={10}>10</option>
        <option key={15} value={15}>15</option>
        <option key={25} value={25}>25</option>
      </select>
    </div >
    // Show error to user, that hasnt logged in
    : <div></div>)
  )
}
export default Billing;
