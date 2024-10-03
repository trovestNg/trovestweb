import React, { useEffect, useState } from "react";
import { Container, Modal, Card, Button, Spinner, FormControl } from "react-bootstrap";
import DashboardCard from "../../components/cards/dashboard-card";
import openBook from '../../assets/images/open-book.png'
import checked from '../../assets/images/check.png';
import timer from '../../assets/images/deadline.png';
import error from '../../assets/images/error.png';
import { Tabs, Tab } from "react-bootstrap";
import UserAllPoliciesTab from "../../components/tabs/userTabs/user-all-policies-tab";
import UserNotAttestedPoliciesTab from "../../components/tabs/userTabs/user-not-attested-policies-tab";
import UserAttestedPoliciesTab from "../../components/tabs/userTabs/attested-policies-tab";
import { getPolicies } from "../../controllers/policy";
import { IPolicy } from "../../interfaces/policy";
import { IUserDashboard } from "../../interfaces/user";
import { IDept } from "../../interfaces/dept";
import { toast } from "react-toastify";
import { getUserInfo, loginUser, logoutUser } from "../../controllers/auth";
import api from "../../config/api";
import UnAuthorizedBMOListTab from "../../components/tabs/users-unauth-tabs/unAuthorizedBMOListTab";
import styles from './unAuth.module.css'
import { IBMO } from "../../interfaces/bmo";
import apiUnAuth from "../../config/apiUnAuth";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { handleSetBmoCustormer, handleUserSearch, handleUserSearchResult, updateNav } from "../../store/slices/userSlice";
import CreateBMOOwnerImportModal from "../../components/modals/createBMOOwnerImportModal";
import { clearAuthUserBmoSearchWord, emptyAuthUserBMOSearchResult, pushToAuthUserNavArray, setAuthUserBmoCustormerProfile, setAuthUserBMOSearchResult, setAuthUserBMOSearchWord } from "../../store/slices/authUserSlice";
import { IBMCustomersPublic, IBMOwnersPublic, IUnAuthUserNavLink } from "../../interfaces/bmOwner";


const UboAdminInitDashboardpage = () => {
    const bmoList: IBMCustomersPublic[] = useSelector((state: any) => state.authUserSlice.authUserBMOSearch.authUserBMOCustomerSearchResult);
    const authUserBmoSearchWord = useSelector((state: any) => state.authUserSlice.authUserBMOSearch.authUserSearchWord);
    const userClass = useSelector((state: any) => state.authUserSlice.authUserProfile.UserClass);
    
    const [loading, setLoading] = useState(false);

    // const [userSearch, setUserSearch] = useState('');
    const [refreshComponent, setRefreshComponent] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    
    const [addNewBenefOwnerImportModal, setAddNewBenefOwnerImportModal] = useState(false);



    const handleSearchByBmoNameOrNumber = async (e: any) => {
        e.preventDefault()
        setLoading(true);

        // toast.error('Await')
        try {
            const res = await apiUnAuth.get(`customers?search=${authUserBmoSearchWord}`);
            console.log(res)
            if (res.data) {
                setLoading(false);
                dispatch(setAuthUserBMOSearchResult(res?.data?.customerAccounts))
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
        navigate(`/ubo-portal/custormer-details/${1}/${owner.customerNumber}`)
    }

    const handleClear = () => {
        // setBySearch(false);
        dispatch(clearAuthUserBmoSearchWord())
        dispatch(emptyAuthUserBMOSearchResult())
        // setBmoList([])
        // setRefreshData(!refreshData)
    }

    // useEffect(() => {
    //     setBmoList([])
    // }, [userSearch == ""])

    return (
        <div className="w-100 p-0">
            {/* <p>{userClass}</p> */}
            <CreateBMOOwnerImportModal off={() => setAddNewBenefOwnerImportModal(false)} show={addNewBenefOwnerImportModal} />
            <div className={`w-100 p-3 rounded rounded-3 py-4 ${styles.jumbo}`}
            >
                <Card className={`rounded rounded-3 bg-primary py-4 text-light px-3 ${styles.jumbo2}`}>
                    <Card.Body>
                        <h4>Welcome to Ultimate Beneficial Owner Portal </h4>
                        <p className="text-secondary">
                            Here you will find a secure and efficient platform designed to simplify the collection, verification, <br /> and management of beneficial ownership information.
                        </p>

                    </Card.Body>
                </Card>
            </div>


            <div className="w-100 d-flex justify-content-center" style={{ position: 'relative' }}>
                <form onSubmit={handleSearchByBmoNameOrNumber} className="d-flex align-items-center w-75 justify-content-center mt-3 gap-3">

                    <FormControl
                        onChange={(e) => dispatch(setAuthUserBMOSearchWord(e.target.value))}
                        placeholder="Search by Name, Company, Assets...."
                        value={authUserBmoSearchWord}
                        className="py-2 w-50" />
                    <i
                        className="bi bi-x-lg"
                        onClick={handleClear}
                        style={{ marginLeft: '150px', display: authUserBmoSearchWord == '' ? 'none' : 'flex', cursor: 'pointer', float: 'right', position: 'absolute' }}></i>

                    <Button
                        disabled={authUserBmoSearchWord == '' || loading}
                        type="submit"
                        variant="primary" style={{ minWidth: '6em', marginRight: '-5px', minHeight: '2.4em' }}>{loading ? <Spinner size="sm" /> : 'Search'}</Button>
                        
                        <Button
                    onClick={()=>setAddNewBenefOwnerImportModal(true)}
                        variant="outline border  d-flex gap-2 border-primary text-primary" style={{ minWidth: '9em', marginRight: '-5px', minHeight: '2.4em' }}>{<div className="d-flex w-100 gap-2 justify-content-center"> <i className="bi bi-file-earmark-arrow-up"></i>
                        <p className="p-0 m-0" >Bulk Upload</p></div>}</Button>
                </form>
                

            </div>

            <div className="d-flex w-100 justify-content-center mt-2" style={{ height: '45vh', overflowY: 'scroll' }}>

                {bmoList.length > 0 && <ul className="w-75 rounded border rounded-3 m-0 p-0" style={{ listStyle: 'none' }}>{
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

export default UboAdminInitDashboardpage;