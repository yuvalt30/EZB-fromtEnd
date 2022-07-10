import React, { useEffect, useId, useState } from "react";
import { Icon } from "@iconify/react";
import { useDispatch, useSelector } from "react-redux";
import { budgetActions } from "../../store";
import { monthNo } from "./Reflection";

const monthPercentage = [8, 17, 25, 33, 42, 50, 58, 67, 75, 83, 92, 100];

export default function SubSummary({ setShow, data = [], monthIndex }) {
  const summary = useSelector((state) => state.summary);
  console.log(summary);
  return (
    <>
      <div className="table">
        <h2>summary</h2>
        <div className="fixTableHead">
          <table align="center" border={1} cellSpacing={0} cellPadding={5}>
            <thead>
              <tr>
                <td>Section</td>
                <td className="plan_budget_data">1</td>
                <td className="execution">2</td>
                {data.summary.map((value, i) => {
                  return (
                    <td key={"c" + i} className="monthly_budget">
                      {i + 1}
                    </td>
                  );
                })}
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Section</td>
                <td className="plan_budget_data">
                  {summary.income.avg - summary.outcome.avg}
                </td>
                <td className="execution">
                  {summary.income.performance - summary.outcome.performance}
                </td>
                {data?.summary.map((value, i) => {
                  return <td>{value}</td>;
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
