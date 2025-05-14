import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import listService from "./listService";

const initialState = {
  lists: [],
  list: null,
  distributedList: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// Upload and distribute a list
export const uploadList = createAsyncThunk(
  "lists/upload",
  async (formData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await listService.uploadList(formData, token);
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

// Get all lists
export const getLists = createAsyncThunk(
  "lists/getAll",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await listService.getLists(token);
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

// Get list by ID
export const getListById = createAsyncThunk(
  "lists/getById",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await listService.getListById(id, token);
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

// Get agent's list items
export const getAgentListItems = createAsyncThunk(
  "lists/getAgentItems",
  async (agentId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await listService.getAgentListItems(agentId, token);
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

export const listSlice = createSlice({
  name: "list",
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
      .addCase(uploadList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(uploadList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.distributedList = action.payload.data;
      })
      .addCase(uploadList.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getLists.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getLists.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.lists = action.payload.data;
      })
      .addCase(getLists.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getListById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getListById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.list = action.payload.data;
      })
      .addCase(getListById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAgentListItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAgentListItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.list = action.payload.data;
      })
      .addCase(getAgentListItems.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = listSlice.actions;
export default listSlice.reducer;
