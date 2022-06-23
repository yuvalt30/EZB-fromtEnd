import "./App.scss";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import Reflection from "./pages/Reflection/Reflection";
import Register from "./pages/Register/Register";
import { useEffect, useState } from "react";
import { createContext } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Budget from "./pages/Budget/Budget";
import PlanBudget from "./pages/PlanBudget/PlanBudget";
import { useSelector } from "react-redux";
import Settings from "./pages/Settings/Settings";
export const Data = createContext();

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const { sectionsArr, data, userRedux } = useSelector((state) => {
    return {
      sectionArr: state.sectionArr,
      data: state.data,
      userRedux: state.user,
    };
  });

  useEffect(() => {
    setUser(userRedux);

    if (localStorage.getItem("user")) {
      navigate("/", { replace: true });
      setUser(JSON.parse(localStorage.getItem("user")));
    } else navigate("/sign-in", { replace: true });
  }, []);

  return (
    <>
      <ToastContainer />
      <Data.Provider value={{ user, sectionsArr, data }}>
        <main>
          {location.pathname !== "/sign-in" && (
            <>
              <Sidebar
                user={
                  localStorage.getItem("user") &&
                  JSON.parse(localStorage.getItem("user"))
                }
              />
            </>
          )}
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/sign-in" element={<Login />} />

            {(user?.role === "admin" || user?.role === "ceo") && (
              <>
                <Route path="/budget" element={<Budget />} />
                <Route path="/reflection" element={<Reflection />} />
                <Route path="/register" element={<Register />} />
                <Route path="/plan-budget" element={<PlanBudget />} />
              </>
            )}
          </Routes>
        </main>
      </Data.Provider>
    </>
  );
}

export default App;
