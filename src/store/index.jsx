import { configureStore, createSlice } from "@reduxjs/toolkit";

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
      state.outcome.chart = payload.chart;
      state.outcome.name = payload.name;
    },
    incomeChart(state, { payload }) {
      state.income.chart = payload.chart;
      state.income.name = payload.name;
      console.log(payload);
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
