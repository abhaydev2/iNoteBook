import React, { useState } from 'react';
import { Plus, Search, Filter, StickyNote, Briefcase, User } from 'lucide-react';
import Header from '../components/Header';
import NoteCard from '../components/NoteCard';
import { useNotes } from '../contexts/NotesContext';

const NotesPage: React.FC = () => {
  const { notes, addNote, updateNote, deleteNote, getPersonalNotes, getWorkNotes } = useNotes();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    category: 'personal' as 'personal' | 'work'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'personal' | 'work'>('all');

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNote.title.trim() && newNote.content.trim()) {
      addNote(newNote.title, newNote.content, newNote.category);
      setNewNote({ title: '', content: '', category: 'personal' });
      setShowAddForm(false);
    }
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || note.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const personalNotes = getPersonalNotes();
  const workNotes = getWorkNotes();

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Notes
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Organize your thoughts and ideas in one place
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center">
              <StickyNote className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{notes.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Notes</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center">
              <User className="h-8 w-8 text-green-600 dark:text-green-400 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{personalNotes.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Personal Notes</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center">
              <Briefcase className="h-8 w-8 text-purple-600 dark:text-purple-400 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{workNotes.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Work Notes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value as 'all' | 'personal' | 'work')}
                  className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Categories</option>
                  <option value="personal">Personal</option>
                  <option value="work">Work</option>
                </select>
              </div>
              
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-300 shadow-lg"
              >
                <Plus className="h-5 w-5" />
                <span>Add Note</span>
              </button>
            </div>
          </div>
        </div>

        {/* Add Note Form */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Add New Note
              </h2>
              
              <form onSubmit={handleAddNote} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newNote.title}
                    onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter note title..."
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={newNote.category}
                    onChange={(e) => setNewNote({ ...newNote, category: e.target.value as 'personal' | 'work' })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="personal">Personal</option>
                    <option value="work">Work</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Content
                  </label>
                  <textarea
                    value={newNote.content}
                    onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                    placeholder="Write your note here..."
                    required
                  />
                </div>
                
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Add Note
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setNewNote({ title: '', content: '', category: 'personal' });
                    }}
                    className="flex-1 py-2 px-4 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Notes Grid */}
        {filteredNotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={updateNote}
                onDelete={deleteNote}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <StickyNote className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchTerm || filterCategory !== 'all' ? 'No notes found' : 'No notes yet'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm || filterCategory !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Start by creating your first note'
              }
            </p>
            {!searchTerm && filterCategory === 'all' && (
              <button
                onClick={() => setShowAddForm(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-300 shadow-lg"
              >
                Create Your First Note
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default NotesPage;