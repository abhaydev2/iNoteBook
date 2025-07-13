import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import {API_ENDPOINTS} from '../config/api.config';

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
          console.log("Error fetching notes:", error);
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
          console.log(error);
          set({ loading: false, error: error.response?.data?.message || error.message });
          return { success: false, error: error.response?.data?.message || error.message };
        }
      },

      updateNote: async (noteId, updates) => {
        set({ loading: true, error: null });
        try {
          // Map content to description for backend
          const payload = { ...updates };
          if (payload.content !== undefined) {
            payload.description = payload.content;
            delete payload.content;
          }
          const { data } = await axios.put(
            `${API_ENDPOINTS.NOTES.UPDATE}/${noteId}`,
            payload,
            { withCredentials: true }
          );
          // Map description to content for frontend compatibility
          const mappedNote = { ...data, content: data.content || data.description || '' };
          set(state => ({
            notes: state.notes.map(note =>
              note.id === noteId ? mappedNote : note
            ),
            loading: false,
          }));
          return { success: true };
        } catch (error) {
          console.log("Error updating note:", error);
          set({ loading: false, error: error.response?.data?.message || error.message });
          return { success: false, error: error.response?.data?.message || error.message };
        }
      },

      deleteNote: async (noteId) => {
        set({ loading: true, error: null });
        try {
          await axios.delete(`${API_ENDPOINTS.NOTES.DELETE}/${noteId}`, { withCredentials: true });
          set(state => ({
            notes: state.notes.filter(note => note.id !== noteId),
            loading: false,
          }));
          return { success: true };
        } catch (error) {
          console.log("Error deleting note:", error);
          set({ loading: false, error: error.response?.data?.message || error.message });
          return { success: false, error: error.response?.data?.message || error.message };
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
        
        // Sort by updated date
        return filtered.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
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