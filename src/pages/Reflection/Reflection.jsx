import React, { useEffect, useMemo, useState } from "react";
import "./Reflection.scss";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Legend,
} from "chart.js";
import { Line, Pie } from "react-chartjs-2";
import { Icon } from "@iconify/react";
import Input from "../../components/Input/Input";
import { useQuery } from "react-query";
import axios from "axios";
import Dropdown from "../../components/Dropdown/Dropdown";
import Preloader from "../../components/Preloader/Preloader";
import Income from "./Income";
import { useSelector } from "react-redux";
import SubSectionIncome from "./SubSectionIncome";
import { ERROR } from "../../utils/toasts";
import Settings from "../Settings/Settings";
import SubSectionOutcome from "./SubSectionOutcome";
import Outcome from "./Outcome";
import Summery from "./Summery";
import SubSummary from "./SubSummary";
import { getNewColor } from "../../utils/colorGenarator";

ChartJS.register(
  ArcElement,
  Tooltip,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const monthNo = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export default function Reflection() {
  const [show, setShow] = useState("");
  const [dates, setDates] = useState({ begin: "", end: "" });
  const [linesData, setLinesData] = useState([]);
  const { selectedSec, subId, outcome, income, selectedSub } = useSelector(
    (state) => {
      return {
        selectedSec: state.lineData.name,
        subId: state.lineData.subId,
        outcome: state.outcome,
        income: state.income,
        selectedSub: state.selectedSub,
      };
    }
  );
  const incomeColor = income.chart.map((value) => {
    return getNewColor();
  });

  const dataIncome = {
    labels: income.name,

    datasets: [
      {
        label: "# of Votes",
        data: income.chart,
        options: {
          datalabels: {
            display: false,
          },
        },
        backgroundColor: incomeColor,
        borderColor: ["#fff"],
        borderWidth: 1,
      },
    ],
  };

  async function getReflection() {
    try {
      const res = await axios.get(
        `http://localhost:5000/tracks/?startMonth=${
          JSON.parse(localStorage.getItem("user")).startMonth
        }`,
        {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("user")).accessToken
            }`,
          },
        }
      );
      return res;
    } catch (err) {
      ERROR(err.response.data);
    }
  }

  const {
    data: reflection,
    status,
    isLoading,
  } = useQuery("reflection", getReflection, {
    refetchOnWindowFocus: false,
    enabled: true,
  });

  const {
    data: subSectionTable,
    isFetching: subSectionTableFetching,
    refetch: subSectionTableFetch,
  } = useQuery("sub-section-table-data", getSubsectionTable, {
    refetchOnWindowFocus: false,
    enabled: false,
  });

  async function getSubsectionTable() {
    try {
      const res = await axios.get(
        `http://localhost:5000/tracks/sec?secName=${selectedSec}`
      );
      return res;
    } catch (err) {
      ERROR(err.response.data);
    }
  }

  useEffect(() => {
    if (selectedSec) {
      subSectionTableFetch();
    }
  }, [selectedSec]);

  const dataOutcome = {
    labels: outcome.name,
    datasets: [
      {
        label: "# of Votes",
        data: outcome.chart,

        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: true,
      },
    },
  };

  async function fetchLineData() {
    if (subId) {
      const res = await axios.get(
        `http://localhost:5000/tracks/past?begin=${dates.begin
          .split("-")
          .reverse()
          .join("/")}&subId=${subId}&end=${dates.end
          .split("-")
          .reverse()
          .join("/")}&sectionName=${selectedSec}`
      );

      setLinesData(res.data);
    } else {
      const res = await axios.get(
        `http://localhost:5000/tracks/past?begin=${dates.begin
          .split("-")
          .reverse()
          .join("/")}&end=${dates.end
          .split("-")
          .reverse()
          .join("/")}&sectionName=${selectedSec}`
      );
      setLinesData(res.data);
    }
  }

  const { isFetching: gettingLineData, refetch: getLineData } = useQuery(
    "fetch-line",
    fetchLineData,
    {
      enabled: false,
      refetchOnWindowFocus: false,
    }
  );

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const [showCharts, setShowCharts] = useState(false);
  const lineData = {
    labels: linesData.titles || months,
    datasets: [
      {
        label: "Income",
        data: linesData.income,
        borderColor: "#63ff85",
        backgroundColor: "#63ff8576",
      },
      {
        label: "Outcome",
        data: linesData.outcome,
        borderColor: "#fd3535",
        backgroundColor: "#fd3535a4",
      },
    ],
  };

  const subLineData = {
    labels: linesData?.titles,
    datasets: [
      {
        label: "Sub section",
        data: linesData?.data,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  const date = new Date();
  const [monthIndex, setMonthIndex] = useState(date.getMonth());
  useEffect(() => {
    setMonthIndex(date.getMonth());
  }, []);

  if (isLoading || gettingLineData || subSectionTableFetching) {
    return <Preloader />;
  }

  return (
    status === "success" && (
      <div className="container reflection">
        <Settings />
        <div className="chart">
          <div>
            <Dropdown
              tittle={"Select month"}
              companyData={months}
              getIndex={(e) => {
                setMonthIndex(e);
              }}
              defaultValue={months[date.getMonth()]}
            />
            <Dropdown
              tittle={"Select year"}
              companyData={[2022, 2021]}
              getIndex={(e) => {
                setMonthIndex(e);
              }}
              defaultValue={2022}
            />
          </div>
          <button
            onClick={() => {
              setShowCharts(true);
            }}
          >
            Show charts
          </button>
          {showCharts && (
            <div className="charts">
              <div>
                <div>
                  <h2>Income</h2>
                  <Pie data={dataIncome} />
                </div>
                <div>
                  <h2>Outcome</h2>
                  <Pie data={dataOutcome} />
                </div>
              </div>
              <button
                onClick={() => {
                  setShowCharts(false);
                }}
              >
                Close
              </button>
            </div>
          )}
        </div>

        <div className="section_table">
          <Income
            monthIndex={monthIndex}
            data={reflection.data}
            setShow={setShow}
          />
          <Outcome
            monthIndex={monthIndex}
            data={reflection.data}
            setShow={setShow}
          />
          <Summery data={reflection.data.summary} monthIndex={monthIndex} />
        </div>

        {show && (
          <div className="subsection_table">
            <div>
              <div className="choose_action">
                <Icon
                  onClick={() => {
                    setShow("");
                  }}
                  className="close"
                  icon="ci:off-close"
                />
                {show !== "menu" && (
                  <Icon
                    className="back"
                    onClick={() => {
                      setShow(
                        show === "show-sub-date" ? "sub-section" : "menu"
                      );
                    }}
                    icon="eva:arrow-ios-back-outline"
                  />
                )}
                {show === "menu" && (
                  <div className="menu">
                    <h2>Choose action</h2>
                    <button
                      onClick={() => {
                        setShow("sub-section");
                      }}
                    >
                      See sub section
                    </button>
                    <button
                      onClick={() => {
                        setShow("show-date");
                      }}
                    >
                      Chart
                    </button>
                  </div>
                )}
                {show === "sub-section" && (
                  <>
                    {subSectionTable?.data?.income[0] && (
                      <SubSectionIncome
                        monthIndex={monthIndex}
                        data={subSectionTable.data}
                        setShow={setShow}
                      />
                    )}
                    {subSectionTable?.data?.outcome[0] && (
                      <SubSectionOutcome
                        monthIndex={monthIndex}
                        data={subSectionTable.data}
                        setShow={setShow}
                      />
                    )}
                    {subSectionTable?.data?.summary[0] && (
                      <SubSummary data={subSectionTable.data} />
                    )}
                    {!subSectionTable?.data?.outcome[0] &&
                      !subSectionTable?.data?.income[0] && (
                        <p>No data available</p>
                      )}
                  </>
                )}
                {show === "line-chart" && (
                  <Line
                    className="line-chart"
                    options={options}
                    data={subId ? subLineData : lineData}
                  />
                )}
                {show === "show-sub-date" && (
                  <div>
                    <Input
                      type={"date"}
                      onChange={(e) => {
                        setDates({ ...dates, begin: e.target.value });
                      }}
                    >
                      From
                    </Input>
                    <Input
                      onChange={(e) => {
                        setDates({ ...dates, end: e.target.value });
                      }}
                      type={"date"}
                    >
                      To
                    </Input>
                    <button
                      onClick={() => {
                        setShow("line-chart");
                        getLineData();
                      }}
                    >
                      Submit
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  );
}
