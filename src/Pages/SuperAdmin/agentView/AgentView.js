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
import Styles from "./agent.module.css";
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
import {
  superAdminGetAgentArtisans,
  getAdminAgentCollection,
  superAdminSearchArtisans
} from "../../../Sagas/Requests";
import { useParams } from "react-router-dom";
import CustomerTable from "../components/customerTable";

export default function AgentView() {
  
  const [refreshData, setRefreshData] = useState();
  const [totalItem, setTotalItem] = useState({ totalItems: 0, count: 0, itemsPerPage: 0, currentPage: 0, totalPages: 0 });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { auth } = useSelector((state) => state);
  const [searchClient, setSearchClient] = useState(false);
  const [agentInfo, setAgentInfo] = useState();
  const [allDeposits, setAllDeposits] = useState();
  const [allCollections, setAllCollections] = useState();
  const [allPayouts, setAllPayouts] = useState();
  const [artisans, setArtisans] = useState([])
  const [admin, setadmin] = useState({});
  const [userInput, setUserInput] = useState('');
  const [loading, setloading] = useState(false);
  const [noOfCus,setNoOfCustomer] = useState('')
  const [searchLoading, setSearchLoading] = useState(false);
  const userType = localStorage.getItem(user_storage_type);

  const { agentId } = useParams();
  const token = localStorage.getItem(user_storage_token);

  // console.log({idHere:})

  const navActions = [
    { icon: "bi bi-envelope-fill", name: "Dashboard" },
    { icon: "bi bi-sliders", name: "Add Agent" },
    { icon: "bi bi-bell-fill", name: "Add Fin Con" },
  ];

  const fetch = async () => {
    if (searchClient){
      searchArtisan()
    }
    else {
      loadAgentData();
    }
  };

  useEffect(() => {
    checkToken();
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
      return fetch();
    }
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
 

  const loadAgentData = async () => {
    setloading(true)
    const payload = {
      page: page,
      limit: limit,
      token: token,
      agent_id: agentId,
    };
    const res = await superAdminGetAgentArtisans(payload);
    console.log(res );

    if (res?.data?.success) {
      setAgentInfo(res?.data?.data?.agent);
      setArtisans(res?.data?.data?.client?.docs);
      setTotalItem({
        totalItems: res?.data?.data?.client?.totalDocs,
        count: res?.data?.data?.client?.pagingCounter,
        itemsPerPage: res?.data?.data?.client?.limit,
        currentPage: res?.data?.data?.client?.page,
        totalPages: res?.data?.data?.client?.totalPages
      })
      setAllCollections(res?.data?.data?.total_collections);
      setAllDeposits(res?.data?.data?.total_remmitance);
      setAllPayouts(res?.data?.data?.total_payout);
      setNoOfCustomer(res?.data?.data?.client?.docs.length);
      
      
      setloading(false)
    }
  };


  const handleSearchArtisan = ()=>{
    setSearchClient(true)
    setRefreshData(!refreshData);
    }

  const searchArtisan = async () => {
    setSearchLoading(true);
    const payload = {
      agent_id: agentId,
      name : userInput,
      page : page,
      limit :limit,
      token: token
    };
    const res = await superAdminSearchArtisans(payload);
    console.log(res);
    if (res?.data?.success) {
      setArtisans(res?.data?.data?.docs);
      setTotalItem({
        totalItems: res?.data?.data?.totalDocs,
        count: res?.data?.data?.pagingCounter,
        itemsPerPage: res?.data?.data?.limit,
        currentPage: res?.data?.data?.page,
        totalPages: res?.data?.data?.totalPages
      })
      setSearchLoading(false);
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
      <Col xs={10} className={`${Styles.col2} min-vh-100 d-flex flex-column justify-content-center align-items-center`}>
        {
loading?<Spinner/> :
       <>
        <Row
          className="w-100 m-0 px-2 bg-white shadow-sm  bg-danger mb-3"
          style={{ height: "5em", maxHeight:'5em' }}
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

        <Row className="w-100 d-flex m-0 mb-2 justify-content-end">
          <Col
            className="d-flex flex-column align-items-start justify-content-start"
            style={{ fontFamily: "Montserrat" }}
          >
            <p
              className="p-0 m-0 mx-3"
              style={{ fontFamily: "Montserrat-SemiBold" }}
            >
              {`Total Custormers :  ${noOfCus}`}
            </p>
           
          </Col>
        </Row>
        <Row className="m-0 w-100">
          <Col
            xs={3}
            className=" d-flex flex-column align-items-center m-0"
            style={{ fontFamily: "Montserrat" }}
          >
            <img
              className="border border-primary"
              src={agentInfo?.image}
              style={{ maxHeight: "10em", maxWidth: "10em" }}
            />
            <p
              className="m-0 mt-2 "
              style={{ fontFamily: "Montserrat-SemiBold" }}
            >{`${agentInfo?.first_name} ${agentInfo?.last_name}`}</p>
            <p
              className="m-0 p-0"
              style={{}}
            >{`${agentInfo?.assigned_id}`}</p>
            <p className="m-0 p-0" style={{}}>{`${agentInfo?.mobile}`}</p>
          </Col>
          <Col xs={9} className="" style={{ fontFamily: "Montserrat" }}>
            <h5 className="mt-2 w-100 bg-secondary py-2 text-light d-flex justify-content-center">
              Agent Perfomance & Activity Record
            </h5>
            <Row className="m-0 d-flex gap-2 w-100">
              <Col xs={5} className=" p-0">
                <p
                  style={{ fontFamily: "Montserrat-Bold" }}
                  className="px-1 m-0 mt-2 text-success "
                >
                  {`Total Collections : ${Naira} ${allCollections}`}
                </p>
                <p
                  style={{ fontFamily: "Montserrat-Bold" }}
                  className="px-1 m-0 mt-2 text-primary "
                >
                  {`Total Deposits : ${Naira} ${allDeposits}`}
                </p>
                <p
                  style={{ fontFamily: "Montserrat-Bold" }}
                  className="px-1 m-0 mt-2 text-danger "
                >
                  {`Paid Out : ${Naira} ${allPayouts}`}
                </p>
                <p
                  style={{ fontFamily: "Montserrat-Regular" }}
                  className="px-1 m-0 mt-3  text-primary "
                >
                  {`Date Joined :  ${moment(agentInfo?.createdAt).format(
                    "DD-MM-YYYY"
                  )}`}
                </p>
                <p
                  style={{ fontFamily: "Montserrat-Regular" }}
                  className="px-1 m-0  text-primary "
                >
                  {`Nin :  ${agentInfo?.nin}`}
                </p>
                <p
                  style={{ fontFamily: "Montserrat-Regular" }}
                  className="px-1m-0  text-primary "
                >
                  {`Email :  ${agentInfo?.email}`}
                </p>
                <p
                  style={{ fontFamily: "Montserrat-Regular" }}
                  className="px-1 m-0 mt-3  text-primary "
                >
                  {`Address :  ${agentInfo?.address}`}
                </p>
              </Col>
              <Col
                className="d-flex p-0 lign-items-center border border-1 py-2"
                style={{
                  fontFamily: "Montserrat-Regular",
                  fontSize: "0.6em",
                }}
              >
                <Row className="w-100 d-flex p-0 m-0 align-items-center justify-content-center">
                  <div className="w-50 d-flex p-0 m-0 align-items-center justify-content-center gap-5">
                    <Card
                      className="rounded shadow-sm d-flex  align-items-center "
                      style={{
                        minWidth: "10em",
                        minHeight: "10em",
                        maxWidth: "10em",
                        cursor: "pointer",
                      }}
                      onClick={()=> navigate(`/super-admin/agent/transaction/${agentId}`)}
                    >
                      <i
                        className="bi bi-receipt text-secondary"
                        style={{
                          fontFamily: "Montserrat-SemiBold",
                          fontSize: "4em",
                        }}
                      ></i>
                      <p
                        className="p-1 m-0 bg-primary text-light text-center"
                        style={{
                          fontFamily: "Montserrat-SemiBold",
                          fontSize: "1em",
                        }}
                      >
                        View Transactions
                      </p>
                    </Card>
                  </div>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="w-100 text-primary  p-4 m-0 mt-5 d-flex ">
          <Card className="w-100 text-primary shadow-sm d-flex justify-content-center align-items-center border border-0 p-4 m-0">
            <Row className="d-flex mb-3 w-100 justify-content-end align-items-end">
              <Col>
                <h4 style={{ fontFamily: "Montserrat-SemiBold" }}>
                  Customers Under This Agent
                </h4>
              </Col>
              <Col xs={4}>
              <InputGroup className="d-flex m-0 p-0 border w-75 border-primary rounded justify-content-space-between">
                  <input
                  type="search"
                  onChange={(e)=>setUserInput(e.target.value)}
                  className="rounded border w-75 border-0 bg-transparent px-2"
                    placeholder="Customer name"
                    style={{
                      maxHeight: "2.4em",
                      outline: "none",
                    }}
                  />
                  <button
                  onClick={()=>handleSearchArtisan()}
                
                  className="text-light d-flex flex-column justify-content-center align-items-center
                  bg-primary w-25 h-100 m-0 p-1 py-2 rounded-right"
                  >{
                  
                    searchLoading? <Spinner/> :
                  <i 
                  className="bi bi-search"></i>
                  }</button>
                  
                </InputGroup>
              </Col>
            </Row>
            {loading ? <Spinner /> : <CustomerTable data={artisans} />}
            <Row className="w-100 mb-4">
        {
          artisans.length > 0 ? (
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
          </Card>
        </Row>
        </>
      }</Col>
    </Container>
  );
}
