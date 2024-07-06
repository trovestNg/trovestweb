import React, { useEffect, useState } from "react";
import { Button, FormControl, Card, ListGroup, Spinner, Tabs, Tab } from "react-bootstrap";
import PrimaryButton from "../../../Components/buttons/primaryButton";
import PrimaryCard from "../../../Components/cards/primaryCard";
import InfoCard from "../../../Components/cards/infoCard";
import PrimaryInput from "../../../Components/inputs/PrimaryInput";
import { getAdminAgents } from "../../../Sagas/Requests";
import { convertToThousand } from "../../../config";
// import CreateAgent from "../../SuperAdmin/components/createAgent";
import CreateAgent from "../../../Components/Modal/createAgent";
import api from "../../../app/controllers/endpoints/api";

import {
    user_storage_token,
    user_storage_type,
    user_storage_name,
} from "../../../config";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ApprovedArtisans from "../tabs/approvedArtisans";
import PendingArtisans from "../tabs/pendingArtisans";
import DisabledArtisans from "../tabs/disabledArtisans";

const AdminClientsViewPage = () => {
    const token = localStorage.getItem('userToken') || '';
    const userInfo = localStorage.getItem(user_storage_name);
    const userData = JSON.parse(userInfo);
    const navigate = useNavigate()

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

    const [artisans, setArtisans] = useState([])

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
            } else {
                setloading(false);
                toast.error('Network error!')
            }
        } catch (error) {
            console.log(error)
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
                toast.error('Network error');
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
        <div className="w-100 py-1 px-0">
            <h1 className="text-secondary p-0 m-0 px-3" style={{ fontFamily: 'header-font' }}>
                {
                    `Artisans Management Page`
                }
            </h1>


            <div className="d-flex gap-3 mt-4 justify-content-center">
                {
                    loading ? <Spinner /> :
                        <>
                            < InfoCard title={'Approved Artisans'} value={20} tColor={'#01065B'} icon={"bi bi-people-fill"} width={'15em'} height={'7.7em'} />
                            < InfoCard title={'Pending Artisans'} value={20} tColor={'#01065B'} icon={"bi bi-people-fill"} width={'15em'} height={'7.7em'} />
                            < InfoCard title={'Disabled Artisans'} value={20} tColor={'#01065B'} icon={"bi bi-people-fill"} width={'15em'} height={'7.7em'} />
                            <PrimaryCard title={'Total Revenue'} value={totalCollections} tColor={'#5BB971'} icon={"bi bi-arrow-down-left"} width={'18em'} height={'7.7em'} />

                        </>
                }

            </div>
            <div className="w-100 mt-5">


                <div className="w-100 mt-2">
                    <Tabs defaultActiveKey="collections" variant="pills">
                        <Tab
                            eventKey="collections"
                            title="Approved"
                            tabClassName="border-1 px-5 py-2 rounded-1 text-center d-flex w-100"
                        >
                            <ApprovedArtisans />
                        </Tab>
                        <Tab
                            eventKey="deposits"
                            title="Pending Approval"
                            tabClassName="border-1 px-5 py-2 rounded-1 text-center d-flex w-100"
                        >
                            <PendingArtisans />
                        </Tab>
                        <Tab
                            eventKey="payouts"
                            title="Disabled"
                            tabClassName="border-1 px-5 py-2 rounded-1 text-center d-flex w-100"
                        >
                            <DisabledArtisans />
                        </Tab>
                    </Tabs>
                </div>
            </div>

            {/* <CreateAgent
                on={adminCreateAgentModal}
                success={adminCreateAgentSuccessModal}
                offSuccess={offSuccessModal}
                onSuccess={() => setAdminCreateAgentSuccessModal(true)}
                fetchService={() => console.log('ok')}
                off={() => {
                    setAdminCreateAgentModal(false);
                }} /> */}
        </div>
    )
}

export default AdminClientsViewPage;