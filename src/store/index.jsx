import { configureStore, createSlice } from "@reduxjs/toolkit";
import { hasSelectionSupport } from "@testing-library/user-event/dist/utils";

const budget = createSlice({
  name: "chat-data",
  initialState: {
    data: {},
    user: {},
    sectionArr: [],
    showStartFrom: false,
    outcome: {
      chart: [],
      name: [],
    },
    income: {
      chart: [],
      name: [],
    },
    lineData: {
      name: "",
      subId: "",
    },
  },
  reducers: {
    outcomeChart(state, { payload }) {
      state.outcome.chart = payload;
    },
    incomeChart(state, { payload }) {
      state.income.chart = payload;
    },
    sectionName(state, { payload }) {
      state.outcome.name = payload;
    },
    sectionArr(state, { payload }) {
      state.sectionArr = payload.sectionsArr;
      state.data = payload.sectionData;
      state.user = payload.user;
    },
    lineData(state, { payload }) {
      state.lineData.name = payload.name;
      state.lineData.subId = payload.subId;
    },
    showStart(state, { payload }) {
      state.showStartFrom = payload;
    },
  },
});
export const budgetActions = budget.actions;
const store = configureStore(budget);
export default store;
