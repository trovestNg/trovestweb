import React, { useEffect, useState } from "react";
import { Container, Modal, Card, Button, Spinner, FormControl, Badge } from "react-bootstrap";
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
import { IBMO, IOwner, IParent } from "../../interfaces/bmo";
import apiUnAuth from "../../config/apiUnAuth";
import { useNavigate, useParams } from "react-router-dom";
import ChartModal from "../../components/modals/chartModal";
import MoreInfoModal from "../../components/modals/moreInfoModal";


const UnAuthBmoView2 = () => {
    const [bmoList, setBmoList] = useState<IOwner[]>();
    const [bmoOwner, setBmoOwner] = useState<IOwner>();
    const [parentInfo, setParentInfo] = useState<IParent>();
    const { curstomerNumber } = useParams()
    const [loading, setLoading] = useState(false);
    const [viewChartModal, setViewChartModal] = useState(false);
    const [viewMoreInfotModal, setViewMoreInfoModal] = useState(false);
    const [userSearch, setUserSearch] = useState('');
    const [refreshComponent, setRefreshComponent] = useState(false)



    const fetch = async () => {
        setLoading(true)
        // toast.error('Await')
        try {
            const res = await apiUnAuth.get(`level/approved?customerNumber=${curstomerNumber}`);
            if (res.data) {
                setBmoList(res?.data?.Owners);
                setParentInfo(res?.data?.Parent)
                setLoading(false)
            } else {
                setLoading(false)
            }
        } catch (error) {
            console.log({ seeError: error })
            // setBmoList([])
            setLoading(false)
        }
    }

    const handleClear = () => {
        // setBySearch(false);
        setUserSearch('')
        setBmoList([])
        // setRefreshData(!refreshData)
    }

    const handleShowInfoModal = (owner:IOwner   )=>{
        setBmoOwner(owner);
        setViewMoreInfoModal(!viewMoreInfotModal);
        

    }

    useEffect(() => {
        fetch();
    }, [])

    const navigate = useNavigate()
    return (
        <div className="w-100 p-0 px-5">
            <ChartModal show={viewChartModal} off={() => setViewChartModal(false)} />
                <MoreInfoModal info={bmoOwner} off={()=>setViewMoreInfoModal(false)} show={viewMoreInfotModal}/>
            <Button className="d-flex gap-2" onClick={() => navigate(-1)} variant="outline border border-primary">
                <i className="bi bi-arrow-left text-primary"></i>
                <p className="p-0 m-0 text-primary">Back To Homepage</p>

            </Button>
            <p className="p-0 m-0 text-primary fw-bold mt-3">{parentInfo?.BusinessName}</p>
            <div className="w-100 d-flex justify-content-between">
                <div className="d-flex gap-2 align-items-center mt-3">
                    {parentInfo &&
                        <>
                        <h5 className="p-0 m-0 text-primary fw-bold">Beneficial Owner Level </h5>
                    <Badge className="d-flex justify-content-center align-items-center text-center" style={{ borderRadius: '20px', height: '20px', width: '20px' }}>{parentInfo?.Level}</Badge>
                    </>
                    }
                </div>
                {bmoList && <Button >Download</Button>}
            </div>

            <div className="w-100 d-flex mt-3 justify-content-between p-2" style={{ backgroundColor: 'rgba(0,73,135,0.09)' }}>
                {
                    loading ?
                        <table className="table table-striped">
                            <thead className="thead-dark">
                                <tr style={{ fontSize: '0.85em' }}>
                                    <th scope="col" className="fw-medium">Business Name</th>
                                    <th scope="col" className="fw-medium">Customer Number</th>
                                    <th scope="col" className="fw-medium">RC Number/BN/CAC</th>
                                    <th scope="col" className="fw-medium">No Of Beneficial Owners</th>
                                </tr>
                            </thead>
                            <tbody>{
                                <tr className="fw-bold text-center">
                                    <td colSpan={4}>
                                        {/* No Data Available */}
                                    </td>

                                </tr>
                            }
                            </tbody>

                        </table>
                        : <table className="table table-striped">
                            <thead className="thead-dark">
                                <tr style={{ fontSize: '0.85em' }}>
                                    <th scope="col" className="fw-medium">Business Name</th>
                                    <th scope="col" className="fw-medium">Customer Number</th>
                                    <th scope="col" className="fw-medium">RC Number/BN/CAC</th>
                                    <th scope="col" className="fw-medium">No Of Beneficial Owners</th>
                                </tr>
                            </thead>
                            <tbody>{
                                <tr className="fw-bold">
                                    <td className="text-primary">
                                        {
                                            parentInfo?.BusinessName
                                        }
                                    </td>
                                    <td className="text-primary">
                                        {
                                            parentInfo?.CustomerNumber
                                        }
                                    </td>
                                    <td className="text-primary">
                                        {
                                            parentInfo?.RcNumber
                                        }
                                    </td>
                                    <td className="text-primary">
                                        {
                                            bmoList && bmoList.length
                                        }
                                    </td>
                                </tr>
                            }
                            </tbody>

                        </table>
                }

            </div>


            <div className="d-flex flex-column w-100 justify-content-center mt-4">
                {parentInfo && <div className="d-flex justify-content-between w-100">
                    <p className="fw-bold text-primary text-capitalize">{`${parentInfo?.BusinessName} Beneficial Owners`}</p>
                    <Button onClick={() => setViewChartModal(!viewChartModal)} variant="outline border  d-flex gap-2 border-primary text-primary">
                        <i className="bi bi-pie-chart p-0 m-0"></i>
                        <p className="p-0 m-0" >View Chart</p>
                    </Button>
                </div>}
                <div style={{ height: '40vh', overflowY: 'scroll' }}>
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
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            <tr className="fw-bold"><td className="text-center" colSpan={8}><Spinner /></td></tr>
                                        }
                                    </tbody>
                                </> :
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
                                            <th scope="col" className="bg-primary text-light"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            bmoList && bmoList.length > 0 ? bmoList && bmoList.map((bmoOwner: IOwner, index: number) => (
                                                <tr key={index}
                                                    role="button"
                                                    onClick={bmoOwner.CategoryDescription == 'Corporate' ? () => navigate(`/custormer-details/${bmoOwner.Id}`) :()=>handleShowInfoModal(bmoOwner)}
                                                >
                                                    <th scope="row">{index + 1}</th>
                                                    <td className="">{bmoOwner.BusinessName}</td>
                                                    <td>{bmoOwner.CategoryDescription}</td>
                                                    <td>{bmoOwner.CountryName}</td>
                                                    <td>{bmoOwner.PercentageHolding}%</td>
                                                    <td>{bmoOwner.NumberOfShares}</td>
                                                    <td>{bmoOwner.IsPEP ? 'Yes' : 'No'}</td>
                                                    <td>{bmoOwner.Ticker ? bmoOwner.Ticker : 'N/A'}</td>
                                                    <td>View more</td>
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
    )

}

export default UnAuthBmoView2;