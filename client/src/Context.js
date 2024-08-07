import React, { createContext, useState } from 'react';

export const Context = createContext();

export const Provider = ({ children }) => {
  const [lastRoomClickedID, setLastRoomClickedID] = useState(0);
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [homeSearch, setHomeSearch] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [homeDates, setHomeDates] = useState([]);
  const [bookingDates, setBookingDates] = useState([]);
  const [amenities, setAmenitiesList] = useState([]);

  const changeHomeDates = (newDates) => {
    setHomeDates(newDates)
  }

  const changeHomeSearch = (newSearch) => {
    setHomeSearch(newSearch)
  }

  const changeAmenitiesList = (amenities) => {
    setAmenitiesList(amenities)
  }

  const changeBookingDates = (newDates) => {
    setBookingDates(newDates)
  }

  const changeLastRoomClickedID = (newValue) => {
    setLastRoomClickedID(newValue);
  };

  const changeCheckInDate = (newDate) => {
    setCheckInDate(newDate);
  };

  const changeCheckOutDate = (newDate) => {
    setCheckOutDate(newDate);
  };

  const changePaymentMethod = (newPaymentMethod) => {
    setPaymentMethod(newPaymentMethod)
  }

  return (
    <Context.Provider value={{
      lastRoomClickedID,
      changeLastRoomClickedID,
      checkInDate,
      changeCheckInDate,
      checkOutDate,
      changeCheckOutDate,
      homeDates,
      changeHomeDates,
      homeSearch,
      changeHomeSearch,
      paymentMethod,
      changePaymentMethod,
      bookingDates,
      changeBookingDates,
      amenities,
      changeAmenitiesList
    }}>
      {children}
    </Context.Provider>
  );
};
