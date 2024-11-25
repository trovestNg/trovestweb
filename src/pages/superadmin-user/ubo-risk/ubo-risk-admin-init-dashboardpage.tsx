import React, { useEffect, useState } from "react";
import { Container, Modal, Card, Button, Spinner, FormControl } from "react-bootstrap";
import DashboardCard from "../../../components/cards/dashboard-card";
import openBook from '../../assets/images/open-book.png'
import checked from '../../assets/images/check.png';
import timer from '../../assets/images/deadline.png';
import error from '../../assets/images/error.png';
import { Tabs, Tab } from "react-bootstrap";
import UserAllPoliciesTab from "../../../components/tabs/userTabs/user-all-policies-tab";
import UserNotAttestedPoliciesTab from "../../../components/tabs/userTabs/user-not-attested-policies-tab";
import UserAttestedPoliciesTab from "../../../components/tabs/userTabs/attested-policies-tab";
import { getPolicies } from "../../../controllers/policy";
import { IPolicy } from "../../../interfaces/policy";
import { IUserDashboard } from "../../../interfaces/user";
import { IDept } from "../../../interfaces/dept";
import { toast } from "react-toastify";
import { getUserInfo, loginUser, logoutUser } from "../../../controllers/auth";
import api from "../../../config/api";
import styles from './unAuth.module.css'
import { IBMO } from "../../../interfaces/bmo";
import apiUnAuth from "../../../config/apiUnAuth";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { handleUserSearch, handleUserSearchResult } from "../../../store/slices/userSlice";
import CreateBMOOwnerImportModal from "../../../components/modals/createBMOOwnerImportModal";
import { IBMCustomersPublic, IBMOwnersPublic, IUnAuthUserNavLink } from "../../../interfaces/bmOwner";
import { pushToAuthUserNavArray, setAuthUserBmoCustormerProfile } from "../../../store/slices/authUserSlice";


const UboRiskAdminInitDashboardpage = () => {
    // const bmoList:IBMO[] = useSelector((state:any)=>state.userSlice.userBMOSearch.searchResult)
    const [loading, setLoading] = useState(false);
    const [sloading, setsLoading] = useState(false);

    // const [userSearch, setUserSearch] = useState('');
    const [refreshComponent, setRefreshComponent] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const [userSearchWord, setUserSearchWord] = useState('')
    // const userSearch = useSelector((state:any)=>state.userSlice.userBMOSearch.searchWords);
    const [addNewBenefOwnerImportModal, setAddNewBenefOwnerImportModal] = useState(false);
    const [bmoList,setBmoList] = useState<IBMCustomersPublic[]>()



    const handleSearchByBmoNameOrNumber = async (e: any) => {
        e.preventDefault()
        setLoading(true);

        // toast.error('Await')
        try {
            const res = await apiUnAuth.get(`customers?search=${userSearchWord}`);
            console.log(res)
            if (res.data) {
                setLoading(false);
                setBmoList(res?.data?.customerAccounts)
                // setBmoList(res?.data?.customerAccounts);
                if (res?.data?.customerAccounts?.length <= 0) {
                    toast.error('No Custormer by that Name/ID')
                }
                setLoading(false);
            }
            else {
                setLoading(false)

            }
        } catch (error) {

            setLoading(false)
        }
    }

    const handleNavigateToLevel = (owner: IBMCustomersPublic) => {
        let payload: IUnAuthUserNavLink = {
            name: owner.customerName,
            customerNumber: owner?.customerNumber,
            ownerId: owner?.ownerId
        }
        let unAvOwner: IBMOwnersPublic = {
            BusinessName: owner.customerName,
            CustomerNumber: owner.customerNumber,
            IdType: "CORPORATE",
            IdNumber: owner.kycReferenceNumber,
            Level: 1,
            RiskScore: owner.rating,
            RcNumber: owner.rcNumber,
            RiskLevel: owner.riskLevel,
            Id:0
        }
        dispatch(pushToAuthUserNavArray(payload));
        dispatch(setAuthUserBmoCustormerProfile(unAvOwner))
        navigate(`/bo-risk-portal/custormer-details/${1}/${owner.customerNumber}`)
    }

  

    const handleClear = () => {
        setUserSearchWord('')
        setRefreshComponent(!refreshComponent)
        // dispatch(handleUserSearch(''))
        // dispatch(handleUserSearchResult([]))
        // setBmoList([])
        // setRefreshData(!refreshData)
    }

    useEffect(() => {
        setBmoList([])
    }, [userSearchWord == ""])

    return (
        <div className="w-100 p-0">
            <CreateBMOOwnerImportModal off={() => setAddNewBenefOwnerImportModal(false)} show={addNewBenefOwnerImportModal} />
            <div className={`w-100 p-3 rounded rounded-3 py-4 ${styles.jumbo}`}
            >
                <Card className={`rounded rounded-3 bg-primary py-4 text-light px-3 ${styles.jumbo2}`}>
                    <Card.Body>
                        <h4>Welcome to Ultimate Beneficial Owner Risk Assessment Portal </h4>
                        <p className="text-secondary">
                            Here you will find a secure and efficient platform designed to simplify the collection, verification, <br /> and management of beneficial ownership information.
                        </p>

                    </Card.Body>
                </Card>
            </div>


            <div className="w-100 d-flex justify-content-center" style={{ position: 'relative' }}>
                <form onSubmit={handleSearchByBmoNameOrNumber} className="d-flex align-items-center w-75 justify-content-center mt-3 gap-3">

                    <FormControl
                        onChange={(e) => setUserSearchWord(e.target.value)}
                        placeholder="Search by Name, Company, Assets...."
                        value={userSearchWord}
                        className="py-2" />
                    <i
                        className="bi bi-x-lg"
                        onClick={handleClear}
                        style={{ marginLeft: '570px', display: userSearchWord == '' ? 'none' : 'flex', cursor: 'pointer', float: 'right', position: 'absolute' }}></i>

                    <Button
                        disabled={userSearchWord == ''}
                        type="submit"
                        variant="primary" style={{ minWidth: '6em', marginRight: '-5px', minHeight: '2.4em' }}>{loading ? <Spinner size="sm" /> : 'Search'}</Button>

                    {/* <Button
                        onClick={() => setAddNewBenefOwnerImportModal(true)}
                        variant="outline border  d-flex gap-2 border-primary text-primary" style={{ minWidth: '9em', marginRight: '-5px', minHeight: '2.4em' }}>{<div className="d-flex w-100 gap-2 justify-content-center"> <i className="bi bi-file-earmark-arrow-up"></i>
                            <p className="p-0 m-0" >Bulk Upload</p></div>}</Button> */}
                </form>

            </div>

            <div className="d-flex w-100 justify-content-center mt-2" style={{ height: '45vh', overflowY: 'scroll' }}>

                {bmoList &&bmoList.length > 0 && <ul className="w-75 rounded border rounded-3 m-0 p-0" style={{ listStyle: 'none' }}>{
                    bmoList.map((bmo: IBMCustomersPublic, index: number) => (

                        <li key={index} onClick={() => handleNavigateToLevel(bmo)} role="button" className="p-2 m-0 border px-3">{bmo.customerName}</li>


                    ))
                }
                </ul>}

            </div>
            {/* <UnAuthorizedBMOListTab/> */}

        </div>
    )

}

export default UboRiskAdminInitDashboardpage;