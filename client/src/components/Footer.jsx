import React from 'react'
import "../styles/footer.scss"
const Footer = () => {
  return (
    <div className='footer-upper-container'>
      <meta name="viewport" content="width=device-width, intial-scale=1"></meta>
      <div className="footer-upper">
        <div className="subscription-and-special-promotion">
          Subscription and Special Promotion
        </div>
        <div className="container">
          <div className="email">
            <input type="text" placeholder="Enter email address here" className="subcription" maxLength={45} />
            <button className="subscribe-button">
              <span className="subscribe">
                Subscribe
              </span>
            </button>
          </div>
        </div>
        <div className="container-2">
          <h1>Hotel</h1>
          <img alt="undefined graphic" src={require("../assets/Logo.PNG")}></img>
          <span className="lorem-ipsum">
            At Hotel Tamarindo, we envision creating unforgettable experiences where every guest feels welcomed, valued, and inspired. With our commitment to excellence, we strive to be the premier destination where luxury, comfort, and sustainability converge, setting new standards in hospitality.
          </span>
        </div>
      </div>
      <div className="footer">
        <div className="copyright-hotel-tamarindo-2024-all-right-reserved">
          © Copyright Hotel Tamarindo 2024. All right reserved
        </div>
        <div className="social-media-stack">
          <div className="instagram">
            <img alt="undefined graphic" src={require("../assets/Insta.png")} />
          </div>
          <div className="twitter">
            <img alt="undefined graphic" src={require("../assets/Twitter.png")} />
          </div>
          <div className="facebook">
            <img alt="undefined graphic" src={require("../assets/Facebook.png")} />
          </div>
        </div>
        <div className="privacy-policy-term-condition-faq">
          <a href="/privacy" className="privacy-policy-link">Privacy Policy</a>
          <a href="/terms" className="terms-conditions-link">Terms & Conditions</a>
          <a href="/faq" className="faq-link">FAQ</a>
        </div>
      </div>
    </div>
  )
}

export default Footer;