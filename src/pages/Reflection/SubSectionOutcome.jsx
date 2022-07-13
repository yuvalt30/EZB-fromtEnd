import React, { useEffect, useId, useState } from "react";
import { Icon } from "@iconify/react";
import { useDispatch, useSelector } from "react-redux";
import { budgetActions } from "../../store";
import { monthNo } from "./Reflection";

const monthPercentage = [8, 17, 25, 33, 42, 50, 58, 67, 75, 83, 92, 100];

export default function SubSectionOutcome({ setShow, data, monthIndex }) {
  const [monthAVG, setMonthAVG] = useState(0);
  const [monthSum, setMonthSum] = useState([]);
  const [monthTotal, setMonthTotal] = useState(0);
  const [performanceTotal, setPerformanceTotal] = useState(0);
  const [charts, setCharts] = useState([]);
  const dispatch = useDispatch();
  const { selectedSec } = useSelector((state) => {
    return {
      selectedSec: state.lineData.name,
    };
  });
  useEffect(() => {
    dispatch(budgetActions.outcomeChart(charts));
  }, [charts]);

  useEffect(() => {
    let percentageSum = 0;
    data.outcome.forEach((value) => {
      for (let i = 0; i <= monthIndex; i++) {
        percentageSum += value.outcome[i];
      }
    });
    const monthAVGSum = percentageSum / (monthIndex + 1);
    const varMonth = String(monthAVGSum).includes(".")
      ? monthAVGSum.toFixed(2)
      : monthAVGSum;
    setMonthAVG(varMonth);
    setPerformanceTotal(percentageSum);
    dispatch(
      budgetActions.summary({
        outcome: {
          avg: Number(varMonth),
          performance: Number(percentageSum),
        },
      })
    );
  }, [monthIndex]);

  useEffect(() => {
    const monthBudget = [];
    let monthSumTotal = 0;
    data.outcome.forEach((value, i) => {
      monthBudget.push(value.outcome);
      monthSumTotal += value.outcomeBudget;
    });
    setMonthTotal(monthSumTotal);
    setMonthSum(monthBudget.reduce((r, a) => r.map((b, i) => a[i] + b)));
  }, []);

  const id = useId();
  return (
    <>
      <div className="table">
        <h2>Outcome {selectedSec}</h2>
        <div className="fixTableHead">
          <table align="center" border={1} cellSpacing={0} cellPadding={5}>
            <thead>
              <tr>
                <td>outcome</td>
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
              {data.outcome.map((value, i) => {
                let sum = 0;
                for (let i = 0; i <= monthIndex; i++) {
                  sum += value.outcome[i];
                }
                return (
                  <Row
                    value={value}
                    total={{ monthTotal }}
                    data={data.outcome}
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
      performance !== 0 && value.outcomeBudget
        ? ((value.outcomeBudget / performance) * 100).toFixed(2)
        : 0,
    ]);
    value.outcomeBudget !== 0 &&
      setPercentage((performance / (value.outcomeBudget * 12)) * 100);
  }, [monthIndex]);
  return (
    <tr>
      <td
        onClick={() => {
          setShow("show-sub-date");
          dispatch(
            budgetActions.selectedSub({ name: value.section, subId: value._id })
          );
        }}
      >
        {value.section}
      </td>
      <td className="plan_budget_data">{value.outcomeBudget}</td>
      <td className="plan_budget_data">
        {Number(value.outcomeBudget) > 0 ? (
          value.outcomeBudget * 12
        ) : (
          <Icon icon="ep:close-bold" />
        )}
      </td>
      <td className="plan_budget_data">
        {total.totalMonth !== 0 && value.outcomeBudget ? (
          ((value.outcomeBudget / total.monthTotal) * 100).toFixed(2) + "%"
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

      {value.outcome.map((month, i, arr) => {
        return (
          i <= monthIndex && (
            <td
              key={month + Math.random()}
              className={`monthly_budget ${
                month > value.outcomeBudget ? "alert" : ""
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
