import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';

interface AvatarState {
  isVisible: boolean;
  isSpeaking: boolean;
  isListening: boolean;
  currentExpression: string;
  currentAnimation: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  mood: 'neutral' | 'happy' | 'thinking' | 'confused' | 'impressed';
  lipSyncEnabled: boolean;
  gestureEnabled: boolean;
  backgroundColor: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: AvatarState = {
  isVisible: true,
  isSpeaking: false,
  isListening: false,
  currentExpression: 'neutral',
  currentAnimation: 'idle',
  position: { x: 50, y: 50 }, // Percentage
  size: { width: 300, height: 400 },
  mood: 'neutral',
  lipSyncEnabled: true,
  gestureEnabled: true,
  backgroundColor: '#f0f9ff',
  isLoading: false,
  error: null,
};

// Async thunks
export const triggerAvatarAnimationAsync = createAsyncThunk(
  'avatar/triggerAnimation',
  async ({ animation, parameters }: { animation: string; parameters?: any }) => {
    // Mock API call - replace with actual API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return { animation, parameters };
  }
);

export const setAvatarExpressionAsync = createAsyncThunk(
  'avatar/setExpression',
  async (expression: string) => {
    // Mock API call - replace with actual API
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return expression;
  }
);

export const getAvatarStateAsync = createAsyncThunk(
  'avatar/getState',
  async () => {
    // Mock API call - replace with actual API
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return {
      expression: 'neutral',
      animation: 'idle',
      mood: 'neutral' as const,
      isVisible: true,
    };
  }
);

export const startSpeakingAsync = createAsyncThunk(
  'avatar/startSpeaking',
  async (text: string) => {
    // Mock TTS API call - replace with actual API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { text, duration: text.length * 100 }; // Mock duration
  }
);

export const stopSpeakingAsync = createAsyncThunk(
  'avatar/stopSpeaking',
  async () => {
    // Mock API call - replace with actual API
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return true;
  }
);

const avatarSlice = createSlice({
  name: 'avatar',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    toggleVisibility: (state) => {
      state.isVisible = !state.isVisible;
    },
    setVisibility: (state, action: PayloadAction<boolean>) => {
      state.isVisible = action.payload;
    },
    setSpeaking: (state, action: PayloadAction<boolean>) => {
      state.isSpeaking = action.payload;
      if (!action.payload) {
        state.currentAnimation = 'idle';
      }
    },
    setListening: (state, action: PayloadAction<boolean>) => {
      state.isListening = action.payload;
      if (action.payload) {
        state.currentExpression = 'attentive';
        state.currentAnimation = 'listening';
      } else {
        state.currentExpression = 'neutral';
        state.currentAnimation = 'idle';
      }
    },
    setMood: (state, action: PayloadAction<AvatarState['mood']>) => {
      state.mood = action.payload;
      
      // Update expression based on mood
      const moodToExpression = {
        neutral: 'neutral',
        happy: 'smiling',
        thinking: 'thoughtful',
        confused: 'confused',
        impressed: 'impressed',
      };
      
      state.currentExpression = moodToExpression[action.payload];
    },
    setPosition: (state, action: PayloadAction<{ x: number; y: number }>) => {
      state.position = action.payload;
    },
    setSize: (state, action: PayloadAction<{ width: number; height: number }>) => {
      state.size = action.payload;
    },
    setBackgroundColor: (state, action: PayloadAction<string>) => {
      state.backgroundColor = action.payload;
    },
    toggleLipSync: (state) => {
      state.lipSyncEnabled = !state.lipSyncEnabled;
    },
    toggleGesture: (state) => {
      state.gestureEnabled = !state.gestureEnabled;
    },
    resetAvatar: (state) => {
      return initialState;
    },
    // Real-time updates (from WebSocket)
    updateFromWebSocket: (state, action: PayloadAction<{
      type: 'speaking' | 'listening' | 'expression' | 'animation' | 'mood';
      value: any;
    }>) => {
      const { type, value } = action.payload;
      
      switch (type) {
        case 'speaking':
          state.isSpeaking = value;
          if (value) {
            state.currentAnimation = 'speaking';
          } else {
            state.currentAnimation = 'idle';
          }
          break;
        case 'listening':
          state.isListening = value;
          if (value) {
            state.currentExpression = 'attentive';
            state.currentAnimation = 'listening';
          } else {
            state.currentExpression = 'neutral';
            state.currentAnimation = 'idle';
          }
          break;
        case 'expression':
          state.currentExpression = value;
          break;
        case 'animation':
          state.currentAnimation = value;
          break;
        case 'mood':
          state.mood = value;
          break;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Trigger Animation
      .addCase(triggerAvatarAnimationAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(triggerAvatarAnimationAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentAnimation = action.payload.animation;
      })
      .addCase(triggerAvatarAnimationAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to trigger animation';
      })
      // Set Expression
      .addCase(setAvatarExpressionAsync.fulfilled, (state, action) => {
        state.currentExpression = action.payload;
      })
      // Get State
      .addCase(getAvatarStateAsync.fulfilled, (state, action) => {
        state.currentExpression = action.payload.expression;
        state.currentAnimation = action.payload.animation;
        state.mood = action.payload.mood;
        state.isVisible = action.payload.isVisible;
      })
      // Start Speaking
      .addCase(startSpeakingAsync.pending, (state) => {
        state.isLoading = true;
        state.isSpeaking = true;
        state.currentAnimation = 'speaking';
        state.currentExpression = 'speaking';
      })
      .addCase(startSpeakingAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        // Auto-stop speaking after duration
        setTimeout(() => {
          state.isSpeaking = false;
          state.currentAnimation = 'idle';
          state.currentExpression = 'neutral';
        }, action.payload.duration);
      })
      .addCase(startSpeakingAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isSpeaking = false;
        state.currentAnimation = 'idle';
        state.currentExpression = 'neutral';
        state.error = action.error.message || 'Failed to start speaking';
      })
      // Stop Speaking
      .addCase(stopSpeakingAsync.fulfilled, (state) => {
        state.isSpeaking = false;
        state.currentAnimation = 'idle';
        state.currentExpression = 'neutral';
      });
  },
});

export const {
  clearError,
  toggleVisibility,
  setVisibility,
  setSpeaking,
  setListening,
  setMood,
  setPosition,
  setSize,
  setBackgroundColor,
  toggleLipSync,
  toggleGesture,
  resetAvatar,
  updateFromWebSocket,
} = avatarSlice.actions;

// Selectors
export const selectAvatar = (state: { avatar: AvatarState }) => state.avatar;
export const selectAvatarVisibility = (state: { avatar: AvatarState }) => state.avatar.isVisible;
export const selectAvatarSpeaking = (state: { avatar: AvatarState }) => state.avatar.isSpeaking;
export const selectAvatarListening = (state: { avatar: AvatarState }) => state.avatar.isListening;
export const selectAvatarExpression = (state: { avatar: AvatarState }) => state.avatar.currentExpression;
export const selectAvatarAnimation = (state: { avatar: AvatarState }) => state.avatar.currentAnimation;
export const selectAvatarMood = (state: { avatar: AvatarState }) => state.avatar.mood;
export const selectAvatarPosition = (state: { avatar: AvatarState }) => state.avatar.position;
export const selectAvatarSize = (state: { avatar: AvatarState }) => state.avatar.size;
export const selectAvatarLoading = (state: { avatar: AvatarState }) => state.avatar.isLoading;
export const selectAvatarError = (state: { avatar: AvatarState }) => state.avatar.error;

export default avatarSlice.reducer;
