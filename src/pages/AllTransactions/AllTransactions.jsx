import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import Preloader from "../../components/Preloader/Preloader";
import "../Reflection/Reflection.scss";
import Dropdown from "../../components/Dropdown/Dropdown";
import "./ALLTransactions.scss";
const monthPercentage = [8, 17, 25, 33, 42, 50, 58, 67, 75, 83, 92, 100];

export default function AllTransactions() {
  const [sectionName, setSectionName] = useState([]);
  const [subSectionName, setSubSectionName] = useState([]);
  const [tableData, setTableData] = useState([]);
  const { data, isLoading, isFetched } = useQuery(
    "sub-section-data",
    async () => {
      const res = await axios.get(`http://localhost:5000/transactions/`, {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("user")).accessToken
          }`,
        },
      });
      return res;
    },
    {
      refetchOnWindowFocus: true,
      enabled: true,
    }
  );
  const date = new Date();
  useEffect(() => {
    if (isFetched) {
      setTableData(data.data);
      const sectionNames = data.data.reduce((value, curr) => {
        !value.includes(curr) && value.push(curr.section.sectionName);
        return value;
      }, []);
      const subSectionNames = data.data.reduce((value, curr) => {
        !value.includes(curr) && value.push(curr.section.subSection);
        return value;
      }, []);
      setSectionName(sectionNames);
      setSubSectionName(subSectionNames);
    }
  }, []);

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <>
      <div className="transaction-container">
        <div className="filter">
          <h4>Filter by</h4>
          <Dropdown
            tittle={"Section"}
            onChange={(e) => {
              setTableData(
                data.data.filter((value) => {
                  return value.section.sectionName === e;
                })
              );
            }}
            companyData={sectionName}
          />
          <Dropdown
            tittle={"Sub section"}
            defaultValue={"Select a sub section"}
            companyData={subSectionName}
            onChange={(e) => {
              setTableData(
                data.data.filter((value) => {
                  return value.section.subSection === e;
                })
              );
            }}
          />
          <button
            onClick={() => {
              setTableData(data.data);
            }}
          >
            Reset
          </button>
        </div>
        <div className="reflection all-transactions">
          <div className="section_table">
            <div className="table">
              <h2>All transactions</h2>

              <div className="fixTableHead">
                <table
                  align="center"
                  border={1}
                  cellSpacing={0}
                  cellPadding={5}
                >
                  <thead>
                    <tr>
                      <td>Section</td>
                      <td className="subsection_data">Sub Section</td>
                      <td className="plan_budget_data">Amount</td>
                      <td className="execution">Description</td>
                      <td>Date</td>
                    </tr>
                  </thead>

                  <tbody>
                    {tableData.map((value, i) => {
                      return (
                        <>
                          <tr>
                            <td>{value.section.sectionName}</td>
                            <td className="subsection_data">
                              {value.section.subSection}
                            </td>
                            <td className="plan_budget_data">{value.amount}</td>
                            <td className="execution">{value.description}</td>
                            <td>{date.toDateString(value.date)}</td>
                          </tr>
                        </>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
