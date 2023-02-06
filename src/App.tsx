import './App.css';
import { useState, useEffect } from "react";
import NavBar from './components/NavBar/NavBar';
import LandingPage from './pages/LandingPage';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from './pages/SignUp/SignUp';
import { StateContext } from './context/SessionContext';
import { Note, User } from './models/Session';
import Profile from './pages/Profile/Profile';
import axios from 'axios';
import AddNotes from './pages/Notes/AddNotes/AddNotes';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginOrSignUp, setLoginOrSignUp] = useState("none");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [roles, setRoles] = useState("");
  const [profileUpdated, setProfileUpdated] = useState("");
  const [token, setToken] = useState(localStorage.getItem('narynotestoken') ?? "");
  const [notes, setNotes] = useState<Array<Note>>();
  
  const user: User = {
    notes: notes,
    setNotes: setNotes,
    access_token: token,
    setToken: setToken,
    isLoggedIn: isLoggedIn,
    loginOrSignup: loginOrSignUp,
    setIsLoggedIn: setIsLoggedIn,
    setLoginOrSignup: setLoginOrSignUp,
    firstName: firstName,
    email: email,
    lastName: lastName,
    age: age,
    mobileNumber: mobileNumber,
    country: country,
    state: state,
    roles: roles,
    profileUpdated: profileUpdated,
    setFirstName: setFirstName,
    setLastName: setLastName,
    setAge: setAge,
    setMobileNumber: setMobileNumber,
    setCountry: setCountry,
    setState: setState,
    setRoles: setRoles,
    setProfileUpdated: setProfileUpdated,
    setEmail: setEmail, 
  }

  const getNotes = async ()=>{
    axios.get('http://localhost:5000/notes', { params: { token: token }})
    .then((response)=>{
      setNotes(response.data.notes);
    })
  }

  const getUser = async () => {
    if(token){
      axios.get('http://localhost:5000/users', { params: { token: token }})
      .then(function (response) {
        const { data } = response;
        let user:User = data;
        setLoginOrSignUp("none");
        setFirstName(user?.firstName ?? "");
        setLastName(user.lastName ?? "");
        setAge(user?.age ?? "");
        setMobileNumber(user?.mobileNumber?? "");
        setCountry(user.country?? "");
        setState(user.state ?? "");
        setRoles(user.roles ?? "");
        setProfileUpdated(user.profileUpdated ?? "");
        setEmail(user.emailId ?? ""); 
        setIsLoggedIn(true);
      })
      .catch(function (error) {
        console.log(error);
      });

    }
  }

  useEffect(() => {
    getUser();
    getNotes();
  }, [])



  return (
    <>
      <StateContext.Provider value={ user }>
        <Router>
          <NavBar />
          <Routes>
            <Route path='/'>
              <Route index element={<LandingPage />} />
              <Route path="signup">
                <Route index element={<SignUp />} />
              </Route>
              <Route path='profile' element={<Profile />} />
              <Route path="note">
                <Route index element={<AddNotes />} />
                {/* <Route path=":noteId" element={<NotePage note={undefined} }/>} /> */}
                <Route path="add" element={<AddNotes />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </StateContext.Provider>
    </>
  );
}

export default App;
