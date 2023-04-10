import React, { useEffect,useState } from "react";
import { Container,
  Col,
  Row,
  Card,
  FormGroup,
  Button,
  InputGroup,
  Spinner, } from "react-bootstrap";

import {
  user_storage_token,
  user_storage_type,
  user_storage_name,
} from "../../../config";
import Styles from "./admin.module.css";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAgentAction } from "../../../Reducers/agent.reducer";
import { setAdminAction } from "../../../Reducers/admin.reducer";
import DisplayMessage from "../../../Components/Message";
import AdminSideNav from "../components/adminsidebar";
import { adminNavActions } from "../../../constants/constants";
import { convertToThousand } from "../../../config";
import moment from "moment";
import DefaultAdminTable from "../../../Components/Dashboard/components/defaultAdminTable";
import AdminAgentTable from "../../../Components/Dashboard/components/adminAgenTable";
import CreateAdmin from "../../SuperAdmin/components/createAdmin";
import CreateAgent from "../../SuperAdmin/components/createAgent";
import api from "../../../app/controllers/endpoints/api";

const AdminTransactionsManagement = () => {
  const token = localStorage.getItem(user_storage_token);
  const userType = localStorage.getItem(user_storage_type);
  const [refreshData, setRefreshData] = useState();
  const [admin, setadmin] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setloading] = useState(false);
  const [superAdminInfo, setSuperAdminInfo] = useState({});
  const [adminCreateSuccessModal, setAdminCreateSuccessModal] = useState(false);
  const [adminCreateModal, setAdminCreateModal] = useState(false);
  const [finconCreateModal, setFinconCreateModal] = useState(false);
  const [finconCreateSuccessModal, setFinconCreateSuccessModal] = useState(false);

  const financeReport = [
    {
      icon: "bi bi-arrow-down",
      title: "Total Revenue",
      amount: 500,
      startDate: moment(admin?.createdAt).format('DD-MM-YYYY'),
      endDate: new Date(),
    },
    {
      icon: "bi bi-arrow-up",
      title: "Total Payout",
      amount: 6000,
      startDate: moment(admin?.createdAt).format('DD-MM-YYYY'),
      endDate: new Date(),
    },
  ];

  const revenue = convertToThousand({total_revenue:250}?.total_revenue);
  const payouts = convertToThousand({total_revenue:250}?.total_payout);
  const admins  = superAdminInfo?.superadmin?.admin

  const offSuccessModal = ()=>{
    setAdminCreateSuccessModal(false)
    setRefreshData(!refreshData)
  }

  console.log(admin)
  const offFSuccessModal = ()=>{
    setFinconCreateSuccessModal(false);
    setRefreshData(!refreshData)
  }

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
      return
    }
  };

  const logUserOut = () => {
    DisplayMessage("logged Out", "success");
    localStorage.removeItem(user_storage_name);
    localStorage.removeItem(user_storage_type);
    localStorage.removeItem(user_storage_token);

    const data = {
      agents: [],
      data: {},
      token: "",
    };
    dispatch(setAdminAction(data));
    return navigate("/");
  };

  const fetchService = async () => {
    setloading(true);
    const res = await api.get(`/super/dashboard?limit=30`, token);
    if (res?.data?.success) {
      setSuperAdminInfo(res?.data?.data);
      setloading(false);
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <Container fluid className={`d-flex p-0 ${Styles.container} min-vh-100`}>
      {/* side bar */}
      <AdminSideNav adminInfo={admin}/>
      {/* page */}
      <Col xs={10} className={`${Styles.col2} min-vh-100 d-flex flex-column  align-items-center`}>
        { loading?  <Spinner/> :
        <>
        <Row
          className="w-100 m-0 px-2 bg-white shadow-sm mb-3"
          style={{ minHeight: "5em" }}
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
              {adminNavActions.map((action, index) => (
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
        
        
        {/* <Row className="w-100 text-primary  p-4 m-0 mt-5 d-flex ">
          <Card className="w-100 text-primary shadow-sm border border-0 p-4 m-0 d-flex ">
            <AdminAgentTable data={[1,2,3,4]} />
          </Card>
        </Row> */}
</>
      }</Col>
    </Container>
  );
};
export default AdminTransactionsManagement;
