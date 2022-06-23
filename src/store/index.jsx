import { configureStore, createSlice } from "@reduxjs/toolkit";
import { hasSelectionSupport } from "@testing-library/user-event/dist/utils";

const budget = createSlice({
  name: "chat-data",
  initialState: {
    data: {},
    user: {},
    sectionArr: [],
    outcome: {
      chart: [],
      name: [],
    },
  },
  reducers: {
    outcomeChart(state, { payload }) {
      state.outcome.chart = payload;
    },
    sectionName(state, { payload }) {
      state.outcome.name = payload;
    },
    sectionArr(state, { payload }) {
      state.sectionArr = payload.sectionsArr;
      state.data = payload.sectionData;
      state.user = payload.user;
    },
  },
});
export const budgetActions = budget.actions;
const store = configureStore(budget);
export default store;
