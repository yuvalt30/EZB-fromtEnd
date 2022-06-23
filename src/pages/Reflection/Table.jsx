import React, { useEffect, useId, useState } from "react";
import { Icon } from "@iconify/react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { budgetActions } from "../../store";

export default function SectionTable({ setShow, data, monthIndex, monthNo }) {
  const [totalMonth, setTotalMonth] = useState([]);
  const [monthSum, setMonthSum] = useState([]);
  const [monthTotal, setMonthTotal] = useState(0);
  const [performanceTotal, setPerformanceTotal] = useState([]);
  const [charts, setCharts] = useState([]);
  const [sectionName, setSectionName] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(budgetActions.outcomeChart(charts));
  }, [charts]);

  useEffect(() => {
    (async function () {
      try {
        const res = await axios.get("http://localhost:5000/tracks/secA");
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    })();
    data.outcome.forEach((value, i) => {
      setSectionName((p) => {
        dispatch(budgetActions.sectionName([...p, value.section]));
        return [...p, value.section];
      });
      setTotalMonth((p) => [...p, value.outcome]);
      i <= monthIndex && setMonthTotal((p) => (p += value.outcomeBudget));
    });
  }, []);

  useEffect(() => {
    const sum = [];
    totalMonth.forEach((sub) => {
      sub.forEach((num, index) => {
        if (sum[index]) {
          sum[index] += num;
        } else {
          sum[index] = num;
        }
      });
    });
    setMonthSum(sum);
  }, [totalMonth]);
  const id = useId();
  return (
    <>
      <div className="table">
        <h2>outcome</h2>
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
                <td>8%</td>
                <td>17%</td>
                <td>25%</td>
                <td>33%</td>
                <td>42%</td>
                <td>50%</td>
                <td>58%</td>
                <td>67%</td>
                <td>75%</td>
                <td>83%</td>
                <td>92%</td>
                <td>100%</td>
              </tr>

              <tr>
                <td>Section</td>
                <td className="plan_budget_data">Monthly</td>
                <td className="plan_budget_data">Yearly</td>
                <td className="plan_budget_data">Percentage</td>
                <td className="execution">Percentage</td>
                <td className="execution">Performance</td>
                <td className="execution">Month avg</td>
                {monthNo.map((value) => {
                  return (
                    <td key={value} className="monthly_budget">
                      {value}
                    </td>
                  );
                })}
              </tr>
            </thead>

            <tbody>
              {data.outcome.map((value, i) => {
                return (
                  <Row
                    value={value}
                    total={{ monthTotal, setPerformanceTotal }}
                    data={data.outcome}
                    setShow={setShow}
                    i={i}
                    key={"a" + i * 2}
                    monthIndex={monthIndex}
                    performTotal={(e) => {
                      setPerformanceTotal((p) => [...p, e]);
                    }}
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
                <td className="execution">
                  {performanceTotal.reduce((p, x) => p + x, 0)}
                </td>
                <td className="execution"></td>
                {monthSum.map((value) => {
                  return (
                    <td key={id + Math.random()} className="monthly_budget">
                      {value}
                    </td>
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
  performTotal,
  chartData,
}) {
  const [performance, setPerformance] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [monthAVG, setMonthAVG] = useState(0);

  useEffect(() => {
    let sum = 0;
    for (let i = 0; i <= monthIndex; i++) {
      sum += value.outcome[i];
    }
    setPerformance(sum);
    setMonthAVG(sum / (monthIndex + 1));
    performTotal(sum);
    console.log((value.outcomeBudget / sum) * 100);
    chartData((p) => [
      ...p,
      sum !== 0 && value.outcomeBudget
        ? ((value.outcomeBudget / sum) * 100).toFixed(2)
        : 0,
    ]);
    value.outcomeBudget !== 0 &&
      setPercentage((sum / (value.outcomeBudget * 12)) * 100);
  }, [monthIndex]);
  return (
    <tr>
      <td
        onClick={() => {
          setShow("menu");
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
          ((value.outcomeBudget / performance) * 100).toFixed(2) + "%"
        ) : (
          <Icon icon="ep:close-bold" />
        )}
      </td>
      <td
        className={`execution ${
          monthIndex === 10 && performance > 92 ? "alert" : ""
        }`}
      >
        {percentage.toFixed(2)}%
      </td>
      <td className="execution">{performance}</td>
      <td className="execution">{Math.round(monthAVG)}</td>

      {value.outcome.map((month, i, arr) => {
        return (
          <td
            key={month + Math.random()}
            className={`monthly_budget ${
              month > value.outcomeBudget ? "alert" : ""
            }`}
          >
            {month}
          </td>
        );
      })}
    </tr>
  );
}
