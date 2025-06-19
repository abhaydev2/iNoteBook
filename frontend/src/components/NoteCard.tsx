import React, { useState } from 'react';
import { Edit, Trash2, Calendar, Tag } from 'lucide-react';
import { Note } from '../contexts/NotesContext';

interface NoteCardProps {
  note: Note;
  onEdit: (id: string, title: string, content: string) => void;
  onDelete: (id: string) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);
  const [editContent, setEditContent] = useState(note.content);

  const handleSave = () => {
    onEdit(note.id, editTitle, editContent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(note.title);
    setEditContent(note.content);
    setIsEditing(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 group">
      <div className="p-6">
        {isEditing ? (
          <div className="space-y-4">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full text-lg font-semibold bg-transparent border-b-2 border-blue-300 dark:border-blue-600 focus:border-blue-500 dark:focus:border-blue-400 outline-none pb-2 text-gray-900 dark:text-white"
              placeholder="Note title..."
            />
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={4}
              className="w-full bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 outline-none resize-none"
              placeholder="Write your note here..."
            />
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                {note.title}
              </h3>
              <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-lg transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(note.id)}
                  className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
              {note.content}
            </p>
            
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Tag className="h-3 w-3" />
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    note.category === 'work' 
                      ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300'
                      : 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300'
                  }`}>
                    {note.category}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{note.updatedAt.toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NoteCard;