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
import { DateRangePicker } from "rsuite";
import 'rsuite/dist/rsuite.min.css';  // Import RSuite styles


const AuthHistoryBmoPage = () => {
    interface IHistory {
        Action: string,
        ActionDescription: string,
        Id: number,
        TimeStamp: string,
        User: string,

    }

    const [searchedWord, setSearchedWord] = useState('');
    const [history, setHistory] = useState<IHistory[]>([]);
    const [bySearch, setBySearch] = useState(false);
    const [sortByDateRange, setSortByDateRange] = useState(false);

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // const [parentInfo, setParentInfo] = useState<IApprovedBMOOwner>();

    const [loading, setLoading] = useState(false);
    const [refreshComponent, setRefreshComponent] = useState(false)

    const [totalBmoCount, setTotalBmoCount] = useState(0);
    const [sloading, setSLoading] = useState(false);

    function filterItemsFromYesterday(items: IHistory[]) {
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

    function filterItemsFromThreeDaysAgo(items: IHistory[]) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);  // Set time to midnight at the start of today
    
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(today.getDate() - 3);  // Get the date 3 days ago
        threeDaysAgo.setHours(0, 0, 0, 0);  // Set time to midnight at the start of 3 days ago
    
        return items.filter(item => {
            const creationDate = new Date(item.TimeStamp);
            return creationDate < today && creationDate >= threeDaysAgo;
        });
    }
    

    function filterItemsFromToday(items: IHistory[]) {
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

    const handleByDateRange = (range: any) => {
        console.log({ seerange: range })

        if (range === null) {
            // Handle the case when the range is cleared
            setSortByDateRange(false)
            setRefreshComponent(!refreshComponent)
        } else {
            let dateStart = moment(range[0]).format('DD-MM-yyyy')
            let dateEnd = moment(range[1]).format('DD-MM-yyyy')
            setStartDate(dateStart)
            setEndDate(dateEnd)
            setBySearch(false)
            setSortByDateRange(true)
            setRefreshComponent(!refreshComponent)

        }

    }

    const handleSearchClear = () => {
        setBySearch(false)
        setSearchedWord('')
        setSortByDateRange(false)
        setRefreshComponent(!refreshComponent)
    }

    const getHistoryByDate = async () => {
        let userInfo = await getUserInfo();
        if (userInfo) {
            try {
                const res = await api.get(`history?StartDate=${startDate}&EndDate=${endDate}&pageSize=${1000}&requesterName=${userInfo.profile.given_name}`, userInfo?.access_token);
                // console.log({heree:res})
                if (res?.status == 200) {
                    setHistory(res?.data?.Histories);
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

    const getHistoryBySearch = async () => {
        let userInfo = await getUserInfo();
        if (userInfo) {
            try {
                const res = await api.get(`history?User=${searchedWord}&pageSize=${1000}&requesterName=${userInfo.profile.given_name}`, userInfo?.access_token);
                // console.log({heree:res})
                if (res?.data) {
                    setHistory(res?.data?.Histories);
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


    const fetch = async () => {
        setLoading(true)// toast.error('Await')

        if (sortByDateRange) {
            getHistoryByDate()
        } else if (bySearch) {
            getHistoryBySearch()
        } else {

            let userInfo = await getUserInfo();
            if (userInfo) {
                try {

                    const res = await api.get(`history?&pageSize=${1000}&requesterName=${userInfo.profile.given_name}`, userInfo?.access_token);
                    // console.log({heree:res})
                    if (res?.data) {
                        setHistory(res?.data?.Histories);
                        setLoading(false)
                    }
                    else if (res?.status == 400) {
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

    }

    const handleSearchByName = (e: any) => {
        e.preventDefault();
        setBySearch(true);
        setSortByDateRange(false)
        setRefreshComponent(!refreshComponent)
    }


    const returLastNameInitial = (name: string) => {
        let splited = name.split(" ");

        if (splited.length >= 2) {
            // Get the first and last names
            let fName = splited[0];
            let lName = splited[splited.length - 1];

            // Get the initials
            let fInit = fName[0];
            let lInit = lName[0];

            return `${fInit}${lInit}`;
        } else {
            // Only the first name is available
            let fName = splited[0];
            let fInit = fName[0];
            return `${fInit}`;
        }
    };

    useEffect(() => {
        fetch()
    }, [refreshComponent])

    return (
        <div className="w-100">

            <div className="w-100 mt-5">


                <div className="d-flex gap-3 flex-column w-100 justify-content-center mt-4">
                    <div className="w-100 d-flex justify-content-between align-items-center">
                        <div className="w-50 d-flex  gap-2 flex-column align-items-start px-4">
                            <label htmlFor="datePicker">Sort by date range:</label>
                            <DateRangePicker onChange={handleByDateRange} name="datePicker" className="" />
                        </div>

                        <div className="w-50 d-flex align-items-center justify-content-end px-4">
                        
                            <form
                                onSubmit={(e) => handleSearchByName(e)}
                                style={{position:'relative'}}
                                className="d-flex w-100 align-items-center justify-content-end  mt-3 gap-3 align-items-center"
                                
                            >
                                

                                <FormControl
                                    onChange={(e) => setSearchedWord(e.target.value)}
                                    placeholder="Sort by name of initiator...."
                                    value={searchedWord}
                                    className="py-2 w-50" />
                                <i
                                    className="bi bi-x-lg"
                                    onClick={handleSearchClear}
                                    style={{
                                        marginRight: '120px',
                                        display: searchedWord == '' ? 'none' : 'flex',
                                        cursor: 'pointer',
                                        position: 'absolute'
                                    }}></i>

                                <Button
                                    disabled={searchedWord == '' || sloading}
                                    type="submit"
                                    variant="primary" style={{ minWidth: '6em', marginRight: '-5px', minHeight: '2.4em' }}>{sloading ? <Spinner size="sm" /> : 'Search'}</Button>


                            </form>

                        </div>



                    </div>
                    <div className="px-4" style={{ height: '50vh', overflowY: 'scroll' }}>
                        <div className="w-100 p-2">
                            <p className="fw-bold">Today</p>
                            {
                                loading &&
                                <div className="w-100 d-flex justify-content-center">
                                    <Spinner className="text-primary" />
                                </div>

                            }

                            {
                                !loading &&
                                    filterItemsFromToday(history).length <= 0 ?
                                    <div className="w-100 d-flex justify-content-center">
                                        No data available</div> :
                                    filterItemsFromToday(history).map((hist: IHistory) => (
                                        <div className="d-flex gap-3 mt-3 w-100 shadow-sm p-2">

                                            <Badge className="p-3 bg-primary text-center d-flex align-items-center justify-content-center " style={{ maxHeight: '3em', maxWidth: '3em', borderRadius: '6em' }}>{returLastNameInitial(hist?.User)}</Badge>
                                            <div className=" w-75">
                                                <p className="p-0 m-0 text-primary fw-bold">{hist.User}</p>
                                                {/* <p className="p-0 m-0">Added new Beneficial Owner to <span className="fw-bold">OLASCO & CO Limited</span></p> */}
                                                <p className="p-0 m-0">{hist.ActionDescription}</p>
                                            </div>
                                            <p className=" w-50 text-end">{moment(hist.TimeStamp).format('DD/M/Y HH:mm A')}</p>
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

                                        <Badge className="p-3 bg-primary text-center d-flex align-items-center justify-content-center " style={{ maxHeight: '3em', maxWidth: '3em', borderRadius: '6em' }}>{returLastNameInitial(hist.User)}</Badge>
                                        <div className=" w-75">
                                            <p className="p-0 m-0 text-primary fw-bold">{hist.User}</p>
                                            {/* <p className="p-0 m-0">Added new Beneficial Owner to <span className="fw-bold">OLASCO & CO Limited</span></p> */}
                                            <p className="p-0 m-0">{hist.ActionDescription}</p>
                                        </div>
                                        <p className=" w-50 text-end">{moment(hist.TimeStamp).format('DD/M/Y HH:mm A')}</p>
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

                                        <Badge className="p-3 bg-primary text-center d-flex align-items-center justify-content-center " style={{ maxHeight: '3em', maxWidth: '3em', borderRadius: '6em' }}>{returLastNameInitial(hist.User)}</Badge>
                                        <div className=" w-75">
                                            <p className="p-0 m-0 text-primary fw-bold">{hist.User}</p>
                                            {/* <p className="p-0 m-0">Added new Beneficial Owner to <span className="fw-bold">OLASCO & CO Limited</span></p> */}
                                            <p className="p-0 m-0">{hist.ActionDescription}</p>
                                        </div>
                                        <p className=" w-50 text-end">{moment(hist.TimeStamp).format('DD/M/Y HH:mm A')}</p>
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