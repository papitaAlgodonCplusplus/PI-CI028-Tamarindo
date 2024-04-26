/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { emptyContainer, showErrorDialog, updateContainer, deleteDataWithTimeout, showWarningDialog } from '../Misc';
import '../amenities_page_styles.scss';
import axios from 'axios';

// Function to add a new amenity to the UI
const addAmenity = (title, fee, id, img) => {
  const newAmenityHTML = `
  <div className="list-container">
  <div style="
    height: 100px;
    margin-top: 2%;
    width: 71%;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);
    padding: 20px;
    display: flex;
    align-items: center;
    position: relative; /* Add position: relative to the parent div */">
    <img style="
      margin-left: 15px;
      max-width: 90px;
      max-height: 90px;
      margin-right: 24px;
      margin-bottom: 10px;" src=${img} alt="${title}-icon"/>
    <div style="
      font-size: 18px;
      font-weight: bold;
      position: absolute; 
      left: 180px; /">${title}</div>
    <div style="
      font-size: 16px;
      color: #333;
      position: absolute;
      left: 540px;">₡${fee}</div>
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
    box-sizing: border-box;">
      <span style="
      overflow-wrap: break-word;
      font-family: 'Poppins';
      font-weight: 400;
      font-size: 15px;
      letter-spacing: 0.3px;
      line-height: 1.333;
      color: #1E91B6;" id="delete-button-${title}">
        Delete Amenity
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
    cursor: pointer;">
      <span style="
      overflow-wrap: break-word;
      font-family: 'Poppins';
      font-weight: 400;
      font-size: 15px;
      letter-spacing: 0.3px;
      line-height: 1.333;
      color: #FFFFFF;">
        Modify Amenity
      </span>
    </div>
  </div>
  
</div>
`;

  const amenities_table = document.querySelector('.amenities-container');
  amenities_table.insertAdjacentHTML('beforeend', newAmenityHTML);
  const deleteButton = document.getElementById("delete-button-" + title);
  deleteButton.addEventListener('click', (e) => handleDelete(e, id, title));
}

// Function to handle deletion of a service
const handleDelete = async (e, id, title) => {
  try {
    e.preventDefault();
    const warningResult = await showWarningDialog("Delete Confirmation", "Are you sure you would like to delete the amenity "+title+"?")
    if (!warningResult) return;
    await deleteDataWithTimeout(`/amenities/delete${id}`, 500);
    fetchData()
  } catch (error) {
    showErrorDialog("An error occurred:", error);
  }
}

// Function to fetch services data from server
const fetchData = async () => {
  // if (userRol !== "admin" && userRol !== "employee") {
  //   return;
  // }
  const amenities_table = document.querySelector('.amenities-container');
  try {
    const res = await axios.get("/amenities");
    emptyContainer(amenities_table);
    // Add each service to the UI
    res.data.forEach(service => {
      addAmenity(service.service_name, service.service_price, service.serviceid, service.image_path);
    });
    updateContainer(amenities_table);
    return;
  } catch (error) {
    showErrorDialog("An error occurred:", error);
  }
};

const Amenities = () => {
  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

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

        </div>
        <button className="add-amenity-button"><center>Add Amenity</center></button>
      </div>
    </div >
  )
}
export default Amenities;