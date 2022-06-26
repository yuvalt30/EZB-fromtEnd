import { Icon } from "@iconify/react";
import axios from "axios";
import React, { useState } from "react";
import { useQuery } from "react-query";
import Input from "../../components/Input/Input";
import Preloader from "../../components/Preloader/Preloader";
import { ERROR, Success, Warn } from "../../utils/toasts";

export default function PlanBudget() {
  const [csvFile, setCsvFile] = useState({});
  const [csvData, setCsvData] = useState([]);
  const [valueInput, setValueInput] = useState({
    sectionName: "",
    incomeName: "",
    outcomeName: "",
  });

  function handleCsv(e) {
    if (e.target.files[0].type === "text/csv") {
      setCsvFile(e.target.files[0]);
      const reader = new FileReader();
      reader.onload = async (e) => {
        let str = e.target.result;
        let result = {
          incomes: [],
          outcomes: [],
        };
        let stripped = str.split('"').join(""); // strip
        stripped = stripped.split("&"); // divide income & outcome
        // incomes
        stripped[0].split("\r\n").forEach((line) => {
          let words = line.split(",").map((value) => {
            return value.trim();
          });
          if (words[0])
            result.incomes.push({
              sectionName: words[0],
              subSections: words.slice(1, words.length),
            });
        });
        //outcomes
        stripped[1].split("\r\n").forEach((line) => {
          let words = line.split(",").map((value) => {
            return value.trim();
          });
          if (words[0])
            result.outcomes.push({
              sectionName: words[0],
              subSections: words.slice(1, words.length),
            });
        });
        setCsvData(result);
      };
      reader.readAsText(e.target.files[0]);
    } else {
      setCsvFile({ err: "Not a csv file" });
    }
  }

  async function sendCSV() {
    try {
      const res = await axios.post("http://localhost:5000/sections", csvData);
      Success("Completed");
      setCsvFile({});
      return res;
    } catch (err) {
      ERROR(err.response.data);
    }
  }

  async function sendBudget() {
    let splitIncome = valueInput.incomeName
      .split('"')
      .join("")
      .split(",")
      .map((value) => {
        return value.trim();
      });
    let splitOutcome = valueInput.outcomeName
      .split('"')
      .join("")
      .split(",")
      .map((value) => {
        return value.trim();
      });
    try {
      const res = await axios.post("http://localhost:5000/sections", {
        incomes: [
          { sectionName: valueInput.sectionName, subSections: splitIncome },
        ],
        outcomes: [
          { sectionName: valueInput.sectionName, subSections: splitOutcome },
        ],
      });
      Success("Completed");
      return res;
    } catch (err) {
      ERROR(err.response.data);
    }
  }
  const { isLoading: fetchingBudgetCsv, refetch: sendCsvFetch } = useQuery(
    "send-budget",
    sendBudget,
    {
      refetchOnWindowFocus: false,
      enabled: false,
    }
  );
  const { isLoading, refetch } = useQuery("send-plan-budget-csv", sendCSV, {
    refetchOnWindowFocus: false,
    enabled: false,
  });
  if (isLoading || fetchingBudgetCsv) {
    return <Preloader />;
  }
  return (
    <div className="container plan_budget">
      <div className="form">
        <div>
          <Input
            onChange={(e) => {
              setValueInput({ ...valueInput, sectionName: e.target.value });
            }}
          >
            Section
          </Input>
          <Input
            onChange={(e) => {
              setValueInput({ ...valueInput, incomeName: e.target.value });
            }}
          >
            Income Sub Section
          </Input>

          <Input
            onChange={(e) => {
              setValueInput({ ...valueInput, outcomeName: e.target.value });
            }}
          >
            Outcome Sub Section
          </Input>
          <button
            onClick={() => {
              if (
                !valueInput.sectionName &&
                !valueInput.incomeName &&
                !valueInput.outcomeName
              ) {
                Warn("Fill all the data");
              } else if (!valueInput.incomeName && !valueInput.outcomeName) {
                Warn("Provide at least one for income or outcome");
              }
              if (
                (valueInput.incomeName || valueInput.outcomeName) &&
                valueInput.sectionName
              ) {
                sendCsvFetch();
              }
            }}
          >
            Submit
          </button>
        </div>
        <hr className="divider" />
        <ol className="instruction">
          <li>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt
            nihil animi aperiam voluptates inventore ratione consectetur iusto,
            esse delectus. Quam.
          </li>
          <li>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt
            nihil animi aperiam voluptates inventore ratione consectetur iusto,
            esse delectus. Quam.
          </li>
          <li>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt
            nihil animi aperiam voluptates inventore ratione consectetur iusto,
            esse delectus. Quam.
          </li>
        </ol>
      </div>
      <div>
        <div className="csv_container">
          <div className="upload_file">
            <input type="file" onChange={handleCsv} />
            <Icon icon="ic:twotone-cloud-upload" />
            <p>Upload your CSV Here</p>
          </div>
          {csvFile.name ? (
            <>
              <div className="file_info">
                <Icon icon="fa6-solid:file-csv" />
                <div className="file_content">
                  <div>
                    <h2>{csvFile.name}</h2>
                  </div>
                  <Icon icon="flat-color-icons:ok" />
                </div>
              </div>
              <button
                onClick={() => {
                  refetch();
                }}
              >
                Submit
              </button>
            </>
          ) : csvFile.err ? (
            <div className="file_error">{csvFile.err}</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
