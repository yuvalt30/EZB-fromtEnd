import { Icon } from "@iconify/react";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useQuery } from "react-query";
import { Data } from "../../App";
import Dropdown from "../../components/Dropdown/Dropdown";
import SubsectionDropdown from "../../components/Dropdown/SubsectionDropdown";
import Input from "../../components/Input/Input";
import Preloader from "../../components/Preloader/Preloader";
import { ERROR, Success, Warn } from "../../utils/toasts";
import "./Budget.scss";

export default function Budget() {
  const [sections, setSections] = useState();
  const { sectionsArr, data, user } = useContext(Data);
  const [subSections, setSubSections] = useState();
  const [amount, setAmount] = useState(0);
  const [csvFile, setCsvFile] = useState({});
  const [csvData, setCsvData] = useState([]);

  async function handleCsv(e) {
    if (e.target.files[0].type === "text/csv") {
      setCsvFile(e.target.files[0]);
      const reader = new FileReader();
      reader.onload = async (e) => {
        let text = e.target.result;
        text = text.split("\r\n");
        text.forEach((value) => {
          const data = value.split(",");
          const obj = {
            description: data[0].trim(),
            amount: data[1].trim(),
            date: data[2].trim(),
            subSection: data[4].trim(),
            sectionName: data[3].trim(),
          };
          setCsvData((prev) => [...prev, obj]);
        });
      };
      reader.readAsText(e.target.files[0]);
    } else {
      setCsvFile({ err: "Not a csv file" });
    }
  }
  async function sendCsv() {
    try {
      const response = await axios.post(
        "http://localhost:5000/transactions/file",
        { transactions: csvData },
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );
      setCsvFile({});
      Success("Completed");
      return response;
    } catch (err) {
      ERROR(err.response.data);
    }
  }
  const { isLoading: csvSending, refetch: sendCsvFile } = useQuery(
    "send-csv",
    sendCsv,
    {
      refetchOnWindowFocus: false,
      enabled: false,
    }
  );
  async function sendData() {
    if (subSections && sections && amount) {
      if (amount >= 0) {
        try {
          const response = await axios.put(
            `http://localhost:5000/sections/${subSections}-${amount}`,
            {
              headers: {
                Authorization: `Bearer ${user.accessToken}`,
              },
            }
          );
          Success("Completed");
          return response;
        } catch (err) {
          ERROR(err.response.data);
        }
      } else {
        Warn("Enter valid amount");
      }
    } else {
      Warn("Fill all the data");
    }
  }
  const { refetch, isLoading } = useQuery("register", sendData, {
    enabled: false,
    refetchOnWindowFocus: false,
  });
  if (isLoading) {
    return <Preloader />;
  }
  if (csvSending) {
    return <Preloader />;
  }
  return (
    <div className="container plan_budget">
      <div className="form">
        <div>
          <Dropdown
            tittle={"Select section"}
            companyData={sectionsArr}
            onChange={(e) => {
              setSections(e);
            }}
          />
          {sections !== undefined && (
            <SubsectionDropdown
              tittle={"Select sub section"}
              onChange={(e) => {
                setSubSections(e);
              }}
              companyData={data.data.filter((value) => {
                return sections === value._id;
              })}
            />
          )}
          {subSections && (
            <Input
              onChange={(e) => {
                setAmount(e.target.value);
              }}
            >
              Monthly budget for {sections} of {subSections}
            </Input>
          )}
          <button
            onClick={() => {
              refetch();
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
              <button onClick={sendCsvFile}>Submit</button>
            </>
          ) : csvFile.err ? (
            <div className="file_error">{csvFile.err}</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
