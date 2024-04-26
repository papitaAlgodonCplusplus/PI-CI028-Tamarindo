/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { emptyContainer, showErrorDialog, updateContainer } from '../Misc';
import '../amenities_page_styles.scss';

// Function to add a new amenity to the UI
const addAmenity = (title, fee, id, icon_path) => {
  const newAmenityHTML = `
  <div className="list-container">
  <div className='room-info'>
    <div class="icon" src=${icon_path}></div>
    <div class="title">${title}</div>
    <div class="amenity-price">₡${fee}</div>
  </div>

  <div className='amenities-button-container'>
    <div className='delete-button-container'>
      <span className='delete-button' id="delete-button-${title}">
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
`;

  const services_table = document.querySelector('.list-container');
  services_table.insertAdjacentHTML('beforeend', newAmenityHTML);
  const deleteButton = document.getElementById("delete-button-" + title);
  deleteButton.addEventListener('click', (e) => handleDelete(e, id));
}

// Function to handle deletion of a service
const handleDelete = async (e, id) => {
  try {
    // e.preventDefault();
    // await deleteDataWithTimeout(`/services/delete/${id}`, 500);
    // fetchData()
  } catch (error) {
    showErrorDialog("An error occurred:", error);
  }
}
// Function to fetch services data from server
const fetchData = async () => {
  // if (userRol !== "admin" && userRol !== "employee") {
  //   return;
  // }
  const services_table = document.querySelector('.amenities-container');
  try {
    // const res = await axios.get("/services");
    emptyContainer(services_table);
    // Add each service to the UI
    res.data.forEach(service => {
      addAmenity(service.service_name, service.service_price, service.serviceid);
    });
    updateContainer(services_table);
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