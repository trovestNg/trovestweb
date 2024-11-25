import { useEffect, useState } from "react";
import {
  Container,
  Col,
  Row,
  Card,
  Table,
  FormGroup,
  Button,
  InputGroup,
  Spinner,
} from "react-bootstrap";
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
import SuperSideNav from "../components/supersidebar";
import { getSuperAdmins } from "../../../Sagas/Requests";

const userType = localStorage.getItem(user_storage_type);

export default function SuperAdminDashboard() {

  const [refreshData, setRefreshData] = useState();
  const [totalItem, setTotalItem] = useState({ totalItems: 0, count: 0, itemsPerPage: 0, currentPage: 0, totalPages: 0 });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { auth } = useSelector((state) => state);
  const [openModal, setopenModal] = useState(false);
  const [admin, setadmin] = useState({});
  const [loading, setloading] = useState(false);
  const [superAdminInfo, setSuperAdminInfo] = useState({});
  const [admins,setAdmins] = useState([]);
  
  const [ superAdminData, setSuperAdminData] = useState()
  const [adminCreateSuccessModal, setAdminCreateSuccessModal] = useState(false);
  const [adminCreateModal, setAdminCreateModal] = useState(false);
  const [finconCreateModal, setFinconCreateModal] = useState(false);
  const [finconCreateSuccessModal, setFinconCreateSuccessModal] = useState(false);
  const token = localStorage.getItem(user_storage_token);

  console.log(userType);
 
  const navActions = [
    { icon: "bi bi-envelope-fill", name: "Dashboard" },
    { icon: "bi bi-sliders", name: "Add Agent" },
    { icon: "bi bi-bell-fill", name: "Add Fin Con" },
  ];

  const collections = convertToThousand(superAdminInfo?.total_collections);
  const deposits = convertToThousand(superAdminInfo?.total_remmitance);
  const payouts = convertToThousand(superAdminInfo?.total_payout);

  const financeReport = [
    {
      icon: "bi bi-arrow-down",
      title: "Total Collections",
      amount: collections,
      startDate: '23-01-2023',
      endDate: new Date(),
    },
    {
      icon: "bi bi-bank2",
      title: "Total Deposits",
      amount: deposits,
      startDate: '23-01-2023',
      endDate: new Date(),
    },
    {
      icon: "bi bi-arrow-up",
      title: "Total Payout",
      amount: payouts,
      startDate: '23-01-2023',
      endDate: new Date(),
    },
  ];

  const fetch = async () => {
    
  };

  useEffect(() => {
    checkToken();
    // getSuperAdminAdmins();
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
      return fetchService();
    }
  };

  const fetchService = async () => {
    setloading(true);
    const res = await api.get(`/super/dashboard?limit=${limit}&page=${page}`, token);
    if (res?.data?.success) {
      setSuperAdminInfo(res?.data?.data);
      setAdmins(res?.data?.data?.superadmin?.admin)
      setTotalItem({
        totalItems: res?.data?.data?.revenue?.totalDocs,
        count: res?.data?.data?.revenue?.pagingCounter,
        itemsPerPage: res?.data?.data?.revenue?.limit,
        currentPage: res?.data?.data?.revenue?.page,
        totalPages: res?.data?.data?.revenue?.totalPages
      })
      setloading(false);
    }
  };

  // super/get-admin-agents/63c940489c10ef9027250fae?page=1&limit=30

  console.log(superAdminInfo)
  const getSuperAdminAdmins = async ()=>{
    const res = await getSuperAdmins(token);
    console.log({responsehere : res?.data});

    if(res?.data?.success){
      setSuperAdminData(res?.data?.data)
    }
  }
  const offSuccessModal = ()=>{
    setAdminCreateSuccessModal(false)
    setRefreshData(!refreshData)
  }

  const offFSuccessModal = ()=>{
    setFinconCreateSuccessModal(false);
    setRefreshData(!refreshData)
  }

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

  const handlePagination = (value) => {
    setPage(value);
    setRefreshData(!refreshData);
  }

  const handleNext = () => {
    setPage(totalItem.currentPage + 1)
    setRefreshData(!refreshData)

  }

  const handlePrevious = () => {
    setPage(totalItem.currentPage - 1)
    setRefreshData(!refreshData)
  };

  return (
    <Container fluid className={`d-flex p-0 ${Styles.container} min-vh-100`}>
      {/* side bar */}
      <SuperSideNav superAdminInfo={admin}/>
      {/* page */}
      <Col xs={10} className={`${Styles.col2} min-vh-100 d-flex flex-column justify-content-center align-items-center`}>{
      loading? <Spinner/> :
        <>
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
        <Row className="w-100 m-0 p-0 mt-3">
          <Col xs={4} className="mt-4 ml-4">
            <h2
              className="ml-4 px-4"
              style={{
                fontFamily: "Philosopher",
                color: "#7D1312",
              }}
            >{`Welcome ${admin?.first_name}`}</h2>
            <h5
              className="ml-4 px-4"
              style={{
                fontFamily: "Philosopher",
                color: "#01065B",
              }}
            >
              Overall Finacial Report Page
            </h5>
          </Col>
          <Col className="d-flex justify-content-end mt-4 ml-4">
            { userType == 'fin_con'? '' :
              <FormGroup className="h-100 d-flex px-3 w-50 gap-2">
              <Button  className="py-3" onClick={()=>setAdminCreateModal(true)}>Create admin</Button>
              <Button className="py-3 bg-secondary" onClick={()=>setFinconCreateModal(true)}>Create finCon</Button>
            </FormGroup>}
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
                    className="d-flex justify-content-center"
                  >
                    <i
                      className={report.icon}
                      style={{
                        fontSize: "1.5em",
                        color: index === 0 ? "primary" : index === 1 ?  "green": index === 2 ? 'danger':'none',
                      }}
                    ></i>
                  </Col>
                  <Col
                    xs={10}
                    className="d-flex flex-column justify-content-center h-100"
                    style={{ fontSize: "1em" }}
                  >
                    <Row
                      className="w-100 d-flex  justify-content-center m-0 "
                      style={{
                        fontSize: "0.9em",
                        fontFamily: "Montserrat-Regular",
                      }}
                    >
                      {report.title}
                    </Row>
                    <Row
                      className="d-flex justify-content-center m-0 "
                      style={{ fontSize: "1.5em", fontFamily: "Ubuntu" }}
                    >
                      <div
                        className="p-0 d-flex m-0 w-100 flex-column align-items-center"
                        style={{
                          fontSize: "1em",
                          color: index === 0 ? "primary" : index === 1 ? "green" : index === 2 ? "danger":"danger",
                        }}
                      >
                       
                        {
                          
                          report?.amount
                        }
                      </div>
                    </Row>
                    <Row
                      className="w-100  d-flex justify-content-center m-0 "
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
          <Card className="w-100 text-primary shadow-sm border border-0 p-4 m-0 d-flex ">
            <DefaultTable data={admins} />
          </Card>
        </Row>
        <Row className="w-100 mb-4">
        {
          admins.length > 0 ? (
            <nav aria-label="..." className="d-flex justify-content-center ">
              <ul className="pagination">
                <Button className="page-item" 
                disabled={totalItem.currentPage == 1}
                onClick={handlePrevious}
                >
                  Previous
                </Button>
                {
                  Array(totalItem.totalPages).fill("").map((value, index)=>(
                    <li
                    key={index}
                    onClick={() => handlePagination(index + 1)}
                      
                      className="page-item"
                    >
                      <a className="page-link"
                      style={{ backgroundColor: index + 1 == totalItem.currentPage ? 'gray' : '', cursor: 'pointer' }}
                       >{index + 1}</a>
                    </li>
                  ))
                }
                <Button className="page-item" 
                disabled={totalItem.currentPage == totalItem.totalPages}
                onClick={handleNext}
                >
                  Next
                </Button>
              </ul>
            </nav>
          ) : null
        }
      </Row>

        
        <CreateAdmin
          on={adminCreateModal}
          success={adminCreateSuccessModal}
          offSuccess={offSuccessModal}
          onSuccess={()=>setAdminCreateSuccessModal(true)}
          fetchService={fetchService}
          off={() => setAdminCreateModal(!adminCreateModal)} />
        
        <CreateFincon
          on={finconCreateModal}
          off={() => setFinconCreateModal(false)}
          success={finconCreateSuccessModal}
          onSuccess={()=>setFinconCreateSuccessModal(true)}
          offSuccess={offFSuccessModal}
          
          fetchService={fetchService}
        />
        </>

      }</Col>
    </Container>
  );
}