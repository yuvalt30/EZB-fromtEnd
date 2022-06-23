import React, { useEffect, useId, useState } from "react";
import { Icon } from "@iconify/react";
import axios from "axios";
export default function Income({ setShow, data, monthIndex, getData }) {
  const [totalMonth, setTotalMonth] = useState([]);
  const [monthSum, setMonthSum] = useState([]);
  const [monthTotal, setMonthTotal] = useState(0);
  const [performanceTotal, setPerformanceTotal] = useState([]);
  const [monthAVG, setMonthAVG] = useState(0);

  useEffect(() => {
    (async function () {
      try {
        const res = await axios.get("http://localhost:5000/tracks/secA");
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  useEffect(() => {
    data.income.forEach((value, i) => {
      setTotalMonth((p) => [...p, value.income]);
      i <= monthIndex && setMonthTotal((p) => (p += value.incomeBudget));
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
        <h2>Income</h2>
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
                <td className="monthly_budget">1</td>
                <td className="monthly_budget">2</td>
                <td className="monthly_budget">3</td>
                <td className="monthly_budget">4</td>
                <td className="monthly_budget">5</td>
                <td className="monthly_budget">6</td>
                <td className="monthly_budget">7</td>
                <td className="monthly_budget">8</td>
                <td className="monthly_budget">9</td>
                <td className="monthly_budget">10</td>
                <td className="monthly_budget">11</td>
                <td className="monthly_budget">12</td>
              </tr>
            </thead>

            <tbody>
              {data.income.map((value, i) => {
                return (
                  <Row
                    value={value}
                    total={{ monthTotal, setPerformanceTotal, monthAVG }}
                    data={data.income}
                    setShow={setShow}
                    getData={getData}
                    i={i}
                    key={"a" + i * 2}
                    monthIndex={monthIndex}
                    performTotal={(e) => {
                      setPerformanceTotal((p) => [...p, e]);
                    }}
                  />
                );
              })}
              <tr style={{ fontWeight: 600 }}>
                <td style={{ textDecoration: "none" }}>Total</td>
                <td className="plan_budget_data">{monthTotal}</td>
                <td className="plan_budget_data">{monthTotal * 12}</td>
                <td className="plan_budget_data">1</td>
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
  getData,
}) {
  const [performance, setPerformance] = useState(0);
  const [percentage, setPercentage] = useState(0);
  useEffect(() => {
    let sum = 0;
    for (let i = 0; i <= monthIndex; i++) {
      sum += value.income[i];
    }
    setPerformance(sum);
    performTotal(sum);
    value.incomeBudget !== 0 &&
      setPercentage((sum / (value.incomeBudget * 12)) * 100);
  }, [monthIndex]);

  return (
    <tr>
      <td
        onClick={() => {
          getData(value);
          setShow("menu");
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
      <td className="execution">{percentage.toFixed(2)}%</td>
      <td className="execution">{performance}</td>
      <td className="execution">100</td>

      {value.income.map((month, i, arr) => {
        return (
          <td
            className={`monthly_budget ${
              month < value.incomeBudget ? "alert" : ""
            }`}
          >
            {month}
          </td>
        );
      })}
    </tr>
  );
}
