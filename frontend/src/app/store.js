import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import agentReducer from "../features/agents/agentSlice";
import csvReducer from "../features/csv/csvSlice";
import listReducer from "../features/lists/listSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    agent: agentReducer,
    csv: csvReducer,
    list: listReducer,
  },
});
