/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef, useContext } from 'react'
import { Context } from '../Context.js';
import { AuthContext } from '../AuthContext.js';
import '../styles/payment_page.scss';
import axios from 'axios'
import { calculateNumberOfDays, showErrorDialog, showSuccessDialog } from '../Misc.js'
import { useNavigate } from 'react-router-dom';
import MastercardImage from "../assets/Mastercard.jpg";
import VisaImage from "../assets/Visa.png";
import AmericanExpressImage from "../assets/AX.png";

const Payment = () => {
  const [selectedCurrency, setServiceCurrency] = useState('');
  const [selectedService, setServiceOption] = useState('');
  const [cards, setCards] = useState([]);
  const [selectedOption, setSelectedOption] = useState('credit-card');
  const [services, setServices] = useState([]);
  const [servicesList, setServicesList] = useState([]);
  const [totalAmenitiesPrice, setTotalAmenitiesPrice] = useState(0);
  const [originalPrice, setOriginalPrice] = useState(0);
  const [currentCurrency, setCurrentCurrency] = useState('Dollars');
  const { lastRoomClickedID, bookingDates } = useContext(Context);
  const number_of_days = calculateNumberOfDays(bookingDates[0].toString(), bookingDates[1].toString()) + 1
  const { userId } = useContext(AuthContext)
  let cardType = "";

  const currencySymbols = {
    'Colones': '₡',
    'Dollars': '$',
    'Yens': '¥',
    'Euros': '€'
  };

  const navigate = useNavigate();
  const handleServiceChange = (e) => {
    setServiceOption(e.target.value);
  };

  // Define an asynchronous function to fetch data
  const fetchAndSetData = async () => {
    try {
      const cards = await axios.get(`payments/creditCards${userId}`)
      setCards(cards.data.data)
      // Fetch services data
      axios.get('/amenities').then(response => {
        // Set the services state with the fetched data
        setServices(response.data);
        // Set the default service option if any
        if (response.data[0]) {
          setServiceOption(response.data[0].service_name);
        }
      });

      // Fetch room details by room ID
      const roomResponse = await axios.get(`/rooms/by_roomID${lastRoomClickedID}`);
      // Fetch room type details by room type ID
      const roomTypeResponse = await axios.get(`/categories/room_type_ByID${roomResponse.data[0].type_of_room}`);
      setOriginalPrice(roomTypeResponse.data[0].price)
    } catch (error) {
      showErrorDialog("An error occurred:", error, false, navigate);
    }
  };


  const { isLoggedIn } = useContext(AuthContext)
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/")
    }
    fetchAndSetData();
  }, []);

  const renderForm = () => {
    switch (selectedOption) {
      case 'credit-card':
        return <CreditCardForm />;
      case 'bank-transaction':
        return <BankTransactionForm />;
      case 'cash':
        return <CashForm />;
      default:
        return null;
    }
  };

  const handleCardNumber = (e) => {
    let numericValue = e.target.value
    if (/\D/.test(e.target.value)) {
      numericValue = e.target.value.replace(/\D/g, '');
      e.target.value = numericValue;
    }

    let newCardType = '';
    if (/^4/.test(numericValue)) {
      newCardType = 'Visa';
    } else if (/^5[1-5]/.test(numericValue)) {
      newCardType = 'Mastercard';
    } else if (/^3[47]/.test(numericValue)) {
      newCardType = 'American Express';
    } else {
      newCardType = 'Mastercard';
    }

    cardType = newCardType;
    document.querySelector('.visa-card-logo-1').style.display = cardType === 'Visa' ? 'block' : 'none';
    document.querySelector('.ax-card-logo-1').style.display = cardType === 'American Express' ? 'block' : 'none';
    document.querySelector('.master-card-logo-1').style.display = cardType === 'Mastercard' ? 'block' : 'none';
  }

  const bankNameRef = useRef(null);
  const cashNameRef = useRef(null);

  const handleCurrency = async e => {
    setServiceCurrency(e.target.value)
    setTotalAmenitiesPrice(convertCurrency(totalAmenitiesPrice, currentCurrency, e.target.value))
    setCurrentCurrency(e.target.value)
  }

  function convertCurrency(amount, fromCurrency, toCurrency) {
    if (fromCurrency === toCurrency) {
      return amount;
    }

    const conversionRates = {
      "Colones": {
        "Dollars": 0.0019706715,
        "Euros": 0.001845197,
        "Yens": 0.31064384
      },
      "Dollars": {
        "Colones": 507.18053,
        "Euros": 0.93619645,
        "Yens": 157.55251
      },
      "Euros": {
        "Colones": 542.11965,
        "Dollars": 1.0684254,
        "Yens": 168.28051,
      },
      "Yens": {
        "Colones": 3.2195641,
        "Dollars": 0.0063495264,
        "Euros": 0.0059424588
      }
    };

    return amount * conversionRates[fromCurrency][toCurrency];
  }

  const handlePay = async e => {
    e.preventDefault();

    const checkbox = document.getElementById('terms');
    const isChecked = checkbox.checked;

    if (!isChecked) {
      showErrorDialog("Error", "Please accept the Terms and Conditions")
      return;
    }

    let paymentId = 0;
    let paymentEndpoint = '';
    let paymentData = {};

    // Set default time for check-in and check-out dates
    const checkInDateTime = bookingDates[0].set({
      hour: 7,
      minute: 0,
      second: 0,
    }).format('YYYY-MM-DD HH:mm:ss');

    const checkOutDateTime = bookingDates[1].set({
      hour: 18,
      minute: 0,
      second: 0,
    }).format('YYYY-MM-DD HH:mm:ss');

    const totalPrice = (originalPrice * number_of_days) + convertCurrency(totalAmenitiesPrice, currentCurrency, "Dollars")
    switch (selectedOption) {
      case 'credit-card':
        // For credit card payment
        var card_name = document.getElementById("card_name");
        var cvv = document.getElementById("cvv");
        var cardnumber = document.getElementById("cardnumber");
        var expiration = document.getElementById("expiration");
        if (card_name.value.trim() === "") {
          showErrorDialog("Error", "Please provide a Card Name")
          return;
        }
        if (cvv.value.trim() === "") {
          showErrorDialog("Error", "Please provide the CVV of the Card")
          return;
        }
        if (expiration.value.trim() === "") {
          showErrorDialog("Error", "Please provide the Expiration Date of the Card")
          return;
        }
        if (cardnumber.value.trim() === "") {
          showErrorDialog("Error", "Please provide the Card Number")
          return;
        }
        paymentEndpoint = '/payments/add_card_payment'; // Set endpoint for adding card payment
        paymentData = { roomID: lastRoomClickedID, userID: userId, price: totalPrice, paymentMethodId: 1, cardType: cardType, number: cardnumber.value, month: expiration.value.slice(0, 2), year: expiration.value.slice(3, 5) }; // Set payment data for credit card
        break;
      case 'bank-transaction':
        var account_number = document.getElementById("account_number");
        var bank_name = document.getElementById("bank_name");
        if (account_number.value.trim() === "") {
          showErrorDialog("Error", "Please provide an Account Number")
          return;
        }
        if (bank_name.value.trim() === "") {
          showErrorDialog("Error", "Please provide the Name of the Bank")
          return;
        }
        // For bank transaction payment
        paymentEndpoint = '/payments/add_bank_payment'; // Set endpoint for adding bank payment
        paymentData = { roomID: lastRoomClickedID, userID: userId, price: totalPrice, paymentMethodId: 2, bankName: bankNameRef.current.value }; // Set payment data for bank transaction
        break;
      case 'cash':
        // For cash payment
        paymentEndpoint = '/payments/add_cash_payment'; // Set endpoint for adding cash payment
        if (selectedCurrency === '') {
          showErrorDialog("Error", "Please select a currency")
          return;
        }

        if (cashNameRef.current.value > 10000000.00) {
          showErrorDialog("Error", "Max cash amount permitted is 10,000,000.00, please refer to support for more info.");
          return;
        }

        if (cashNameRef.current.value < convertCurrency(totalPrice, "Dollars", currentCurrency)) {
          showErrorDialog("Error", "Cash amount must be at least " + convertCurrency(totalPrice, "Dollars", currentCurrency).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " " + selectedCurrency);
          return;
        }

        const change = convertCurrency(cashNameRef.current.value, currentCurrency, "Dollars") - totalPrice; // Calculate change
        paymentData = { roomID: lastRoomClickedID, userID: userId, price: totalPrice, paymentMethodId: 3, change }; // Set payment data for cash
        break;
      default:
        break;
    }

    // If payment endpoint is determined
    if (paymentEndpoint !== '') {
      // Make a POST request to add payment with payment data
      const paymentRes = await axios.post('/payments/add_payment', paymentData);
      // Make a POST request to the determined payment endpoint with payment data
      const paymentCardRes = await axios.post(paymentEndpoint, paymentData);
      // Update payment ID with the received payment ID
      paymentId = paymentRes.data.payment_id;
      console.log(paymentCardRes)
    }

    const reservationRequestData = {
      check_in_date: checkInDateTime,           // Date of check-in
      check_out_date: checkOutDateTime,         // Date of check-out
      room_id: lastRoomClickedID,           // ID of the room selected
      payment_id: paymentId,                 // ID of the payment method
      user_id: userId                       // ID of the user making the reservation
    };

    // Making a POST request to add reservation
    const reservationResponse = await axios.post("/reservations/add_reservation", reservationRequestData);

    try {
      let counter = 0;  // Counter to keep track of the number of services processed
      // Iterating through each service asynchronously
      servicesList.map(async (service) => {
        // Fetching service details
        const serviceResponse = await axios.get(`/amenities/get_service${service}`);
        const serviceId = serviceResponse.data[0].serviceid; // Extracting service ID from the response
        // Making a POST request to add service to service log
        await axios.post(`/amenities/add_to_service_log`, { service_id: serviceId, reservation_id: reservationResponse.data.insertId });
        counter++;
        // Checking if all services have been processed
        if (counter === servicesList.length) {
          return Promise.resolve(); // Resolving the promise once all services are processed
        }
      });
    } catch (error) {
      showErrorDialog("Error occurred:", error, false, navigate);
    }
    showSuccessDialog("Payment Approved", "You'll receive an email with your reservation details.", navigate);
  };


  const handleExpirationChange = async event => {
    // Extract the input value (card expiration month / year)
    let inputValue = event.target.value;

    // Ensure input is at least 3 characters long
    if (inputValue.length <= 3) {
      return;
    }

    // Remove non-digit characters from the input
    inputValue = inputValue.replace(/\D/g, '');

    // Validate and format the input
    if (inputValue.length > 0) {
      // Extract month and year from the input
      let [month, year] = inputValue.match(/(\d{1,2})(\d{0,2})/).slice(1, 3);

      // Convert month and year to integers
      month = parseInt(month, 10);
      year = parseInt(year, 10);

      // Validate month and year
      if (month > 12 || month < 1 || year < new Date().getFullYear() - 2000) {
        showErrorDialog('Invalid expiration date', "Make sure the month and the date are correct.", false, navigate);
        // Clear input field
        event.target.value = ``;
        return;
      }

      // Update input field with formatted month/year
      event.target.value = `${month}/${year}`;
    }
  };

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
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
          // Extract the service price from the response data
          let servicePrice;
          if (selectedCurrency === "") {
            servicePrice = response.data[0].service_price;
          } else {
            servicePrice = convertCurrency(response.data[0].service_price, "Dollars", selectedCurrency);
          }

          // Update the total price by adding the service price
          setTotalAmenitiesPrice(previousTotalPrice => previousTotalPrice + servicePrice);

          // Add the selected service as a new label to the amenities list
          const amenitiesList = document.querySelector('.amenities-list');
          const newLabel = document.createElement('label');
          newLabel.textContent = selectedService;
          newLabel.classList.add('amenity');
          amenitiesList.appendChild(newLabel);
        })
        .catch(error => {
          // If there's an error fetching the service price, show an error dialog
          showErrorDialog('Error fetching service price:', error, false, navigate);
        });
    }
  }

  return (
    <div className='pay_page'>
      <meta name="viewport" content="intial-scale=1"></meta>
      <div className="payments-options">
        Select Payment Method
      </div>

      <div className="frame-4">
        <div className={`card-option ${selectedOption === 'credit-card' ? 'selected' : 'card-option'}`}>
          <input
            value="credit-card"
            onChange={handleOptionChange}
            type="radio"
            name="paymentMethod"
            id="card-option"
          />
          <label htmlFor="card-option">
            <img alt="undefined graphic" src={require("../assets/Card.PNG")} className="image-142" />
          </label>
        </div>
        <div className={`bank-option ${selectedOption === 'bank-transaction' ? 'selected' : 'bank-option'}`}>
          <input
            value="bank-transaction"
            onChange={handleOptionChange}
            type="radio"
            name="paymentMethod"
            id="bank-option"
          />
          <label htmlFor="bank-option">
            <img alt="undefined graphic" src={require("../assets/Image14.png")} className="image-141" />
          </label>
        </div>
        <div className={`cash-option ${selectedOption === 'cash' ? 'selected' : 'cash-option'}`}>
          <input
            value="cash"
            onChange={handleOptionChange}
            type="radio"
            name="paymentMethod"
            id="cash-option"
          />
          <label htmlFor="cash-option">
            <img alt="undefined graphic" src={require("../assets/Cash.jpg")} className="image-143" />
          </label>
        </div>
      </div>
      <div className="card">
        <div className="container">
          {bookingDates[0].toString()[0]}
          {bookingDates[0].toString()[1]}
          {bookingDates[0].toString()[2]}
          {bookingDates[0].toString()[3]}
          {' '}
          {bookingDates[0].toString()[4]}
          {' '}
          {bookingDates[0].toString()[5]}
          {bookingDates[0].toString()[6]}
          {' '}
          {bookingDates[0].toString()[7]}
          {' '}
          {bookingDates[0].toString()[8]}
          {bookingDates[0].toString()[9]}
        </div>
        <div className="container2">
          -
        </div>
        <div className="container3">
          {bookingDates[1].toString()[0]}
          {bookingDates[1].toString()[1]}
          {bookingDates[1].toString()[2]}
          {bookingDates[1].toString()[3]}
          {' '}
          {bookingDates[1].toString()[4]}
          {' '}
          {bookingDates[1].toString()[5]}
          {bookingDates[1].toString()[6]}
          {' '}
          {bookingDates[1].toString()[7]}
          {' '}
          {bookingDates[1].toString()[8]}
          {bookingDates[1].toString()[9]}
        </div>
        <div className="master-suite-tropicana">
          Master Suite Tropicana
        </div>
        <img alt="undefined graphic" src={require("../assets/Image13.png")} className="image-13" />
        <div className="amenities">
          {currencySymbols[currentCurrency]}{' '}
          {convertCurrency(originalPrice, "Dollars", currentCurrency).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
          × {number_of_days} {number_of_days === 1 ? 'day' : 'days'} {' '}
          + <br />{' '}
          {currencySymbols[currentCurrency]}{' '}
          {totalAmenitiesPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}  (AMENITIES)
        </div>
        <span className="total-80000000">
          total {currencySymbols[currentCurrency]}
          {(convertCurrency(originalPrice * number_of_days, "Dollars", currentCurrency) + totalAmenitiesPrice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>
      {/* Render payment form based on selected option */}
      {renderForm()}
    </div>
  );

  // Component for Credit Card payment form
  function CreditCardForm() {
    const [showForm, setShowForm] = useState(false);

    const handleExistingCardSelection = async (card) => {
      const totalPrice = (originalPrice * number_of_days) + convertCurrency(totalAmenitiesPrice, currentCurrency, "Dollars")
      console.log(`Selected card ID: ${card.paymentId}`);
      const paymentEndpoint = '/payments/add_card_payment'; // Set endpoint for adding card payment
      const paymentData = { roomID: lastRoomClickedID, userID: userId, price: totalPrice, paymentMethodId: 1, cardType: cardType, number: card.card_nunmber, month: card.month, year: card.year }; // Set payment data for credit card
      // If payment endpoint is determined
      let paymentId;
      if (paymentEndpoint !== '') {
        // Make a POST request to add payment with payment data
        const paymentRes = await axios.post('/payments/add_payment', paymentData);
        // Make a POST request to the determined payment endpoint with payment data
        const paymentCardRes = await axios.post(paymentEndpoint, paymentData);
        // Update payment ID with the received payment ID
        paymentId = paymentRes.data.payment_id;
        console.log(paymentCardRes)
      }

      const checkInDateTime = bookingDates[0].set({
        hour: 7,
        minute: 0,
        second: 0,
      }).format('YYYY-MM-DD HH:mm:ss');

      const checkOutDateTime = bookingDates[1].set({
        hour: 18,
        minute: 0,
        second: 0,
      }).format('YYYY-MM-DD HH:mm:ss');

      const reservationRequestData = {
        check_in_date: checkInDateTime,           // Date of check-in
        check_out_date: checkOutDateTime,         // Date of check-out
        room_id: lastRoomClickedID,           // ID of the room selected
        payment_id: paymentId,                 // ID of the payment method
        user_id: userId                       // ID of the user making the reservation
      };

      // Making a POST request to add reservation
      const reservationResponse = await axios.post("/reservations/add_reservation", reservationRequestData);

      try {
        let counter = 0;  // Counter to keep track of the number of services processed
        // Iterating through each service asynchronously
        servicesList.map(async (service) => {
          // Fetching service details
          const serviceResponse = await axios.get(`/amenities/get_service${service}`);
          const serviceId = serviceResponse.data[0].serviceid; // Extracting service ID from the response
          // Making a POST request to add service to service log
          await axios.post(`/amenities/add_to_service_log`, { service_id: serviceId, reservation_id: reservationResponse.data.insertId });
          counter++;
          // Checking if all services have been processed
          if (counter === servicesList.length) {
            return Promise.resolve(); // Resolving the promise once all services are processed
          }
        });
      } catch (error) {
        showErrorDialog("Error occurred:", error, false, navigate);
      }
      showSuccessDialog("Payment Approved", "You'll receive an email with your reservation details.", navigate);
    };

    const formatCardNumber = (number) => {
      return `**** **** **** ${number.slice(-4)}`;
    };

    const formatExpirationDate = (month, year) => {
      // Format expiration date as MM/YY
      return `${String(month).padStart(2, '0')}/${String(year).slice(-2)}`;
    };

    return (
      <div className="credit-card-section">
        {!showForm ? (
          <div className="select-card-option">
            <div className="existing-cards">
              <h2 className='or-separator-2'>Your saved cards</h2>
              <ul>
                {cards.map(card => (
                  <li key={card.paymentid}>
                    <button className="card-option-button-2" onClick={() => handleExistingCardSelection(card)}>
                      <div className="card-template">
                        <div className="card-chip"></div>
                        <div className="card-number">{formatCardNumber(card.card_number)}</div>
                        <div className="card-holder">{card.card_type}</div>
                        <div className="expiration-date">{formatExpirationDate(card.month, card.year)}</div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="or-separator">
              <span>or</span>
            </div>
            <button className="card-option-button" onClick={() => setShowForm(true)}>Pay with another card</button>
          </div>
        ) : (
          <div className="group-21">
            <div className="enter-card-details">
              Enter card details
            </div>
            <div className="container">
              <input id="card_name" name="card_name" maxLength={40} placeholder='Card name' className="card-name" required />
            </div>
            <div className="line-3"></div>
            <div className="container-4">
              <input type="text" onInput={handleCardNumber} maxLength="19" id="cardnumber" className="card-number" placeholder='Card number' required />
              <img className="master-card-logo-1" src={MastercardImage} alt="Card Logo" />
              <img className="visa-card-logo-1" src={VisaImage} alt="Card Logo" />
              <img className="ax-card-logo-1" src={AmericanExpressImage} alt="Card Logo" />
            </div>
            <div className="line-22"></div>
            <div className="container-3">
              <div className="group-18">
                <div className="container-1">
                  <div className="line-21"></div>
                </div>
                <input autoComplete="new-password" type="text" id="expiration" onChange={handleExpirationChange} className="expiry-date" placeholder="MM/YY" required />
              </div>
              <div className="group-14">
                <div className="container-5">
                  <div className="line-2"></div>
                </div>
                <input type="password" autoComplete="new-password" name="cvv" placeholder='CVV' id="cvv" className="cvv" maxLength="4" required />
              </div>
            </div>
            <div className="terms-checkbox">
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms">I agree to the</label>
              <a className="terms-conds" href="/terms-and-conditions">Terms and Conditions</a>
            </div>
            <button onClick={handlePay} className="group-17"> PAY NOW </button>
          </div>
        )}
      </div>
    );
  }

  // Component for Bank Transaction payment form
  function BankTransactionForm() {
    setServiceCurrency("Dollars")
    setTotalAmenitiesPrice(convertCurrency(totalAmenitiesPrice, currentCurrency, "Dollars"))
    setCurrentCurrency("Dollars")
    return (
      <div className="group-22">
        <div className="enter-card-details">
          Enter bank details
        </div>
        <div className="container">
          <input type="text" id="account_number" maxLength={30} placeholder='Account Number' className="card-name-2" required />
        </div>
        <div className="line-3">
        </div>
        <div className="container-4">
          <input type="text" id="bank_name" maxLength={30} ref={bankNameRef} className="card-number" placeholder='Bank Name' required />
        </div>
        <div className="line-22">
        </div>
        <div className="terms-checkbox">
          <input type="checkbox" id="terms" required />
          <label htmlFor="terms">I agree to the</label>
          <a className="terms-conds" href="/terms-and-conditions">Terms and Conditions</a>
        </div>
        <button className="group-17" onClick={handlePay}> PAY NOW </button>
      </div>
    );
  }

  // Component for Cash payment form
  function CashForm() {
    return (
      <div className="group-23">
        <div className="enter-card-details">
          Enter cash details
        </div>
        <div className="custom-select">
          <select onChange={handleCurrency} value={selectedCurrency}>
            <option value="" disabled selected>Currency</option>
            <option value="Colones">₡ Colones</option>
            <option value="Dollars">$ Dollars</option>
            <option value="Euros">€ Euros</option>
            <option value="Yens">¥ Yens</option>
          </select>
        </div>
        <div className="container">
          <input type="number" ref={cashNameRef} step="0.01" min="0" max="99999999.99" id="cash_amount" placeholder='Cash Amount' className="card-name" required />
        </div>
        <div className="line-3">
        </div>
        <div className="terms-checkbox">
          <input type="checkbox" id="terms" required />
          <label htmlFor="terms">I agree to the</label>
          <a className="terms-conds" href="/terms-and-conditions">Terms and Conditions</a>
        </div>
        <button onClick={handlePay} className="group-17"> PAY NOW </button>
      </div>
    );
  }
};

export default Payment;