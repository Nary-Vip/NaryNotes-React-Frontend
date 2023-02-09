import "./Login.css";
import React, { useContext, useState } from 'react'
import { StateContext } from "../../context/SessionContext";
import axios from 'axios';
import { Note, User } from '../../models/Session';
import { AiOutlineClose } from "react-icons/ai";

const Login = () => {
  const session = useContext(StateContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginSwitch = () => {
    session!.setLoginOrSignup!("signup");
  }

  const handleSignIn = async (e: any) => {
    e.preventDefault()
    axios.post('http://localhost:5000/users/login', {
      "emailId": email,
      "password": password
    })
      .then(function (response) {
        let user: User = response.data.user;
        console.warn(user);
        session!.setLoginOrSignup!("none");
        session!.setFirstName!(user.firstName ?? "");
        session!.setLastName!(user.lastName ?? "");
        session!.setAge!(user.age ?? "");
        session!.setMobileNumber!(user.mobileNumber ?? "");
        session!.setCountry!(user.country ?? "");
        session!.setState!(user.state ?? "");
        session!.setRoles!(user.roles ?? "");
        session!.setProfileUpdated!(user.profileUpdated ?? "");
        session!.setEmail!(user.emailId ?? "");
        session!.setIsLoggedIn!(true);
        session!.setToken!(user.access_token ?? "");
        localStorage.setItem('narynotestoken', user.access_token);
      })
      .catch(function (error) {
        console.log(error);
      }).finally(() => {
        axios.get('http://localhost:5000/notes', { params: { token: session?.access_token } }).then((response) => {
          console.log(response);
          const notes: Array<Note> = response.data.notes;
          session?.setNotes!(notes);
        });
      });
  }

  return (
    <div className='overlay'>
      <div className={"signin"}>
        <form className='signin-form'>
          <div className="login-close-pop-up"><AiOutlineClose className="login-close-pop-up-icon" onClick={
            () => {
              session?.setLoginOrSignup!("none");
            }
          } /></div>
          <h2 className='signin-title'>LOGIN</h2>
          <input className='signin-input username' placeholder="User Name" onChange={(e) => setEmail(e.target.value)} value={email} />
          <input type="password" className='signin-input password' placeholder="Password" onChange={(e) => setPassword(e.target.value)} value={password} />
          <button className='signin-button' onClick={handleSignIn}>Login</button>
          <p className='switch-to-login' onClick={handleLoginSwitch}>Don't have an account?</p>
        </form>
      </div>
    </div>
  )
}

export default Login
