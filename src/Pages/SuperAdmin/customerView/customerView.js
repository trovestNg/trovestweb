import { useEffect, useState } from "react";
import {
  Container,
  Col,
  Row,
  Card,
  InputGroup,
  Spinner,
  Button,
} from "react-bootstrap";
import { toast } from "react-toastify";
import DashboardPage from "../../../Components/Dashboard/dashboardPage";
import Styles from "./sadmin.module.css";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  user_storage_token,
  user_storage_name,
  Naira,
  user_storage_type,
} from "../../../config";
import { Formik } from "formik";
import * as yup from "yup";
import { setAgentAction } from "../../../Reducers/agent.reducer";
import { setAdminAction } from "../../../Reducers/admin.reducer";
import DisplayMessage from "../../../Components/Message";
import CreateFincon from "../components/createFincon";
import api from "../../../app/controllers/endpoints/api";
import moment from "moment";
import SuperSideNav from "../components/supersidebar";
import {
  superAdminGetArtisan,
  getAdminAgentCollection,
} from "../../../Sagas/Requests";
import { useParams } from "react-router-dom";
import SavingsTable from "../components/savingsTable";

const userType = localStorage.getItem(user_storage_type);

export default function CustomerView() {
  const [refreshData, setRefreshData] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { auth } = useSelector((state) => state);
  const [openModal, setopenModal] = useState(false);
  const [loading, setloading] = useState(false);
  const [admin, setadmin] = useState({});
  const [thrifts, setThrifts] = useState([]);
  const [totalSaved, setTotalSaved] = useState(0);
  const [withdrawn, setWithdrawn] = useState(0)
  const [clientData, setClientData] = useState();
  
  
  const [adminCreateSuccessModal, setAdminCreateSuccessModal] = useState(false);
  const [finconCreateModal, setFinconCreateModal] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filter,setFilter] = useState(false)
  const [finconCreateSuccessModal, setFinconCreateSuccessModal] =
    useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);

  const { clientId } = useParams();
  const token = localStorage.getItem(user_storage_token);

  const initialValue = {
    startDate: "",
    endDate: "",
  };
  const validationSchema = yup.object().shape({
    startDate: yup.string().required("Select start date"),
    endDate: yup.string().required("Select end date"),
  });

  const navActions = [
    { icon: "bi bi-envelope-fill", name: "Dashboard" },
    { icon: "bi bi-sliders", name: "Add Agent" },
    { icon: "bi bi-bell-fill", name: "Add Fin Con" },
  ];

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

  const fetch = () => {
    setloading(true);

    if (filter) {
      console.log("filter");
    } else {
      loadData();
    }
  };

  const loadData = async () => {
    const payload ={ token :token, artisan_id : clientId }
    try {
      const res = await superAdminGetArtisan(payload);
      console.log(res);

      if (res?.data?.success) {
        setClientData(res?.data?.data?.artisan);
        setThrifts(res?.data?.data?.thrifts);
        setTotalSaved(res?.data?.data?.artisan?.total_savings);
        setWithdrawn(res?.data?.data?.artisan?.total_payout)
        setloading(false);
      }
    } catch (error) {}
  };

  const handleDateSearch = (val) => {
    setStartDate(val?.startDate);
    setEndDate(val?.endDate);
    setRefreshData(!refreshData);
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
  // console.log(clientData );

  const calculateTotalSavings = (array)=>{
    let totalSavings = 0;
    const thriftLength = array?.length;
    for (let x=0; x<thriftLength; x++){
      totalSavings += Number( array[x]?.amount)
    }
    // setTotalSaved(totalSavings);
    return (totalSavings)
  
  }


  return (
    <Container fluid className={`d-flex p-0 ${Styles.container} min-vh-100`}>
      {/* side bar */}
      <SuperSideNav superAdminInfo={admin} />
      {/* page */}
      <Col
        xs={10}
        className={`${Styles.col2} min-vh-100 d-flex flex-column justify-content-center align-items-center`}
      >
        {loading ? (
          <Spinner />
        ) : (
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

            <Row
              className="w-100 d-flex justify-content-end m-0 p-0 mt-3"
              style={{ backgroundColor: "#FBFBFB" }}
            >
              <Col xs={4} className="mt-2 ">
                {loading ? (
                  ""
                ) : (
                  <>
                    <h2
                      className="ml-4 px-4"
                      style={{
                        fontFamily: "Philosopher",
                        color: "#01065B",
                      }}
                    >{`Client ${clientData?.full_name}`}</h2>
                    <h5
                      className="ml-4 px-4"
                      style={{
                        fontFamily: "Philosopher",
                        color: "#01065B",
                      }}
                    >
                      Savings Record Page
                    </h5>
                    <p
                      style={{
                        fontFamily: "Montserrat-Bold",
                      }}
                      className="px-4 m-0 mt-4 text-success "
                    >
                      {`Total Money Saved : ${Naira} ${totalSaved} `}
                    </p>

                    <p
                      style={{
                        fontFamily: "Montserrat-Bold",
                      }}
                      className="px-4 text-secondary m-0"
                    >
                      {`Amount Withdrawn : ${Naira} ${withdrawn}`}
                    </p>
                  </>
                )}
              </Col>
              <Col className="d-flex flex-column py-3  align-items-center">
                {loading ? (
                  ""
                ) : (
                  <div className="d-flex gap-3">
                    <div>
                      <p
                        style={{
                          fontFamily: "Montserrat-Regular",
                          color: "#01065B",
                        }}
                        className="p-0 mt-2"
                      >
                        {`Full Name : ${clientData?.full_name}`}
                      </p>
                      <p
                        style={{
                          fontFamily: "Montserrat-Regular",
                          color: "#01065B",
                        }}
                        className="p-0 mt-2"
                      >
                        {`Email : ${clientData?.email}`}
                      </p>
                      <p
                        style={{
                          fontFamily: "Montserrat-Regular",
                          color: "#01065B",
                        }}
                        className="p-0 mt-2"
                      >
                        {`Phone : ${clientData?.mobile}`}
                      </p>
                      <p
                        style={{
                          fontFamily: "Montserrat-Regular",
                          color: "#01065B",
                        }}
                        className="p-0 mt-2"
                      >
                        {`Address : ${clientData?.address}`}
                      </p>
                      <p
                        style={{
                          fontFamily: "Montserrat-Regular",
                          color: "#01065B",
                        }}
                        className="p-0 mt-2"
                      >
                        {`Date Joined : ${moment(clientData?.updatedAt).format(
                          "DD-MM-YYYY"
                        )}`}
                      </p>
                      <p
                        style={{
                          fontFamily: "Montserrat-Regular",
                          color: "#01065B",
                        }}
                        className="p-0 mt-2"
                      >
                        {`Agent Incharge : ${clientData?.agent_id?.first_name} ${clientData?.agent_id?.last_name}`}
                      </p>
                    </div>
                    <img
                      src={clientData?.image}
                      className="rounded mr-4"
                      style={{ maxWidth: "8em", maxHeight: "8em" }}
                    />
                  </div>
                )}
              </Col>
            </Row>
            <Row className="w-100 text-primary  p-4 m-0 mt-5 d-flex ">
              <Card className="w-100 text-primary shadow-sm d-flex justify-content-center align-items-center border border-0 p-4 m-0">
                <Row className="w-100 mt-3">
                  <Col style={{ fontFamily: "Montserrat", fontSize: "1em" }}>
                    <h1 style={{ fontSize: "1.5em" }}>Savings Record</h1>
                  </Col>
                  <Formik
                    initialValues={initialValue}
                    validationSchema={validationSchema}
                    onSubmit={(val) => handleDateSearch(val)}
                  >
                    {({ handleChange, handleSubmit, errors }) => (
                      <Col className="d-flex align-items-center gap-2 justify-content-end">
                        <InputGroup
                          className="d-flex align-items-center border rounded justify-content-center gap-2"
                          style={{ maxWidth: "13em", minHeight:'2em' }}
                        >
                          <label htmlFor="startDate">From :</label>
                          <input
                            onChange={handleChange}
                            name="startDate"
                            type="date"
                            className="h-100 border border-0 outline py-1 bg-transparent d-flex align-items-center"
                            style={{ outline: "none" }}
                          />
                        </InputGroup>

                        <InputGroup
                          className="d-flex align-items-center border rounded justify-content-center gap-2"
                          style={{ maxWidth: "13em" }}
                        >
                          <label htmlFor="endDate">To :</label>
                          <input
                            onChange={handleChange}
                            name="endDate"
                            type="date"
                            className="h-100 border border-0 outline py-1 bg-transparent d-flex align-items-center"
                            style={{ outline: "none" }}
                          />
                        </InputGroup>

                        <Button
                          type="submit"
                          onClick={handleSubmit}
                          disabled={Object.keys(errors).length > 0}
                          className="text-light d-flex flex-column justify-content-center align-items-center
                  bg-primary h-100 m-0 p-1 py-1 rounded-right rounded"
                          style={{ maxWidth: "3em" }}
                        >
                          {
                            // searchLoading? <Spinner/> :
                            <i className="bi bi-search"></i>
                          }
                        </Button>
                      </Col>
                    )}
                  </Formik>
                </Row>
                {loading ? <Spinner /> : <SavingsTable data={thrifts} />}
              </Card>
            </Row>

            <CreateFincon
              on={finconCreateModal}
              success={finconCreateSuccessModal}
              offSuccess={() =>
                setAdminCreateSuccessModal(!finconCreateSuccessModal)
              }
              off={() => setFinconCreateModal(!finconCreateModal)}
            />
          </>
        )}
      </Col>
    </Container>
  );
}
