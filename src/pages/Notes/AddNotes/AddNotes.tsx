import axios from 'axios';
import React, { useContext, useEffect, useState, useRef, useLayoutEffect } from 'react';
import TimeStamp from '../../../components/note/TimeStamp';
import { StateContext } from '../../../context/SessionContext';
import { Note } from '../../../models/Session';
import "./AddNotes.css";
import { AiOutlineEdit } from "react-icons/ai";
import { MdDeleteForever } from "react-icons/md";
import NotePage from '../NotePage/NotePage';
import { BsMic } from "react-icons/bs";
import { CiImageOn } from "react-icons/ci";
import storage from "../../../firebase/firebase_connect";
// 
import Recorder from '../../../components/Recorder/Recorder';
import { useLocation } from 'react-router-dom';
import { getDownloadURL, uploadBytesResumable, ref } from 'firebase/storage';
import { notesAPI } from '../../../api/notesAPI';
import LoadingBar from 'react-top-loading-bar';

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
  const [showRecorder, setShowRecorder] = useState(false);
  const [progress, setProgress] = useState(0);
  const [percent, setPercent] = useState(0);
  let colorSchemes = ["#093145", "#1287A8", "#AD2A1A", "#ECB944", "#FDA18A"];
  const session = useContext(StateContext);

  const updateNote = () => {
    setProgress(10);
    const note = {
      "title": editTitle,
      "content": editContent,
      "tags": "personal",
      "color": noteColor,
      "token": session?.access_token,
      "noteId": selectedNoteId
    }
    setProgress(50);
    notesAPI.updateUserNote(note)
      .then(function (response:any) {
        console.log(response);
        setProgress(70);
      })
      .catch(function (error:any) {
        console.log(error);
      }).finally(() => {
        notesAPI.getUserNotes(session?.access_token).then((notes: Note[]) => {
          session?.setNotes!(notes);
        });
        setEditTitle("");
        setEditContent("");
        setshowSingleNoteEditPage(false);
        setProgress(100);
      })

  };

  const addNote = () => {
    setProgress(10);
    const note = {
      "title": title,
      "content": content,
      "tags": "personal",
      "color": noteColor,
      "token": session?.access_token
    };
    setProgress(50);
    notesAPI.addUserNotes(note)
      .then((response: any)=> {
        // console.log("response");
        setProgress(80);
      })
      .catch(function (error: any) {
        console.log(error);
      }).finally(() => {
        notesAPI.getUserNotes(session?.access_token).then((notes: Note[]) => {
          session?.setNotes!(notes);
        });
        setTitle("");
        setContent("");
        setProgress(100);
      })
  }

  const hiddenFileInput = useRef<HTMLInputElement>(null);

  const handleClick = (event: React.ChangeEvent<any>) => {
    hiddenFileInput?.current?.click();
  };

  const handleImageUpload = (event: React.ChangeEvent<any>) => {
    const imageSelected = event.target.files[0];
    session?.setLoader(true);
    const image = new FormData();
    image.append("image", imageSelected);
    if (!imageSelected) {
      alert("Please choose a file first!")
    }

    const storageRef = ref(storage, `/scan/${imageSelected.name}`)
    const uploadTask = uploadBytesResumable(storageRef, imageSelected);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );

        // update progress
        setPercent(percent);
      },
      (err) => console.log(err),
      () => {
        // download url
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          console.log(url, "Hellomo");
          axios.post(
            'http://localhost:5000/notes/content',
            {
              "imageUrl": url,
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


  }

  useEffect(() => {
    setContent(session?.transcribedText! ?? "");
    setShowRecorder(false);
  }, [session?.transcribedText])


  const deleteNote = (noteId: string) => {
    setProgress(10);
    const body = {
      "token": session?.access_token,
      "noteId": noteId
    }
    setProgress(30);
    notesAPI.deleteUserNote(body)
      .then((response:any) =>{
        console.log(response);
        setProgress(70);
      })
      .catch(function (error:any) {
        console.log(error);
      }).finally(() => {
        notesAPI.getUserNotes(session?.access_token).then((notes: Note[]) => {
          session?.setNotes!(notes);
        });
        setProgress(100);
      })
  }
  const location = useLocation();
  useLayoutEffect(() => {
    document.documentElement.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <div className='add-notes-container'>
      <LoadingBar
                color='#000000'
                progress={progress}
                onLoaderFinished={() => setProgress(0)}
            />
        <div className='add-notes' style={{ height: showSingleNoteEditPage ? "60vh" : "55vh" }}>
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
              <div className="form-group mic-area">
                <textarea onChange={(e) => {
                  showSingleNoteEditPage ?
                    setEditContent(e.target.value) :
                    setContent(e.target.value);
                }} rows={4} className="form-control" value={showSingleNoteEditPage ? editContent : content} placeholder={session?.loader === true ? "Model is processing your input, please wait" : "Content"} >
                </textarea>

              </div>
            </div>
            <div className='colorPallate-container'>
              <div className='model-icons-stack'>
                <BsMic className="icon-user" onClick={() => setShowRecorder(true)} />
                <CiImageOn className="icon-user" onClick={handleClick} />
                <input type='file' name='file' ref={hiddenFileInput} style={{ display: "none" }} onChange={handleImageUpload} />
                <div className='line-break'></div>
              </div>
              {colorSchemes.map((color) => {
                return <div key={color} onClick={() => {
                  setNoteColor(color);
                }} className={`colorPalatte ${noteColor === color ? "active" : ""}`} style={{ backgroundColor: color }}>
                </div>
              })}
            </div>
            <button style={{ backgroundColor: noteColor }} onClick={showSingleNoteEditPage ? updateNote : addNote} className={showSingleNoteEditPage ? "submit-button edit-button" : "submit-button"}>
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
        {showRecorder ?
          <div className="recoder-container">
            <Recorder />
          </div>
          : <></>}
      </div>
      <div className='my-notes-container'>
        <div className='my-notes-inner-container'>
          {session?.loader ?
            <div className='my-notes-text'>Loading your notes</div> :
            session?.notes?.length === 0 || session?.notes === undefined ?
              <div className='my-notes-text'>No Notes available</div> :
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
                      <MdDeleteForever className='delete-icon' onClick={() => {
                        setSelectedNoteId(note._id!);
                        deleteNote(note._id!);
                      }} />
                      <AiOutlineEdit onClick={() => {
                        window.scrollTo(0, 0);
                        setEditTitle(note?.title!);
                        setEditContent(note?.content!);
                        setshowSingleNoteEditPage(true);
                        setSelectedNoteId(note._id!);
                      }} className='edit-icon' />
                    </div>
                  </div>
                </div>

              </article>
            })}
          </div>
        </div>
      </div>
      {showFullNote ? <NotePage note={fullNote!} closeState={setShowFullNote} /> : <></>}

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