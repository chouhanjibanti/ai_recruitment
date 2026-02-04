import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import jobsSlice from './slices/jobsSlice';
import candidatesSlice from './slices/candidatesSlice';
import interviewsSlice from './slices/interviewsSlice';
import avatarSlice from './slices/avatarSlice';
import uiSlice from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    jobs: jobsSlice,
    candidates: candidatesSlice,
    interviews: interviewsSlice,
    avatar: avatarSlice,
    ui: uiSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
