import { createSlice } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  theme: 'light', // 'light' | 'dark'
  sidebarOpen: false,
  loading: {
    global: false,
    posts: false,
    auth: false,
    comments: false,
  },
  notifications: [],
  modals: {
    createPost: false,
    editPost: false,
    deletePost: false,
    login: false,
    register: false,
    share: false,
  },
  activeModal: null,
  activeModalData: null,
};

// Slice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    setLoading: (state, action) => {
      const { type, status } = action.payload;
      state.loading[type] = status;
    },
    addNotification: (state, action) => {
      const notification = {
        id: Date.now(),
        ...action.payload,
      };
      state.notifications.unshift(notification);
    },
    removeNotification: (state, action) => {
      const id = action.payload;
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== id
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    openModal: (state, action) => {
      const { modalType, data } = action.payload;
      state.activeModal = modalType;
      state.activeModalData = data || null;
      state.modals[modalType] = true;
    },
    closeModal: (state, action) => {
      const modalType = action.payload || state.activeModal;
      if (modalType) {
        state.modals[modalType] = false;
        state.activeModal = null;
        state.activeModalData = null;
      }
    },
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach((key) => {
        state.modals[key] = false;
      });
      state.activeModal = null;
      state.activeModalData = null;
    },
  },
});

export const {
  toggleTheme,
  setTheme,
  toggleSidebar,
  setSidebarOpen,
  setLoading,
  addNotification,
  removeNotification,
  clearNotifications,
  openModal,
  closeModal,
  closeAllModals,
} = uiSlice.actions;

export default uiSlice.reducer;