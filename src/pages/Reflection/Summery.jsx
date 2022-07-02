import axios from "axios";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { monthPercentage } from "./Outcome";

export default function Summery({ data, monthIndex }) {
  const { plannedOutcome, plannedIncome } = useSelector((state) => {
    return {
      plannedIncome: state.plannedIncome,
      plannedOutcome: state.plannedOutcome,
    };
  });

  return (
    <div className="table">
      <h2>Summery</h2>
      <div className="fixTableHead">
        <table cellSpacing={0}>
          <thead>
            <tr>
              <td>section</td>
              <td className="plan_budget_data">planned income</td>
              <td className="execution">planned outcome</td>
              <td>planned balance</td>
              <td>current balance</td>
              <td>% of planned</td>
              <td>% gap of current month</td>
            </tr>
          </thead>
          <tbody>
            {data.map((value) => {
              let outcome;
              let income;
              plannedOutcome.forEach((plan) => {
                plan.name === value.section && (outcome = plan.value);
              });
              plannedIncome.forEach((plan) => {
                plan.name === value.section && (income = plan.value);
              });
              const planBudget =
                (value.incomeBudget || 0) - (value.outcomeBudget || 0);
              const current = (income || 0) - (outcome || 0);
              const percent =
                planBudget !== 0
                  ? ((current / planBudget) * 100).toFixed(2)
                  : 0;
              return (
                <tr key={Math.random() * 100 + "az"}>
                  <td>{value.section}</td>
                  <td>{value.incomeBudget || 0}</td>
                  <td>{value.outcomeBudget || 0}</td>
                  <td>{planBudget}</td>
                  <td>{current}</td>
                  <td>{planBudget !== 0 ? percent : 0}%</td>
                  <td>{monthPercentage[monthIndex] - percent}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
