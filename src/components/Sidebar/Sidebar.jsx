import { Icon } from "@iconify/react";
import React, { useCallback, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.scss";
export default function Sidebar({ user }) {
  const navigate = useNavigate();
  const logOut = useCallback(() => {
    localStorage.setItem("user", null);
    navigate("/sign-in");
  }, [localStorage.getItem("user")]);

  return (
    <div className="navigation">
      <ul>
        <li>
          <NavLink to="/dashboard">
            <span className="title">Brand Name</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/">
            <Icon icon="fluent:cube-rotate-20-filled" />
            <span className="title">Transactions</span>
          </NavLink>
        </li>

        {(user?.role === "ceo" || user?.role === "admin") && (
          <>
            <li>
              <NavLink to="/register">
                <Icon icon="carbon:data-enrichment-add" />
                <span className="title">Register</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/budget">
                <Icon icon="mdi:account-cash-outline" />
                <span className="title">Budget</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/plan-budget">
                <Icon icon="carbon:heat-map-02" />
                <span className="title">Plan Budget</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/reflection">
                <Icon icon="el:graph-alt" />
                <span className="title">Reflection</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/all-transactions">
                <Icon icon="el:graph-alt" />
                <span className="title">All transactions</span>
              </NavLink>
            </li>
          </>
        )}
      </ul>
      <button onClick={logOut}>
        <span className="title">Log out</span>
      </button>
    </div>
  );
}
