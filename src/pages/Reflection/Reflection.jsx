import React, { useEffect, useState } from "react";
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
import SectionTable from "./Table";
import { Icon } from "@iconify/react";
import Input from "../../components/Input/Input";
import { useQuery } from "react-query";
import axios from "axios";
import Dropdown from "../../components/Dropdown/Dropdown";
import Preloader from "../../components/Preloader/Preloader";
import Income from "./Income";
import SubIncome from "./SubSection";
import { useSelector } from "react-redux";
import Settings from "../Settings/Settings";
import { useContext } from "react";
import { Data } from "../../App";
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

export default function Reflection() {
  const [show, setShow] = useState("");
  const [dates, setDates] = useState({ begin: "", end: "" });
  const [chartData, setChartData] = useState([]);
  const [linesData, setLinesData] = useState([]);
  const { outcome } = useSelector((state) => {
    return { outcome: state.outcome };
  });
  const { user } = useContext(Data);
  async function getReflection() {
    return await axios.get("http://localhost:5000/tracks");
  }
  const {
    data: reflection,
    status,
    isFetching,
  } = useQuery("reflection", getReflection, {
    refetchOnWindowFocus: false,
    enabled: true,
  });

  const data = {
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
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  async function fetchLineData() {
    const res = await axios.get(
      `http://localhost:5000/tracks/past?begin=${dates.begin
        .split("-")
        .reverse()
        .join("/")}&end=${dates.end
        .split("-")
        .reverse()
        .join("/")}&sectionName=${chartData.section}`
    );
    setLinesData(res.data);
  }
  const { isFetching: gettingLineData, refetch: getLineData } = useQuery(
    "fetch-line",
    fetchLineData,
    {
      enabled: false,
      refetchOnWindowFocus: false,
    }
  );
  useEffect(() => {
    if (status === "success") {
      const total = reflection.data.income.map((value) => {
        return value.income;
      });
    }
  }, [status]);

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
  const lineData = {
    labels: months,
    datasets: [
      {
        label: "Income",
        data: linesData,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };
  const date = new Date();
  const [monthIndex, setMonthIndex] = useState(date.getMonth());
  const monthArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const [monthNo, setMonthNo] = useState(monthArr);
  if (isFetching) {
    return <Preloader />;
  }
  if (gettingLineData) {
    return <Preloader />;
  }
  return (
    status === "success" && (
      <div className="container reflection">
        {/* <Settings /> */}
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
          </div>

          <div>
            <h2>Income</h2>
            <Pie data={data} />
          </div>
          <div>
            <h2>Outcome</h2>
            <Pie data={data} />
          </div>
        </div>

        <div className="section_table">
          <Income
            monthIndex={monthIndex}
            data={reflection.data}
            setShow={setShow}
            getData={setChartData}
          />
          <SectionTable
            monthIndex={monthIndex}
            data={reflection.data}
            setShow={setShow}
            getData={setChartData}
            monthNo={monthNo}
          />
          {/* <SubSection data={data} /> */}
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
                      setShow("menu");
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
                  <SubIncome
                    setShow={setShow}
                    monthIndex={monthIndex}
                    data={reflection.data}
                    getData={setChartData}
                    monthNo={monthNo}
                  />
                )}
                {show === "line-chart" && (
                  <Line
                    className="line-chart"
                    options={options}
                    data={lineData}
                  />
                )}
                {show === "show-date" && (
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
