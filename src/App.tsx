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
import Footer from './components/Footer/Footer';
import { userAPI } from './api/userAPI';
import { notesAPI } from './api/notesAPI';

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
  const [transcribedText, setTranscribedText] = useState<string | null>(null);
  const [loader, setLoader] = useState(false);
  const [profile, setProfile] = useState("");

  const user: User = {
    transcribedText,
    setTranscribedText,
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
    loader: loader,
    setLoader: setLoader,
    profile: profile,
    setProfile: setProfile
  }

  const getNotes = async () => {
    setLoader(true);
    notesAPI.getUserNotes(token).then((notes:Note[])=>{
      setNotes(notes);
    })
    setLoader(false);
  }

  const getUser = async () => {
    if (token) {
      setLoader(true);
      userAPI.getUser(token).then((user: User) => {
        setLoginOrSignUp("none");
        setFirstName(user?.firstName ?? "");
        setLastName(user.lastName ?? "");
        setAge(user?.age ?? "");
        setMobileNumber(user?.mobileNumber ?? "");
        setCountry(user.country ?? "");
        setState(user.state ?? "");
        setRoles(user.roles ?? "");
        setProfileUpdated(user.profileUpdated ?? "");
        setEmail(user.emailId ?? "");
        setIsLoggedIn(true);
        setProfile(user?.profile ?? "")
      }).catch((error: String) => {
        console.log(error);
      })
        .finally(() => {
          setLoader(false);
        })

    }
  }

  useEffect(() => {
    getUser();
    getNotes();
  }, [])



  return (
    <>
      <StateContext.Provider value={user}>
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
          <Footer />
        </Router>
      </StateContext.Provider>
    </>
  );
}

export default App;
