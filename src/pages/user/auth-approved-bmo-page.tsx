import React, { useEffect, useState } from "react";

import UserAllPoliciesTab from "../../components/tabs/userTabs/user-all-policies-tab";
import { IPolicy } from "../../interfaces/policy";
import { IDept } from "../../interfaces/dept";
import { getPolicies } from "../../controllers/policy";
import { getUserInfo, loginUser } from "../../controllers/auth";
import { toast } from "react-toastify";
import api from "../../config/api";
import { IUserPolicy } from "../../interfaces/user";
import { Button, FormControl, Spinner } from "react-bootstrap";
import apiUnAuth from "../../config/apiUnAuth";
import { useDispatch, useSelector } from "react-redux";
import { handleUserSearch, handleUserSearchResult } from "../../store/slices/userSlice";


const AuthApprovedBmoPage = () => {

    const [policies, setPolicies] = useState<IPolicy[]>([]);
    const [depts, setDepts] = useState<IDept[]>([]);
    // const [regUsers, setRegUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshComponent, setRefreshComponent] = useState(false)

    const [totalPolicyCount, setTotalPolicyCount] = useState(0);
    const [totalAttested, setTotalAttested] = useState(0);
    const [totalNotAttested, setTotalNotAttested] = useState(0);

    const dispatch = useDispatch()
    const userSearch = useSelector((state:any)=>state.userSlice.userBMOSearch.searchWords);

    const getAllPolicies = async () => {
        setLoading(true)
        try {
            let userInfo = await getUserInfo();
            let userName = userInfo?.profile?.sub.split('\\')[1]
            const res = await api.get(`Policy/user-policy?userName=${userName}`, `${userInfo?.access_token}`);
            if (res?.data) {
                let notDeleted = res?.data.filter((pol: IPolicy) => !pol.isDeleted || !pol.markedForDeletion)

                setTotalPolicyCount(notDeleted.length);
                setLoading(false)
            }

        } catch (error) {
            // console.log({ gotten: userInfo })(error)
        }


    }

    const handleSearchByBmoNameOrNumber = async (e: any) => {
        e.preventDefault()
        setLoading(true);
       
        // toast.error('Await')
        try {
            const res = await apiUnAuth.get(`customers?search=${userSearch}`);
            console.log(res)
            if (res.data) {
                setLoading(false);
                dispatch(handleUserSearchResult(res?.data?.customerAccounts))
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
        // try {
        //     
        //     console.log({ listHere: res?.data })
        //     
        //         
        //        
        //     }
        // }
        // catch (error) {
        //     console.log(error)
        // }
    }

    const handleClear = () => {
        // setBySearch(false);
        dispatch(handleUserSearch(''))
        dispatch(handleUserSearchResult([]))
        // setBmoList([])
        // setRefreshData(!refreshData)
    }


    useEffect(() => {
        // getAllPolicies(); 
    }, [refreshComponent])

    return (
        <div className="w-100">
            <h5 className="font-weight-bold text-primary" style={{ fontFamily: 'title' }}>Approved Beneficial Owners {`(${totalPolicyCount})`} </h5>
            <p>Here, you'll find approved Beneficial Owners.</p>
    
            <div className="w-100 d-flex" style={{ position: 'relative' }}>
                <form onSubmit={handleSearchByBmoNameOrNumber} className="d-flex w-100 mt-3 gap-3">

                    <FormControl
                        onChange={(e) => dispatch(handleUserSearch(e.target.value))}
                        placeholder="Search by Name, Company, Assets...."
                        value={userSearch}
                        className="py-2 w-50" />
                    <i
                        className="bi bi-x-lg"
                        onClick={handleClear}
                        style={{ marginLeft: '400px', display: userSearch == '' ? 'none' : 'flex', cursor: 'pointer', float: 'right', position: 'absolute' }}></i>

                    <Button
                        disabled={userSearch == '' || loading}
                        type="submit"
                        variant="primary" style={{ minWidth: '6em', marginRight: '-5px', minHeight: '2.4em' }}>{loading ? <Spinner size="sm" /> : 'Search'}</Button>


                </form>

            </div>
            <div className="w-100 mt-5">
                {/* <UserAllPoliciesTab /> */}
            </div>
        </div>
    )

}

export default AuthApprovedBmoPage;