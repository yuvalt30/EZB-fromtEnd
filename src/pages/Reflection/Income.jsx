import React, { useEffect, useId, useState } from "react";
import { Icon } from "@iconify/react";
import { useDispatch } from "react-redux";
import { budgetActions } from "../../store";
import { monthNo } from "./Reflection";
const monthPercentage = [8, 17, 25, 33, 42, 50, 58, 67, 75, 83, 92, 100];

export default function Income({ setShow, data, monthIndex }) {
  const [monthAVG, setMonthAVG] = useState(0);
  const [monthSum, setMonthSum] = useState([]);
  const [monthTotal, setMonthTotal] = useState(0);
  const [performanceTotal, setPerformanceTotal] = useState(0);
  const [monthArr, setMonthArr] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    let percentageSum = 0;
    const percentArr = [];
    const performanceSumArr = [];

    data.income.forEach((value) => {
      let performanceSum = 0;
      for (let i = 0; i <= monthIndex; i++) {
        performanceSum += value.income[i];
      }
      console.log(performanceSum);

      performanceSumArr.push({
        name: value.section,
        value: performanceSum,
      });
      percentArr.push(
        monthTotal !== 0 && value.incomeBudget
          ? (value.incomeBudget / monthTotal) * 100
          : 0
      );
    });

    dispatch(budgetActions.incomeChart({ chart: percentArr }));
    dispatch(budgetActions.plannedIncome(performanceSumArr));
    dispatch(budgetActions.performanceTotal(percentageSum));

    const monthAVGSum = percentageSum / (monthIndex + 1);
    setMonthAVG(() =>
      String(monthAVGSum).includes(".") ? monthAVGSum.toFixed(2) : monthAVGSum
    );
    setPerformanceTotal(percentageSum);
    setMonthArr(
      monthNo
        .slice(JSON.parse(localStorage.getItem("user")).startMonth)
        .concat(monthNo.slice(0, monthIndex))
    );
  }, [monthIndex]);

  useEffect(() => {
    const monthBudget = [];
    let monthSumTotal = 0;
    const sectionName = [];
    const percentArr = [];
    data.income.forEach((value, i) => {
      monthBudget.push(value.income);
      monthSumTotal += value.incomeBudget;
      sectionName.push(value.section);
    });
    data.income.forEach((value, i) => {
      percentArr.push(((value.incomeBudget / monthTotal) * 100).toFixed(2));
    });
    console.log(monthSumTotal);
    dispatch(budgetActions.incomeChart({ name: sectionName }));
    setMonthTotal(monthSumTotal);
    setMonthSum(monthBudget.reduce((r, a) => r.map((b, i) => a[i] + b)));
  }, []);

  const id = useId();
  return (
    <>
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
                  return i <= monthIndex && <td>{value}%</td>;
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
                {monthArr.map((value, i) => {
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

export function Row({ setShow, value, total, monthIndex, performance }) {
  const [percentage, setPercentage] = useState(0);
  const [monthAVG, setMonthAVG] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    setMonthAVG(performance / (monthIndex + 1));
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
        {total.monthTotal !== 0 && value.incomeBudget ? (
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
                month < value.incomeBudget ? "alert" : ""
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
