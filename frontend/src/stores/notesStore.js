import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import API_ENDPOINTS from '../config/api.config';

const useNotesStore = create(
  persist(
    (set, get) => ({
      // State
      notes: [],
      loading: false,
      error: null,
      searchTerm: '',
      selectedCategory: 'all',
      
      // Dummy categories
      categories: [
        { id: 'all', name: 'All Notes', color: 'gray' },
        { id: 'work', name: 'Work', color: 'blue' },
        { id: 'personal', name: 'Personal', color: 'green' },
        { id: 'ideas', name: 'Ideas', color: 'purple' },
        { id: 'todo', name: 'To Do', color: 'red' },
      ],

      // Actions
      fetchNotes: async () => {
        set({ loading: true, error: null });
        try {
          const { data } = await axios.get(API_ENDPOINTS.NOTES.GET_ALL, { withCredentials: true });
          // Map description to content for frontend compatibility
          const mappedNotes = Array.isArray(data)
            ? data.map(note => ({ ...note, content: note.content || note.description || '' }))
            : [];
          set({ notes: mappedNotes, loading: false });
          return { success: true, notes: mappedNotes };
        } catch (error) {
          set({ loading: false, error: error.response?.data?.message || error.message });
          return { success: false, error: error.response?.data?.message || error.message };
        }
      },

      addNote: async (noteData) => {
        set({ loading: true, error: null });
        try {
          const { data } = await axios.post(API_ENDPOINTS.NOTES.CREATE, noteData, { withCredentials: true });
          // Map description to content for frontend compatibility
          const mappedNote = { ...data, content: data.content || data.description || '' };
          set(state => ({
            notes: [mappedNote, ...state.notes],
            loading: false,
          }));
          return { success: true, note: mappedNote };
        } catch (error) {
          set({ loading: false, error: error.response?.data?.message || error.message });
          return { success: false, error: error.response?.data?.message || error.message };
        }
      },

      updateNote: async (noteId, updates) => {
        set({ loading: true, error: null });
        
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set(state => ({
            notes: state.notes.map(note =>
              note.id === noteId
                ? { ...note, ...updates, updatedAt: new Date().toISOString() }
                : note
            ),
            loading: false,
          }));
          
          return { success: true };
        } catch (error) {
          set({ loading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      deleteNote: async (noteId) => {
        set({ loading: true, error: null });
        
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set(state => ({
            notes: state.notes.filter(note => note.id !== noteId),
            loading: false,
          }));
          
          return { success: true };
        } catch (error) {
          set({ loading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      togglePin: async (noteId) => {
        const { notes, updateNote } = get();
        const note = notes.find(n => n.id === noteId);
        if (note) {
          return await updateNote(noteId, { isPinned: !note.isPinned });
        }
      },

      // Search and filter
      setSearchTerm: (term) => set({ searchTerm: term }),
      setSelectedCategory: (category) => set({ selectedCategory: category }),

      // Get filtered notes
      getFilteredNotes: () => {
        const { notes, searchTerm, selectedCategory } = get();
        
        let filtered = notes;
        
        // Filter by category
        if (selectedCategory !== 'all') {
          filtered = filtered.filter(note => note.category === selectedCategory);
        }
        
        // Filter by search term
        if (searchTerm) {
          filtered = filtered.filter(note =>
            note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            note.content.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        
        // Sort by pinned first, then by updatedAt
        return filtered.sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'notes-storage',
      partialize: (state) => ({
        notes: state.notes,
        selectedCategory: state.selectedCategory,
      }),
    }
  )
);

export default useNotesStore;