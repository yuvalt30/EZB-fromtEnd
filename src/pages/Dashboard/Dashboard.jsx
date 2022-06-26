import { Icon } from "@iconify/react";
import React, { useEffect, useState, useContext } from "react";
import "./Dashboard.scss";
import Input from "../../components/Input/Input";
import Dropdown from "../../components/Dropdown/Dropdown";
import { Data } from "../../App";
import axios from "axios";
import { useQuery } from "react-query";
import SubsectionDropdown from "../../components/Dropdown/SubsectionDropdown";
import Preloader from "../../components/Preloader/Preloader";
import { ERROR, Success, Warn } from "../../utils/toasts";

export default function Dashboard() {
  const [csvFile, setCsvFile] = useState({});
  const [csvData, setCsvData] = useState([]);
  const [sections, setSections] = useState();
  const [subSections, setSubSections] = useState([]);
  const [date, setDate] = useState();
  const [amount, setAmount] = useState();
  const [description, setDescription] = useState();
  const { user } = useContext(Data);
  const [errors, setErrors] = useState({});

  async function sendSections() {
    try {
      const res = await axios.post(
        "http://localhost:5000/transactions",
        {
          section: subSections,
          amount,
          date,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );
      Success("Completed");
      return res;
    } catch (err) {
      ERROR(err.response.data);
    }
  }

  const { isLoading, isFetched, refetch } = useQuery(
    "send-section",
    sendSections,
    {
      refetchOnWindowFocus: false,
      enabled: false,
    }
  );
  const { isLoading: csvSending, refetch: sendCsvFile } = useQuery(
    "send-csv",
    sendCsv,
    {
      refetchOnWindowFocus: false,
      enabled: false,
    }
  );

  function sendData() {
    if (sections && subSections[0] && amount) {
      if (amount >= 0) {
        refetch();
      } else {
        Warn("Enter valid amount");
      }
    } else {
      Warn("Fill all data");
    }
  }

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
  const { sectionsArr, data } = useContext(Data);
  useEffect(() => {
    if (isFetched) {
      Success("Completed");
    }
  }, []);

  if (isLoading) {
    return <Preloader />;
  }
  if (csvSending) {
    return <Preloader />;
  }

  return (
    <div className="container dashboard">
      <div className="dashboard_form">
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
          <Input
            onChange={(e) => setAmount(e.target.value)}
            value={amount}
            error={errors.amount}
          >
            Amount
          </Input>
          <Input
            onChange={(e) => setDate(e.target.value)}
            value={date}
            type={"date"}
            error={errors.date}
          >
            Date (optional)
          </Input>
          <Input
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            error={errors.description}
          >
            Description (optional)
          </Input>
          <button onClick={sendData}>Submit</button>
        </div>
        <hr className="divider" />
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
  );
}
