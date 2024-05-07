import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import "../styles/navbar.scss"
import { AuthContext } from "../AuthContext.js"
import axios from 'axios';

const Navbar = () => {
  const { userId } = useContext(AuthContext)
  const [img_source, setImg] = useState('');

  const fetchData = async e => {
    if (isLoggedIn) {
      const image = await axios.get(`/files/get_image_by_userID${userId}`);
      setImg("/upload/" + image.data[0].filename)
    }
  }

  useEffect(() => {
    fetchData()
  });

  const { isLoggedIn } = useContext(AuthContext)
  const navigate = useNavigate()
  const handleReturn = () => {
    navigate("/reservations_list")
  }
  return (isLoggedIn ?
    <div className="navbar">
      <h1 onClick={handleReturn}>Hotel</h1>
      <img className="logo" alt="undefined graphic" onClick={handleReturn} src={require("../assets/Logo.PNG")}></img>
      <ul>
        <li><a href="/services">Services</a></li>
        <li><a href="/reviews">Reviews</a></li>
        <li><a href="/about_us">About Us</a></li>
      </ul>
      <img src={img_source} className='pfp' alt="pfp"></img>
    </div>
    :
    <div className="navbar">
      <h1 onClick={handleReturn}>Hotel</h1>
      <img className="logo" alt="undefined graphic" onClick={handleReturn} src={require("../assets/Logo.PNG")}></img>
      <ul>
        <li><a href="/services">Services</a></li>
        <li><a href="/reviews">Reviews</a></li>
        <li><a href="/about_us">About Us</a></li>
      </ul>
    </div>
  )
}

export default Navbar;