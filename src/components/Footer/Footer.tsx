import React from 'react';
import "./Footer.css";
import NaryLogo from "../../images/narynotes-logo.png";
import { Link, useNavigate } from 'react-router-dom';
const Footer = () => {
  
  const navigate = useNavigate();
  return (
    <div className='footer-container'>
      <div className='footer-inner-container'>
        <div className='footer-block block-1'>
          <img src={NaryLogo} className="footer-logo" onClick={()=>{
            navigate("/")
          }} alt="Footer Logo" />
        </div>
        <div className='footer-block block-2'>
          <h3>NaryNotes</h3>
          <Link style={{ textDecoration: 'none'}} to="note"><p>Create Note</p></Link>
          <Link style={{ textDecoration: 'none'}} to="profile"><p>Profile</p></Link>
        </div>
        <div className='footer-block block-3'>
          <h3>Model Resources</h3>
          <p>Google's Terrasact</p>
          <p>Wave2Vec</p>
        </div>
      </div>
    </div>
  )
}

export default Footer