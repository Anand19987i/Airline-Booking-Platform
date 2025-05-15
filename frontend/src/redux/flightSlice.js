import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  flight: [],
  singleFlight: {},
  flightInput: {}
  
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
    },
    setFlightInput: (state, action) => {
        state.flightInput = action.payload;
    }
  },
});

export const { 
  setFlight, 
  setSingleFlight,
  setFlightInput
} = flightSlice.actions;

export default flightSlice.reducer;