import axios from 'axios';
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import TimeStamp from '../../../components/note/TimeStamp';
import { StateContext } from '../../../context/SessionContext';
import { Note } from '../../../models/Session';
import "./AddNotes.css";

const AddNotes = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [noteColor, setNoteColor] = useState("#FFC59D");

  let colorSchemes = ["#FFC59D", "#CCEDF6", "#F2D2DD", "#ECB403", "#FDA18A"];

  const session = useContext(StateContext);

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

  return (
    <>
      <div className='add-notes-container' style={{ backgroundColor: noteColor }}>
        <div className='add-notes'>
          <div className='add-notes-inner-container'>
            <h2 className='center-title add-a-note-text'>Add a Note</h2>
            <div className="row mt-2">
              <div className=""><input type="text" onChange={(e) => setTitle(e.target.value)} className="form-control" placeholder="Title" value={title} /></div>
            </div>
            <div className="row mt-4">
              <div className=""><input type="text" onChange={(e) => setContent(e.target.value)} className="form-control" value={content} placeholder="Content" /></div>
            </div>
            <div className='colorPallate-container'>
              {colorSchemes.map((color) => {
                if (noteColor === color) {

                }
                return <div key={color} onClick={() => {
                  setNoteColor(color);
                }} className={`colorPalatte ${noteColor === color ? "active" : ""}`} style={{ backgroundColor: color }}>
                </div>
              })}
            </div>
            <button onClick={addNote} className='submit-button'>
              SUBMIT
            </button>
          </div>

        </div>

      </div>
      <div className='my-notes-container'>
        <div className='my-notes-inner-container'>
          <div className='my-notes-text'>My Notes</div>
          <div className='note-list'>
            {session?.notes?.map((note) => {
              return <article className="note-container" style={{ backgroundColor: note.color }}>
                <div className="title-and-content">
                  <h3 className="note-title">{note.title}</h3>
                  <p className="note-content">{note.content?.substring(0, 100)}</p>
                </div>
                <div>
                  <div className="author-created-time">
                    <p><TimeStamp createdAt={note.createdAt} /></p>
                  </div>
                  <Link className="see-more-note-tab" to={`/note/${note._id}`}>See More</Link>
                </div>
              </article>
            })}
          </div>
        </div>
      </div>
    </>
  )
}

export default AddNotes