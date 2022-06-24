import React from "react";

export default function Summery() {
  return (
    <div className="table">
      <h2>Summery</h2>
      <div className="fixTableHead">
        <table>
          <thead>
            <tr>
              <th>section</th>
              <th>planned income</th>
              <th>planned outcome</th>
              <th>planned balance</th>
              <th>current balance</th>
              <th>% of planned</th>
            </tr>
          </thead>
        </table>
      </div>
    </div>
  );
}
