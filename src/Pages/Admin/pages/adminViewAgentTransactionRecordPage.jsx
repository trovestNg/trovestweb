import React, { useEffect, useState } from "react";
import { Button, FormControl, Card, ListGroup, Spinner, Tab, Tabs } from "react-bootstrap";
import PrimaryButton from "../../../Components/buttons/primaryButton";
import PrimaryCard from "../../../Components/cards/primaryCard";
import InfoCard from "../../../Components/cards/infoCard";
import PrimaryInput from "../../../Components/inputs/PrimaryInput";
import ProfileCard from "../../../Components/cards/profileCard";
import { getAdminAgents } from "../../../Sagas/Requests";
import { convertToThousand } from "../../../config";
import CreateAgent from "../../SuperAdmin/components/createAgent";
import { useNavigate } from "react-router-dom";

import api from "../../../app/controllers/endpoints/api";
import { adminGetAgent, adminGetAgentArtisans } from "../../../Sagas/Requests";
import CollectionTab from "../tabs/collections";
import PayoutTab from "../tabs/payouts";
import DepositTab from "../tabs/deposits";

import {
    user_storage_token,
    user_storage_type,
    user_storage_name,
} from "../../../config";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import moment from "moment";

const AdminViewAgentTransactionRecordPage = () => {
    const { id } = useParams();
    const token = localStorage.getItem('userToken') || '';
    const navigate = useNavigate();
    const userInfo = localStorage.getItem(user_storage_name);

    const [agentData, setAgentData] = useState({});

    const [collection, setCollection] = useState('0');
    const [deposit, setDeposit] = useState('0');
    const [payout, setPayout] = useState('0');

    const [userInput, setUserInput] = useState('');
    const [searchLoading, setSearchLoading] = useState(false);


    const [searchAgent, setSearchAgent] = useState(false);

    console.log(user_storage_token)

    const [limit, setLimit] = useState(100);
    const [page, setPage] = useState(1);
    const [artisans, setArtisans] = useState([{}]);

    const [totalCollections, setTotalCollections] = useState(0);
    const [totalDeposits, setTotalDeposits] = useState(0);
    const [totalPayouts, setTotalPayouts] = useState(0);

    const [adminCreateAgentModal, setAdminCreateAgentModal] = useState(false);
    const [adminCreateAgentSuccessModal, setAdminCreateAgentSuccessModal] = useState(false);




    const [loading, setloading] = useState(false);
    const [sloading, setSloading] = useState(false);
    const [ploading, setPloading] = useState(false);
    const [refreshData, setRefreshData] = useState(false);

   

    const handleAdminGetAgent = async () => {
        try {
            setloading(true);
            const res = await adminGetAgent(token, id);
            const resp = await adminGetAgentArtisans(token, id, 1, 10)
            console.log(res)
            console.log(resp)
            if (res?.data?.success) {
                setAgentData(res?.data?.data?.agent);
                setCollection(res?.data?.data?.total_collections);
                setPayout(res?.data?.data?.total_payout)
                setDeposit(res?.data?.data?.total_remmitance);
                setloading(false);
            }

        } catch (error) {
            console.log(error)
        }

    }

    const handleAdminGetAgentArtisans = async () => {
       
        try {
            const res = await adminGetAgentArtisans(token, id, 1, 10)
            console.log(res)
            if (res?.data?.success) {
                setArtisans(res?.data?.data?.artisan);
            }

        } catch (error) {
            console.log(error)
        }

    }

    const handleAgentSearch = (e) => {
        setSloading(true);
        e.preventDefault()
        setSearchAgent(true);
        setRefreshData(!refreshData);

    }

    const searchAgentArtisanByName = async () => {
        try {
            const res = await api.get(`/admin/admin-search-agent?name=${userInput}&page=${page}&limit=50`, token);
            console.log(res);

            if (res?.data?.success) {
                setloading(false)
                setArtisans(res?.data?.data?.docs);
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
            searchAgentArtisanByName();
        } else {
            handleAdminGetAgentArtisans();
        }

    }

    const offSuccessModal = () => {
        setAdminCreateAgentSuccessModal(false)
        setRefreshData(!refreshData)
    }

    useEffect(() => {
        fetchData();
        handleAdminGetAgent()
    }, [refreshData])

    return (
        <div className="w-100 py-1 px-0">
            <div className="d-flex w-100 justify-content-between px-5">
                <div className="">
                    {
                        loading ? <Spinner size="sm" /> :
                            <ProfileCard page={'transaction'} title={'Total Revenue'} value={totalCollections} info={agentData} tColor={'#01065B'} icon={"bi bi-bank2"} height={'17em'} />
                    }


                </div>

                <div className="px-2" style={{ fontSize: '0.7em' }}>
                    {
                        loading ? <Spinner size="sm" /> :

                            <table>
                                <tbody>
                                    <tr className="d-flex gap-2">
                                        <td><InfoCard currency={true} value={collection} width={'21em'} height={'8.5em'} title={'Total Collections'} /></td>
                                        <td><InfoCard currency={true} tColor={'success'} value={deposit} width={'21em'} height={'8.5em'} title={'Total Deposits'} /></td>
                                    </tr>
                                    <tr className="d-flex gap-2 mt-3">
                                        <td><InfoCard tColor={'danger'} currency={true} value={payout} width={'21em'} title={'Total Payouts'} height={'8.5em'} /></td>
                                        <td><InfoCard width={'21em'} value={artisans.length} title={'Total Artisans'} height={'8.5em'} /></td>
                                    </tr>
                                </tbody>
                            </table>
                    }




                </div>
            </div>

           
            <div className="w-100 mt-5">
                <div className="d-flex align-items-center w-100">

                    <h4 className="px-2 w-75 text-info" style={{ fontFamily: 'title-font' }}>Transaction History</h4>

                    <div className="w-50 text-end justify-content-end">

                    </div>

                </div>
                <div>
                   

                    <Tabs defaultActiveKey="collections" variant="pills">
                        <Tab 
                        eventKey="collections" 
                        title="Collections"
                        tabClassName="border-1 px-5 py-2 rounded-1 text-center d-flex w-100"
                        >
                            {/* Content for the Home tab */}
                            <CollectionTab data={[]} />
                        </Tab>
                        <Tab 
                        eventKey="deposits" 
                        title="Deposits"
                        tabClassName="border-1 px-5 py-2 rounded-1 text-center d-flex w-100"
                        >
                            {/* Content for the Profile tab */}
                            <PayoutTab data={[]} />
                        </Tab>
                        <Tab 
                        eventKey="payouts" 
                        title="Payouts"
                        tabClassName="border-1 px-5 py-2 rounded-1 text-center d-flex w-100"
                        >
                            {/* Content for the Contact tab */}
                            <DepositTab data={[]} />
                        </Tab>
                    </Tabs>
                </div>

                
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
        </div>
    )
}

export default AdminViewAgentTransactionRecordPage;