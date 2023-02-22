import { useState, useEffect, useContext } from "react";
import axios from 'axios';
import AudioAnalyser from "react-audio-analyser";
import { StateContext } from '../../context/SessionContext';
import "./Recorder.css";
import { getDownloadURL, uploadBytesResumable, ref } from 'firebase/storage';
import storage from "../../firebase/firebase_connect";

const Recorder = () => {
    const [status, setStatus] = useState("inactive");
    const [audioSrc, setAudioSrc] = useState("audio/wav");
    const [loader, setLoader] = useState(false);
    const [audioType, setAudioType] = useState("audio/wav");
    const session = useContext(StateContext);

    const controlAudio = (status) => {
        setStatus(status);
    };

    const audioProps = {
        audioType,
        status,
        audioSrc,
        timeslice: 1000,
        startCallback: e => {
            console.log("succ start", e);
        },
        pauseCallback: e => {
            console.log("succ pause", e);
        },
        stopCallback: e => {
            const formData = new FormData();
            setAudioSrc(window.URL.createObjectURL(e));
            formData.append("audioFile", e, "recorder.wav");
            console.warn(formData);
            const config = {
                headers: {'content-type': 'multipart/form-data'}
            }
            
            // axios.post('http://localhost:5000/speechtext', formData);
            setLoader(true);
            
            const storageRef = ref(storage, `/audio/${formData}`);
            const uploadTask = uploadBytesResumable(storageRef, formData, config);
        
            uploadTask.on(
              "state_changed",
              (snapshot) => {
                const percent = Math.round(
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
        
                // update progress
                // setPercent(percent); 
              },
              (err) => console.log(err),
              () => {
                // download url
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                  console.log(url, "Hellomo");
                  axios.patch(
                    'http://localhost:5000/notes/content',
                    {
                    "audio": url,
                    "token": session?.access_token
                    }
                  )
                    .then(function (response) {
                      console.log(response);
                      session?.setTranscribedText(response.data.text);
                    })
                    .catch(function (error) {
                      console.log(error);
                    }).finally(() => {
                      session?.setLoader(false);
                    })
                });
              }
            );
            // axios.post(
            //     'http://localhost:5000/speechtext',
            //     formData,
            // )
            //     .then(function (response) {
            //         console.log(response);
            //         session.setTranscribedText(response.data.text);
            //     })
            //     .catch(function (error) {
            //         console.log(error);
            //     }).finally(() => {
            //         setLoader(false);
            //     })
            console.log("succ stop", e);
        },
        onRecordCallback: e => {
            console.log("recording", e);
        },
        errorCallback: err => {
            console.log("error", err);
        }
    };



    return (
        <div className="recorder-wall">

            <h3 className="recorder-title">{loader? "Please wait, your audio is being processed...":status === "inactive" ?"Tap on the recorder" : "Recoding... Tap again to stop!"}</h3>
            <div onClick={()=>{
                        if(status === "inactive") controlAudio("recording");
                        if(status === "recording") controlAudio("inactive");
                    }}>
                <AudioAnalyser {...audioProps} className="recorder-tile" >
                </AudioAnalyser>
            </div>
            
        </div>
    );
}

export default Recorder;