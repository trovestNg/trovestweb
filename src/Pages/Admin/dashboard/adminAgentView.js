import React, { useEffect, useState } from "react";
import {
  Container,
  Col,
  Row,
  Card,
  FormGroup,
  Button,
  InputGroup,
  Spinner,
  Modal,
} from "react-bootstrap";

import {
  user_storage_token,
  user_storage_type,
  user_storage_name,
} from "../../../config";
import Styles from "./admin.module.css";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { setAgentAction } from "../../../Reducers/agent.reducer";
import { setAdminAction } from "../../../Reducers/admin.reducer";
import DisplayMessage from "../../../Components/Message";
import AdminSideNav from "../components/adminsidebar";
import { adminNavActions } from "../../../constants/constants";
import { convertToThousand } from "../../../config";
import moment from "moment";
import api from "../../../app/controllers/endpoints/api";
import { Naira } from "../../../config";
import AdminCustomerTable from "../components/adminCustomerTable";
import UpdateAgentBio from "../../../Components/Modal/agentBioModal";
import UpdateAgentPass from "../../../Components/Modal/agentPassModal";

const AdminAgentView = () => {
  const token = localStorage.getItem(user_storage_token);
  const userType = localStorage.getItem(user_storage_type);
  const [refreshData, setRefreshData] = useState(false);
  const [admin, setadmin] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setloading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [userInput, setUserInput] = useState("");

  const [updateAgentInfo, setUpdateAgentInfo] = useState(false);
  const [updateAgentPass, setUpdateAgentPass] = useState(false);

  const [agentInfo, setAgentInfo] = useState();
  const [allDeposits, setAllDeposits] = useState();
  const [allCollections, setAllCollections] = useState();
  const [allPayouts, setAllPayouts] = useState();
  const [artisans, setArtisans] = useState();

  const [adminCreateSuccessModal, setAdminCreateSuccessModal] = useState(false);
  const [searchClient, setSearchClient] = useState(false);

  const [finconCreateSuccessModal, setFinconCreateSuccessModal] =
    useState(false);

  const { agentId } = useParams();

  const offSuccessModal = () => {
    setAdminCreateSuccessModal(false);
    setRefreshData(!refreshData);
  };

  const offFSuccessModal = () => {
    setFinconCreateSuccessModal(false);
    setRefreshData(!refreshData);
  };

  const handleUpdateAgentBio = () => {};

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

  const fetch = () => {
    if (searchClient) {
      searchartisan();
    } else {
      fetchAgentArtisans();
    }
    fetchAgentInfo();
  };

  const handleSearchArtisan = () => {
    setSearchClient(true);
    setRefreshData(!refreshData);
  };
  const searchartisan = async () => {
    console.log("search");
  };
  // const loadData = ()=>{
  //   fetchAgentInfo();
  //   fetchAgentArtisans();
  // }
  const fetchAgentInfo = async () => {
    setloading(true);
    const res = await api.get(`/admin/agent/${agentId}`, token);
    console.log(res);
    if (res?.data?.success) {
      setAgentInfo(res?.data?.data?.agent);
      setAllCollections(res?.data?.data?.total_collections);
      setAllDeposits(res?.data?.data?.total_remmitance);
      setAllPayouts(res?.data?.data?.total_payout);
      setloading(false);
    }
  };
  const fetchAgentArtisans = async () => {
    setloading(true);
    const res = await api.get(
      `/admin/agent-artisans/${agentId}?page=1&limit=10`,
      token
    );
    // console.log(res);

    if (res?.data?.success) {
      setArtisans(res?.data?.data?.artisan);
    }
  };

  useEffect(() => {
    checkToken();
  }, [refreshData]);

  const calculateAgentCollections = (array) => {
    let total = 0;
    for (let x = 0; x < array.length; x++) {
      total = total + Number(array[x]?.amount);
    }
    return total;
  };

  console.log(artisans);
  return (
    <Container fluid className={`d-flex p-0 ${Styles.container} min-vh-100`}>
      <UpdateAgentBio
        on={updateAgentInfo}
        off={() => {
          setUpdateAgentInfo(false);
          setRefreshData(!refreshData);
        }}
        initialInfo={agentInfo}
        agId={agentId}
      />
      <UpdateAgentPass
        on={updateAgentPass}
        off={() => setUpdateAgentPass(false)}
        initialInfo={agentInfo}
        agId={agentId}
      />
      {/* side bar */}
      <AdminSideNav adminInfo={admin} />
      {/* page */}
      <Col
        xs={10}
        className={`${Styles.col2} min-vh-100 d-flex flex-column  align-items-center`}
      >
        {loading ? (
          <Spinner />
        ) : (
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
            <Row className="w-100 d-flex m-0 mb-2 justify-content-end">
              <Col
                className="d-flex flex-column align-items-start justify-content-start"
                style={{ fontFamily: "Montserrat" }}
              >
                <p
                  className="p-0 m-0 mx-3"
                  style={{ fontFamily: "Montserrat-SemiBold" }}
                >
                  {`Total Custormers :  ${agentInfo?.artisans.length}`}
                </p>
              </Col>
            </Row>
            <Row className="m-0 w-100">
              <Col
                xs={4}
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

                <div className="d-flex  w-100 p-2 gap-2">
                  <Button
                    // onClick={() => setDebitModal(true)}
                    className="ml-3"
                    onClick={() => setUpdateAgentInfo(true)}
                  >
                    Update Info
                  </Button>

                  <Button
                    // onClick={() => setDebitModal(true)}
                    className="ml-3 bg-secondary border border-0"
                    onClick={() => setUpdateAgentPass(true)}
                  >
                    Reset Password
                  </Button>
                </div>
              </Col>
              <Col xs={8} className="" style={{ fontFamily: "Montserrat" }}>
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
                      {`Nin :  ${"000000002123"}`}
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
                          onClick={() =>
                            navigate(`/admin/transaction/${agentId}`)
                          }
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
                        onChange={(e) => setUserInput(e.target.value)}
                        className="rounded border w-75 border-0 bg-transparent px-2"
                        placeholder="Customer name"
                        style={{
                          maxHeight: "2.4em",
                          outline: "none",
                        }}
                      />
                      <button
                        onClick={() => handleSearchArtisan()}
                        disabled
                        className="text-light d-flex flex-column justify-content-center align-items-center
                  bg-primary w-25 h-100 m-0 p-1 py-2 rounded-right"
                      >
                        {searchLoading ? (
                          <Spinner />
                        ) : (
                          <i className="bi bi-search"></i>
                        )}
                      </button>
                    </InputGroup>
                  </Col>
                </Row>
                {<AdminCustomerTable data={artisans} />}
              </Card>
            </Row>

            {/* <Row className="w-100 text-primary  p-4 m-0 mt-5 d-flex ">
          <Card className="w-100 text-primary shadow-sm border border-0 p-4 m-0 d-flex ">
            <AdminAgentTable data={[1,2,3,4]} />
          </Card>
        </Row> */}
          </>
        )}
      </Col>
    </Container>
  );
};
export default AdminAgentView;
