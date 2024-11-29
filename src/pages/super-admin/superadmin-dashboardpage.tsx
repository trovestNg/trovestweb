import React, { useEffect, useState } from "react";
import { Container, Modal, Card, Button, Spinner, FormControl } from "react-bootstrap";
import DashboardCard from "../../components/cards/dashboard-card";
import openBook from '../../assets/images/open-book.png'
import checked from '../../assets/images/check.png';
import timer from '../../assets/images/deadline.png';
import error from '../../assets/images/error.png';
import { Tabs, Tab } from "react-bootstrap";
import { getPolicies } from "../../controllers/policy";
import { IPolicy } from "../../interfaces/policy";
import { IUserDashboard } from "../../interfaces/user";
import { IDept } from "../../interfaces/dept";
import { toast } from "react-toastify";
import api from "../../config/api";
import styles from './unAuth.module.css'
import { IBMO } from "../../interfaces/bmo";
import apiUnAuth from "../../config/apiUnAuth";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { handleSetBmoCustormer, handleUserSearch, handleUserSearchResult, updateNav } from "../../store/slices/userSlice";
import { clearAuthUserBmoSearchWord, emptyAuthUserBMOSearchResult, pushToAuthUserNavArray, setAuthUserBmoCustormerProfile, setAuthUserBMOSearchResult, setAuthUserBMOSearchWord } from "../../store/slices/authUserSlice";
import { IBMCustomersPublic, IBMOwnersPublic, IUnAuthUserNavLink } from "../../interfaces/bmOwner";
import AgentsPagination from "../../components/paginations/agents-paginations";
import CreateAgentModal from "../../components/modals/createAgentModal";
import CreateAdminModal from "../../components/modals/createAdminModal";
import CreateFinconModal from "../../components/modals/createFinconModal";
import AdminPagination from "../../components/paginations/admin-pagination";

export interface IAgent {
    _id: string
    first_name: string,
    last_name: string,
    mobile: string,
    email: string,
    noOfCustormers: string,
    artisans: string[]

}

export interface IAdmin {
address:string,
agents:[],
createdAt:string,
email:string,
first_name:string,
image:string,
key:string,
last_name:string,
location:[],
mobile:string,
password:string,
superAdmin:string,
updatedAt:string,
user_type:string,
username:string
_id:string
}

const SuperAdminDashboardpage = () => {
    const bmoList: IBMCustomersPublic[] = useSelector((state: any) => state.authUserSlice.authUserBMOSearch.authUserBMOCustomerSearchResult);
    const authUserBmoSearchWord = useSelector((state: any) => state.authUserSlice.authUserBMOSearch.authUserSearchWord);
    const userClass = useSelector((state: any) => state.authUserSlice.authUserProfile.UserClass);
    const [userSearchedAgent, setUserSearchedAgent] = useState('');
    const userToken = localStorage.getItem('token') || '';
    const token = JSON.parse(userToken);
    let userName = localStorage.getItem('userInfo') || '';
    let user = JSON.parse(userName)

    const [createAgentModal, setCreateAgentModal] = useState(false);
    const [createFinconModal, setCreateFinconModal] = useState(false);


    const [admins, setAdmins] = useState<IAdmin[]>([]);
    const [totalCollection, setTotalCollections] = useState('');
    const [totalDeposits, setTotalDeposits] = useState('')
    const [totalPayouts, setTotalPayouts] = useState('')

    const [loading, setLoading] = useState(false);
    const [sloading, setSLoading] = useState(false);

    const [search, setSearch] = useState(false)

    // const [userSearch, setUserSearch] = useState('');
    const [refData, setRefData] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()


    const [addNewBenefOwnerImportModal, setAddNewBenefOwnerImportModal] = useState(false);

    const handleBySearch = () => {
        setSearch(true);
        setRefData(!refData);
    }


    const handleSearchByBmoNameOrNumber = async (e: any) => {
        e.preventDefault()
        setSLoading(true);

        // toast.error('Await')
        try {
            const res = await api.get('super/dashboard?limit=10&page=1', token);
            console.log(res)
            if (res?.data?.success) {
                const filtered = res?.data?.data?.superadmin?.admin.filter((admin:IAdmin)=>admin.first_name.toLocaleLowerCase().includes(userSearchedAgent.toLocaleLowerCase()))
                setSLoading(false);
                setAdmins(filtered);
                // setSLoading(false)
            }
            else {
                setLoading(false)
                setSLoading(false);
            }
        } catch (error) {

            setLoading(false)
        }
    }

    const handleClear = () => {
        setUserSearchedAgent('');
        // setBySearch(false);
        dispatch(clearAuthUserBmoSearchWord())
        dispatch(emptyAuthUserBMOSearchResult())
        // setBmoList([])
        setRefData(!refData)
    }

    const fetch = async () => {
        if (search) {

        } else {
            try {
                setLoading(true);
                const res = await api.get('super/dashboard?limit=8&page=1', token);
                console.log({ seeAdmins: res?.data?.data?.superadmin?.admin })
                if (res?.data?.success) {
                    const filtered = res?.data?.data?.superadmin?.admin.sort((a: IAdmin, b: IAdmin) =>b.agents.length - a.agents.length);
                    setAdmins(filtered);
                    setTotalCollections(res?.data?.data?.total_collections);
                    setTotalDeposits(res?.data?.data?.total_remmitance);
                    setTotalPayouts(res?.data?.data?.total_payout);
                    setLoading(false);
                    // toast.success('Fetched info')
                }
                else{
                    setLoading(false);
                    toast.error('Network error')  
                }
            } catch (error) {
                console.log(error)
                setLoading(false);
            }
        }
    }

    useEffect(() => {
        fetch()
    }, [refData])

    const dashboardInfo = [
        {
            title: 'Total Collections',
            icon: 'bi bi-graph-down-arrow',
            titleColor: 'success',
            value: totalCollection
        },
        {
            title: 'Total Deposits',
            titleColor: 'primary',
            icon: 'bi bi-bank',
            value: totalDeposits
        },
        {
            title: 'Total Payouts',
            titleColor: 'danger',
            icon: 'bi bi-graph-up-arrow',
            value: totalPayouts
        },
    ]

    return (
        <div className="w-100 p-0">
            

            <div className="w-100 d-flex gap-3 flex-column align-items-end">
                {
                    !loading && user?.user_type=='super_admin' &&
                    <div className="d-flex gap-3">
                        {/* <p className="p-0 m-0">Quick action</p> */}
                        <Button onClick={
                            () => setCreateAgentModal(true)
                        } className="p-2 px-3">New Admin</Button>

                        <Button variant="outline border" onClick={
                            () => setCreateFinconModal(true)
                        } className="p-2 px-3">New Fincon</Button>
                    </div>}
            </div>

            <div className="w-100 d-flex mt-2 gap-3 justify-content-center">
                {loading && <Spinner className="text-primary" />}
                {
                    !loading &&
                    dashboardInfo.map((info, index) => (
                        <DashboardCard titleColor={info.titleColor} key={index} count={info.value}
                            icon={info.icon}
                            title={info.title}
                        // url={info.path}
                        />
                    ))
                }

            </div>

            {
                !loading &&
                <div className="mt-5" >
                    <div className="w-100 d-flex justify-content-between align-items-center">
                        <p className="fw-bold m-0 p-0">All Your Admins</p>

                        <form onSubmit={handleSearchByBmoNameOrNumber} className="d-flex align-items-center justify-content-center gap-2">

                            <FormControl
                                onChange={(e) => setUserSearchedAgent(e.target.value)}
                                placeholder="Search by Name...."
                                value={userSearchedAgent}
                                className="py-2" />
                            <i
                                className="bi bi-x-lg"
                                onClick={handleClear}
                                style={{ marginLeft: '50px', display: userSearchedAgent == '' ? 'none' : 'flex', cursor: 'pointer', float: 'right', position: 'absolute', fontSize: '0.7em' }}></i>

                            <Button
                                disabled={userSearchedAgent == '' || sloading}
                                type="submit"
                                variant="primary" style={{ minWidth: '6em', marginRight: '-5px', minHeight: '2.4em' }}>{sloading ? <Spinner size="sm" /> : 'Search'}</Button>


                        </form>
                    </div>
                    {
                        loading ? <table className="table table-stripped w-100">
                            <thead className="thead-dark">
                                <tr >
                                    <th scope="col" className="bg-primary text-light">#</th>
                                    <th scope="col" className="bg-primary text-light">Policy Title</th>
                                    <th scope="col" className="bg-primary text-light">Department</th>
                                    <th scope="col" className="bg-primary text-light">Deadline to Attest</th>
                                    <th scope="col" className="bg-primary text-light">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className=""><td className="text-center" colSpan={5}><Spinner className="spinner-grow text-primary" /></td></tr>
                            </tbody>
                        </table> :
                            <AdminPagination data={admins} />
                    }
                </div>}
            <CreateAdminModal
                // parent={{ ...parentInfo, customerNumber: curstomerNumber, CountryId: "NG", }}
                totalOwners={bmoList}
                custormerNumb={34543534}
                lev={2}
                off={() => {
                    setCreateAgentModal(false);
                    setRefData(!refData);
                    // window.location.reload()
                }
                }
                show={createAgentModal}
            />

<CreateFinconModal
                // parent={{ ...parentInfo, customerNumber: curstomerNumber, CountryId: "NG", }}
                totalOwners={bmoList}
                custormerNumb={34543534}
                lev={2}
                off={() => {
                    setCreateFinconModal(false);
                    setRefData(!refData);
                    // window.location.reload()
                }
                }
                show={createFinconModal}
            />
        </div>
    )

}

export default SuperAdminDashboardpage;