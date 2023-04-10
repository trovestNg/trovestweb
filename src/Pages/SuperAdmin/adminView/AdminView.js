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
import { superAdminGetAdminAgents,getAdminAgentCollection,superAdminSearchAgent } from "../../../Sagas/Requests";
import { useParams } from "react-router-dom";
import AgentTable from "../components/agentTable";

const userType = localStorage.getItem(user_storage_type);

export default function AdminView() {
  const [refreshData, setRefreshData] = useState();
  const dispatch = useDispatch();
  const [totalItem, setTotalItem] = useState({ totalDocs: 0, count: 0, itemsPerPage: 0, currentPage: 0, totalPages: 0 });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const navigate = useNavigate();
  const { auth } = useSelector((state) => state);
  const [openModal, setopenModal] = useState(false);
  const [admin, setadmin] = useState({});
  const [adminAgents, setAdminAgents] = useState([])
  const [adminData, setAdminData] = useState();
  const [totalDeposits, setTotalDeposits] = useState();
  const [totalCollections, setTotalCollections] = useState();
  const [totalPayouts, setTotalPayouts] = useState();
  const [loading, setloading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [superAdminInfo, setSuperAdminInfo] = useState({});
  const [searchAgent, setSearchAgent] = useState(false);
  const [adminCreateSuccessModal, setAdminCreateSuccessModal] = useState(false);
  const [adminCreateModal, setAdminCreateModal] = useState(false);
  const [finconCreateModal, setFinconCreateModal] = useState(false);
  const [finconCreateSuccessModal, setFinconCreateSuccessModal] =
    useState(false);
    const [userSearchAgent, setUserSearchAgent] = useState('');

  const { adminId } = useParams();
  const token = localStorage.getItem(user_storage_token);

  const navActions = [
    { icon: "bi bi-envelope-fill", name: "Dashboard" },
    { icon: "bi bi-sliders", name: "Add Agent" },
    { icon: "bi bi-bell-fill", name: "Add Fin Con" },
  ];

  
  
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
      return fetch();
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
 

  const fetch = async () => {

    if(searchAgent){
      agentSearch();
    }
    else {
      loadAdminData()
    }
  };

const loadAdminData = async ()=>{
  setloading(true)
 
    const payload = { 

      token : token,
      page : page, 
      limit : limit,
      admin_id : adminId
    }
  
const res = await superAdminGetAdminAgents(payload);
if(res?.data?.success){
  
  setAdminData(res?.data?.data?.admin);
  setAdminAgents(res?.data?.data?.agents?.docs)
  setTotalCollections(res?.data?.data?.total_collections);
  setTotalDeposits(res?.data?.data?.total_remmitance);
  setTotalPayouts(res?.data?.data?.total_payout);
  setloading(false)
}
console.log(res)
}


  useEffect(() => {
    checkToken();
  }, [!refreshData]);
  
  const handleAgentSearch = ()=>{
    setSearchAgent(true);
    setRefreshData(!refreshData)
    }

    const handleclearName = (e) => {
      setSearchAgent(false)
      setRefreshData(!refreshData)
  
    }

  const agentSearch = async ()=>{
    setSearchLoading(true);
    const payload = { 
      token : token,
      page : page, 
      limit : limit,
      name : userSearchAgent}

   const res = await superAdminSearchAgent(payload);
   if(res?.data?.success){
    setSearchLoading(false);
    setAdminAgents(res?.data?.data?.docs);
    setTotalItem({totalDocs: res?.data?.data?.totalDocs, pagingCounter: res?.data?.data?.pagingCounter,
    pagingCounter: res?.data?.data?.pagingCounter, currentPage: 0, totalPages: 0 })
   }
   console.log({searchedHere : res})

  }
  


  
  console.log({ respon: adminData });
  return (
    <Container fluid className={`d-flex p-0 ${Styles.container} min-vh-100`}>
      {/* side bar */}
      <SuperSideNav superAdminInfo={admin} />
      {/* page */}

      <Col xs={10} className={`${Styles.col2} min-vh-100 d-flex flex-column justify-content-center align-items-center`}>
        { loading? <Spinner/> :
        <>
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
          className="w-100 d-flex justify-content-end m-0 p-0"
          style={{ backgroundColor: "#FBFBFB" }}
        >
          <Col xs={4} className="mt-2 ">
            {loading? '':
              <>
            <h2
              className="ml-4 px-4"
              style={{
                fontFamily: "Philosopher",
                color: "#01065B",
              }}
            >{`Admin ${adminData?.first_name}`}</h2>
            <h5
              className="ml-4 px-4"
              style={{
                fontFamily: "Philosopher",
                color: "#01065B",
              }}
            >
              Activity Report Page
            </h5>
            <p 
                  style={{
                    fontFamily: "Montserrat-Bold",
                    
                  }}
                  className="px-4 m-0 mt-4 text-primary "
                >
                  {`Agents Collection : ${Naira} ${totalCollections} `}
                </p>
                <p 
                  style={{
                    fontFamily: "Montserrat-Bold",
                    
                  }}
                  className="px-4 m-0 mt-2 text-success "
                >
                  {`Agents Deposit : ${Naira} ${totalDeposits} `}
                </p>

                <p
                  style={{
                    fontFamily: "Montserrat-Bold",
                    
                  }}
                  className="px-4 text-secondary m-0 mt-2" 
                >
                  {`Agents PayOut : ${Naira} ${totalPayouts} `}
                </p>
            </>
            }
          </Col>
          <Col className="d-flex flex-column py-3  align-items-center">
            { loading?'':<div className="d-flex gap-3">
              <div>
                <p
                  style={{
                    fontFamily: "Montserrat-Regular",
                    color: "#01065B",
                  }}
                  className="p-0 mt-2"
                >
                  {`Full Name : ${adminData?.first_name} ${adminData?.last_name}`}
                </p>
                <p
                  style={{
                    fontFamily: "Montserrat-Regular",
                    color: "#01065B",
                  }}
                  className="p-0 mt-2"
                >
                  {`Email : ${adminData?.email}`}
                </p>
                <p
                  style={{
                    fontFamily: "Montserrat-Regular",
                    color: "#01065B",
                  }}
                  className="p-0 mt-2"
                >
                  {`Phone : ${adminData?.mobile}`}
                </p>
                <p
                  style={{
                    fontFamily: "Montserrat-Regular",
                    color: "#01065B",
                  }}
                  className="p-0 mt-2"
                >
                  {`Address : ${adminData?.address}`}
                </p>
                <p
                  style={{
                    fontFamily: "Montserrat-Regular",
                    color: "#01065B",
                  }}
                  className="p-0 mt-2"
                >
                  {`Date Joined : ${moment(adminData?.createdAt).format(
                    "DD-MM-YYYY"
                  )}`}
                </p>
              </div>
              <img
                src={adminData?.image}
                className="rounded mr-4"
                style={{ maxWidth: "8em", maxHeight: "8em" }}
              />
            </div>}
          </Col>
        </Row>
        <Row className="w-100 text-primary  p-4 m-0 mt-5 d-flex ">
          <Card className="w-100 text-primary shadow-sm d-flex justify-content-center align-items-center border border-0 p-4 m-0">
          <Row className="d-flex mb-3 w-100 justify-content-end align-items-end">
              <Col>
                <h4 style={{ fontFamily: "Montserrat-SemiBold" }}>
                  Agents Under This Admin
                </h4>
              </Col>
              <Col xs={4}>
                <InputGroup className="d-flex m-0 p-0 border w-75 border-primary rounded justify-content-space-between">
                  <input
                  type="search"
                  onChange={(e)=>setUserSearchAgent(e.target.value)}
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
                  onClick={()=>handleAgentSearch()}>{
                  
                    searchLoading? <Spinner/> :
                  <i 
                  className="bi bi-search"></i>
                  }</button>
                  
                </InputGroup>
              </Col>
            </Row>
            {
            loading? <Spinner/> : <AgentTable data={adminAgents}/>
          }</Card>
        </Row>

        <CreateFincon
          on={finconCreateModal}
          success={finconCreateSuccessModal}
          offSuccess={() =>
            setAdminCreateSuccessModal(!finconCreateSuccessModal)
          }
          off={() => setFinconCreateModal(!finconCreateModal)}
        />
      </>}</Col>
    </Container>
  );
}
