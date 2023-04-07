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
import { getAdminAgents } from "../../../Sagas/Requests";

const AdminDashboard = () => {
  const token = localStorage.getItem(user_storage_token);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const userType = localStorage.getItem(user_storage_type);
  const [refreshData, setRefreshData] = useState();
  const [admin, setadmin] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setloading] = useState(false);
  const [superAdminInfo, setSuperAdminInfo] = useState({});
  const [searchAgent, setSearchAgent] = useState(false);
  const [adminCreateSuccessModal, setAdminCreateSuccessModal] = useState(false);
  const [adminCreateModal, setAdminCreateModal] = useState(false);
  const [finconCreateModal, setFinconCreateModal] = useState(false);
  const [finconCreateSuccessModal, setFinconCreateSuccessModal] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

 
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
      return loadData();
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



  const loadData = ()=>{
    if(searchAgent){
      searchAgentByName()
    } 
    else {
      getAdminRegAgents()
    }
  }


  const getAdminRegAgents = async ()=>{
    const payload = { page : page, limit : limit, token :token } ;
    const res = await getAdminAgents(payload);
    console.log({res})
  }

  const searchAgentByName =()=>{

  }

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
        <Row className="w-100 m-0 p-0 mt-3">
          <Col xs={4} className="mt-4 ml-4">
            <h2
              className="ml-4 px-4"
              style={{
                fontFamily: "Philosopher",
                color: "#7D1312",
              }}
            >{`Admin ${admin?.first_name}`}</h2>
            <h5
              className="ml-4 px-4"
              style={{
                fontFamily: "Philosopher",
                color: "#CB601A",
              }}
            >
             Your Report Page
            </h5>
          </Col>
          <Col className="d-flex justify-content-end mt-4 ml-4">
            <FormGroup className="h-100 d-flex px-3 w-50 justify-content-end">
              <Button className="py-3 bg-info" onClick={()=>setAdminCreateModal(true)}>Create Agent</Button>
            </FormGroup>
          </Col>
        </Row>
        <Row className="w-100 d-flex mt-4  gap-4 justify-content-center align-items-center p-3 m-0">
          {financeReport.map((report, index) => (
            <Card
            key={index}
              className="shadow-sm border border-0 p-2 d-flex justify-content-center align-items-center flex-row rounded round-1"
              style={{ width: "250px", height: "150px" }}
            >
              {loading ? (
                <Spinner className="text-primary" />
              ) : (
                <>
                  <Col
                    xs={2}
                    className="d-flex text-success justify-content-center"
                  >
                    <i
                      className={report.icon}
                      style={{
                        fontSize: "1.5em",
                        color: index != 0 ? "red" : "green",
                      }}
                    ></i>
                  </Col>
                  <Col
                    xs={10}
                    className="d-flex flex-column justify-content-center h-100"
                    style={{ fontSize: "1em" }}
                  >
                    <Row
                      className="w-100 d-flex  text-primary justify-content-center m-0 "
                      style={{
                        fontSize: "0.9em",
                        fontFamily: "Montserrat-Regular",
                      }}
                    >
                      {report.title}
                    </Row>
                    <Row
                      className="d-flex text-success justify-content-center m-0 "
                      style={{ fontSize: "1.5em", fontFamily: "Ubuntu" }}
                    >
                      <div
                        className="p-0 d-flex m-0 w-100 flex-column align-items-center"
                        style={{
                          fontSize: "1em",
                          color: index != 0 ? "red" : "green",
                        }}
                      >
                        {
                          report?.amount
                        }
                      </div>
                    </Row>
                    <Row
                      className="w-100 text-primary d-flex justify-content-center m-0 "
                      style={{
                        fontSize: "0.8em",
                        fontFamily: "Montserrat-Regular",
                      }}
                    >
                      {`${report.startDate} - ${moment(report.endDate).format("DD-MM-YYYY")}`}
                    </Row>
                  </Col>
                </>
              )}
            </Card>
          ))}
        </Row>
        <Row className="w-100 text-primary  p-4 m-0 mt-5 d-flex ">
          <Card className="w-100 text-primary shadow-sm d-flex justify-content-center align-items-center border border-0 p-4 m-0">
          <Row className="d-flex mb-3 w-100 justify-content-end align-items-end">
              <Col>
                <h4 style={{ fontFamily: "Montserrat-SemiBold" }}>
                  Registered agents
                </h4>
              </Col>
              <Col xs={4}>
                <InputGroup className="d-flex m-0 p-0 border w-75 border-primary rounded justify-content-space-between">
                  <input
                  type="search"
                  // onChange={(e)=>setUserSearchAgent(e.target.value)}
                    className="rounded border w-75 border-0 bg-transparent px-2"
                    placeholder="Search agent name"
                    style={{
                      maxHeight: "2.4em",
                      outline: "none",
                    }}
                  />
                  <button
                
                  className="text-light d-flex flex-column justify-content-center align-items-center
                  bg-primary w-25 h-100 m-0 p-1 py-2 rounded-right"
                  // onClick={()=>handleAgentSearch()}
                   >{
                  
                    searchLoading? <Spinner/> :
                  <i 
                  className="bi bi-search"></i>
                  }</button>
                  
                </InputGroup>
              </Col>
            </Row>
            {
            loading? <Spinner/> : <AdminAgentTable data={[1,2,3]}/>
          }</Card>
        </Row>

        
        <CreateAgent
          on={adminCreateModal}
          success={adminCreateSuccessModal}
          offSuccess={offSuccessModal}
          onSuccess={()=>setAdminCreateSuccessModal(true)}
          fetchService={()=>console.log('ok')}
          off={() => setAdminCreateModal(!adminCreateModal)} />
        
        {/* <CreateFincon
          on={finconCreateModal}
          success={finconCreateSuccessModal}
          onSuccess={()=>setFinconCreateSuccessModal(true)}
          offSuccess={offFSuccessModal}
          off={() => setFinconCreateModal(!finconCreateModal)}
          fetchService={fetchService}
        /> */}

      </Col>
    </Container>
  );
};
export default AdminDashboard;
