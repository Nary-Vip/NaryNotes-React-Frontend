import { useState, useEffect, useContext } from "react";
import axios from 'axios';
import AudioAnalyser from "react-audio-analyser";
import { StateContext } from '../../context/SessionContext';
import "./Recorder.css";

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
            // axios.post('http://localhost:5000/speechtext', formData);
            setLoader(true);
            axios.post(
                'http://localhost:5000/speechtext',
                formData,
            )
                .then(function (response) {
                    console.log(response);
                    session.setTranscribedText(response.data.text);
                })
                .catch(function (error) {
                    console.log(error);
                }).finally(() => {
                    setLoader(false);
                })
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