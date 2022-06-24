import React, { useEffect, useId, useState } from "react";
import { Icon } from "@iconify/react";
import { useDispatch } from "react-redux";
import { budgetActions } from "../../store";
import Settings from "../Settings/Settings";
import { monthNo } from "./Reflection";

const monthPercentage = [8, 17, 25, 33, 42, 50, 58, 67, 75, 83, 92, 100];

export default function Income({ setShow, data, monthIndex }) {
  const [monthAVG, setMonthAVG] = useState(0);
  const [monthSum, setMonthSum] = useState([]);
  const [monthTotal, setMonthTotal] = useState(0);
  const [performanceTotal, setPerformanceTotal] = useState(0);
  const [charts, setCharts] = useState([]);
  const [sectionName, setSectionName] = useState([]);
  const [startMonth, setStartMonth] = useState(
    JSON.parse(localStorage.getItem("user")).startMonth
  );
  const [months, setMonths] = useState(monthNo);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(budgetActions.incomeChart(charts));
  }, [charts]);

  useEffect(() => {
    let percentageSum = 0;
    data.income.forEach((value) => {
      for (let i = 0; i <= monthIndex; i++) {
        percentageSum += value.income[i];
      }
    });
    const monthAVGSum = percentageSum / (monthIndex + 1);
    setMonthAVG(() =>
      String(monthAVGSum).includes(".") ? monthAVGSum.toFixed(2) : monthAVGSum
    );
    setPerformanceTotal(percentageSum);
  }, [monthIndex]);

  useEffect(() => {
    const monthBudget = [];
    let monthSumTotal = 0;
    data.income.forEach((value, i) => {
      monthBudget.push(value.income);
      monthSumTotal += value.incomeBudget;
      setSectionName((p) => {
        // dispatch(budgetActions.sectionName([...p, value.section]));
        return [...p, value.section];
      });
    });
    setMonthTotal(monthSumTotal);
    setMonthSum(monthBudget.reduce((r, a) => r.map((b, i) => a[i] + b)));
    const newMonthNo = monthNo.splice(startMonth, -monthIndex);
    console.log(newMonthNo, startMonth, monthIndex);
  }, []);

  const id = useId();
  return (
    <>
      {/* <Settings /> */}
      <div className="table">
        <h2>income</h2>
        <div className="fixTableHead">
          <table align="center" border={1} cellSpacing={0} cellPadding={5}>
            <thead>
              <tr>
                <td>income</td>
                <td className="plan_budget_data" colSpan={3}>
                  Planned Budget
                </td>
                <td className="execution" colSpan={3}>
                  Execution in reality
                </td>
                {monthPercentage.map((value, i) => {
                  return i === monthIndex && <td>{value}%</td>;
                })}
              </tr>

              <tr>
                <td>Section</td>
                <td className="plan_budget_data">Monthly</td>
                <td className="plan_budget_data">Yearly</td>
                <td className="plan_budget_data">Percentage</td>
                <td className="execution">Percentage</td>
                <td className="execution">Performance</td>
                <td className="execution">Month avg</td>
                {monthNo.map((value, i) => {
                  return (
                    i <= monthIndex && (
                      <td key={value} className="monthly_budget">
                        {value}
                      </td>
                    )
                  );
                })}
              </tr>
            </thead>

            <tbody>
              {data.income.map((value, i) => {
                let sum = 0;
                for (let i = 0; i <= monthIndex; i++) {
                  sum += value.income[i];
                }
                return (
                  <Row
                    value={value}
                    total={{ monthTotal }}
                    data={data.income}
                    setShow={setShow}
                    performance={sum}
                    i={i}
                    key={"a" + i * 2}
                    monthIndex={monthIndex}
                    chartData={setCharts}
                  />
                );
              })}
              <tr style={{ fontWeight: 600 }}>
                <td style={{ textDecoration: "none" }}>Total</td>
                <td className="plan_budget_data">{monthTotal}</td>
                <td className="plan_budget_data">{monthTotal * 12}</td>
                <td className="plan_budget_data">100%</td>
                <td className="execution"></td>
                <td className="execution">{performanceTotal}</td>
                <td className="execution">{monthAVG}</td>
                {monthSum.map((value, i) => {
                  return (
                    i <= monthIndex && (
                      <td key={id + Math.random()} className="monthly_budget">
                        {value}
                      </td>
                    )
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export function Row({
  setShow,
  value,
  total,
  monthIndex,
  performance,
  chartData,
}) {
  const [percentage, setPercentage] = useState(0);
  const [monthAVG, setMonthAVG] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    setMonthAVG(performance / (monthIndex + 1));
    chartData((p) => [
      ...p,
      performance !== 0 && value.incomeBudget
        ? ((value.incomeBudget / performance) * 100).toFixed(2)
        : 0,
    ]);
    value.incomeBudget !== 0 &&
      setPercentage((performance / (value.incomeBudget * 12)) * 100);
  }, [monthIndex]);
  return (
    <tr>
      <td
        onClick={() => {
          setShow("menu");
          dispatch(budgetActions.lineData({ name: value.section }));
        }}
      >
        {value.section}
      </td>
      <td className="plan_budget_data">{value.incomeBudget}</td>
      <td className="plan_budget_data">
        {Number(value.incomeBudget) > 0 ? (
          value.incomeBudget * 12
        ) : (
          <Icon icon="ep:close-bold" />
        )}
      </td>
      <td className="plan_budget_data">
        {total.totalMonth !== 0 && value.incomeBudget ? (
          ((value.incomeBudget / total.monthTotal) * 100).toFixed(2) + "%"
        ) : (
          <Icon icon="ep:close-bold" />
        )}
      </td>
      <td
        className={`execution ${
          percentage > monthPercentage[monthIndex] ? "alert" : ""
        }`}
      >
        {percentage.toFixed(2)}%
      </td>
      <td className="execution">{performance}</td>
      <td className="execution">{Math.round(monthAVG)}</td>

      {value.income.map((month, i, arr) => {
        return (
          i <= monthIndex && (
            <td
              key={month + Math.random()}
              className={`monthly_budget ${
                month > value.incomeBudget ? "alert" : ""
              }`}
            >
              {month}
            </td>
          )
        );
      })}
    </tr>
  );
}
