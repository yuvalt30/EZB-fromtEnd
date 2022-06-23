import { Icon } from "@iconify/react";
import React from "react";
import Dropdown from "../../components/Dropdown/Dropdown";
import "./Settings.scss";

export default function Settings() {
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
  return (
    <div className="setting">
      {/* <Dropdown
        tittle={"Start From"}
        companyData={months}
        getIndex={(e) => {
          // setMonthNo();
          let arr = monthArr;
          const x = arr.slice(e);
          setMonthNo(x.concat(arr.slice(0, e)));
        }}
        defaultValue={"Starts from"}
      /> */}
      <Icon icon="ant-design:setting-filled" />
    </div>
  );
}
