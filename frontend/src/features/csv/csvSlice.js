import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import csvService from "./csvService";

const initialState = {
  distributions: {},
  distributionHistory: {},
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// Upload CSV and distribute tasks
export const uploadCsv = createAsyncThunk(
  "csv/upload",
  async (csvData, thunkAPI) => {
    try {
      return await csvService.uploadCsv(csvData);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get distributions by agent
export const getDistributions = createAsyncThunk(
  "csv/getDistributions",
  async (_, thunkAPI) => {
    try {
      return await csvService.getDistributions();
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const csvSlice = createSlice({
  name: "csv",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadCsv.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(uploadCsv.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.distributions = action.payload.data;
      })
      .addCase(uploadCsv.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getDistributions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDistributions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.distributionHistory = action.payload.data;
      })
      .addCase(getDistributions.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = csvSlice.actions;
export default csvSlice.reducer;
