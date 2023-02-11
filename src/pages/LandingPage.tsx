import React, { useContext } from 'react';
import "./LandingPage.css";
import landingPageCoverPic from "../images/landing-page.jpg";
import { StateContext } from '../context/SessionContext';
import { useNavigate } from 'react-router-dom';
import asr from "../images/ASR.jpg";
import ocr from "../images/ocr.jpeg";

const LandingPage = () => {
  const navigate = useNavigate();
  const session = useContext(StateContext);
  return (
    <div className='landing-page'>
      <div className='center-flex'>
        <div className='left-center-flex'>
          <h1 className='left-flex-title'>Create. Edit. Store. <br />Access. Smartly.</h1>
          <p className='left-flex-content'>NaryNotes is smart note keeping platform, through which you can create, store, edit the notes.
            You can also create your note content using the audio and photo which is processed by our high end Deep learning models.
          </p>
          {!session?.isLoggedIn ?? false ?
            <>
              <div className="left-flex-sign-up-button" onClick={() => {
                session?.setLoginOrSignup!("signup");
              }}>
                <span className='left-flex-sign-up-button-bold'>Sign up </span>- It's Free
              </div>
              <div className="left-flex-login-in-button" onClick={() => {
                session?.setLoginOrSignup!("login");
              }}>
                <span className='left-flex-login-in-button-bold'>Log In </span>
              </div>
            </> : <>
              <div className="left-flex-sign-up-button" onClick={() => {
                navigate("note");
              }}>
                <span className='left-flex-sign-up-button-bold'>Create a Note</span>
              </div>
              <div className="left-flex-login-in-button" onClick={() => {
                navigate("profile");
              }}>
                <span className='left-flex-login-in-button-bold'>Your Profile </span>
              </div>
            </>}
        </div>
        <div className='right-center-flex'>
          <img src={landingPageCoverPic} className="landing-image" alt="landing" />
        </div>
      </div>
      <div className='feature-1'>
        <div className='feature-landing-page'>
          <div className='feature-header-div'>
            <h2 className='feature-header'>FEATURES</h2>
          </div>
          {/* Feature - 1 */}
          <div className='feature-landing-block'>
            <img src={asr} alt='feature' className='feature-image' />
            <div className='feature-content'>
              <h3 className='feature-title'>Take notes smartly with S2T Model</h3>
              <p className='feature-description'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Perferendis laudantium asperiores beatae, error, reiciendis odit dignissimos minima consequuntur corrupti quibusdam similique quas accusamus inventore praesentium voluptate corporis odio aliquam sapiente?</p>
              <div className='feature-button'>Use Now</div>
            </div>
          </div>
          {/* Feature - 2 */}
          <div className='feature-landing-block'>
            <div className='feature-content'>
              <h3 className='feature-title'>Take notes with OCR</h3>
              <p className='feature-description'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Perferendis laudantium asperiores beatae, error, reiciendis odit dignissimos minima consequuntur corrupti quibusdam similique quas accusamus inventore praesentium voluptate corporis odio aliquam sapiente?</p>
              <div className='feature-button'>Use Now</div>
            </div>
            <img src={ocr} alt='feature' className='feature-image' />
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage