//hotelSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchHotels = createAsyncThunk('hotels/fetchHotels', async () => {
  const response = await fetch('/api/hotels');
  return response.json();
});

const hotelSlice = createSlice({
  name: 'hotels',
  initialState: { hotels: [], status: 'idle' },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHotels.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchHotels.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.hotels = action.payload;
      })
      .addCase(fetchHotels.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export default hotelSlice.reducer;
