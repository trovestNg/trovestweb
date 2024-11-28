import React, { useEffect, useState } from "react";
import { Container, Modal, Card, Button, Spinner, FormControl, Badge, FormSelect, ListGroup, ListGroupItem, Image } from "react-bootstrap";
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
import agentPic from '../../assets/images/receipt.png'
import AgentsPagination from "../../components/paginations/agents-paginations";
import { convertToThousand } from "../../utils/helpers";
import moment from "moment";
import ArtisansPagination from "../../components/paginations/atisans-paginations";
import EditAgentInfoModal from "../../components/modals/editAgentInfoModal";
import ResetAgentPasswordModal from "../../components/modals/resetAgentPasswordModal";

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

const AdminViewAgentInfoPage = () => {
    const userToken = localStorage.getItem('token') || '';
    const token = JSON.parse(userToken);

    const [userSearchedAgentCustomers, setUserSearchedAgentCustomers] = useState('');

    const [agentInfo, setAgentInfo] = useState<IAgentInfo>();
    const [agentArtisans, setAgentArtisans] = useState<IArtisan[]>([]);

    const [totalCollection, setTotalCollections] = useState('');
    const [totalDeposits, setTotalDeposits] = useState('')
    const [totalPayouts, setTotalPayouts] = useState('');

    const [userSearchedAgent, setUserSearchedAgent] = useState('');

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
    const handleSearchByName = (e:any) => {
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

        try {
            setLoading(true)
            const res = await api.get(`admin/agent/${id}`, token);
            if (res?.data?.success) {
                setAgentInfo(res.data?.data?.agent)
                setTotalCollections(res?.data?.data?.total_collections);
                setTotalDeposits(res?.data?.data?.total_remmitance);
                setTotalPayouts(res?.data?.data?.total_payout);
                setLoading(false);
                // toast.success('Got infor')
            }

        } catch (error) {

        }

    }

    const fetchAtisans = async () => {
        if (bySearch) {
            searchByName()
        } else {

            try {
                setSLoading(true)
                const res = await api.get(`admin/agent-artisans/${id}?page=1&limit=10`, token);
                console.log({ artisansHere: res })
                if (res?.data?.success) {
                    setAgentArtisans(res.data?.data?.artisan);
                    setSLoading(false)

                    // toast.success('Got infor')
                }

            } catch (error) {

            }
        }

    }

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
        navigate('/admin')
    }
    useEffect(() => {
        fetch();
    }, [])

    useEffect(() => {
        fetchAtisans();
    }, [refData])
    return (
        <div className="w-100 p-0">
            {/* <MoreInfoModal handleApprv={handleApproveBo} lev={level} info={bmoOwner} off={() => setViewMoreInfoModal(false)} show={viewMoreInfotModal} /> */}
           
            



            <div className="w-100 d-flex justify-content-between">
                <Button className="d-flex gap-2" onClick={handleBackToHomePage} variant="outline border">
                    <i className="bi bi-arrow-left"></i>
                    <p className="p-0 m-0">Go Back</p>

                </Button>

                <p className="fw-bold">Agent Information</p>

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

            <div className="w-100 d-flex mt-3 justify-content-between p-2" style={{ backgroundColor: 'rgba(0,73,135,0.09)' }}>
                {
                    loading ?
                        <div className="w-100 d-flex justify-content-center">
                            <Spinner className="text-primary" />
                        </div>
                        :
                        <div className="d-flex justify-content-between w-100">
                            <div>
                                <div className="d-flex gap-3">
                                    <Image src={agentInfo?.image} height={'100px'} />
                                    <div>
                                        <p className="p-0 m-0 text-capitalize">{`${agentInfo?.first_name} ${agentInfo?.last_name}`}</p>
                                        <p className="p-0 m-0">{agentInfo?.assigned_id}</p>
                                        <p className="p-0 m-0">{agentInfo?.mobile}</p>
                                        <div className="d-flex gap-2">
                                            <div className="d-flex gap-2 text-success" role="button">
                                                <i className="bi bi-person-vcard"></i>
                                                <p onClick={()=>setUpdateAgentModal(true)} className="p-0 m-0">Update Info</p>
                                            </div>
                                            |
                                            <div className="d-flex gap-2 text-danger" role="button">
                                                <i className="bi bi-gear"></i>
                                                <p onClick={()=>setResetAgentPasswordModal(true)} className="p-0 m-0">Reset Password</p>
                                            </div>

                                        </div>
                                    </div>


                                    <div>
                                        <p className="p-0 m-0 text-success fw-bold">{`Total Collections : ${convertToThousand(totalCollection)}.`}</p>
                                        <p className="p-0 m-0 text-danger fw-bold">{`Total Payouts : ${convertToThousand(totalPayouts)}.`}</p>
                                        <p className="p-0 m-0 text-secondary fw-bold">{`Total Deposits : ${convertToThousand(totalDeposits)}.`}</p>
                                        <p className="p-0 m-0">{`Date employed ${moment(agentInfo?.createdAt).format('MMM DD YYYY')}`}</p>
                                    </div>

                                    <div className="">
                                        <p className="p-0 m-0">{`Nin : ${agentInfo?.nin?agentInfo?.nin:'N/A'}`}</p>
                                        <p className="p-0 m-0">{`Email : ${agentInfo?.email}`}</p>
                                        <p className="p-0 m-0">{`Address : ${agentInfo?.address}`}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="px-3 text-center d-flex flex-column">
                                <i className="bi bi-receipt" style={{ fontSize: '3em' }}></i>
                                <Link to={`/admin/agent-transactions/${id}`}>View Transaction</Link>
                                {/* <p className="p-0 m-0" role="button"></p> */}
                            </div>
                        </div>
                }

            </div>


            <div className="d-flex flex-column w-100 ">
                <div className="w-100 px-2" style={{ height: '80vh', overflowY: 'scroll', scrollbarWidth: 'none' }}>
                    {
                        sloading && <div className="w-100 d-flex justify-content-center mt-3"><Spinner size="sm" className="text-primary"/></div>
                    }
                    {
                        !sloading &&
                        <div className="mt-3 w-100" >
                            <div className="w-100 d-flex justify-content-between align-items-center">
                                <p className="fw-bold m-0 p-0">Customers under this agent</p>

                                <form
                                    onSubmit={handleSearchByName}
                                    className="d-flex align-items-center justify-content-center gap-2">

                                    <FormControl
                                        onChange={(e) => setUserSearchedAgentCustomers(e.target.value)}
                                        placeholder="Search by Name...."
                                        value={userSearchedAgentCustomers}
                                        className="py-2" />
                                    <i
                                        className="bi bi-x-lg"
                                        onClick={handleClear}
                                        style={{ marginLeft: '50px', display: userSearchedAgentCustomers == '' ? 'none' : 'flex', cursor: 'pointer', float: 'right', position: 'absolute', fontSize: '0.7em' }}></i>

                                    <Button
                                        disabled={userSearchedAgentCustomers == '' || sloading}
                                        type="submit"
                                        variant="secondary" style={{ minWidth: '6em', marginRight: '-5px', minHeight: '2.4em' }}>{sloading ? <Spinner size="sm" /> : 'Search'}</Button>


                                </form>
                            </div>
                            {
                                sloading ? <table className="table table-stripped w-100">
                                    <thead className="thead-dark">
                                        <tr >
                                            <th scope="col" className="bg-secondary text-light">#</th>
                                            <th scope="col" className="bg-secondary text-light">Policy Title</th>
                                            <th scope="col" className="bg-secondary text-light">Department</th>
                                            <th scope="col" className="bg-secondary text-light">Deadline to Attest</th>
                                            <th scope="col" className="bg-secondary text-light">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className=""><td className="text-center" colSpan={5}><Spinner className="spinner-grow text-primary" /></td></tr>
                                    </tbody>
                                </table> :
                                    <ArtisansPagination data={agentArtisans} />
                            }
                        </div>}

                </div>



            </div>


<EditAgentInfoModal agentId={id} off={()=>{setUpdateAgentModal(false); setRefData(!refData)}} agentInfo={agentInfo} show={updateAgentModal}/>
<ResetAgentPasswordModal agentId={id} off={()=>{setResetAgentPasswordModal(false); setRefData(!refData)}} agentInfo={agentInfo} show={resetAgentPasswordModal}/>
        </div>
    )

}

export default AdminViewAgentInfoPage;