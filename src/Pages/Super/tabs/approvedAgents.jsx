import React, { useEffect, useState } from "react";
import moment from "moment";
import { Spinner, Card, ListGroup, ListGroupItem,Button,FormControl } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { convertToThousand } from "../../../config";
import { getAdminAgents } from "../../../Sagas/Requests";
import { toast } from "react-toastify";
import { getSuperAdminDashboard } from "../../../Sagas/Requests";
import api from "../../../app/controllers/endpoints/api";

const ApprovedAgents = ({ data, reloadComp }) => {
    const token = localStorage.getItem('userToken') || '';
    const [agents, setAgents] = useState([]);
    const [loading, setloading] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(100);
    const [userInput, setUserInput] = useState('');
    const [sloading, setSloading] = useState(false);
    const [searchAgent, setSearchAgent] = useState(false);
    const [refreshData, setRefreshData] = useState(false);
    const [admins, setAdmins] = useState([]);

    const navigate = useNavigate();


    const handleAgentSearch = (e) => {
        
        e.preventDefault()
        setSearchAgent(true);
        setRefreshData(!refreshData);

    }

    const handleGetSuperAdminDash = async () => {
        try {
            setloading(true)
            const payload = { page: page, limit: limit, token: token };
            const res = await getSuperAdminDashboard(payload);
            console.log(res)
            // console.log({res})
            if (res?.data?.success) {

                // setAdmins(res?.data?.data?.superadmin?.admin.reverse());
                setAgents(res?.data?.data?.superadmin?.agents);
                // setTotalCollections(res?.data?.data?.total_collections);
                // setTotalDeposits(res?.data?.data?.total_remmitance);
                // setTotalPayouts(res?.data?.data?.total_payout);
                setloading(false)
            }
            else {
                setloading(false);
            }

        } catch (error) {
            console.log(error);
            // toast.error('Network error!')
        }
    }

    const searchAgentByName = async () => {
        try {
            setloading(true)
            const payload = { page: page, limit: limit, token: token };
            const res = await getSuperAdminDashboard(payload);
            console.log(res)
            // console.log({res})
            if (res?.data?.success) {
                let filtered = res?.data?.data?.superadmin?.agents.filter((policy) =>
                    policy.first_name.toLowerCase().includes(userInput.toLowerCase())
                );

                setAgents(filtered.reverse());
                // setTotalCollections(res?.data?.data?.total_collections);
                // setTotalDeposits(res?.data?.data?.total_remmitance);
                // setTotalPayouts(res?.data?.data?.total_payout);
                setloading(false)
            }
            else {
                setloading(false);
            }

        } catch (error) {
            console.log(error);
            // toast.error('Network error!')
        }
    }

    const handleClear = () => {
        setSearchAgent(false);
        setUserInput('');
        setRefreshData(!refreshData)
    }

    const fetchData = () => {
        if (searchAgent) {
            searchAgentByName();
        } else {
            handleGetSuperAdminDash();
        }

    }

    useEffect(() => {
        fetchData()
    }, [refreshData])

    return (
        <div className="w-100">




            <div className="d-flex align-items-center w-100">

                <h4 className="px-2 w-75 text-info" style={{ fontFamily: 'title-font' }}></h4>

                <div className="d-flex align-items-center gap-2" style={{ position: 'relative' }}>
                    <FormControl
                        onChange={(e) => setUserInput(e.currentTarget.value)}
                        placeholder="Search name.."
                        value={userInput}
                        className="py-2" style={{ minWidth: '350px' }} />
                    <i
                        className="bi bi-x-lg"
                        onClick={handleClear}
                        style={{ marginLeft: '310px', display: userInput == '' ? 'none' : 'flex', cursor: 'pointer', float: 'right', position: 'absolute' }}></i>

                    <Button
                        disabled={userInput == '' || sloading}
                        onClick={(e) => handleAgentSearch(e)}
                        variant="primary" style={{ minWidth: '20px', marginRight: '-5px', minHeight: '2.4em' }}>
                        {
                            sloading ? <Spinner size="sm" /> : <i className="bi bi-search"></i>
                        }
                    </Button>
                </div>

            </div>


            <table className="table table-striped mt-2">
                <thead>
                    <tr className="bg-primary   text-light">
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Phone No</th>
                        <th scope="col">No of artisan</th>
                        <th scope="col">Email</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        loading ? <tr className="w-100 text-center">
                            <td className="" colSpan={6}>
                                <Spinner size="sm" />
                            </td>

                        </tr> :
                            agents.length <= 0 ?
                                <tr>
                                    <td colSpan={6}>
                                        <p className="font-weight-bold w-100 text-center" style={{ fontFamily: 'title-font' }}>No Data Available</p>
                                    </td>
                                </tr> :
                                agents.map((agent, index) => (
                                    <tr
                                        onClick={() => navigate(`/admin/agent/${agent._id}`)}
                                        key={index} style={{ cursor: 'pointer' }}>
                                        <th scope="row">{index + 1}</th>
                                        <td className="text-capitalize">{`${agent?.first_name} ${agent?.last_name}`}</td>
                                        <td>{`${agent?.mobile}`}</td>
                                        <td>{agent?.artisans && agent?.artisans.length}</td>
                                        <td>{agent?.email}</td>
                                        <td className="table-icon">
                                            <i className="bi bi-three-dots-vertical"></i>
                                            {/* <div className="content card border shadow position-absolute mr-3 mt-0 mb-3">
                                                    <Card className="rounded rounded-3 border-0 shadow-lg" style={{ minWidth: "10rem" }}>
                                                        {
                                                            <>
                                                                <ListGroup variant="flush">
                                                                    {

                                                                        <ListGroup.Item

                                                                        >
                                                                            Edit agent
                                                                        </ListGroup.Item>}
                                                                </ListGroup>
                                                                <ListGroup variant="flush">
                                                                    {
                                                                        <ListGroup.Item
                                                                        // disabled={room?.availability?.noOccupied > 0}

                                                                        >
                                                                            Delete agent
                                                                        </ListGroup.Item>}
                                                                </ListGroup>
                                                            </>

                                                        }
                                                    </Card>
                                                </div> */}
                                        </td>
                                    </tr>
                                ))
                    }
                </tbody>
            </table>
            <nav aria-label="...">
                <ul className="pagination">
                    <li className="page-item disabled">
                        <span className="page-link">Previous</span>
                    </li>
                    <li className="page-item active" aria-current="page"><a className="page-link" href="#">1</a></li>
                    <li className="page-item" >
                        <span className="page-link">2</span>
                    </li>
                    <li className="page-item"><a className="page-link" href="#">3</a></li>
                    <li className="page-item">
                        <a className="page-link" href="#">Next</a>
                    </li>
                </ul>
            </nav>
        </div>
    )
}

export default ApprovedAgents;