import React, { useState } from 'react';
import { Trash2, RotateCcw, X, AlertTriangle, Calendar, Tag } from 'lucide-react';
import Header from '../components/Header';
import { useNotes } from '../contexts/NotesContext';

const RecycleBinPage: React.FC = () => {
  const { deletedNotes, restoreNote, permanentlyDeleteNote } = useNotes();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const handlePermanentDelete = (id: string) => {
    permanentlyDeleteNote(id);
    setShowDeleteConfirm(null);
  };

  const handleRestore = (id: string) => {
    restoreNote(id);
  };

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Trash2 className="h-8 w-8 text-red-600 dark:text-red-400 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Recycle Bin
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Restore or permanently delete your notes
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-8">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-amber-800 dark:text-amber-300">
                Notes in Recycle Bin
              </h3>
              <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                Deleted notes are stored here temporarily. You can restore them or permanently delete them.
                Permanently deleted notes cannot be recovered.
              </p>
            </div>
          </div>
        </div>

        {/* Deleted Notes */}
        {deletedNotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deletedNotes.map((note) => (
              <div
                key={note.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 group relative overflow-hidden"
              >
                {/* Deleted overlay */}
                <div className="absolute top-0 left-0 right-0 bg-red-100 dark:bg-red-900/50 px-4 py-2 text-xs text-red-700 dark:text-red-300 font-medium text-center">
                  Deleted Note
                </div>
                
                <div className="p-6 pt-12">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 opacity-75">
                      {note.title}
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 opacity-75">
                    {note.content}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
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
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleRestore(note.id)}
                      className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      <RotateCcw className="h-4 w-4" />
                      <span>Restore</span>
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(note.id)}
                      className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      <X className="h-4 w-4" />
                      <span>Delete Forever</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="relative inline-block">
              <Trash2 className="h-24 w-24 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg font-bold">✓</span>
                </div>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Recycle Bin is Empty
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Great! You don't have any deleted notes. When you delete notes, 
              they will appear here so you can restore them if needed.
            </p>
          </div>
        )}

        {/* Permanent Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/50 mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Permanently Delete Note
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  This action cannot be undone. The note will be permanently deleted 
                  and cannot be recovered.
                </p>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => handlePermanentDelete(showDeleteConfirm)}
                    className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Delete Forever
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="flex-1 py-2 px-4 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default RecycleBinPage;