import React, { useEffect, useState } from "react";
import { Button, FormControl, Card, ListGroup, Spinner, Tabs, Tab } from "react-bootstrap";
import PrimaryButton from "../../../Components/buttons/primaryButton";
import PrimaryCard from "../../../Components/cards/primaryCard";
import { getAdminAgents, getSuperAdminDashboard } from "../../../Sagas/Requests";
// import CreateAgent from "../../SuperAdmin/components/createAgent";
import CreateAdmin from "../../../Components/Modal/createAdmin";
import CreateFincon from "../../../Components/Modal/createFincon";
import CreateAgent from "../../../Components/Modal/createAgent";
import api from "../../../app/controllers/endpoints/api";
import ResetAdminPassword from "../../../Components/Modal/resetAdminPassword";
import ApprovedAdmins from "../tabs/approvedAdmins";
import ApprovedFincons from "../tabs/approvedFincons";
import ApprovedAgents from "../tabs/approvedAgents";

import {
    user_storage_token,
    user_storage_type,
    user_storage_name,
} from "../../../config";
import { toast } from "react-toastify";
import { useNavigate, useHis } from "react-router-dom";
import EditAgent from "../../../Components/Modal/editAgent";

const SAdminDashboardViewPage = () => {
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

    const [agents, setAgents] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [fincons, setFincons] = useState([]);

    const [totalCollections, setTotalCollections] = useState(0);
    const [totalDeposits, setTotalDeposits] = useState(0);
    const [totalPayouts, setTotalPayouts] = useState(0);

    const [resetPass, setResetPass] = useState(false);

    const [createAdminModal, setCreateAdminModal] = useState(false);
    const [createFinconModal, setCreateFinconModal] = useState(false);

    const [adminCreateAgentSuccessModal, setAdminCreateAgentSuccessModal] = useState(false);




    const [loading, setloading] = useState(false);
    const [sloading, setSloading] = useState(false);
    const [refreshData, setRefreshData] = useState(false);

    const handleGetSuperAdminDash = async () => {
        try {
            setloading(true)
            const payload = { page: page, limit: limit, token: token };
            const res = await getSuperAdminDashboard(payload);
            console.log(res)
            // console.log({res})
            if (res?.data?.success) {

                setAdmins(res?.data?.data?.superadmin?.admin);
                setAgents(res?.data?.data?.superadmin?.agents);
                setTotalCollections(res?.data?.data?.total_collections);
                setTotalDeposits(res?.data?.data?.total_remmitance);
                setTotalPayouts(res?.data?.data?.total_payout);
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
            const res = await api.get(`/admin/admin-search-agent?name=${userInput}&page=${page}&limit=50`, token);
            console.log(res);

            if (res?.data?.success) {
                setloading(false)
                setAgents(res?.data?.data?.docs);
                setSloading(false)
            } else {

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
            handleGetSuperAdminDash();
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
        <div className="w-100 py-1 px-0">
            <div className="d-flex w-100">
                <div className="w-50">
                    <h1 className="text-primary p-0 m-0 px-3" style={{ fontFamily: 'header-font' }}>
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
                    {
                        userData?.user_type== "fin_con"? '':
                        <div className="d-flex gap-2 text-end">
                        <PrimaryButton
                            textColor={'light'}
                            minWidth={'11em'}
                            action={() => setCreateAdminModal(true)}
                            bgColor={'primary'} title={'Create Admin'} />

                        <PrimaryButton
                            textColor={'light'}
                            minWidth={'11em'}
                            action={() => setCreateFinconModal(true)}
                            bgColor={'info'} title={'Create FinCon'} />

                    </div>}
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
                <div className="w-100 mt-2">
                    <Tabs defaultActiveKey="admins" variant="pills gap-5">
                        <Tab
                            eventKey="admins"
                            title="Your Admins"
                            tabClassName="border border-1 px-5 py-2 rounded-1 text-center d-flex w-100"
                        >
                            <ApprovedAdmins/>
                            


                        </Tab>
                        <Tab
                            eventKey="agents"
                            title="Your Agents"
                            tabClassName="border border-2 px-5 py-2 rounded-1 text-center d-flex w-100"
                        >
                            <ApprovedAgents data={agents ? agents : []} />
                        </Tab>
                        {/* <Tab
                            eventKey="fincons"
                            title="Your Fincons"
                            tabClassName="border border-1 px-5 py-2 rounded-1 text-center d-flex w-100"
                        >
                            <ApprovedFincons data={fincons} />
                        </Tab> */}


                    </Tabs>
                </div>

            </div>



            < CreateAdmin
                on={createAdminModal}
                off={() => {
                    setCreateAdminModal(false);
                }} />

            < CreateFincon
                on={createFinconModal}
                off={() => {
                    setCreateFinconModal(false);
                }} />

            <ResetAdminPassword
                off={() => {
                    setResetPass(false)
                    setRefreshData(!refreshData)
                }}
                on={resetPass}
            />
        </div>
    )
}

export default SAdminDashboardViewPage;