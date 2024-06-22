import React, { useState, useContext, useEffect } from 'react'
import axios from "axios"
import { AuthContext } from '../AuthContext.js';
import "../styles/about_us.scss"
import hotelCEO from '../img/ceo_hotel.png'

const AboutUs = () => {

  return (
    
    <div className="about-us">
      <div className="my-reservations">
        <div className="my-reservations-1">
          <div className="my-reservations">
            About us
          </div>
          <div className="line-2">
          </div>
        </div>
      </div>

      <div className='texto'>
        <p>
            Welcome to Hotel Tamarindo, where hospitality meets excellence. Established in 1990, we have been a leader in the hospitality industry, 
            setting the standard for unparalleled service and unforgettable experiences.
        </p>

        <p>
            At Hotel Tamarindo, we pride ourselves on offering a wide range of amenities to cater to every guest's needs and preferences. 
            From luxurious accommodations to world-class dining options, we strive to exceed your expectations at every turn.
        </p>

        <p>
            Nestled in the heart of Tamarindo, our hotel provides the perfect blend of comfort and convenience. Whether you're here for business 
            or pleasure, our dedicated team is committed to ensuring your stay is nothing short of extraordinary. Indulge in our state-of-the-art 
            facilities, with a variety of leisure activities and attractions nearby, there's never a dull moment at Hotel Tamarindo.
        </p>

        <p>
            Experience the warmth of our hospitality and the sophistication of our services. From the moment you arrive, you'll be greeted with 
            genuine smiles and personalized attention, making you feel right at home. Join us at Hotel Tamarindo and discover why we are the 
            preferred choice for discerning travelers. 
        </p>

        <p>
            Your journey begins here.
        </p>

        <div className='ceo'>
            <div className='imagen'>
                <img src={hotelCEO} alt="Foto perfil CEO Hotel Tamrindo" class='imagen-1'/>
            </div>

            <div className='ceo-text'>
                <p>
                “Even the longest journeys are worth it when they bring people together. From traveling to see family or friends 
                to catching up with work colleagues in person, share the moments that are most important to you”
                </p>

                <p className='firma'>
                    Carlos Fernández
                    
                </p>
                <p className='ceo-hotel'>
                    CEO Hotel Tamarindo
                </p>
            </div>
        </div>
      </div>
    
      
    </div>
  )
}

export default AboutUs;