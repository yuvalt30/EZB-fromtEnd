import React, { useEffect, useId, useState } from "react";
import { Icon } from "@iconify/react";
import { useDispatch } from "react-redux";
import { budgetActions } from "../../store";
import { useQuery } from "react-query";
import axios from "axios";
import Preloader from "../../components/Preloader/Preloader";
import "../Reflection/Reflection.scss";
const monthPercentage = [8, 17, 25, 33, 42, 50, 58, 67, 75, 83, 92, 100];

export default function AllTransactions() {
  const { data, isLoading, refetch } = useQuery(
    "sub-section-data",
    async () => {
      return await axios.get(`http://localhost:5000/transactions/`, {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("user")).accessToken
          }`,
        },
      });
    },
    {
      refetchOnWindowFocus: true,
      enabled: true,
    }
  );
  const date = new Date();
  if (isLoading) {
    return <Preloader />;
  }

  return (
    <>
      <div className="reflection all-transactions">
        <div className="section_table">
          <div className="table">
            <h2>All transactions</h2>

            <div className="fixTableHead">
              <table align="center" border={1} cellSpacing={0} cellPadding={5}>
                <thead>
                  <tr>
                    <td>Section</td>
                    <td className="plan_budget_data">Amount</td>
                    <td className="execution">Description</td>
                    <td>Date</td>
                  </tr>
                </thead>

                <tbody>
                  {data.data.map((value, i) => {
                    return (
                      <>
                        <tr>
                          <td>{value.section}</td>
                          <td>{value.amount}</td>
                          <td>{value.description}</td>
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
    </>
  );
}
