import React, { useState, useEffect, useContext, useLayoutEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { StateContext } from '../../context/SessionContext';
import "./Profile.css";
import axios from 'axios';
import { User } from '../../models/Session';
import storage from "../../firebase/firebase_connect";
import { getDownloadURL, uploadBytesResumable, ref } from 'firebase/storage';
import LoadingBar from 'react-top-loading-bar'

const Profile = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const session = useContext(StateContext);  
    const [progress, setProgress] = useState(0)

    const fetchDetails = () => {
        console.warn(session!);
        setEmailId(session?.email ?? "");
        setFirstName(session?.firstName ?? "");
        setLastName(session?.lastName ?? "");
        setAge(session?.age ?? "");
        setMobileNumber(session?.mobileNumber ?? "");
        setState(session?.state ?? "");
        setCountry(session?.country ?? "");
        setRole(session?.roles ?? "");
        setProfile(session?.profile ?? "")
    }

    const logout = () => {
        session!.setIsLoggedIn!(false);
        localStorage.setItem('narynotestoken', "");
        navigate("/");
    }

    useEffect(() => {
        fetchDetails();
    }, []);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [emailId, setEmailId] = useState("");
    const [age, setAge] = useState("");
    const [country, setCountry] = useState("");
    const [state, setState] = useState("");
    const [profile, setProfile] = useState("");
    const [role, setRole] = useState("");

    // const switchRole = (event: MouseEvent) => {
    //     setRole(event.target!.);
    // }

    const updateProfile = () => {
        axios.patch('http://localhost:5000/users', {
            "roles": "user",
            "token": session!.access_token,
            "emailId": emailId,
            "firstName": firstName,
            "lastName": lastName,
            "mobileNumber": mobileNumber,
            "age": age,
            "country": country,
            "state": state,
            "profile": profile
        })
            .then(function (response) {
                // console.log(response);
                let user: User = response.data.response;
                session!.setLoginOrSignup!("none");
                session!.setFirstName!(user?.firstName ?? "");
                session!.setLastName!(user?.lastName ?? "");
                session!.setAge!(user?.age ?? "");
                session!.setMobileNumber!(user?.mobileNumber ?? "");
                session!.setCountry!(user?.country ?? "");
                session!.setState!(user?.state ?? "");
                session!.setRoles!(user?.roles ?? "");
                session!.setProfileUpdated!(user?.profileUpdated ?? "");
                session!.setEmail!(user?.emailId ?? "");
                session!.setIsLoggedIn!(true);
                session!.setProfile!(profile ?? "");
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    useLayoutEffect(() => {
        document.documentElement.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <div className='profile-master-container'>
            <LoadingBar
        color='#f11946'
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
            <div className="container rounded mb-5">
                <div className="row">
                    <div className="col-md-5 mt-5 border-right">
                        <input type="file"
                            id="profileimage" name="profile"
                            accept="image/png, image/jpeg" style={{ display: "none" }} onChange={(e: React.ChangeEvent<any>) => {
                                const target = e.target.files[0];
                                const storageRef = ref(storage, `/profile/${target.name}`);
                                const uploadTask = uploadBytesResumable(storageRef, target);
                                
                                uploadTask.on(
                                    "state_changed",
                                    (snapshot) => {
                                        const percent = Math.round(
                                            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                                        );
                                        setProgress(percent);

                                        // update progress
                                        // setPercent(percent);
                                    },
                                    (err) => console.log(err),
                                    () => {
                                        // download url
                                        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                                            console.log(url, "Hellomo");
                                            setProfile(url);
                                        });
                                    }
                                );
                                // setProfilePic(target.fil);
                            }} />
                        <div className="d-flex flex-column align-items-center text-center py-5"><label htmlFor='profileimage' className='profileimage'><img className="rounded-circle mt-5 " width="120px" height="120px" alt="profile" src={profile !==""? profile: "https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"} />
                        </label><span className="font-weight-bold name-display mt-3">{firstName} {lastName}</span><span className="email-display">{emailId}</span><span> </span></div>
                    </div>
                    <div className="col-md-5 border-right">
                        <div className="p-3 py-5">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h4 className="text-right">Profile Settings</h4>
                            </div>
                            <div className="row mt-2">
                                <div className="col-md-6"><label className="labels">Name</label><input type="text" onChange={(e) => setFirstName(e.target.value)} className="form-control" placeholder="first name" value={firstName} /></div>
                                <div className="col-md-6"><label className="labels">Surname</label><input type="text" onChange={(e) => setLastName(e.target.value)} className="form-control" value={lastName} placeholder="surname" /></div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-12"><label className="labels">Mobile Number</label><input type="text" onChange={(e) => setMobileNumber(e.target.value)} className="form-control" placeholder="enter phone number" value={mobileNumber} /></div>
                                <div className="col-md-12"><label className="labels">Email ID</label><input type="text" onChange={(e) => setEmailId(e.target.value)} className="form-control" placeholder="enter email id" value={emailId} /></div>
                                <div className="col-md-12"><label className="labels">Age</label><input type="number" onChange={(e) => setAge(e.target.value)} className="form-control" placeholder="education" value={age} /></div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-6"><label className="labels">Country</label><input type="text" onChange={(e) => setCountry(e.target.value)} className="form-control" placeholder="country" value={country} /></div>
                                <div className="col-md-6"><label className="labels">State/Region</label><input type="text" onChange={(e) => setState(e.target.value)} className="form-control" value={state} placeholder={state} /></div>
                            </div>
                            {/* <div className="dropdown mt-3 d-flex justify-content-center">
                            <button className="btn btn-light dropdown-toggle px-4" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Role
                            </button>
                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                <button className='profile-button'>Admin</button>
                                <button className='profile-button'>user</button>
                            </div>
                        </div> */}
                            <div className='button-array mt-5'>
                                <button onClick={updateProfile} className="profile-button save" type="button">Save Profile</button>
                                <button onClick={logout} className="profile-button logout" type="button">Logout</button>
                            </div>
                        </div>
                    </div>
                    {/* <div className="col-md-4">
                    <div className="p-3 py-5">
                        <div className="d-flex justify-content-between align-items-center experience"><span>Edit Experience</span><span className="border px-3 p-1 add-experience"><i className="fa fa-plus"></i>&nbsp;Experience</span></div><br />
                        <div className="col-md-12"><label className="labels">Experience in Designing</label><input type="text" className="form-control" placeholder="experience" value="" /></div> <br />
                        <div className="col-md-12"><label className="labels">Additional Details</label><input type="text" className="form-control" placeholder="additional details" value="" /></div>
                    </div>
                </div> */}
                </div>
                <script src="https://code.jquery.com/jquery.js"></script>
                <script src="js/bootstrap.min.js"></script>
            </div>
        </div>

    )
}

export default Profile