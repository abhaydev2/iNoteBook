import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
      fetchNotes: async (userId) => {
        set({ loading: true, error: null });
        
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 800));
          
          // Dummy notes data - in real app, this would be an API call
          const dummyNotes = [
            {
              id: 1,
              title: 'Welcome to NoteMaker!',
              content: 'This is your first note. You can create, edit, and delete notes to organize your thoughts and ideas.',
              category: 'personal',
              createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
              updatedAt: new Date(Date.now() - 86400000).toISOString(),
              isPinned: true,
            },
            {
              id: 2,
              title: 'Meeting Notes - Q1 Planning',
              content: 'Discuss quarterly goals, budget allocation, and team expansion plans. Key points: increase revenue by 15%, hire 2 new developers, launch mobile app.',
              category: 'work',
              createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
              updatedAt: new Date(Date.now() - 172800000).toISOString(),
              isPinned: false,
            },
            {
              id: 3,
              title: 'Recipe Ideas',
              content: 'Try making pasta with homemade pesto, grilled chicken with herbs, and chocolate chip cookies for dessert.',
              category: 'personal',
              createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
              updatedAt: new Date(Date.now() - 259200000).toISOString(),
              isPinned: false,
            },
            {
              id: 4,
              title: 'App Feature Ideas',
              content: 'Add dark mode toggle, implement search functionality, create note categories, add export options.',
              category: 'ideas',
              createdAt: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
              updatedAt: new Date(Date.now() - 345600000).toISOString(),
              isPinned: false,
            },
          ];
          
          set({ notes: dummyNotes, loading: false });
          
          return { success: true, notes: dummyNotes };
        } catch (error) {
          set({ loading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },

      addNote: async (noteData) => {
        set({ loading: true, error: null });
        
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const newNote = {
            id: Date.now(),
            ...noteData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isPinned: false,
          };
          
          set(state => ({
            notes: [newNote, ...state.notes],
            loading: false,
          }));
          
          return { success: true, note: newNote };
        } catch (error) {
          set({ loading: false, error: error.message });
          return { success: false, error: error.message };
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