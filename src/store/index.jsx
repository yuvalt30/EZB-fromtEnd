import { configureStore, createSlice } from "@reduxjs/toolkit";

const budget = createSlice({
  name: "chat-data",
  initialState: {
    data: {},
    user: localStorage.getItem("user"),
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
    performanceTotal: 0,
    plannedIncome: [],
    plannedOutcome: [],
  },
  reducers: {
    outcomeChart(state, { payload }) {
      payload.chart && (state.outcome.chart = payload.chart);
      payload.name && (state.outcome.name = payload.name);
    },
    incomeChart(state, { payload }) {
      payload.chart && (state.income.chart = payload.chart);
      payload.name && (state.income.name = payload.name);
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
    performanceTotal(state, { payload }) {
      state.performanceTotal = payload;
    },
    plannedIncome(state, { payload }) {
      state.plannedIncome = payload;
    },
    plannedOutcome(state, { payload }) {
      state.plannedOutcome = payload;
    },
  },
});
export const budgetActions = budget.actions;
const store = configureStore(budget);
export default store;
