import NoteContext from "./NoteContext";
import { useState } from "react";

const NoteState = (props) => {
  const host = "http://localhost:3000";
  const notesInitial = [];
  const [notes, setnotes] = useState(notesInitial);
  //get all notes
  const getNotes = async () => {
    //api call
    const response = await fetch(`${host}/api/notes/fetchnotes`, {
      headers: {
        "Content-Type": "application/json",
        "auth-token":
         localStorage.getItem('token'),
      },
    });
    const data = await response.json();
    // console.log(data);
    setnotes(data);
  };
  //Add a note
  const addNote = async (title, tag, description) => {
    try {
      const response = await fetch(`${host}/api/notes/addnotes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem('token'),
        },
        body: JSON.stringify({ title, description, tag }),
      });
      const data = await response.json();
      if (response.ok) {
        setnotes(notes.concat(data));
        return { success: true };
      } else {
        return { success: false, errors: data.errors || [data.error] };
      }
    } catch (err) {
      return { success: false, errors: [err.message] };
    }
  };
  //Delete Note
  const deleteNote = async (id) => {
    //todo: api call
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token":
         localStorage.getItem('token'),
      },
    });
    const data = await response.json();
    console.log(data);
 
    console.log("deleting the note with id " + id);
    const newNotes = notes.filter((note) => {
      return note._id !== id;
    });
    setnotes(newNotes);
  };

  //Edit a note
  const editNote = async (id, title, description, tag) => {
    //todo: api call
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token":
         localStorage.getItem('token'),
      },
      body: JSON.stringify({ title, description, tag }),
    });
    const result = await response.json();
    console.log(result);

    // Update the note in the client state with the updated note from backend
    const updatedNote = result.note;
    const latestNotes = notes.map((note) =>
      note._id === id ? updatedNote : note
    );
    setnotes(latestNotes);
  };

  return (
    <NoteContext.Provider
      value={{ notes, addNote, deleteNote, editNote, getNotes }}>
      {props.children}
       
    </NoteContext.Provider>
  );
};

export default NoteState;
