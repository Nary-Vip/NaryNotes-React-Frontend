import React, { useState, useContext } from 'react';
import { StateContext } from '../../context/SessionContext';
import axios from 'axios';
import "./SignUp.css";

const SignUp = () => {
  const session = useContext(StateContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginSwitch = () => {
    session!.setLoginOrSignup!("login");
  }

  const handleSignUp = async (e: any) => {
    e.preventDefault()
      //create User
      axios.post('http://localhost:5000/users', {
        "emailId": email,
        "password": password
      })
      .then(function (response) {
        console.log(response);
        alert(response.data.message);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  return (
    <div className='overlay'>
      <div className={"signup"}>
        <form className='signup-form'>
          <h2 className='signup-title'>SIGN UP</h2>
          <input className='signup-input username' placeholder="User Name" onChange={(e) => setEmail(e.target.value)} value={email} />
          <input type="password" className='signup-input password' placeholder="Password" onChange={(e) => setPassword(e.target.value)} value={password} />
          <button className='signin-button' onClick={handleSignUp}>Sign Up</button>
          <p className='switch-to-login' onClick={handleLoginSwitch}>Already have an account?</p>
        </form>
      </div>
    </div>

  )
}

export default SignUp