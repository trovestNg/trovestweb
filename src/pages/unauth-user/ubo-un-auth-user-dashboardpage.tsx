import React, { useEffect, useState } from "react";
import { Container, Modal, Card, Button, Spinner, FormControl } from "react-bootstrap";
import { toast } from "react-toastify";
import { getUserInfo, loginUser, logoutUser } from "../../controllers/auth";
import api from "../../config/api";
import UnAuthorizedBMOListTab from "../../components/tabs/users-unauth-tabs/unAuthorizedBMOListTab";
import styles from './unAuth.module.css'
import { IBMO, IOwner } from "../../interfaces/bmo";
import apiUnAuth from "../../config/apiUnAuth";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    setUnAuthUserBMOSearchWord,
    setUnAuthUserBMOSearchResult,
    emptyUnAuthUserBMOSearchResult,
    pushTounAuthUserNavArray,
    removeFromUnAuthUserNavArray,
    emptyUnAuthUserNavArray,
    clearUnAuthUserBmoSearchWord,
    setUnAuthUserBmoCustormerProfile,
    setUnAuthUserBMOOwnerProfile
} from "../../store/slices/unAuthserSlice";
import { IBMCustomersPublic, IBMOwnersPublic, IUnAuthUserNavLink } from "../../interfaces/bmOwner";
import { setAuthUserBMOSearchResult } from "../../store/slices/authUserSlice";


const UboUnAuthUserDashboardpage = () => {
    const bmoList: IBMCustomersPublic[] = useSelector((state: any) => state.unAuthUserSlice.unAuthUserBMOSearch.unAuthUserBMOCustomerSearchResult)
    const unAuthUserBmoSearchWord = useSelector((state: any) => state.unAuthUserSlice.unAuthUserBMOSearch.unAuthUserSearchWord)

    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    // const [userSearch, setUserSearch] = useState('');
    const [refreshComponent, setRefreshComponent] = useState(false)
    const navigate = useNavigate()
    
    

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
            Level: owner.level,
            RiskScore: owner.rating,
            RcNumber: owner.rcNumber,
            RiskLevel: owner.riskLevel
        }
        dispatch(pushTounAuthUserNavArray(payload));
        dispatch(setUnAuthUserBmoCustormerProfile(unAvOwner))
        navigate(`custormer-details/${1}/${owner.customerNumber}`)
    }

    const handleSearchByBmoNameOrNumber = async (e: any) => {
        e.preventDefault()
        setLoading(true);

        // toast.error('Await')
        try {
            const res = await apiUnAuth.get(`customers?search=${unAuthUserBmoSearchWord}`);
            console.log(res)
            if (res.data) {
                setLoading(false);
                dispatch(setUnAuthUserBMOSearchResult(res?.data?.customerAccounts))
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

    const handleClear = () => {
        // setBySearch(false);
        dispatch(clearUnAuthUserBmoSearchWord())
        dispatch(emptyUnAuthUserBMOSearchResult())
        // setBmoList([])
        // setRefreshData(!refreshData)
    }

    // useEffect(() => {
    //     setBmoList([])
    // }, [userSearch == ""])

    return (
        <div className="w-100 p-0">
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
                        onChange={(e) => dispatch(setUnAuthUserBMOSearchWord(e.target.value))}
                        placeholder="Search by Name, Company, Assets...."
                        value={unAuthUserBmoSearchWord}
                        className="py-2 w-50" />
                    <i
                        className="bi bi-x-lg"
                        onClick={handleClear}
                        style={{ marginLeft: '400px', display: unAuthUserBmoSearchWord == '' ? 'none' : 'flex', cursor: 'pointer', float: 'right', position: 'absolute' }}></i>

                    <Button
                        disabled={unAuthUserBmoSearchWord == '' || loading}
                        type="submit"
                        variant="primary" style={{ minWidth: '6em', marginRight: '-5px', minHeight: '2.4em' }}>{loading ? <Spinner size="sm" /> : 'Search'}</Button>


                </form>

            </div>

            <div className="d-flex w-100 justify-content-center mt-2" style={{ height: '45vh', overflowY: 'scroll' }}>

                {bmoList.length > 0 && <ul className="w-50 rounded border rounded-3 m-0 p-0" style={{ listStyle: 'none' }}>{
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

export default UboUnAuthUserDashboardpage;