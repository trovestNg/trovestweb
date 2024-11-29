import React, { useEffect, useState } from "react";
import { Container, Modal, Card, Button, Spinner, FormControl, Badge, FormSelect, ListGroup, ListGroupItem, Image, Tab, Tabs } from "react-bootstrap";
import { toast } from "react-toastify";
import api from "../../config/api";
import styles from './unAuth.module.css'
import { IBMO, IOwner, IParent } from "../../interfaces/bmo";
import apiUnAuth from "../../config/apiUnAuth";
import { Link, useNavigate, useParams } from "react-router-dom";
import ChartModal from "../../components/modals/chartModal";
import MoreInfoModal from "../../components/modals/moreInfoModal";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import { useDispatch, useSelector } from "react-redux";
import { pushToAuthUserNavArray, reduceAuthUserNavArray, removeFromAuthUserNavArray, setAuthUserBMOOwnerProfile } from "../../store/slices/authUserSlice";
import { IBMOwnersPublic, IUnAuthUserNavLink } from "../../interfaces/bmOwner";
import SureToApproveBOModal from "../../components/modals/sureToApproveBOModal";
import { baseUrl } from "../../config/config";
import ArtisansPagination from "../../components/paginations/atisans-paginations";
import EditAgentInfoModal from "../../components/modals/editAgentInfoModal";
import ResetAgentPasswordModal from "../../components/modals/resetAgentPasswordModal";
import ArtisanSavingTab from "../../components/tabs/userTabs/artisan-savings-tab";
import AgentSavingsTab from "../../components/tabs/userTabs/agent-savings-tab";
import AgentPayoutTab from "../../components/tabs/userTabs/agent-payout-tab";
import ApprovedAgentsTab from "../../components/tabs/userTabs/approved-agents-tab";
import { IAgent } from "./admin-dashboardpage";
import SuperApprovedArtisanTab from "../../components/tabs/userTabs/superapproved-artisan-tab";
import AdminApprovedArtisanTab from "../../components/tabs/userTabs/adminapproved-artisan-tab";

export interface IAgentInfo {
    address: string,
    admin_id: string,
    amount: number
    approved: boolean,
    artisans: string[]
    assigned_id: string
    collections: string[]
    createdAt: string
    designated_govt: string
    disabled: boolean
    email: string
    first_name: string
    gender: string
    image: string
    key: string
    last_name: string
    localgovt: string
    location: string[]
    mobile: string
    nin: string
    payment: []
    payment_request: []
    state: string
    updatedAt: string
    updated_by: string[]
    user_type: string
    _id: string
}
export interface IThrift {
    amount: string
    artisan_id: string
    createdAt: string
    date_paid: string
    status: string
    updatedAt: string
    _id: string
}

export interface IArtisan {
    address: string
    agent_id: string
    approved: boolean
    createdAt: string
    date_of_birth: string
    email: string
    full_name: string
    identification: { type: string, identifications: [] }
    image: string
    key: string
    liquidation_date: string
    mobile: string
    password: string
    savings_amount: string
    thrifts: IThrift[]
    total_balance: string
    total_payouts: string
    total_savings: string
    updatedAt: string
    user_type: string
    withdrawal_due: boolean
    _id: string
}

export interface IAgentPaymentRecord {
    agent: {},
    total_collections: string,
    total_payout: number
    total_remmitance: string
}

const SuperAdminViewArtisanManagementPage = () => {
    const userToken = localStorage.getItem('token') || '';
    const token = JSON.parse(userToken);

    const [agents, setAgents] = useState<IAgent[]>([]);

    const [userSearchedAgentCustomers, setUserSearchedAgentCustomers] = useState('');

    const [agentInfo, setAgentInfo] = useState<IAgentInfo>();
    const [search, setSearch] = useState(false)
    const [agentArtisans, setAgentArtisans] = useState<IArtisan[]>([]);

    const [totalCollection, setTotalCollections] = useState('');
    const [totalDeposits, setTotalDeposits] = useState('')
    const [totalPayouts, setTotalPayouts] = useState('');

    const [userSearchedAgent, setUserSearchedAgent] = useState('');
    const [artisanSavingThrift, setArtisanSavingThrift] = useState<IThrift[]>([]);
    const [artisanWithdrawThrift, setArtisanWithdrawThrift] = useState<IThrift[]>([]);
    const { id } = useParams()
    const [loading, setLoading] = useState(false);
    const [sloading, setSLoading] = useState(false);

    const [viewChartModal, setViewChartModal] = useState(false);
    const [viewMoreInfotModal, setViewMoreInfoModal] = useState(false);
    const [userSearch, setUserSearch] = useState('');
    const [refData, setRefData] = useState(false);
    const [bmoParentId, setBmoParentId] = useState<number>();

    const userClass = useSelector((state: any) => state.authUserSlice.authUserProfile.UserClass);
    const [bmoId, setBmoId] = useState('');
    const [bySearch, setBySearch] = useState(false);

    const navigate = useNavigate();

    const [addNewBenefOwnerModal, setAddNewBenefOwnerModal] = useState(false);


    const [updateAgentModal, setUpdateAgentModal] = useState(false);
    const [resetAgentPasswordModal, setResetAgentPasswordModal] = useState(false);

    const [addNewBenefOwnerCoperateModal, setAddNewBenefOwnerCoperateModal] = useState(false);
    const [addNewBenefOwnerFundsManagerModal, setAddNewBenefOwnerFundsManagerModal] = useState(false);
    const [addNewBenefOwnerImportModal, setAddNewBenefOwnerImportModal] = useState(false);

    const [editBenefOwnerIndividualModal, setEditBenefOwnerIndividualModal] = useState(false);
    const [editBenefOwnerFundModal, setEditBenefOwnerFundModal] = useState(false);
    const [editBenefOwnerCoperateModal, setEditBenefOwnerCoperateModal] = useState(false);
    const [deleteBmOwner, setDeleteBmOwner] = useState(false);
    const [approveBmOwner, setApproveBmOwner] = useState(false);
    const [dontAllowAdd, setDontAllowAd] = useState(false);
    const [rejectBmOwner, setRejectBmOwner] = useState(false);

    const [selectedOwner, setSelectedOwner] = useState<any>();

    const [isLoaded, setIsloaded] = useState(false);


    const [dloading, setDLoading] = useState(false);


    const dispatch = useDispatch()

    const unAvOwner = useSelector((state: any) => state.authUserSlice.authUserBmoOwnerProfile);
    const navArray = useSelector((state: any) => state.authUserSlice.authUserNavigationArray);

    const handleRejectBo = () => {
        setViewMoreInfoModal(false);
        setRejectBmOwner(true)
    }
    const handleSearchByName = (e: any) => {
        e.preventDefault()
        setBySearch(true);
        setRefData(!refData);
    }

    const searchByName = async () => {
        try {
            setSLoading(true)
            const res = await api.get(`admin/agent-artisans/${id}?page=1&limit=10`, token);
            console.log({ artisansHere: res })
            if (res?.data?.success) {
                let filter = res.data?.data?.artisan.filter((artisan: IArtisan) => artisan.full_name.toLocaleLowerCase().includes(userSearchedAgentCustomers.toLocaleLowerCase()))
                setAgentArtisans(filter);
                setSLoading(false);
                // toast.success('Got infor')
            }

        } catch (error) {

        }

    }








    const fetch = async () => {
        if (search) {

        } else {
            try {
                setLoading(true);
                const res = await api.get('admin/get-admin-agents?page=1&limit=100', token);
                console.log({ seeAgents: res })
                if (res?.data?.success) {
                    setAgents(res?.data?.data?.agents?.docs);
                    setTotalCollections(res?.data?.data?.total_collections);
                    setTotalDeposits(res?.data?.data?.total_remmitance);
                    setTotalPayouts(res?.data?.data?.total_payout);
                    setLoading(false);
                    // toast.success('Fetched info')
                }
                else {
                    setLoading(false);
                    // toast.error('Network error')
                }
            } catch (error) {
                console.log(error)
                setLoading(false);
            }
        }
    }

    // const fetchAtisans = async () => {
    //     if (bySearch) {
    //         searchByName()
    //     } else {

    //         try {
    //             setSLoading(true)
    //             const res = await api.get(`admin/agent-artisans/${id}?page=1&limit=10`, token);
    //             console.log({ artisansHere: res })
    //             if (res?.data?.success) {
    //                 setAgentArtisans(res.data?.data?.artisan);
    //                 setSLoading(false)

    //                 // toast.success('Got infor')
    //             }

    //         } catch (error) {

    //         }
    //     }

    // }

    const handleClear = () => {
        setBySearch(false)
        setUserSearchedAgentCustomers('');
        setRefData(!refData)
        // setBmoList([])
        // setRefreshData(!refreshData)
    }

    const handleAddNewBenefOwner = () => {
        setAddNewBenefOwnerModal(true)
    }






    const handleShowInfoModal = (owner: IBMOwnersPublic) => {
        // setBmoOwner(owner);
        setBmoParentId(owner?.ParentId)
        setViewMoreInfoModal(!viewMoreInfotModal);
    }



    // const handleNudgeAuthorizer = async (bmoId: any) => {
    //     // console.log({here:bmoId})
    //     let userInfo = await getUserInfo();
    //     if (userInfo) {
    //         try {
    //             // setOLoading(true)
    //             // let userInfo = await getUserInfo();
    //             const res = await api.get(`nudge?requsterName=${userInfo?.profile.given_name}&parentId=${parentInfo?.Id}`, userInfo?.access_token);
    //             if (res?.status == 200) {
    //                 setViewMoreInfoModal(false)
    //                 toast.success('Authorizer nudged for approval')
    //             } else {
    //                 toast.error('Failed to nudge Authorizer')
    //             }

    //         } catch (error) {

    //         }
    //     }

    // }



    const handleBackToHomePage = () => {
        navigate(-1)
    }
    useEffect(() => {
        fetch();
    }, [])

    useEffect(() => {
        // fetchAtisans();
    }, [refData])
    return (
        <div className="w-100 p-0">
            {/* <MoreInfoModal handleApprv={handleApproveBo} lev={level} info={bmoOwner} off={() => setViewMoreInfoModal(false)} show={viewMoreInfotModal} /> */}





            <div className="w-100 d-flex justify-content-between">
                <Button className="d-flex gap-2" onClick={handleBackToHomePage} variant="outline border">
                    <i className="bi bi-arrow-left"></i>
                    <p className="p-0 m-0">Go Back</p>

                </Button>
                {
                    loading && <Spinner size="sm" />
                }
                <p className="fw-bold">Manage Registered Customers.</p>

            </div>

            {/* <div className="w-100 d-flex justify-content-between">
                <div className="d-flex gap-2 align-items-center mt-3">
                    {parentInfo &&
                        <>
                            <h5 className="p-0 m-0 text-primary fw-bold">Beneficial Owner Level </h5>
                            <Badge className="d-flex justify-content-center align-items-center text-center" style={{ borderRadius: '20px', height: '20px', width: '20px' }}>{level}</Badge>
                        </>
                    }
                </div>
                <div className="d-flex gap-2">
                    {
                        userClass == 'Initiator' &&
                        <Button

                            onClick={() => calculatePercent(bmoList)} className="d-flex gap-2" style={{ minWidth: '15em' }}>
                            <i className="bi bi-plus-circle"></i>
                            <p className="p-0 m-0" >Add New Beneficial Owner</p>
                        </Button>}

                    {bmoList.length > 0 && <FormSelect style={{ maxWidth: '8em' }} onChange={(e) => handleListDownload(e.currentTarget.value)}>
                        <option>Download</option>
                        <option value={'csv'}>CSV</option>
                        <option value={'pdf'}>PDf</option>
                    </FormSelect>
                    }
                </div>

            </div> */}




            <div className="mt-4">
                <Tabs
                    defaultActiveKey="saved"
                    id="uncontrolled-tab-example"
                    variant="underline"
                    className="mb-3 gap-5"
                >
                    <Tab eventKey="saved" title="Approved Customers"

                    >
                        <AdminApprovedArtisanTab agents={agents} />
                    </Tab>

                    <Tab eventKey="withdrawn" title="Customers Pending Approval">
                    <AdminApprovedArtisanTab agents={[]} />
                    </Tab>


                </Tabs>

            </div>


            <EditAgentInfoModal agentId={id} off={() => { setUpdateAgentModal(false); setRefData(!refData) }} agentInfo={agentInfo} show={updateAgentModal} />
            <ResetAgentPasswordModal agentId={id} off={() => { setResetAgentPasswordModal(false); setRefData(!refData) }} agentInfo={agentInfo} show={resetAgentPasswordModal} />
        </div>
    )

}

export default SuperAdminViewArtisanManagementPage;