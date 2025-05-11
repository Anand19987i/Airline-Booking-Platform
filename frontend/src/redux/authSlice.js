import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
        state.token = action.payload;
    },
     updateWallet(state, action) {
      if (state.user) {
        state.user.wallet = action.payload;
      }
    },
  },
});

export const { 
  setUser, setToken, updateWallet
} = authSlice.actions;

export default authSlice.reducer;