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
import { IApprovedBMOOwner, IBMCustomersPublic, IBMOwnersPublic } from "../../interfaces/bmOwner";
import { baseUrl } from "../../config/config";


const AuthReportBmoPage = () => {
    const [bmoList, setBmoList] = useState<IBMCustomersPublic[]>([]);
    const [parentInfo, setParentInfo] = useState<IApprovedBMOOwner>();

    const [loading, setLoading] = useState(false);
    const [sloading, setSLoading] = useState(false);
    const [searchedWord, setSearchedWord] = useState('');

    const [refreshComponent, setRefreshComponent] = useState(false)

    const [totalBmoCount, setTotalBmoCount] = useState(0);

    const [dloading, setDLoading] = useState(false);
    const [bySearch, setBySearch] = useState(false);


    const dispatch = useDispatch()
    // const userSearch = useSelector((state:any)=>state.userSlice.userBMOSearch.searchWords);

    const handleSearchByName = (e: any) => {
        e.preventDefault();
        setBySearch(true);
        setRefreshComponent(!refreshComponent)
    }

    const handleSearchByBmoNameOrNumber = async (e: any) => {
        e.preventDefault()
        setLoading(true);

        // toast.error('Await')
        try {
            const res = await apiUnAuth.get(`customers?search=${searchedWord}`);
            console.log(res)
            if (res.data) {
                setLoading(false);
                // dispatch(setAuthUserBMOSearchResult(res?.data?.customerAccounts))
                setBmoList(res?.data?.customerAccounts);
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
        setSearchedWord('')
        setBmoList([])
        // setRefreshData(!refreshData)
    }

    const downloadPdfReport = async () => {
        try {
            setDLoading(true)
            let userInfo = await getUserInfo();
            // const res = await api.get(``, );
            const res = await fetch(`${baseUrl}/report/customer/pdf?customerNumber=${'All'}&&requesterName=${`${userInfo?.profile.given_name} ${userInfo?.profile.family_name}`}`)
            if (res.status == 200) {
                res.blob().then(blob => {
                    let a = document.createElement('a');
                    a.href = window.URL.createObjectURL(blob);
                    a.download = 'General UBO Report.pdf';
                    a.click();
                })
                setDLoading(false)
            }

            if (res.status == 404) {
                toast.error('Fail to fetch report')
                setDLoading(false)
            }

        } catch (error) {

        }
    }

    const downloadExcelReport = async () => {
        try {
            setDLoading(true)
            let userInfo = await getUserInfo();
            // const res = await api.get(``, );
            const res = await fetch(`${baseUrl}/report?format=xlsx&&customerNumber=${'All'}&&requesterName=${`${userInfo?.profile.given_name} ${userInfo?.profile.family_name}`}`)

            if (res.status == 200) {
                res.blob().then(blob => {
                    let a = document.createElement('a');
                    a.href = window.URL.createObjectURL(blob);
                    a.download = 'General UBO Report.xlsx';
                    a.click();
                })
                setDLoading(false)
            }

            if (res.status == 404) {
                toast.error('Fail to fetch report')
                setDLoading(false)
            }

        } catch (error) {

        }
    }

    const handleListDownload = (val: string) => {
        if (val == 'pdf') {
            // toast.success('This operation might take a while, be patient')
            downloadPdfReport()
        } else if (val == 'csv') {
            // toast.success('This operation might take a while, be patient')
            downloadExcelReport()
        } else {
            return
        }
    }

     const handleGetReportByOwner = async(owner:any)=>{

     }


    useEffect(() => {
        // fetch()
    }, [refreshComponent])

    return (
        <div className="w-100">
            <div className="w-75 justify-content-between d-flex">
                <div className="">
                    <h5 className="font-weight-bold text-primary" style={{ fontFamily: 'title' }}>Generate Report</h5>
                    <p>Here, you can spool and download reports of beneficial owners and their risk assessment.</p>
                </div>

                <div className="d-flex gap-2">

                    {<FormSelect className="bg-primary text-light" style={{ minWidth: '12em', maxHeight: '3em' }} onChange={(e) => handleListDownload(e.currentTarget.value)}>
                        <option>Download All</option>
                        <option value={'csv'}>CSV</option>
                        <option value={'pdf'}>PDf</option>
                    </FormSelect>
                    }
                </div>
            </div>


            <div className="w-100 d-flex align-items-center mt-5">
                <div className="w-100 justify-content-between d-flex">
                    <div className="">
                        <h5 className="font-weight-bold text-primary" style={{ fontFamily: 'title' }}>Individual report:</h5>
                        <p>Download individual report for authorised for corporate account.</p>
                    </div>
                </div>

            </div>


            <div className="w-100 d-flex align-items-center">


                <form
                    onSubmit={(e) => handleSearchByBmoNameOrNumber(e)}
                    className="d-flex w-100 mt-3 gap-3 align-items-center"
                    style={{ position: 'relative' }}
                >

                    <FormControl
                        onChange={(e) => setSearchedWord(e.target.value)}
                        placeholder="Search by Name, Company, Assets...."
                        value={searchedWord}
                        className="py-2 w-50" />
                    <i
                        className="bi bi-x-lg"
                        onClick={handleClear}
                        style={{
                            marginLeft: '550px',
                            display: searchedWord == '' ? 'none' : 'flex',
                            cursor: 'pointer', float: 'right', position: 'absolute'
                        }}></i>

                    <Button
                        disabled={searchedWord == '' || sloading}
                        type="submit"
                        variant="primary" style={{ minWidth: '6em', marginRight: '-5px', minHeight: '2.4em' }}>{sloading ? <Spinner size="sm" /> : 'Search'}</Button>
                </form>

            </div>

            <div className="d-flex w-100 mt-2" style={{ height: '45vh', overflowY: 'scroll' }}>

                {
                    bmoList.length> 0 &&
                    <ul className="w-75 rounded border rounded-3 m-0 p-0" style={{ listStyle: 'none' }}>{
                    bmoList.map((bmo: IBMCustomersPublic, index: number) => (

                        <li key={index}
                            onClick={() => handleGetReportByOwner(bmo)} 
                            role="button" className="p-2 m-0 border px-3">{bmo.customerName}</li>


                    ))
                }
                </ul>}

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
            {/* <div className="w-100 mt-5">

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

            </div> */}
        </div>
    )

}

export default AuthReportBmoPage;