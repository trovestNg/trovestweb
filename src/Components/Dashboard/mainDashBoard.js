import { useEffect, useState } from "react";
import { Container, Col, Row, Card, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import DashboardPage from "./dashboardPage";
import Styles from './md.module.css'
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from 'react-redux'
import { user_storage_token, user_storage_name, dateFormat, convertToThousand, Naira, calculateRevenueTotalObject, user_storage_type } from "../../config";
import { setAgentAction } from "../../Reducers/agent.reducer";
import { setAdminAction } from "../../Reducers/admin.reducer";
import { getAdmin } from "../../Sagas/Requests";
import DisplayMessage from "../Message";
import { CreateAgent } from "./components/create";


const userType = localStorage.getItem(user_storage_type)

export default function Dashboard() {
    const adminToken = localStorage.getItem(user_storage_token)
    const [dashBoard, setDashBoard] = useState(false);
    const [addAdmin, setAdmin] = useState(false);
    const [addAgent, setAddAgent] = useState(false);
    const [addFinCon, setAddFinCon] = useState(false);
    const [paymentReq, setPaymentReq] = useState(false);
    const [profile, setProfile] = useState(false);
    const [refreshData, setRefreshData] = useState();
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { auth } = useSelector(state => state)
    const superAdmin = useSelector(state => state)
    const [openModal, setopenModal] = useState(false)
    const [admin, setadmin] = useState({})
    const [loading, setloading] = useState(false)
    const [skip, setskip] = useState(0)
    const [limit, setlimit] = useState(10)
    const [agents, setagents] = useState([])
    const [menu, setmenu] = useState(false)
    const [totalClients, settotalClients] = useState(0)
    const [totalRevenue, settotalRevenue] = useState(0)
    const [data, setData] = useState({});
    const [agentCreateModal, setAgentCreateModal] = useState(false)

    const operations = [
        { icon: "bi bi-house-door-fill mr-3 ml-2", name: 'Dashboard' },
        { icon: "bi bi-file-person-fill", name: 'Create Admin' },
        { icon: "bi bi-person-fill-add", name: 'Create Agent' },
        { icon: "bi bi-graph-up", name: 'Create FinCon' },
        { icon: "bi bi-currency-dollar", name: 'Payment Requests' },
        { icon: "bi bi-file-person-fill", name: 'Profile' },

    ]

    const navActions = [
        { icon: "bi bi-envelope-fill", name: 'Dashboard' },
        { icon: "bi bi-sliders", name: 'Add Agent' },
        { icon: "bi bi-bell-fill", name: 'Add Fin Con' },
    ]


    const fetch = async () => {
        checkToken()

    }


    useEffect(() => {
        fetch();
    }, [!refreshData]);

    const getAgents = async () => {
        try {
            setagents(superAdmin.admins.agents)
        } catch (error) {
            if (error.message === "Request failed with status code 401") {
                localStorage.removeItem(user_storage_token)
                localStorage.removeItem(user_storage_name)
                setloading(false)
                return navigate('/')
            }
            else {
                setloading(false)
                alert(error.message)
            }
        }
    }

    const checkToken = () => {
        const adminData = localStorage.getItem(user_storage_name)
        adminData !== null ? setadmin(JSON.parse(adminData)) : setadmin({})
        if ((adminToken === null && (userType === null || userType === 'admin')) || userType === 'admin') {
            alert('Unauthorized Access')
            logOutAdmin()
        }
        else {
            return getAgents()
        }
    }

    const logOutAdmin = () => {
        DisplayMessage('logged Out', 'success')
        localStorage.removeItem(user_storage_name)
        localStorage.removeItem(user_storage_token)
        const data = {
            agents: [],
            data: {},
            token: ''
        }
        dispatch(setAgentAction(data))
        dispatch(setAdminAction(data))
        return navigate('/')
    }

    const sideBarAction = (op, index) => {
        { index == 0 && toast.success('In progress') };
        { index == 1 && setAdmin(true); };
        { index == 2 && setAgentCreateModal(!agentCreateModal); };
        { index == 3 && setAddFinCon(true); };
        { index == 4 && setPaymentReq(true); };
        { index == 5 && setProfile(true); };
        // setRefreshData(!refreshData);

    }

    const handleCreateFinCon = () => {

    }





    return (
        <Container fluid className={`d-flex p-0 ${Styles.container} min-vh-100`}>
            {/* side bar */}
            <Col xs={2} className={`${Styles.col1} p-0 m-0 bg-primary`}  >
                {/* user Bio */}
                <Row className="w-100 gap-1 d-dlex justify-content-center p-0  m-0">

                    <Col className="d-flex justify-content-center">
                        <img className={`${Styles.pic} p-0 m-0 mt-5 bg-light`}
                            src={admin?.image}
                            alt="Profile Pic"
                        />
                    </Col>

                    <p className="p-0 w-100 text-center text-light m-0 mt-3" style={{ fontFamily: 'Montserrat-Bold' }}>
                        {`${admin?.first_name} ${admin?.last_name}`}
                    </p>

                    <p className="p-0 w-100 text-center text-light m-0 " style={{ fontFamily: 'Montserrat-Thin' }}>
                        {`${admin?.user_type == 'super_admin' ? 'Super Admin' : admin?.user_type == 'admin' ? 'Admin' :
                            admin?.user_type == 'agent' ? 'Agent' : 'Fin Con'}`}
                    </p>

                    <p className="p-0 w-100 text-center text-light m-0 " style={{ fontFamily: 'Montserrat-Thin' }}>
                        {admin?.mobile}
                    </p>
                </Row>
                {/* Nav ul */}
                <Row className="w-100 gap-1 h-25 mt-5 m-0 pr-0 m-0 bg-primary">
                    <ul className={`${Styles.opList}  p-o pr-3 w-100 m-0 mr-5 mt-3`}>
                        {
                            operations.map((op, index) => <li onClick={() => sideBarAction(op, index)} className={`${Styles.opLists} py-2 w-100 px-2 rounded
                            rounded-1 my-1 ml-4 text-light`}>{
                                    (<>
                                        <i className={`${op.icon} mr-3 ml-2`} style={{ marginRight: '1em' }}></i>
                                        {op.name}
                                    </>)
                                }</li>)
                        }
                    </ul>

                </Row>
                {/* nav buttom*/}
                <Row className="w-100 gap-1 h-25 m-0">
                    <ul className={`${Styles.opList} d-flex align-items-end  p-o pr-3 w-100 m-0 mr-5 mt-5`}>
                        <li onClick={() => logOutAdmin()} className={`${Styles.opLists} py-2 w-100 px-2 rounded
                            rounded-1 my-1 ml-4 text-light`} style={{ marginTop: '4em' }}>
                            {
                                (<>
                                    <i className={`bi bi-house-door-fill mr-3 ml-2`} style={{ marginRight: '1em' }}></i>
                                    {'Logout'}
                                </>)
                            }
                        </li>
                    </ul>
                </Row>
            </Col>
            {/* page */}
            <Col xs={10} className={`${Styles.col2} min-vh-100`}>
                {/* navbar constant */}
                <Row className="w-100 m-0 px-2 bg-white shadow-sm mb-3" style={{ height: '5em' }}>
                    {/* search bar column */}
                    <Col xs={9}></Col>
                    {/* notification column */}
                    <Col xs={3} className=''>
                        <ul className="d-flex flex-row gap-3 align-items-center 
                        justify-content-center h-100" style={{ listStyle: 'none' }}>{
                                navActions.map((action, index) => (
                                    <div onClick={() => console.log(index)} className="shadow-sm d-flex align-items-center justify-content-center" style={{
                                        width: '2em', height: '2em', borderRadius: '1em',
                                        backgroundColor: '#fff',
                                        cursor: 'pointer'
                                    }}>
                                        <i className={action.icon} style={{ color: '#7D1312' }} />

                                    </div>
                                ))
                            }</ul>
                    </Col>
                </Row>
                <Row className="w-100  m-0 p-0 mt-3">
                
                    <Col xs={4} className="mt-4 ml-4 bg-danger">
                        <h2 className="ml-4 px-4" style={{
                            fontFamily: 'Philosopher',
                            color: '#7D1312'
                        }}>{`Welcome ${admin?.first_name}`}</h2>
                        <h5
                            className="ml-4 px-4"
                            style={{
                                fontFamily: 'Philosopher',
                                color: '#01065B'
                            }}
                        >Overall Finacial Report Page</h5>
                    </Col>
                    <Col className="mt-4 ml-4 bg-primary">

                    </Col>

                    <DashboardPage tableData={admin?.admins} />
                    <CreateAgent on={agentCreateModal} off={() => setAgentCreateModal(!agentCreateModal)} />
                </Row>

            </Col>
        </Container>
    )
}