import React from 'react';
import "./LandingPage.css";
import landingPageCoverPic from "../images/landing-page.jpg";

const LandingPage = () => {
  return (
    <div className='landing-page'>
      <div className='center-flex'>
        <div className='left-center-flex'>
          <h1 className='left-flex-title'>Create. Edit. Store. <br />Access. Smartly.</h1>
          <p className='left-flex-content'>NaryNotes is smart note keeping platform, through which you can create, store, edit the notes.
            You can also create your note content using the audio and photo which is processed by our high end Deep learning models.
          </p>
          <div className="left-flex-sign-up-button">
            <span className='left-flex-sign-up-button-bold'>Sign up </span>- It's Free
          </div>
          <div className="left-flex-login-in-button">
            <span className='left-flex-login-in-button-bold'>Log In </span>
          </div>
        </div>  
        <div className='right-center-flex'>
          <img src={landingPageCoverPic} className="landing-image" alt="landing" />
        </div>
      </div>

    </div>
  )
}

export default LandingPage