import { useEffect, useState } from "react";
import { Container, Col, Row, Tabs, Tab } from "react-bootstrap";
import { toast } from "react-toastify";
import DashboardPage from "../../../Components/Dashboard/dashboardPage";
import Styles from "./sadmin.module.css";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  user_storage_token,
  user_storage_name,
  dateFormat,
  convertToThousand,
  Naira,
  calculateRevenueTotalObject,
  user_storage_type,
} from "../../../config";
import { setAgentAction } from "../../../Reducers/agent.reducer";
import { setAdminAction } from "../../../Reducers/admin.reducer";
import { getAdmin } from "../../../Sagas/Requests";
import DisplayMessage from "../../../Components/Message";
import CreateAdmin from "../components/createAdmin";
import CreateFincon from "../components/createFincon";
import api from "../../../app/controllers/endpoints/api";
import moment from "moment";
import DefaultTable from "../../../Components/Dashboard/components/defaultTable";
import SuperSideNav from "../../SuperAdmin/components/supersidebar";
import AdminSideNav from "../components/adminsidebar";
import "./tabs.module.css";
import {
  superAdminGetAdminAgents,
  getAdminAgentCollection,
} from "../../../Sagas/Requests";
import { useParams } from "react-router-dom";
import Remittance from "./tabs/remittance";
import Collections from "./tabs/collections";
import Payouts from "./tabs/payouts";

const userType = localStorage.getItem(user_storage_type);

export default function ATransactionView() {
  const [refreshData, setRefreshData] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { auth } = useSelector((state) => state);
  const [openModal, setopenModal] = useState(false);
  const [admin, setadmin] = useState({});
  const [loading, setloading] = useState(false);
  const [superAdminInfo, setSuperAdminInfo] = useState({});
  const [superAdminAdminData, setSuperAdminAdminData] = useState();
  const [adminCreateSuccessModal, setAdminCreateSuccessModal] = useState(false);
  const [adminCreateModal, setAdminCreateModal] = useState(false);
  const [finconCreateModal, setFinconCreateModal] = useState(false);
  const [finconCreateSuccessModal, setFinconCreateSuccessModal] =
    useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);

  const { adminId } = useParams();
  const token = localStorage.getItem(user_storage_token);
  const adminAgents = superAdminAdminData?.agents?.docs;
  const adminData = superAdminAdminData?.admin;

  const navActions = [
    { icon: "bi bi-envelope-fill", name: "Dashboard" },
    { icon: "bi bi-sliders", name: "Add Agent" },
    { icon: "bi bi-bell-fill", name: "Add Fin Con" },
  ];

  const fetch = async () => {
   console.log('ok')
  };

  useEffect(() => {
    checkToken()
  }, [!refreshData]);

  const checkToken = () => {

    const userData = localStorage.getItem(user_storage_name);
    userData !== null ? setadmin(JSON.parse(userData)) : setadmin({});
    if (
      (token === null && (userType === null || userType !== "admin")) ||
      userType === "fincon"
    ) {
      alert("Unauthorized Access");
      logUserOut();
    } else {
      return fetch();
    }
  };


  const getSuperAdminAgents = async () => {
    const payload = {
      page: page,
      limit: limit,
      token: token,
      admin_id: adminId,
    };

    const res = await superAdminGetAdminAgents(payload);
    console.log({ responsehere: res?.data });

    if (res?.data?.success) {
      setSuperAdminAdminData(res?.data?.data);
    }
  };

  const getAdmintRevenue = async () => {
    const payload = {
      agent_id: adminId,
      token: token,
    };
    const res = await getAdminAgentCollection(payload);
    console.log({ agentTCollect: res });
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
  console.log({ respon: superAdminAdminData });
  return (
    <Container fluid className={`d-flex p-0 ${Styles.container} min-vh-100`}>
      {/* side bar */}
      <AdminSideNav adminInfo={admin} />
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
          className="w-100 d-flex justify-content-end m-0 p-0 mt-3"
          style={{ backgroundColor: "#FBFBFB" }}
        >
          <h4>Agent Bola Transaction Report</h4>
        </Row>
        <div className="w-100  ">
          <Container fluid className="">
            <Row className="d-flex justify-content-center m-0">
              <Col className="w-100 d-flex flex-column align-items-center">
                <Row className="w-100">
                  <Tabs
                    className="d-flex justify-content-center align-items-center px-3 m-0  gap-5 mt-5 mb-4"
                    defaultActiveKey="remitance"
                    variant="pills"
                    id=""
                  >
                    <Tab
                      eventKey="remitance"
                      title="Deposits"
                      className="w-100 mt-4"
                      tabClassName="border-1 px-5 py-2 w-100 rounded-5"
                    >
                      <Remittance />
                    </Tab>
                    <Tab
                      eventKey="collections"
                      title="Collections"
                      className="w-100 mt-4"
                      tabClassName="px-5 py-2 w-100 rounded-5"
                    >
                      <Collections />
                    </Tab>
                    <Tab
                      eventKey="payouts"
                      title="Pay outs"
                      className="w-100 mt-4"
                      tabClassName="px-5 w-100 py-2 rounded-5"
                    >
                      <Payouts />
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
