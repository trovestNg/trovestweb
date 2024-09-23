import React, { useEffect, useState } from "react";

import UserAllPoliciesTab from "../../components/tabs/userTabs/user-all-policies-tab";
import { IPolicy } from "../../interfaces/policy";
import { IDept } from "../../interfaces/dept";
import { getPolicies } from "../../controllers/policy";
import { getUserInfo, loginUser } from "../../controllers/auth";
import { toast } from "react-toastify";
import api from "../../config/api";
import { IUserPolicy } from "../../interfaces/user";
import { Button, Card, FormControl, FormSelect, ListGroup, ListGroupItem, Spinner } from "react-bootstrap";
import apiUnAuth from "../../config/apiUnAuth";
import { useDispatch, useSelector } from "react-redux";
import { handleUserSearch, handleUserSearchResult } from "../../store/slices/userSlice";
import { IApprovedBMOOwner, IBMOwnersPublic } from "../../interfaces/bmOwner";


const AuthReportBmoPage = () => {
    const [bmoList, setBmoList] = useState<IApprovedBMOOwner[]>([]);
    const [parentInfo, setParentInfo] = useState<IApprovedBMOOwner>();

    const [loading, setLoading] = useState(false);
    const [sloading, setSLoading] = useState(false);
    const [searchedWord, setSearchedWord] = useState('');

    const [refreshComponent, setRefreshComponent] = useState(false)

    const [totalBmoCount, setTotalBmoCount] = useState(0);


    const dispatch = useDispatch()
    // const userSearch = useSelector((state:any)=>state.userSlice.userBMOSearch.searchWords);

    const fetch = async () => {
        setLoading(true)// toast.error('Await')
        let userInfo = await getUserInfo();
        if (userInfo) {
            try {

                const res = await api.get(`rejected?requesterName=${userInfo.profile.given_name}`, userInfo?.access_token);
                console.log({ heree: res })
                if (res?.data) {
                    setBmoList(res?.data?.Data.reverse());
                    setTotalBmoCount(res?.data?.Data.length)
                    // calculatePercent(res?.data?.Owners)
                    setParentInfo(res?.data?.Parent)
                    setLoading(false)
                }
                else if (res?.status == 400) {
                    // setParentInfo(unAvOwner);
                    setBmoList([]);
                    setLoading(false)
                }
                else {
                    // setParentInfo(unAvOwner);
                    setBmoList([]);
                    setLoading(false)
                }
            } catch (error) {
                // setParentInfo(unAvOwner);
                setBmoList([]);
                // setBmoList([])
                setLoading(false)
            }

        }

    }

    // const handleSearchByBmoNameOrNumber = async (e: any) => {
    //     e.preventDefault()
    //     setLoading(true);

    //     // toast.error('Await')
    //     try {
    //         const res = await apiUnAuth.get(`customers?search=${userSearch}`);
    //         console.log(res)
    //         if (res.data) {
    //             setLoading(false);
    //             dispatch(handleUserSearchResult(res?.data?.customerAccounts))
    //             // setBmoList(res?.data?.customerAccounts);
    //             if (res?.data?.customerAccounts?.length <= 0) {
    //                 toast.error('No Custormer by that Name/ID')
    //             }
    //             setLoading(false);
    //         }
    //         else {
    //             setLoading(false)

    //         }
    //     } catch (error) {

    //         setLoading(false)
    //     }
    //     // try {
    //     //     
    //     //     console.log({ listHere: res?.data })
    //     //     
    //     //         
    //     //        
    //     //     }
    //     // }
    //     // catch (error) {
    //     //     console.log(error)
    //     // }
    // }

    const handleClear = () => {
        // setBySearch(false);
        dispatch(handleUserSearch(''))
        dispatch(handleUserSearchResult([]))
        // setBmoList([])
        // setRefreshData(!refreshData)
    }


    useEffect(() => {
        fetch()
    }, [refreshComponent])

    return (
        <div className="w-100">
            <div className="w-100 justify-content-between d-flex">
                <div className="">
                    <h5 className="font-weight-bold text-primary" style={{ fontFamily: 'title' }}>Generate Report</h5>
                    <p>Here, you can spool and download reports of beneficial owners and their risk assessment.</p>
                </div>

                <div className="d-flex gap-2">

                        <Button variant="outline" className="border border-primary" style={{ maxWidth: '12em', maxHeight: '3em' }}
                        // onChange={(e) => handleListDownload(e.currentTarget.value)}
                        >Download All
                        </Button>
                    </div>
            </div>

            {/* <div className="w-100 d-flex" style={{ position: 'relative' }}>
                <form 
                // onSubmit={handleSearchByBmoNameOrNumber} 
                className="d-flex w-100 mt-3 gap-3">

                    <FormControl
                        onChange={(e) => dispatch(handleUserSearch(e.target.value))}
                        placeholder="Search by Name, Company, Assets...."
                        // value={userSearch}
                        className="py-2 w-50" />
                    <i
                        className="bi bi-x-lg"
                        onClick={handleClear}
                        style={{ marginLeft: '400px', 
                        // display: userSearch == '' ? 'none' : 'flex', 
                        display: 'none', 
                        cursor: 'pointer', float: 'right', position: 'absolute' }}></i>

                    <Button
                        disabled={searchedWord == '' || sloading}
                        type="submit"
                        variant="primary" style={{ minWidth: '6em', marginRight: '-5px', minHeight: '2.4em' }}>{sloading ? <Spinner size="sm" /> : 'Search'}</Button>


                </form>

            </div> */}
            <div className="w-100 mt-5">

                <div className="">
                    <h5 className="font-weight-bold text-primary" style={{ fontFamily: 'title' }}>Customize report:</h5>
                    <p>Customize your report by adjusting the filter options below to choose the data you want in your downloaded Excel or PDF file</p>
                </div>

                <div className="w-100 d-flex flex-column gap-3">
                    <div className="d-flex gap-2">

                        <FormSelect style={{ maxWidth: '12em', maxHeight: '3em' }}
                        // onChange={(e) => handleListDownload(e.currentTarget.value)}
                        >
                            <option>BO Category</option>
                            <option value={'csv'}>All</option>
                            <option value={'csv'}>Individual BO</option>
                            <option value={'pdf'}>Corporate BO</option>
                        </FormSelect>
                    </div>

                    <div className="d-flex gap-2">

                        <FormSelect style={{ maxWidth: '12em', maxHeight: '3em' }}
                        // onChange={(e) => handleListDownload(e.currentTarget.value)}
                        >
                            <option>Country</option>
                            <option value={'csv'}>All</option>
                            <option value={'csv'}>Nigeria</option>
                            <option value={'pdf'}>Other</option>
                        </FormSelect>
                    </div>

                    <div className="d-flex gap-2">

                        <FormSelect style={{ maxWidth: '12em', maxHeight: '3em' }}
                        // onChange={(e) => handleListDownload(e.currentTarget.value)}
                        >
                            <option>PEP</option>
                            <option value={'csv'}>Yes</option>
                            <option value={'csv'}>No</option>
                        </FormSelect>
                    </div>

                    <div className="d-flex gap-2">

                    <Button className="border border-primary p-2" style={{ maxWidth: '12em', maxHeight: '3em' }}
                        // onChange={(e) => handleListDownload(e.currentTarget.value)}
                        >Generate Report
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    )

}

export default AuthReportBmoPage;