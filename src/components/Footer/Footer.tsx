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
          <a href='https://github.com/tesseract-ocr/tesseract' target="_blank" rel="noreferrer"><p>Google's Terrasact</p></a>
          <a href='https://ai.facebook.com/blog/wav2vec-20-learning-the-structure-of-speech-from-raw-audio/' target="_blank" rel="noreferrer"><p>Wave2Vec</p></a>
        </div>
      </div>
    </div>
  )
}

export default Footer