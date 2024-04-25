/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from 'react';
import '../amenities_page_styles.scss';
import axios from "axios";
import { AuthContext } from '../AuthContext.js';
import { useNavigate } from 'react-router-dom';
import { emptyContainer, updateContainer, showErrorDialog, postDataWithTimeout, deleteDataWithTimeout } from '../Misc';

const Amenities = () => {
  return (
    <div>
      <div className="amenities">
        Amenities
      </div>
      <hr className="solid"></hr>

      <div className="amenities-bar">
        <div className="amenities-info-bar">
          <span className="amenity">
            Amenity
          </span>
          <span className="price">
            Price
          </span>
        </div>
      </div>
    </div>
  )
}
export default Amenities;