import { Dispatch, SetStateAction } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { Note } from "../../../models/Session";
import "./NotePage.css";

const NotePage = (props:{note:Note, closeState: Dispatch<SetStateAction<boolean>>}) => {

  return (
    <div className="note-page" style = {{backgroundColor: props.note.color}}>
      <div className='close-icon-div'>
            <AiOutlineClose className='close-icon' onClick={() => {
              props.closeState(false);
            }} />
            </div>
      <h1 className="note-title">{props.note.title}</h1>
      <p className="note-content">{props.note.content}</p>
    </div>  
  )
}

export default NotePage