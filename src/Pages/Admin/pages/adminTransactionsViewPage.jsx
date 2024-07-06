import React, { useEffect, useState } from "react";
import { Spinner, Tabs, Tab } from "react-bootstrap";
import PrimaryCard from "../../../Components/cards/primaryCard";
import { getAdminAgents } from "../../../Sagas/Requests";
import api from "../../../app/controllers/endpoints/api";

import {
    user_storage_token,
} from "../../../config";
import { toast } from "react-toastify";
import ApprovedArtisans from "../tabs/approvedArtisans";
import PendingAgents from "../tabs/pending";
import DisabledAgents from "../tabs/disabled";


const AdminTransactionsViewPage = () => {
    const token = localStorage.getItem('userToken') || '';
    
    const [userInput, setUserInput] = useState('');
    


    const [searchAgent, setSearchAgent] = useState(false);

    console.log(user_storage_token)

    const [limit, setLimit] = useState(100);
    const [page, setPage] = useState(1);
    const [agents, setAgents] = useState([{}]);

    const [totalCollections, setTotalCollections] = useState(0);
    const [totalDeposits, setTotalDeposits] = useState(0);
    const [totalPayouts, setTotalPayouts] = useState(0);





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

   

    useEffect(() => {
        fetchData()
    }, [refreshData])

    return (
        <div className="w-100 py-1 px-0">
            <h1 className="text-secondary p-0 m-0 px-3" style={{ fontFamily: 'header-font' }}>
                {
                    `All Transaction Management Page`
                }
            </h1>


            <div className="d-flex gap-3 mt-4 justify-content-center">
                {
                    loading ? <Spinner /> :
                        <>
                             <>
                            <PrimaryCard title={'Total Revenue'} value={totalCollections} tColor={'#01065B'} icon={"bi bi-bank2"} width={'18em'} height={'7.7em'} />
                            <PrimaryCard title={'Your Deposits'} value={totalDeposits} tColor={'#5BB971'} icon={"bi bi-arrow-down-left"} width={'18em'} height={'7.7em'} />
                            <PrimaryCard title={'Your Payouts'} value={totalPayouts} tColor={'#F30D0D'} icon={"bi bi-arrow-up-right"} width={'18em'} height={'7.7em'} />
                        </>

                        </>
                }

            </div>
            <div className="w-100 mt-5">


                <div className="w-100 mt-2">
                    <Tabs defaultActiveKey="collections" variant="pills">
                        <Tab
                            eventKey="collections"
                            title="POS Deposits"
                            tabClassName="border-1 px-5 py-2 rounded-1 text-center d-flex w-100"
                        >
                            <ApprovedArtisans />
                        </Tab>
                        <Tab
                            eventKey="deposits"
                            title="Bank Transfers"
                            tabClassName="border-1 px-5 py-2 rounded-1 text-center d-flex w-100"
                        >
                            <PendingAgents />
                        </Tab>
                        <Tab
                            eventKey="payouts"
                            title="Office Deposits"
                            tabClassName="border-1 px-5 py-2 rounded-1 text-center d-flex w-100"
                        >
                            <DisabledAgents />
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}

export default AdminTransactionsViewPage;