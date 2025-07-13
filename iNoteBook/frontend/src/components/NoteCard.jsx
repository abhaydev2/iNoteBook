import { useState } from 'react';
import { clsx } from 'clsx';
import useNotesStore from '../stores/notesStore';

const NoteCard = ({ note }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({
    title: note.title,
    content: note.content,
    category: note.category,
  });
  
  const { deleteNote, updateNote, loading, categories } = useNotesStore();

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      await deleteNote(note.id);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    if (!editData.title.trim() || !editData.content.trim()) {
      return;
    }
    
    const result = await updateNote(note.id, editData);
    
    if (result.success) {
      setIsEditModalOpen(false);
    }
  };

  const handleEditCancel = () => {
    setEditData({
      title: note.title,
      content: note.content,
      category: note.category,
    });
    setIsEditModalOpen(false);
  };

  const getCategoryColor = (category) => {
    const colors = {
      work: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      personal: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      ideas: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      todo: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const truncateContent = (content, maxLength = 150) => {
    if (!content) return '';
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <>
      <div className="card card-hover p-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span
              className={clsx(
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                getCategoryColor(note.category)
              )}
            >
              {note.category}
            </span>
          </div>
          
          <div className="flex items-center space-x-1">
            
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="p-1 rounded-md text-gray-400 hover:text-blue-500 transition-colors duration-200"
              title="Edit note"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            
            <button
              onClick={handleDelete}
              className="p-1 rounded-md text-gray-400 hover:text-red-500 transition-colors duration-200"
              title="Delete note"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {note.title}
        </h2>

        {/* Content */}
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
          {isExpanded ? (note.content || '') : truncateContent(note.content)}
          {(note.content && note.content.length > 150) && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="ml-2 text-primary-600 dark:text-primary-400 hover:underline text-sm font-medium"
            >
              {isExpanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>Created {formatDate(note.created_at)}</span>
          {note.updated_at !== note.created_at && (
            <span>Updated {formatDate(note.updated_at)}</span>
          )}
        </div>
      </div>

      {/* Edit Note Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Edit Note
                </h2>
                <button
                  onClick={handleEditCancel}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editData.title}
                    onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                    className="input-field"
                    placeholder="Enter note title"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    value={editData.category}
                    onChange={(e) => setEditData(prev => ({ ...prev, category: e.target.value }))}
                    className="input-field"
                  >
                    {categories.slice(1).map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Content
                  </label>
                  <textarea
                    value={editData.content}
                    onChange={(e) => setEditData(prev => ({ ...prev, content: e.target.value }))}
                    className="input-field min-h-[120px] resize-none"
                    placeholder="Write your note content here..."
                    required
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleEditCancel}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={clsx(
                      'btn-primary',
                      loading && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NoteCard;