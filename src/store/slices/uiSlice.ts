import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  theme: 'light' | 'dark' | 'system';
  sidebarOpen: boolean;
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
  }>;
  modals: {
    createJob: boolean;
    editCandidate: boolean;
    interviewSettings: boolean;
    userProfile: boolean;
  };
  loading: {
    global: boolean;
    jobs: boolean;
    candidates: boolean;
    interviews: boolean;
  };
  currentPage: string;
  breadcrumbs: Array<{
    label: string;
    path: string;
  }>;
  searchQuery: string;
  selectedItems: string[]; // For bulk operations
}

const initialState: UIState = {
  theme: 'system',
  sidebarOpen: true,
  notifications: [],
  modals: {
    createJob: false,
    editCandidate: false,
    interviewSettings: false,
    userProfile: false,
  },
  loading: {
    global: false,
    jobs: false,
    candidates: false,
    interviews: false,
  },
  currentPage: 'dashboard',
  breadcrumbs: [
    { label: 'Dashboard', path: '/' },
  ],
  searchQuery: '',
  selectedItems: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<UIState['theme']>) => {
      state.theme = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    addNotification: (state, action: PayloadAction<Omit<UIState['notifications'][0], 'id' | 'timestamp' | 'read'>>) => {
      const notification = {
        ...action.payload,
        id: `notification-${Date.now()}`,
        timestamp: new Date().toISOString(),
        read: false,
      };
      state.notifications.unshift(notification);
      
      // Keep only last 50 notifications
      if (state.notifications.length > 50) {
        state.notifications = state.notifications.slice(0, 50);
      }
    },
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    markAllNotificationsAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.read = true;
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    openModal: (state, action: PayloadAction<keyof UIState['modals']>) => {
      state.modals[action.payload] = true;
    },
    closeModal: (state, action: PayloadAction<keyof UIState['modals']>) => {
      state.modals[action.payload] = false;
    },
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach(key => {
        state.modals[key as keyof UIState['modals']] = false;
      });
    },
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.global = action.payload;
    },
    setJobsLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.jobs = action.payload;
    },
    setCandidatesLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.candidates = action.payload;
    },
    setInterviewsLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.interviews = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<string>) => {
      state.currentPage = action.payload;
    },
    setBreadcrumbs: (state, action: PayloadAction<UIState['breadcrumbs']>) => {
      state.breadcrumbs = action.payload;
    },
    addBreadcrumb: (state, action: PayloadAction<{ label: string; path: string }>) => {
      const exists = state.breadcrumbs.find(bc => bc.path === action.payload.path);
      if (!exists) {
        state.breadcrumbs.push(action.payload);
      }
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearSearchQuery: (state) => {
      state.searchQuery = '';
    },
    toggleSelectedItem: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      const index = state.selectedItems.indexOf(itemId);
      if (index > -1) {
        state.selectedItems.splice(index, 1);
      } else {
        state.selectedItems.push(itemId);
      }
    },
    setSelectedItems: (state, action: PayloadAction<string[]>) => {
      state.selectedItems = action.payload;
    },
    clearSelectedItems: (state) => {
      state.selectedItems = [];
    },
    selectAllItems: (state, action: PayloadAction<string[]>) => {
      state.selectedItems = action.payload;
    },
  },
});

export const {
  setTheme,
  toggleSidebar,
  setSidebarOpen,
  addNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  removeNotification,
  clearNotifications,
  openModal,
  closeModal,
  closeAllModals,
  setGlobalLoading,
  setJobsLoading,
  setCandidatesLoading,
  setInterviewsLoading,
  setCurrentPage,
  setBreadcrumbs,
  addBreadcrumb,
  setSearchQuery,
  clearSearchQuery,
  toggleSelectedItem,
  setSelectedItems,
  clearSelectedItems,
  selectAllItems,
} = uiSlice.actions;

// Selectors
export const selectUI = (state: { ui: UIState }) => state.ui;
export const selectTheme = (state: { ui: UIState }) => state.ui.theme;
export const selectSidebarOpen = (state: { ui: UIState }) => state.ui.sidebarOpen;
export const selectNotifications = (state: { ui: UIState }) => state.ui.notifications;
export const selectUnreadNotifications = (state: { ui: UIState }) => 
  state.ui.notifications.filter(n => !n.read);
export const selectUnreadNotificationCount = (state: { ui: UIState }) => 
  state.ui.notifications.filter(n => !n.read).length;
export const selectModals = (state: { ui: UIState }) => state.ui.modals;
export const selectLoading = (state: { ui: UIState }) => state.ui.loading;
export const selectGlobalLoading = (state: { ui: UIState }) => state.ui.loading.global;
export const selectCurrentPage = (state: { ui: UIState }) => state.ui.currentPage;
export const selectBreadcrumbs = (state: { ui: UIState }) => state.ui.breadcrumbs;
export const selectSearchQuery = (state: { ui: UIState }) => state.ui.searchQuery;
export const selectSelectedItems = (state: { ui: UIState }) => state.ui.selectedItems;
export const selectSelectedItemsCount = (state: { ui: UIState }) => state.ui.selectedItems.length;

export default uiSlice.reducer;
