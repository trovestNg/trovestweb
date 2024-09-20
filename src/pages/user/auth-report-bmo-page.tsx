import React, { useEffect, useState } from "react";

import UserAllPoliciesTab from "../../components/tabs/userTabs/user-all-policies-tab";
import { IPolicy } from "../../interfaces/policy";
import { IDept } from "../../interfaces/dept";
import { getPolicies } from "../../controllers/policy";
import { getUserInfo, loginUser } from "../../controllers/auth";
import { toast } from "react-toastify";
import api from "../../config/api";
import { IUserPolicy } from "../../interfaces/user";
import { Button, Card, FormControl, ListGroup, ListGroupItem, Spinner } from "react-bootstrap";
import apiUnAuth from "../../config/apiUnAuth";
import { useDispatch, useSelector } from "react-redux";
import { handleUserSearch, handleUserSearchResult } from "../../store/slices/userSlice";
import { IApprovedBMOOwner, IBMOwnersPublic } from "../../interfaces/bmOwner";


const AuthReportBmoPage = () => {
    const [bmoList, setBmoList] = useState<IApprovedBMOOwner[]>([]);
    const [parentInfo, setParentInfo] = useState<IApprovedBMOOwner>();
    
    const [loading, setLoading] = useState(false);
    const [refreshComponent, setRefreshComponent] = useState(false)

    const [totalBmoCount, setTotalBmoCount] = useState(0);
    

    const dispatch = useDispatch()
    // const userSearch = useSelector((state:any)=>state.userSlice.userBMOSearch.searchWords);

    const fetch = async () => {
        setLoading(true)// toast.error('Await')
        let userInfo = await getUserInfo();
        if(userInfo){
            try {
                
                const res = await api.get(`rejected?requesterName=${userInfo.profile.given_name}`,userInfo?.access_token);
                console.log({heree:res})
                if (res?.data) {
                    setBmoList(res?.data?.Data.reverse());
                    setTotalBmoCount(res?.data?.Data.length)
                    // calculatePercent(res?.data?.Owners)
                    setParentInfo(res?.data?.Parent)
                    setLoading(false)
                }
                else if(res?.status == 400){
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
            <h5 className="font-weight-bold text-primary" style={{ fontFamily: 'title' }}>Generate Report</h5>
            <p>Here, you can spool and download reports of beneficial owners and their risk assessment.</p>
    
            <div className="w-100 d-flex" style={{ position: 'relative' }}>
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

            </div>
            <div className="w-100 mt-5">
                





            


            <div className="d-flex flex-column w-100 justify-content-center mt-4">
                
                <div style={{ height: '70vh', overflowY: 'scroll' }}>
                    <table className="table table-striped mt-3" >
                        {
                            loading ?
                                <>
                                    <thead className="thead-dark">
                                        <tr >
                                            <th scope="col" className="bg-primary text-light">#</th>
                                            <th scope="col" className="bg-primary text-light">Beneficial Owner</th>
                                            <th scope="col" className="bg-primary text-light">Account Type</th>
                                            <th scope="col" className="bg-primary text-light">Nationality </th>
                                            <th scope="col" className="bg-primary text-light">% Holding </th>
                                            <th scope="col" className="bg-primary text-light">No of Shares  </th>
                                            <th scope="col" className="bg-primary text-light">PEP</th>
                                            
                                            <th scope="col" className="bg-primary text-light">Ticker</th>
                                            <th scope="col" className="bg-primary text-light">Action</th>
                                            <th scope="col" className="bg-primary text-light"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            <tr className="fw-bold"><td className="text-center" colSpan={9}><Spinner /></td></tr>
                                        }
                                    </tbody>
                                </> :
                                <>
                                    <thead className="thead-dark">
                                        <tr >
                                            <th scope="col" className="bg-primary text-light">#</th>
                                            <th scope="col" className="bg-primary text-light">Corporate Account</th>
                                            <th scope="col" className="bg-primary text-light">Customer Number</th>
                                            <th scope="col" className="bg-primary text-light">BO Level </th>
                                            <th scope="col" className="bg-primary text-light">Beneficial Owner</th>
                                            <th scope="col" className="bg-primary text-light">Authorizer</th>
                                            <th scope="col" className="bg-primary text-light">Date Approved</th>
                                            <th scope="col" className="bg-primary text-light">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            bmoList && bmoList.length > 0 ? bmoList && bmoList.map((bmoOwner: IApprovedBMOOwner, index: number) => (
                                                <tr key={index}
                                                    role="button"
                                                    // onClick={bmoOwner.CategoryDescription == 'Corporate' ? ()=>handleNavigateToLevel(bmoOwner) : () => handleShowInfoModal(bmoOwner)}
                                                >
                                                    <th scope="row">{index + 1}</th>
                                                    <td className="">{bmoOwner.BusinessName}</td>
                                                    <td>{bmoOwner.CategoryDescription}</td>
                                                    <td>{bmoOwner.CountryName}</td>
                                                    <td>{bmoOwner.PercentageHolding}%</td>
                                                    <td>{bmoOwner.NumberOfShares}</td>
                                                    <td>{bmoOwner.IsPEP ? 'Yes' : 'No'}</td>
                                                    <td>{bmoOwner.Ticker ? bmoOwner.Ticker : 'N/A'}</td>
                                                    <td className="table-icon" >
                                                        <i className=" bi bi-three-dots" onClick={(e) => e.stopPropagation()}></i>
                                                        <div className="content ml-5" style={{ position: 'relative', zIndex: 1500 }}>
                                                            <Card className="p-2  shadow-sm rounded border-0"
                                                                style={{ minWidth: '15em', marginLeft: '-10em', position: 'absolute' }}>

                                                                <ListGroup>
                                                                    <ListGroupItem className="multi-layer"
                                                                    // onClick={(e) => handleGetAttestersList(e, policy)}
                                                                    >
                                                                        <span className="w-100 d-flex justify-content-between">
                                                                            <div className="d-flex gap-2">
                                                                                <i className="bi bi-eye"></i>
                                                                                View More
                                                                            </div>

                                                                            {/* <i className="bi bi-chevron-right"></i> */}
                                                                        </span>

                                                                    </ListGroupItem>
                                                                    {
                                                                        <div onClick={(e) => e.stopPropagation()}>
                                                                            <ListGroupItem
                                                                            // onClick={(e) => handleUpdate(e, policy)}
                                                                            >
                                                                                <span className="w-100 d-flex justify-content-between">
                                                                                    <div className="d-flex gap-2">
                                                                                        <i className="bi bi-calendar-event"></i>
                                                                                        Edit
                                                                                    </div>
                                                                                </span>
                                                                            </ListGroupItem>
                                                                            <ListGroupItem
                                                                                className="text-danger"
                                                                            // disabled={policy?.markedForDeletion}
                                                                            // onClick={(e) => handleDelete(e, policy)}
                                                                            >
                                                                                <span className="w-100 d-flex justify-content-between">
                                                                                    <div className="d-flex gap-2">
                                                                                        <i className="bi bi-trash"></i>
                                                                                        Delete
                                                                                    </div>
                                                                                </span>
                                                                            </ListGroupItem>
                                                                        </div>
                                                                    }
                                                                </ListGroup>

                                                            </Card>

                                                        </div>

                                                    </td>


                                                </tr>
                                            )) : <tr className="text-center">
                                                <td colSpan={9}>
                                                    No Data Available
                                                </td>
                                            </tr>
                                        }
                                    </tbody>

                                </>
                        }
                    </table>

                </div>



            </div>

            </div>
        </div>
    )

}

export default AuthReportBmoPage;