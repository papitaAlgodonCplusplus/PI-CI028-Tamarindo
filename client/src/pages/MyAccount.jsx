import React, { useState, useContext, useEffect } from 'react'
import axios from "axios"
import { AuthContext } from '../AuthContext.js';
import "../styles/my_account.scss"

const MyAccount = () => {
  const [data_user, setData] = useState({});
  const { userId } = useContext(AuthContext);
  const { isLoggedIn } = useContext(AuthContext)
  const [img_source, setImg] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/auth/getUserbyID${userId}`);
        setData(res.data[0]);
        const image = await axios.get(`/files/get_image_by_userID${userId}`);
        setImg("/upload/" + image.data[0].filename)
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [userId]);

  return (
    isLoggedIn ?
    <div className="myAccount">
      <div className="my-reservations">
        <div className="my-reservations-1">
          <div className="my-reservations">
            My Account 
          </div>
          <div className="line-2">
          </div>
        </div>
      </div>
    
      <div class="square">
        <img src={img_source} className="image" alt="pfp"/>

        <div class="db-name"> Name </div>
        <div class="datos-name">
          {data_user.name}
        </div>

        <div class="db-last"> Last Name </div>
        <div class="datos-last">
          {data_user.last_name}
        </div>

        <div class="db-email"> Email Address </div>
        <div class="datos-email">
          {data_user.email}
        </div>

        <div class="db-phone"> Rol </div>
        <div class="datos-phone">
          {data_user.rol}
        </div>
      </div>
      
      <div class="change_botton">
        <a href="/pass_change" className='change_pass'>Change password</a>
      </div>
      
    </div>
      :
    <div></div>
  )
}

export default MyAccount;


