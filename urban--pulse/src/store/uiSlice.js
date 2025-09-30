import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { firebaseService } from '../services/firebaseService/firebaseService';

export const CurrentUser = createAsyncThunk ('currentUser/', async () => {
    return await firebaseService.getCurrentUserFullName();
});

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    isAuthOpenModal: false,
    isViewModal: false,
    formError: '',
    isSignIn: true,
    userName: 'User',
    setTimeoutId: null,
  },
  reducers: {
    openAuthModal(state) { state.isAuthOpenModal = true; },
    closeAuthModal(state) { state.isAuthOpenModal = false; },
    openViewModal(state) { state.isViewModal = true; },
    closeViewModal(state) { state.isViewModal = false; },
    signInMode(state) { state.isSignIn = true; },
    signUpMode(state) { state.isSignIn = false; },

    setFormError(state, action) { state.formError = action.payload; },
    resetAllModals(state) {
      state.isAuthOpenModal = false;
      state.isViewModal = false;
      state.formError = '';
    },

   /* SetTimeout(state) { 
      this.clearTimeout(state);
      state.setTimeoutId = setTimeout(() => {
        state.formError = '';
        state.setTimeoutId = null;
      }, 3500);
    },

    clearTimeout(state) {
      if (state.setTimeoutId) {
        clearTimeout(state.setTimeoutId);
        state.setTimeoutId = null;
    }
  },*/
  extraReducers: (builder) => {
    builder
      .addCase(CurrentUser.pending, (state) => {
        state.userName = 'User';
      })
      .addCase(CurrentUser.fulfilled, (state, action) => {
        state.userName = action.payload || 'User';
      })},
    }}
);

export const { openAuthModal, closeAuthModal, openViewModal, closeViewModal, setFormError, resetAllModals, isSignIn, signInMode, signUpMode, userName, SetTimeout, clearTimeout, setTimeoutId } = uiSlice.actions;
export default uiSlice.reducer;
