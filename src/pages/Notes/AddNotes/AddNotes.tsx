import axios from 'axios';
import React, { useContext, useState } from 'react';
import TimeStamp from '../../../components/note/TimeStamp';
import { StateContext } from '../../../context/SessionContext';
import { Note } from '../../../models/Session';
import "./AddNotes.css";
import { AiOutlineEdit } from "react-icons/ai"; 
import { MdDeleteForever } from "react-icons/md";
import NotePage from '../NotePage/NotePage';
import { BsMic } from "react-icons/bs";
import useRecorder from '../../../recorder/Recorder';
import { WaveformAudioRecorder, WaveformAudioRecorderType } from 'waveform-audio-recorder';

const AddNotes = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [noteColor, setNoteColor] = useState("#FFC59D");
  const [showSingleNoteEditPage, setshowSingleNoteEditPage] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [selectedNoteId, setSelectedNoteId] = useState("");
  const [showFullNote, setShowFullNote] = useState(false);
  const [fullNote, setFullNote] = useState<Note | null>(null);
  const [audioBlob, setAudioBlob] = useState<string|null>("");

  let colorSchemes = ["#093145", "#1287A8", "#AD2A1A", "#ECB944", "#FDA18A"];

  const session = useContext(StateContext);

  const [recorderState, setRecorderState] = useState<WaveformAudioRecorderType | null>(null);
  console.log(recorderState);

  const updateNote = () => {
    axios.patch('http://localhost:5000/notes', {
      "title": editTitle,
      "content": editContent,
      "tags": "personal",
      "color": noteColor,
      "token": session?.access_token,
      "noteId": selectedNoteId
    })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      }).finally(() => {
        axios.get('http://localhost:5000/notes', { params: { token: session?.access_token } }).then((response) => {
          console.log(response);
          const notes: Array<Note> = response.data.notes;
          session?.setNotes!(notes);
        });
        setEditTitle("");
        setEditContent("");
        setshowSingleNoteEditPage(false);
      })

  };

  const addNote = () => {
    axios.post('http://localhost:5000/notes', {
      "title": title,
      "content": content,
      "tags": "personal",
      "color": noteColor,
      "token": session?.access_token
    })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      }).finally(() => {
        axios.get('http://localhost:5000/notes', { params: { token: session?.access_token } }).then((response) => {
          console.log(response);
          const notes: Array<Note> = response.data.notes;
          session?.setNotes!(notes);
        });
        setTitle("");
        setContent("");
      })
  }

  const deleteNote = (noteId:string)=>{
    console.log(noteId);
    axios.delete('http://localhost:5000/notes', {
      data:{
      "token": session?.access_token,
      "noteId": noteId
      }
    })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      }).finally(() => {
        axios.get('http://localhost:5000/notes', { params: { token: session?.access_token } }).then((response) => {
          console.log(response);
          const notes: Array<Note> = response.data.notes;
          session?.setNotes!(notes);
        });
      })
  }

  return (
    <>
      <div className='add-notes-container' style={{ backgroundColor: noteColor }}>
        <div className='add-notes'>
          <div className='add-notes-inner-container'>
            <h2 className='center-title add-a-note-text'>{showSingleNoteEditPage ? "Edit" : "Add a Note"}</h2>
            <div className="row mt-2">
              <div className=""><input type="text" onChange={(e) => {
                showSingleNoteEditPage ?
                  setEditTitle(e.target.value) :
                  setTitle(e.target.value);
              }} className="form-control" placeholder="Title" value={
                showSingleNoteEditPage ?
                  editTitle :
                  title} /></div>
            </div>
            <div className="row mt-4">
              <div className="form-group"><textarea onChange={(e) => {
                showSingleNoteEditPage ?
                  setEditContent(e.target.value) :
                  setContent(e.target.value);
              }} className="form-control" value={showSingleNoteEditPage ? editContent : content} placeholder="Content" >
                
              </textarea>
              <span className="icon-user" onClick={recorderState?.initRecording ? ()=>{recorderState?.saveRecording();
              setAudioBlob(recorderState.audio);
              console.log(audioBlob);
              } : recorderState?.startRecording}><BsMic color={recorderState?.initRecording ? "red" : "gray"} /></span>
                
              </div>
            </div>  
            <div className='colorPallate-container'>
              {colorSchemes.map((color) => {
                return <div key={color} onClick={() => {
                  setNoteColor(color);
                }} className={`colorPalatte ${noteColor === color ? "active" : ""}`} style={{ backgroundColor: color }}>
                </div>
              })}
            </div>
            <button onClick={showSingleNoteEditPage ? updateNote : addNote} className={showSingleNoteEditPage ? "submit-button edit-button" : "submit-button"}>
              {showSingleNoteEditPage ? "UPDATE" : "SUBMIT"}
            </button>
            {
              showSingleNoteEditPage ?
                <div className='cancel-button' onClick={() => {
                  setshowSingleNoteEditPage(false);
                }}>CANCEL</div>
                : <></>
            }
          </div>
        </div>
        {(audioBlob !== "")? <audio src={audioBlob!} />:<></>}
       
        <WaveformAudioRecorder setRecorderState={setRecorderState} />
                {recorderState?.initRecording ? recorderState?.recordingDuration : ""}
        
        

      </div>
      <div className='my-notes-container'>
        <div className='my-notes-inner-container'>
          {session?.notes?.length === 0 || session?.notes === undefined?
          <div className='my-notes-text'>No Notes available</div>:
            <div className='my-notes-text'>My Notes</div>}
          <div className='note-list'>
            {session?.notes?.map((note, index) => {
              return <article key={index} className="note-container" style={{ backgroundColor: note.color }}>
                <div className="title-and-content">
                  <h3 className="note-title">{note.title?.substring(0, 30)}{(note.title!.length > 30) ? "..." : ""}</h3>
                  <p className="note-content">{note.content?.substring(0, 100)}</p>
                </div>
                <div>
                  <div className="author-created-time">
                    <p><TimeStamp createdAt={note.createdAt} /></p>
                  </div>
                  <div className='see-more-delete-icon-flex'>
                  <div onClick={() => {
                    setShowFullNote(true);
                    setFullNote(note);
                  }} className="see-more-note-tab">See More</div>
                  <div className='crud-icons'>
                  <MdDeleteForever className='delete-icon' onClick={()=>{
                    setSelectedNoteId(note._id!);
                    deleteNote(note._id!);
                    }}/>
                  <AiOutlineEdit onClick={() => {
                    window.scrollTo(0, 0);
                    setEditTitle(note?.title!);
                    setEditContent(note?.content!);
                    setshowSingleNoteEditPage(true);
                    setSelectedNoteId(note._id!);
                  }} className='edit-icon'/>
                  </div>
                  </div>
                </div>
                
              </article>
            })}
          </div>
        </div>
      </div>
      {showFullNote? <NotePage note={fullNote!} closeState = {setShowFullNote}/>:<></>}
      
      {/* {showSingleNoteEditPage ? <div className='edit-note-pop-up'>
        <div>
          <div className='close-icon-div'>
            <AiOutlineClose className='close-icon' onClick={() => {
              setshowSingleNoteEditPage(false);
            }} />
          </div>
          <div className="row mt-2">
            <div className=""><input type="text" onChange={(e) => setEditTitle(e.target.value)} className="form-control" placeholder="Title" value={editTitle} /></div>
          </div>
          <div className="row mt-4">
            <div className=""><textarea onChange={(e) => setEditContent(e.target.value)} className="form-control" value={editContent} placeholder="Content" /></div>
          </div>
        </div>
        <div className='colorPallate-container'>
          {colorSchemes.map((color) => {
            return <div key={color} onClick={() => {
              setNoteColor(color);
            }} className={`colorPalatte ${noteColor === color ? "active" : ""}`} style={{ backgroundColor: color }}>
            </div>
          })}
        </div>

        <div className='update-button-container'>
          <button onClick={updateNote} className='submit-button edit-button'>
            UPDATE
          </button>
        </div>
      </div> : <></>
      } */}
    </>
  )
}

export default AddNotes