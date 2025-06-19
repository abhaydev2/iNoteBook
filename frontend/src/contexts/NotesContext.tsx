import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Note {
  id: string;
  title: string;
  content: string;
  category: 'personal' | 'work';
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

interface NotesContextType {
  notes: Note[];
  deletedNotes: Note[];
  addNote: (title: string, content: string, category: 'personal' | 'work') => void;
  updateNote: (id: string, title: string, content: string) => void;
  deleteNote: (id: string) => void;
  restoreNote: (id: string) => void;
  permanentlyDeleteNote: (id: string) => void;
  getPersonalNotes: () => Note[];
  getWorkNotes: () => Note[];
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [deletedNotes, setDeletedNotes] = useState<Note[]>([]);

  useEffect(() => {
    const savedNotes = localStorage.getItem('notes');
    const savedDeletedNotes = localStorage.getItem('deletedNotes');
    
    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes).map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt)
      }));
      setNotes(parsedNotes);
    }
    
    if (savedDeletedNotes) {
      const parsedDeletedNotes = JSON.parse(savedDeletedNotes).map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt)
      }));
      setDeletedNotes(parsedDeletedNotes);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('deletedNotes', JSON.stringify(deletedNotes));
  }, [deletedNotes]);

  const addNote = (title: string, content: string, category: 'personal' | 'work') => {
    const newNote: Note = {
      id: Date.now().toString(),
      title,
      content,
      category,
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false
    };
    
    setNotes(prev => [newNote, ...prev]);
  };

  const updateNote = (id: string, title: string, content: string) => {
    setNotes(prev => prev.map(note => 
      note.id === id 
        ? { ...note, title, content, updatedAt: new Date() }
        : note
    ));
  };

  const deleteNote = (id: string) => {
    const noteToDelete = notes.find(note => note.id === id);
    if (noteToDelete) {
      setDeletedNotes(prev => [{ ...noteToDelete, isDeleted: true }, ...prev]);
      setNotes(prev => prev.filter(note => note.id !== id));
    }
  };

  const restoreNote = (id: string) => {
    const noteToRestore = deletedNotes.find(note => note.id === id);
    if (noteToRestore) {
      setNotes(prev => [{ ...noteToRestore, isDeleted: false }, ...prev]);
      setDeletedNotes(prev => prev.filter(note => note.id !== id));
    }
  };

  const permanentlyDeleteNote = (id: string) => {
    setDeletedNotes(prev => prev.filter(note => note.id !== id));
  };

  const getPersonalNotes = () => notes.filter(note => note.category === 'personal');
  const getWorkNotes = () => notes.filter(note => note.category === 'work');

  return (
    <NotesContext.Provider value={{
      notes,
      deletedNotes,
      addNote,
      updateNote,
      deleteNote,
      restoreNote,
      permanentlyDeleteNote,
      getPersonalNotes,
      getWorkNotes
    }}>
      {children}
    </NotesContext.Provider>
  );
};