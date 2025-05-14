import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import agentService from "./agentService";

const initialState = {
  agents: [],
  agent: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// Create a new agent
export const createAgent = createAsyncThunk(
  "agents/create",
  async (agentData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await agentService.createAgent(agentData, token);
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

// Get all agents
export const getAgents = createAsyncThunk(
  "agents/getAll",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await agentService.getAgents(token);
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

// Get agent by ID
export const getAgentById = createAsyncThunk(
  "agents/getById",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await agentService.getAgentById(id, token);
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

// Update agent
export const updateAgent = createAsyncThunk(
  "agents/update",
  async ({ id, agentData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await agentService.updateAgent(id, agentData, token);
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

// Delete agent
export const deleteAgent = createAsyncThunk(
  "agents/delete",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await agentService.deleteAgent(id, token);
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

export const agentSlice = createSlice({
  name: "agent",
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
      .addCase(createAgent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createAgent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.agents.push(action.payload.data);
      })
      .addCase(createAgent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAgents.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAgents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.agents = action.payload.data;
      })
      .addCase(getAgents.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAgentById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAgentById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.agent = action.payload.data;
      })
      .addCase(getAgentById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateAgent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateAgent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.agents = state.agents.map((agent) =>
          agent._id === action.payload.data._id ? action.payload.data : agent
        );
      })
      .addCase(updateAgent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteAgent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteAgent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.agents = state.agents.filter(
          (agent) => agent._id !== action.meta.arg
        );
      })
      .addCase(deleteAgent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = agentSlice.actions;
export default agentSlice.reducer;
