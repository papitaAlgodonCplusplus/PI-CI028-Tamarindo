import React, { useState, useContext, useEffect } from 'react'
import axios from "axios"
import { AuthContext } from '../AuthContext.js';
import "../styles/my_account.scss"

const MyAccount = () => {
  const [data_user, setData] = useState({});
  const { userId } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/auth/getUserbyID${userId}`);
        setData(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [userId]);

  return (
    <div>
      <div className="my-reservations">
        <div className="my-reservations-1">
          <div className="my-reservations">
            My Account 
          </div>
          <div className="line-2">
          </div>
        </div>
      </div>
    
      <div class="cuadrado">
        <div class="imagen"> Aqui va la imagen </div>

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

        <div class="db-phone"> Phone Number </div>
        <div class="datos-phone">
          {data_user.phone}
        </div>
      </div>
      
      <div class="change">
        <a href="/reservations_list" className='change_pass'>Change password</a>
      </div>
      
    </div>
    
    
    
  )
}

export default MyAccount;


