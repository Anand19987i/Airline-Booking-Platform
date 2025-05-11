import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  flight: [],
  singleFlight: {},
};

const flightSlice = createSlice({
  name: 'flight',
  initialState,
  reducers: {
    setFlight: (state, action) => {
      state.flight = action.payload;
    },
    setSingleFlight: (state, action) => {
        state.singleFlight = action.payload;
    }
  },
});

export const { 
  setFlight, 
  setSingleFlight,
} = flightSlice.actions;

export default flightSlice.reducer;