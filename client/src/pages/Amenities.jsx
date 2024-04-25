/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from 'react';
import '../amenities_page_styles.scss';
import axios from "axios";
import { AuthContext } from '../AuthContext.js';
import { useNavigate } from 'react-router-dom';
import { emptyContainer, updateContainer, showErrorDialog, postDataWithTimeout, deleteDataWithTimeout } from '../Misc';

// Function to add a new amenity to the UI
const addAmenity = (title, fee, id) => {
  const newAmenityHTML = `
  <div class="list-item">
  {/* Room Info */}
    <div style="  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
                  border-radius: 6px;
                  background: #FFFFFF;
                  position: absolute;
                  left: 50%;
                  bottom: 0px;
                  translate: -50% 0;
                  display: flex;
                  flex-direction: row;
                  justify-content: space-between;
                  padding: 10px 0 46px 28px;
                  width: 752px;
                  box-sizing: border-box;">
      <div style="  background: url('assets/images/Image.png') 50% / cover no-repeat;
                    position: absolute;
                    left: 57.9px;
                    top: 0px;
                    width: 46.3px;
                    height: 32.8px;">
    <div style="
    background: url('assets/images/Image16.png') 50% / cover no-repeat;
    margin-right: 45px;
    width: 128px;
    height: 87px;">
        </div>
        <div style="
    margin: 48.5px 0 11.5px 0;
    display: inline-block;
    overflow-wrap: break-word;
    font-family: 'Poppins';
    font-weight: 500;
    font-size: 18px;
    letter-spacing: 0.2px;
    color: #1A1A1A;">
          Birthday Cake<br />
  
        </div>
      </div>
      <div className="container-5">
        ₡8000.50
      </div>
    </div>
  
  {/* Delete Button */}
    <div style="
   border-radius: 6px;
   border: 1px solid #1E91B6;
   background: #FFFFFF;
   position: absolute;
   left: 50%;
   bottom: 0px;
   translate: -50% 0;
   display: flex;
   flex-direction: row;
   justify-content: center;
   padding: 8px 0.4px 8px 0;
   width: 169px;
   box-sizing: border-box;">
      <span style="
    overflow-wrap: break-word;
    font-family: 'Poppins';
    font-weight: 400;
    font-size: 15px;
    letter-spacing: 0.3px;
    line-height: 1.333;
    color: #1E91B6;">
        Delete Amenity
      </span>
    </div>
  </div>
`;
}

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


      <div>
        <div className="amenities-container">

          <div>
            <div className='room-info'>
              <div class="icon"></div>
              <div class="title">Product Title</div>
              <div class="amenity-price">$19.99</div>
            </div>

            <div className='amenities-button-container'>
              <div className='delete-button-container'>
                <span className='delete-button'>
                  Delete Amenity
                </span>
              </div>

              <div className="mod-amenity">
                <span className="modify-amenity">
                  Modify Amenity
                </span>
              </div>
            </div>
            
          </div>

        </div>
        <button className="add-amenity-button"><center>Add Amenity</center></button>
      </div>
    </div >
  )
}
export default Amenities;