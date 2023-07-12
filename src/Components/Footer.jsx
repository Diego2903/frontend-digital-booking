import './Styles/Footer.css'
import iconFacebook from '../assets/iconFacebook.svg'
import iconTwitter from '../assets/iconTwitter.svg'
import iconInstagram from '../assets/iconInstagram.svg'
import iconLinkedin from '../assets/iconLinkedin.svg'


const Footer = () => {

  return (
    <footer>
      <div className='copyright'>©2023 Digital Booking
      </div>
      <div className = "social-media">
            {/* <img className="logos" src="./images/Facebook.png" alt='facebook' />
            <img className="logos" src="./images/Linkedin.png" alt='linkedin' />
            <img className="logos" src="./images/Twitter.png" alt='twitter' />
            <img className="logos" src="./images/Instagram.png" alt='instagram' /> */}
              <img className="logos" src={iconFacebook} alt='facebook' />
            <img className="logos" src={iconLinkedin} alt='linkedin' />
            <img className="logos" src={iconTwitter} alt='twitter' />
            <img className="logos" src={iconInstagram} alt='instagram' />
      </div>
    </footer>
  )
}

export default Footer