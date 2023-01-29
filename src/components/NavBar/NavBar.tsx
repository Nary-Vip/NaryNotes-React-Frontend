import React, { useContext } from 'react'
import "./NavBar.css";
import { StateContext } from '../../context/SessionContext';
import Login from '../../pages/Login/Login';
import SignUp from '../../pages/SignUp/SignUp';
import { Link } from 'react-router-dom';

const NavBar = () => {
    const session = useContext(StateContext);
    return (
        <div className="nav-sign-container">
            <nav className='navbar'>
                <img src='/images/narynotes-logo.png' alt="NaryNotes logo" className='navbar-logo' />
                <div className='navbar-center-content'>
                    <div>
                        <Link to="/" className='navbar-center-content-title'>Nary Notes</Link>
                    </div>
                </div>
                {session!.isLoggedIn ? (<div className='navbar-right'>
                    <Link to="/note" className='navbar-right-routes'>My Notes</Link>
                    <Link to="/profile" className='navbar-right-routes'>Profile</Link>
                </div>) :
                    <div className='navbar-right'>
                        <div onClick={(() => session!.setLoginOrSignup!("login"))} className='navbar-right-routes'>Login</div>
                        <div onClick={(() => session!.setLoginOrSignup!("signup"))} className='navbar-right-routes'>SignUp</div>
                    </div>}
            </nav>
                        {
                session?.loginOrSignup === "signup" ?
                    <SignUp /> : <></>
            }
            {
                session?.loginOrSignup === "login" ?
                    <Login /> : <></>
            }
        </div>

    )
}



export default NavBar