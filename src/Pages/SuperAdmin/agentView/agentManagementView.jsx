import { useEffect, useState } from "react";
import { Container, Col, Row, Tabs, Tab } from "react-bootstrap";
import { toast } from "react-toastify";
import DashboardPage from "../../../Components/Dashboard/dashboardPage";
import Styles from "./agent.module.css";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import api from "../../../app/controllers/endpoints/api";
import {
    user_storage_token,
  user_storage_name,
  user_storage_type
 } from "../../../config";
import { setAgentAction } from "../../../Reducers/agent.reducer";
import { setAdminAction } from "../../../Reducers/admin.reducer";
import DisplayMessage from "../../../Components/Message";
import SuperSideNav from "../components/supersidebar";
import ApprovedAgents from "./tabs/approvedAgents";



const userType = localStorage.getItem(user_storage_type);

export default function AgentManagement() {
  

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [admin, setadmin] = useState({});
  const [refreshData, setRefreshData] = useState(false);
  const token = localStorage.getItem(user_storage_token);

  const navActions = [
    { icon: "bi bi-envelope-fill", name: "Dashboard" },
    { icon: "bi bi-sliders", name: "Add Agent" },
    { icon: "bi bi-bell-fill", name: "Add Fin Con" },
  ];

  

  useEffect(() => {
    checkToken()
  }, [!refreshData]);

  const checkToken = () => {
    const userData = localStorage.getItem(user_storage_name);
    userData !== null ? setadmin(JSON.parse(userData)) : setadmin({});
    if (
      (token === null && (userType === null || userType === "admin")) ||
      userType === "admin"
    ) {
      alert("Unauthorized Access");
      logUserOut();
    } else {
      return
    }
  };


  const logUserOut = () => {
    DisplayMessage("logged Out", "success");
    localStorage.removeItem(user_storage_name);
    localStorage.removeItem(user_storage_token);
    const superAdminInfo = {
      agents: [],
      superAdminInfo: {},
      token: "",
    };
    dispatch(setAgentAction(superAdminInfo));
    dispatch(setAdminAction(superAdminInfo));
    return navigate("/");
  };

  return (
    <Container fluid className={`d-flex p-0 ${Styles.container} min-vh-100`}>
      {/* side bar */}
      <SuperSideNav superAdminInfo={admin} />
      {/* page */}
      <Col xs={10} className={`${Styles.col2} min-vh-100`}>
        {/* navbar constant */}
        <Row
          className="w-100 m-0 px-2 bg-white shadow-sm mb-3"
          style={{ height: "5em" }}
        >
          {/* search bar column */}
          <Col xs={9}></Col>
          {/* notification column */}
          <Col xs={3} className="">
            <ul
              className="d-flex flex-row gap-3 align-items-center 
                        justify-content-center h-100"
              style={{ listStyle: "none" }}
            >
              {navActions.map((action, index) => (
                <div
                  key={index}
                  onClick={() => console.log(index)}
                  className="shadow-sm d-flex align-items-center justify-content-center"
                  style={{
                    width: "2em",
                    height: "2em",
                    borderRadius: "1em",
                    backgroundColor: "#fff",
                    cursor: "pointer",
                  }}
                >
                  <i className={action.icon} style={{ color: "#7D1312" }} />
                </div>
              ))}
            </ul>
          </Col>
        </Row>

        <Row
          className="w-100 d-flex justify-content-end m-0 p-0 mt-3 mx-4"
          style={{ backgroundColor: "#FBFBFB" }}
        >
          <h4 style={{ fontFamily:'Montserrat' }}>Agents Management</h4>
        </Row>
        <div className="w-100  ">
          <Container fluid className="">
            <Row className="d-flex justify-content-center m-0">
              <Col className="w-100 d-flex flex-column align-items-center">
                <Row className="w-100">
                  <Tabs
                    className="d-flex justify-content-center align-items-center px-3 m-0  gap-5 mt-5 mb-4"
                    defaultActiveKey="allAgents"
                    variant="pills"
                    id=""
                  >
                    
                    <Tab
                      eventKey="allAgents"
                      title="All Registered Agents"
                      className="w-100 mb-4"
                      tabClassName="border-1 px-5 py-2 w-100 rounded-5"
                    >
                      <ApprovedAgents/>
                    </Tab>
                  </Tabs>
                </Row>
              </Col>
            </Row>
          </Container>
        </div>
      </Col>
    </Container>
  );
}
