import React, { useEffect, useState } from "react";
import { Button, FormControl, Card, ListGroup, Spinner } from "react-bootstrap";
import PrimaryButton from "../../../Components/buttons/primaryButton";
import PrimaryCard from "../../../Components/cards/primaryCard";
import { getAdminAgents } from "../../../Sagas/Requests";
// import CreateAgent from "../../SuperAdmin/components/createAgent";
import CreateAgent from "../../../Components/Modal/createAgent";
import api from "../../../app/controllers/endpoints/api";
import ResetAdminPassword from "../../../Components/Modal/resetAdminPassword";

import {
    user_storage_token,
    user_storage_type,
    user_storage_name,
} from "../../../config";
import { toast } from "react-toastify";
import { useNavigate, useHis } from "react-router-dom";
import EditAgent from "../../../Components/Modal/editAgent";

const AdminDashboardViewPage = () => {
    const token = localStorage.getItem('userToken') || '';
    const userInfo = localStorage.getItem(user_storage_name);
    const userData = JSON.parse(userInfo);
    const navigate = useNavigate();

    const [userInput, setUserInput] = useState('');
    const [searchLoading, setSearchLoading] = useState(false);


    const [searchAgent, setSearchAgent] = useState(false);

    console.log(user_storage_token)

    const [limit, setLimit] = useState(100);
    const [page, setPage] = useState(1);
    const [agents, setAgents] = useState([{}]);

    const [totalCollections, setTotalCollections] = useState(0);
    const [totalDeposits, setTotalDeposits] = useState(0);
    const [totalPayouts, setTotalPayouts] = useState(0);

    const [resetPass,setResetPass] = useState(false);

    const [adminCreateAgentModal, setAdminCreateAgentModal] = useState(false);
    const [adminCreateAgentSuccessModal, setAdminCreateAgentSuccessModal] = useState(false);




    const [loading, setloading] = useState(false);
    const [sloading, setSloading] = useState(false);
    const [refreshData, setRefreshData] = useState(false);

    const getAdminRegAgents = async () => {
       try {
        setloading(true)
        const payload = { page: page, limit: limit, token: token };
        const res = await getAdminAgents(payload);
        // console.log({res})
        if (res?.data?.success) {
            setAgents(res?.data?.data?.agents?.docs);
            setTotalCollections(res?.data?.data?.total_collections);
            setTotalDeposits(res?.data?.data?.total_remmitance);
            setTotalPayouts(res?.data?.data?.total_payout);
            setloading(false)
        }
        else{
            setloading(false);
        }
        
       } catch (error) {
        console.log(error);
        toast.error('Network error!')
       }
    }

    // const getSearchedAgents = async () => {
    //     setloading(true)
    //     const payload = { page: page, limit: limit, token: token };
    //     const res = await getAdminAgents(payload);
    //     // console.log({res})
    //     if (res?.data?.success) {
    //         setAgents(res?.data?.data?.agents?.docs);
    //         setTotalCollections(res?.data?.data?.total_collections);
    //         setTotalDeposits(res?.data?.data?.total_remmitance);
    //         setTotalPayouts(res?.data?.data?.total_payout);
    //         setloading(false)
    //     }
    // }

    const handleAgentSearch = (e) => {
        setSloading(true);
        e.preventDefault()
        setSearchAgent(true);
        setRefreshData(!refreshData);

    }

    const searchAgentByName = async () => {
       try {
        const res = await api.get(`/admin/admin-search-agent?name=${userInput}&page=${page}&limit=50`, token);
        console.log(res);

        if (res?.data?.success) {
            setloading(false)
            setAgents(res?.data?.data?.docs);
            setSloading(false)
        } else{
            
            setSloading(false)
        }
        
       } catch (error) {
        console.log(error)
       }
    }

    const fetchData = () => {
        if (searchAgent) {
            searchAgentByName();
        } else {
            getAdminRegAgents();
        }

    }

    const offSuccessModal = () => {
        setAdminCreateAgentSuccessModal(false)
        setRefreshData(!refreshData)
    }

    useEffect(() => {
        fetchData()
    }, [refreshData])

    return (
        <div className="py-1 px-0">
            <div className="d-flex w-100">
                <div className="w-50">
                    <h1 className="text-secondary p-0 m-0 px-3" style={{ fontFamily: 'header-font' }}>
                        {
                            `Hello ${userData.first_name}`
                        }
                    </h1>
                    <p className="p-0 m-0 px-3">Welcome To Your Dashboard</p>
                </div>

                <div className="d-flex px-2 w-50 justify-content-end align-items-end flex-column">
                    <h1 className="text-secondary p-0 m-0" style={{ fontFamily: 'header-font' }}>
                        {
                            `Quick actions`
                        }
                    </h1>
                    <div className="d-flex gap-2 text-end">
                        <PrimaryButton
                            textColor={'light'}
                            minWidth={'11em'}
                            action={() => setAdminCreateAgentModal(true)}
                            bgColor={'info'}  title={'Create New Agent'} />
                        <PrimaryButton 
                        mWidth={'10em'} 
                        action={()=>setResetPass(true)} variant={'primary'} title={'Reset Password'} />
                    </div>
                </div>
            </div>

            <div className="d-flex gap-3 mt-4 justify-content-center">
                {
                    loading ? <Spinner /> :
                        <>
                            <PrimaryCard title={'Total Revenue'} value={totalCollections} tColor={'#01065B'} icon={"bi bi-bank2"} width={'18em'} height={'7.7em'} />
                            <PrimaryCard title={'Your Deposits'} value={totalDeposits} tColor={'#5BB971'} icon={"bi bi-arrow-down-left"} width={'18em'} height={'7.7em'} />
                            <PrimaryCard title={'Your Payouts'} value={totalPayouts} tColor={'#F30D0D'} icon={"bi bi-arrow-up-right"} width={'18em'} height={'7.7em'} />
                        </>
                }

            </div>
            <div className="w-100 mt-5">
                <div className="d-flex align-items-center w-100">

                    <h4 className="px-2 w-75 text-info" style={{ fontFamily: 'title-font' }}>Your Agents</h4>

                    <div className="w-50 text-end justify-content-end">
                        <form onSubmit={(e) => handleAgentSearch(e)} className="d-flex justify-content-end w-100 flex-row m-0 p-0" >
                            <FormControl onChange={(e) => setUserInput(e.currentTarget.value)} placeholder="Search agent" className="rounded-1" style={{ maxWidth: '15em' }} />

                            <Button
                                type="submit" variant="grey border rounded-1" style={{ maxWidth: '3em' }}>
                                {
                                    sloading?<Spinner size="sm"/>:<i className="bi bi-search"></i>
                                }
                            </Button>
                            {/* <PrimaryInput placeHolder={'Search agent'} icon2={"bi bi-search"} maxWidth={'15em'} /> */}
                        </form>
                    </div>

                </div>
                <table className="table table-striped mt-2">
                    <thead>
                        <tr className="bg-info text-light">
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
                            agents.length <= 0 ?
                                <tr>
                                    <td colSpan={6}>
                                        <p className="font-weight-bold w-100 text-center" style={{ fontFamily: 'title-font' }}>No agent by that name</p>
                                    </td>
                                </tr> :

                                loading ? <tr className="w-100 text-center">
                                    <td className="" colSpan={6}>
                                        <Spinner size="sm" />
                                    </td>

                                </tr> :
                                    agents.map((agent, index) => (
                                        <tr 
                                        onClick={()=>navigate(`agent/${agent._id}`)}
                                        key={index} style={{ cursor: 'pointer' }}>
                                            <th scope="row">{index + 1}</th>
                                            <td className="text-capitalize">{`${agent?.first_name} ${agent?.last_name}`}</td>
                                            <td>{`${agent?.mobile}`}</td>
                                            <td>{agent?.artisans&& agent?.artisans.length}</td>
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

         

            < CreateAgent
                on={adminCreateAgentModal}
                success={adminCreateAgentSuccessModal}
                offSuccess={offSuccessModal}
                onSuccess={() => setAdminCreateAgentSuccessModal(true)}
                fetchService={() => console.log('ok')}
                off={() => {
                    setAdminCreateAgentModal(false);
                }} />

                <ResetAdminPassword
                off={()=>setResetPass(false)}
                on={resetPass}
                />
        </div>
    )
}

export default AdminDashboardViewPage;