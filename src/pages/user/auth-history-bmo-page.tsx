import React, { useEffect, useState } from "react";

import UserAllPoliciesTab from "../../components/tabs/userTabs/user-all-policies-tab";
import { IPolicy } from "../../interfaces/policy";
import { IDept } from "../../interfaces/dept";
import { getPolicies } from "../../controllers/policy";
import { getUserInfo, loginUser } from "../../controllers/auth";
import { toast } from "react-toastify";
import api from "../../config/api";
import { IUserPolicy } from "../../interfaces/user";
import { Badge, Button, Card, FormControl, ListGroup, ListGroupItem, Spinner } from "react-bootstrap";
import apiUnAuth from "../../config/apiUnAuth";
import { useDispatch, useSelector } from "react-redux";
import { handleUserSearch, handleUserSearchResult } from "../../store/slices/userSlice";
import { IApprovedBMOOwner, IBMOwnersPublic } from "../../interfaces/bmOwner";
import moment from "moment";


const AuthHistoryBmoPage = () => {
    interface IHistory {
        Action: string,
        ActionDescription: string,
        Id: number,
        TimeStamp: string,
        User: string,
        
    }

    const [history, setHistory] = useState<IHistory[]>([]);
    // const [parentInfo, setParentInfo] = useState<IApprovedBMOOwner>();

    const [loading, setLoading] = useState(false);
    const [refreshComponent, setRefreshComponent] = useState(false)

    const [totalBmoCount, setTotalBmoCount] = useState(0);

    function filterItemsFromYesterday(items:IHistory[]) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);  // Get yesterday's date
        yesterday.setHours(0, 0, 0, 0);  // Set time to midnight to compare only the date part
      
        const today = new Date();
        today.setHours(0, 0, 0, 0);  // Set time to midnight
      
        return items.filter(item => {
          const creationDate = new Date(item.TimeStamp);
          return creationDate >= yesterday && creationDate < today;
        });
      }

      function filterItemsFromThreeDaysAgo(items:IHistory[]) {
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);  // Get the date for 3 days ago
        threeDaysAgo.setHours(0, 0, 0, 0);  // Set time to midnight for accurate comparison
      
        return items.filter(item => {
          const creationDate = new Date(item.TimeStamp);
          return creationDate >= threeDaysAgo;  // Return items created 3 days ago or later
        });
      }

      function filterItemsFromToday(items:IHistory[]) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);  // Set time to midnight at the start of today
      
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);  // Get tomorrow's date
        tomorrow.setHours(0, 0, 0, 0);  // Set time to midnight at the start of tomorrow
      
        return items.filter(item => {
          const creationDate = new Date(item.TimeStamp);
          return creationDate >= today && creationDate < tomorrow;
        });
      }

    const dispatch = useDispatch()
    // const userSearch = useSelector((state:any)=>state.userSlice.userBMOSearch.searchWords);

    const fetch = async () => {
        setLoading(true)// toast.error('Await')
        let userInfo = await getUserInfo();
        if (userInfo) {
            try {

                const res = await api.get(`history?&pageSize=${1000}&requesterName=${userInfo.profile.given_name}`, userInfo?.access_token);
                // console.log({heree:res})
                if (res?.data) {
                    setHistory(res?.data?.Histories);
                    // setTotalBmoCount(res?.data?.Data.length)
                    // calculatePercent(res?.data?.Owners)
                    // setParentInfo(res?.data?.Parent)
                    setLoading(false)
                }
                else if (res?.status == 400) {
                    // setParentInfo(unAvOwner);
                    setHistory([]);
                    setLoading(false)
                }
                else {
                    // setParentInfo(unAvOwner);
                    setHistory([]);
                    setLoading(false)
                }
            } catch (error) {
                // setParentInfo(unAvOwner);
                setHistory([]);
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
            {/* <h5 className="font-weight-bold text-primary" style={{ fontFamily: 'title' }}>History</h5>
            <p>Here, you'll find History for beneficial owners.</p> */}

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
                        // disabled={userSearch == '' || loading}
                        type="submit"
                        variant="primary" style={{ minWidth: '6em', marginRight: '-5px', minHeight: '2.4em' }}>{loading ? <Spinner size="sm" /> : 'Search'}</Button>


                </form>

            </div> */}
            <div className="w-100 mt-5">


                <div className="d-flex gap-3 flex-column w-100 justify-content-center mt-4">

                    <div className="px-4" style={{ height: '50vh', overflowY: 'scroll' }}>
                        <div className="w-100 p-2">
                        <p className="fw-bold">Today</p>
                            {
                               filterItemsFromToday(history).map((hist: IHistory) => (
                                    <div className="d-flex gap-3 mt-3 w-100 shadow-sm p-2">

                                        <Badge className="p-3 bg-primary text-center d-flex align-items-center justify-content-center " style={{ maxHeight: '3em', maxWidth: '3em', borderRadius: '6em' }}>{hist.User[0]}{hist.User[1]}</Badge>
                                        <div className=" w-75">
                                            <p className="p-0 m-0 text-primary fw-bold">{hist.User}</p>
                                            {/* <p className="p-0 m-0">Added new Beneficial Owner to <span className="fw-bold">OLASCO & CO Limited</span></p> */}
                                            <p className="p-0 m-0">{hist.ActionDescription}</p>
                                        </div>
                                        <p className=" w-50 text-end">{moment(hist.TimeStamp).format('HH:mm A')}</p>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    <div className="w-100 d-flex justify-content-center">
                        <hr className="w-75" />
                    </div>
                    <div className="px-4" style={{ height: '50vh', overflowY: 'scroll' }}>
                        <div className="w-100 p-2">
                            <p className="fw-bold">Yesterday</p>
                            {
                                filterItemsFromYesterday(history).map((hist: IHistory) => (
                                    <div className="d-flex gap-3 mt-3 w-100 shadow-sm p-2">

                                        <Badge className="p-3 bg-primary text-center d-flex align-items-center justify-content-center " style={{ maxHeight: '3em', maxWidth: '3em', borderRadius: '6em' }}>{hist.User[0]}{hist.User[1]}</Badge>
                                        <div className=" w-75">
                                            <p className="p-0 m-0 text-primary fw-bold">{hist.User}</p>
                                            {/* <p className="p-0 m-0">Added new Beneficial Owner to <span className="fw-bold">OLASCO & CO Limited</span></p> */}
                                            <p className="p-0 m-0">{hist.ActionDescription}</p>
                                        </div>
                                        <p className=" w-50 text-end">{moment(hist.TimeStamp).format('HH:mm A')}</p>
                                    </div>
                                ))
                            }
                        </div>
                    </div>

                    <div className="w-100 d-flex justify-content-center">
                        <hr className="w-75" />
                    </div>

                    <div className="px-4" style={{ height: '50vh', overflowY: 'scroll' }}>
                        <div className="w-100 p-2">
                            <p className="fw-bold">Other Days</p>
                            {
                                filterItemsFromThreeDaysAgo(history).map((hist: IHistory) => (
                                    <div className="d-flex gap-3 mt-3 w-100 shadow-sm p-2">

                                        <Badge className="p-3 bg-primary text-center d-flex align-items-center justify-content-center " style={{ maxHeight: '3em', maxWidth: '3em', borderRadius: '6em' }}>{hist.User[0]}{hist.User[1]}</Badge>
                                        <div className=" w-75">
                                            <p className="p-0 m-0 text-primary fw-bold">{hist.User}</p>
                                            {/* <p className="p-0 m-0">Added new Beneficial Owner to <span className="fw-bold">OLASCO & CO Limited</span></p> */}
                                            <p className="p-0 m-0">{hist.ActionDescription}</p>
                                        </div>
                                        <p className=" w-50 text-end">{moment(hist.TimeStamp).format('HH:mm A')}</p>
                                    </div>
                                ))
                            }
                        </div>
                    </div>





                </div>

            </div>
        </div>
    )

}

export default AuthHistoryBmoPage;