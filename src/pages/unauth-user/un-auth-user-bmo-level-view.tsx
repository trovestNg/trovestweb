import React, { useEffect, useState } from "react";
import { Container, Modal, Card, Button, Spinner, FormControl, Badge, FormSelect, ListGroup, ListGroupItem } from "react-bootstrap";
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
import styles from './unAuth.module.css'
import { IBMO, IOwner, IParent } from "../../interfaces/bmo";
import apiUnAuth from "../../config/apiUnAuth";
import { useNavigate, useParams } from "react-router-dom";
import ChartModal from "../../components/modals/chartModal";
import MoreInfoModal from "../../components/modals/moreInfoModal";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import { useDispatch, useSelector } from "react-redux";
import { clearNav, reduceNavLink, updateNav } from "../../store/slices/userSlice";
import UnAuthBOOwnwerList from "../../components/paginations/ubo/un-auth-ubo-owners-list";
import { pushTounAuthUserNavArray, reduceUnAuthUserNavArray, removeFromUnAuthUserNavArray, setUnAuthUserBMOOwnerProfile } from "../../store/slices/unAuthserSlice";
import { IBMCustomersPublic, IBMOwnersPublic, IUnAuthUserNavLink } from "../../interfaces/bmOwner";
import { baseUrl } from "../../config/config";




const UnAuthBmoOwnerView = () => {
    const [bmoList, setBmoList] = useState<IBMOwnersPublic[]>([]);
    const [bmoOwner, setBmoOwner] = useState<IBMOwnersPublic>();
    const [parentInfo, setParentInfo] = useState<IBMOwnersPublic>();
    const { level, ownerId } = useParams()
    const [loading, setLoading] = useState(false);
    const [viewChartModal, setViewChartModal] = useState(false);
    const [viewMoreInfotModal, setViewMoreInfoModal] = useState(false);
    const [userSearch, setUserSearch] = useState('');
    const [refreshComponent, setRefreshComponent] = useState(false);
    const navigate = useNavigate();
    
    const dispatch = useDispatch();
    const [ref, setRef] = useState(false);

    const [currentLev,setCurrentLev] = useState(2)
    const [dloading, setDLoading] = useState(false);

    
    const unAvOwner = useSelector((state:any)=>state.unAuthUserSlice.unAuthUserBmoOwnerProfile);
    const navArray = useSelector((state: any) => state.unAuthUserSlice.unAuthUserNavigationArray);

  useEffect(() => {
    const handlePopState = () => {
        // console.log("Back button detected");
       
      if (navArray.length > 0) {
        const newArray = [...navArray];
        newArray.pop();
        // Dispatch the modified array back to the reducer
        dispatch(reduceUnAuthUserNavArray(newArray));
      }
    };

    // Add event listener for browser back action
    window.addEventListener('popstate', handlePopState);

    // Cleanup the event listener when component unmounts
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navArray.length, dispatch, navArray]);


    type Column = {
        header: string;
        dataKey: keyof IOwner;
    };
    const downloadPdfReport = async()=>{
        try {
            setDLoading(true)
            let userInfo = await getUserInfo();
            // const res = await api.get(`report?format=xlsx&&customerNumber=${curstomerNumber}&&requesterName=${`${userInfo?.profile.given_name} ${userInfo?.profile.family_name}`}`, );

            const res= await fetch(`${baseUrl}/report/otherLevels/pdf?parentId=${parentInfo?.Id}&requesterName=${`Public`}`)
            if(res.status==200){
                res.blob().then(blob=>{
                    let a=document.createElement('a');
                    a.href=window.URL.createObjectURL(blob);
                    a.download=parentInfo?.BusinessName+' Owners List.' + 'pdf';
                    a.click();
                   })
                   setDLoading(false)
               }
    
               if(res.status==404){
                toast.error('Fail to fetch report')
                   setDLoading(false)
               }
          
        } catch (error) {

        }
    }

    const headers: any = [

        { label: 'S/N', key: 'serialNumber' },
        { label: 'Beneficial Owner', key: 'BusinessName' },
        { label: 'Account Type', key: 'CategoryDescription' },
        { label: 'Nationality', key: 'CountryName' },
        { label: '% Holding', key: 'PercentageHolding' },
        { label: 'No of Shares', key: 'NumberOfShares' },
        { label: 'PEP', key: 'IsPEP' },
        { label: 'Ticker', key: 'Ticker' }
    ];

    const generateCSV = (data: IBMOwnersPublic[], headers: { label: string; key: keyof IBMOwnersPublic }[]) => {
        // Map data to match the headers
        const csvData = data.map((item, index) => ({
            BusinessName: item.BusinessName,
            CategoryDescription: item.CategoryDescription,
            CountryName: item.CountryName,
            PercentageHolding: item.PercentageHolding,
            CustomerNumber: item.BVN,
            NumberOfShares: item.NumberOfShares,
            IsPEP: item.IsPEP,
            Ticker: item.Ticker,
            serialNumber: index + 1
        }));

        // Convert the data to CSV format with headers
        const csv = Papa.unparse({
            fields: headers.map(header => header.label),
            data: csvData.map((item: any) => headers.map(header => item[header.key]))
        });

        // Create a Blob from the CSV string
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

        // Use FileSaver.js to save the file
        saveAs(blob, `${parentInfo?.BusinessName} BMO List}-.csv`);
    };

    const handleListDownload = (val: string) => {
        if (val == 'pdf') {
            downloadPdfReport()
        } else if (val == 'csv') {
            downloadExcelReport()
        } else {
            return
        }
    }


    // const fetchi = async () => {
    //     setLoading(true)
    //     // toast.error('Await')
    //     try {
    //         const res = await apiUnAuth.get(`owner/level/navigate/approved?OwnerId=${ownerId}`);
    //         console.log({seeMe:res})
    //         if (res.data) {
    //             setBmoList(res?.data?.Owners);
    //             setParentInfo(res?.data?.Parent)
    //             setLoading(false)
    //         }
    //         else if(res.status=404){
    //             setParentInfo(unAvOwner);
    //             setBmoList([]);
    //             setLoading(false)
    //         }
    //         else {
    //             setParentInfo(unAvOwner);
    //             setBmoList([]);
    //             setLoading(false)
    //         }
    //     } catch (error) {
    //         console.log({ seeError: error })
    //         setBmoList([])
    //         setLoading(false)
    //     }
    // }







    const fetchAll = async () => {
        setLoading(true)// toast.error('Await')
        
            try {
                
                const res = await apiUnAuth.get(`owner/level/navigate/approved?OwnerId=${ownerId}`);
                if (res?.data) {
                    const filtered = res?.data.Owners.filter((owner:IBMOwnersPublic)=>owner.IsAuthorized)
                    setBmoList(filtered);
                    // calculatePercent(res?.data?.Owners)
                    setParentInfo(res?.data?.Parent)
                    setLoading(false)
                }
                else if(res?.status == 400){
                    setParentInfo(unAvOwner);
                    setBmoList([]);
                    setLoading(false)
                }
                else {
                    setParentInfo(unAvOwner);
                    setBmoList([]);
                    setLoading(false)
                }
            } catch (error) {
                setParentInfo(unAvOwner);
                setBmoList([]);
                // setBmoList([])
                setLoading(false)
            }

        
       
    }






    console.log({seeMe:unAvOwner})
    const handleClear = () => {
        // setBySearch(false);
        setUserSearch('')
        setBmoList([])
        // setRefreshData(!refreshData)
    }

    const handleShowInfoModal = (owner: IBMOwnersPublic) => {
        setBmoOwner(owner);
        setViewMoreInfoModal(!viewMoreInfotModal);
    }

    const handleViewChart = () => {
        setViewChartModal(!viewChartModal);
    }

    // const handleNavigateNavs = (currentNav: any, navIndex: number) => {
    //     setRef(!ref)
    //     console.log({ currentNavList: navArray })
    //     const slicedNavList = navArray.slice(0, navIndex + 1);
    //     console.log({ slicedResultt: slicedNavList });
    //     dispatch(removeFromUnAuthUserNavArray(slicedNavList));
    //     // navigate(-1)
    //     if(navIndex ==0){
    //         navigate(`/custormer-details/${1}/${currentNav?.customerNumber}`)
    //     } else{
    //         navigate(`/owner-details/${level && +level - 1}/${currentNav?.ownerId}`)
    //     }
       

    // }

    const handleNavigateNavs = (currentNav: any, navIndex: number) => {
        // console.log({ currentNavList: navArray });
        // console.log({clickedNav:currentNav, itsIndex:navIndex})

        const slicedNavList = navArray.slice(0, navIndex + 1);
        // console.log({ slicedResultt: slicedNavList });
        dispatch(removeFromUnAuthUserNavArray(slicedNavList));
        
        if(navIndex ==0){
            navigate(`/custormer-details/${1}/${currentNav?.customerNumber}`)
        } else{
            navigate(`/owner-details/${level && +level - 1}/${currentNav?.ownerId}`);
            setRef(!ref)
        }
       

    }

    const handleBackToHomePage = () => {
        dispatch(clearNav([]))
        navigate('/')
    }

    const handleNavigateToOwner = (owner: IBMOwnersPublic) => {
        let payload: IUnAuthUserNavLink = {
            name: owner.BusinessName,
            customerNumber: owner?.CustomerNumber,
            ownerId: owner?.Id
        }
        let unAvOwner = {
            AuthorizeBy: owner.AuthorizeBy,
            AuthorizeDate: owner.AuthorizeDate,
            BVN: owner.BVN,
            BusinessName: owner.BusinessName,
            Category: owner.Category,
            CategoryDescription: owner.CategoryDescription,
            Comments: owner.Comments,
            CountryId: owner.CountryId,
            CountryName: owner.CountryName,
            CreatedBy: owner.CreatedBy,
            CreatedDate: owner.CreatedDate,
            CustomerNumber: owner.CustomerNumber            ,
            Id: owner.Id,
            IdNumber: owner.IdNumber,
            IdType: owner.IdType,
            IsAuthorized: owner.IsAuthorized,
            IsPEP: owner.IsPEP,
            IsRejected: owner.IsRejected,
            Level: owner.Level,
            NumberOfShares: owner.NumberOfShares,
            ParentId: owner.ParentId,
            PercentageHolding: owner.PercentageHolding,
            RcNumber: owner.RcNumber,
            RejectedBy: owner.RejectedBy,
            RejectedDate: owner.RejectedDate,
            RiskLevel: owner.RiskLevel,
            RiskScore: owner.RiskScore,
            Ticker:owner.Ticker
        }
        setCurrentLev(lev => lev+1)
        dispatch(pushTounAuthUserNavArray(payload));
        dispatch(setUnAuthUserBMOOwnerProfile(unAvOwner))
        window.history.pushState({}, '', `/owner-details/${level && +level + 1}/${owner.Id}`);
        navigate(`/owner-details/${level && +level + 1}/${owner.Id}`);
        setRef(!ref);
    }


    const downloadExcelReport = async()=>{
        try {
            setDLoading(true)
            let userInfo = await getUserInfo();
            // const res = await api.get(`report?format=xlsx&&customerNumber=${curstomerNumber}&&requesterName=${`${userInfo?.profile.given_name} ${userInfo?.profile.family_name}`}`, );

            const res= await fetch(`${baseUrl}/report/level?format=xlsx&&parentIid=${parentInfo?.Id}&requesterName=${`Public`}`)
           if(res.status==200){
            res.blob().then(blob=>{
                let a=document.createElement('a');
                a.href=window.URL.createObjectURL(blob);
                a.download=parentInfo?.BusinessName+' Owners List.' + 'xlsx';
                a.click();
               })
               setDLoading(false)
           }

           if(res.status==404){
            toast.error('Fail to fetch report')
               setDLoading(false)
           }
          
        } catch (error:any) {
toast.error(error?.message);
setDLoading(false);
        }
    }

    useEffect(() => {
        fetchAll();
    }, [ref])
    return (
        <div className="w-100 p-0">
            {bmoList.length > 0 && <ChartModal bmoList={bmoList} profile={parentInfo} show={viewChartModal} off={() => setViewChartModal(false)} />}
            <MoreInfoModal lev={level} info={bmoOwner} off={() => setViewMoreInfoModal(false)} show={viewMoreInfotModal} />
            <Button className="d-flex gap-2" onClick={handleBackToHomePage} variant="outline border border-primary">
                <i className="bi bi-arrow-left text-primary"></i>
                <p className="p-0 m-0 text-primary">Back To Homepage</p>

            </Button>
            {
                level && +level >= 1 &&
                <div className=" mt-2 d-flex align-items-center">
                    {
                        navArray.map((page: any, index: number) => 
                            (<Button onClick={()=>handleNavigateNavs(page,index)} 
                        style={{outline:'none'}} 
                        disabled={navArray.length === index +1} 
                        className="p-0 m-0 border text-uppercase border-0" variant="outline">{navArray.length === index +1?page.name:`${page.name}>`}</Button>))
                    }
                    {/* <p role="button" onClick={()=>navigate(-1)} className="p-0 m-0">{`Level-${level&& +level -1}`}</p> */}
                </div>
            }
            {/* <p className="p-0 m-0 text-primary fw-bold mt-3">{parentInfo?.BusinessName}</p> */}
            <div className="w-100 d-flex justify-content-between">
                <div className="d-flex gap-2 align-items-center mt-3">
                    {
                        <>
                            <h5 className="p-0 m-0 text-primary fw-bold">Beneficial Owner Level </h5>
                            <Badge className="d-flex justify-content-center align-items-center text-center" style={{ borderRadius: '20px', height: '20px', width: '20px' }}>{level}</Badge>
                        </>
                    }
                </div>
                <div className="d-flex gap-2">
                    {/* <Button onClick={handleAddNewBenefOwner} className="d-flex gap-2" style={{ minWidth: '15em' }}>
                        <i className="bi bi-plus-circle"></i>
                        <p className="p-0 m-0" >Add New Beneficial Owner</p></Button> */}
                    {/* {bmoList.length>0 && <FormSelect style={{ maxWidth: '8em' }} onChange={(e) => handleListDownload(e.currentTarget.value)}>
                        <option>Download</option>
                        <option value={'csv'}>CSV</option>
                        <option value={'pdf'}>PDf</option>
                    </FormSelect>
                    } */}

                    {/* {
                        bmoList.length>0 && !loading &&
                        <Button 
                        style={{minWidth:'8em'}}
                        disabled={dloading}
                        variant="outline border border-1" 
                        onClick={downloadExcelReport}>{dloading?<Spinner size="sm"/>:'Download List'}</Button>
                    } */}

{bmoList.length>0 && <FormSelect style={{ maxWidth: '8em' }} onChange={(e) => handleListDownload(e.currentTarget.value)}>
                        <option>Download</option>
                        <option value={'csv'}>CSV</option>
                        <option value={'pdf'}>PDf</option>
                    </FormSelect>
                    }
                </div>

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
                                    <th scope="col" className="fw-medium">Status</th>
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
                                    <th scope="col" className="fw-medium">Status</th>
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
                                            bmoList.length
                                        }
                                    </td>

                                    <td className={`text-${parentInfo?.IsAuthorized?'success':'danger'}`}>
                                        {
                                            parentInfo?.IsAuthorized?'Authorized':'UnAuthorized'
                                            
                                        }
                                    </td>
                                </tr>
                            }
                            </tbody>

                        </table>
                }

            </div>


            <div className="d-flex flex-column w-100 justify-content-center mt-4">
                {bmoList.length >0 && <div className="d-flex justify-content-between w-100">
                    <p className="fw-bold text-primary text-capitalize">{`${parentInfo?.BusinessName} Beneficial Owners`}</p>
                    <Button onClick={() => handleViewChart()} variant="outline border  d-flex gap-2 border-primary text-primary">
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
                                            <th scope="col" className="bg-primary text-light">Action</th>
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
                                            <th scope="col" className="bg-primary text-light">Beneficial Owner</th>
                                            <th scope="col" className="bg-primary text-light">Account Type</th>
                                            <th scope="col" className="bg-primary text-light">Nationality </th>
                                            <th scope="col" className="bg-primary text-light">% Holding </th>
                                            <th scope="col" className="bg-primary text-light">No of Shares  </th>
                                            <th scope="col" className="bg-primary text-light">PEP</th>
                                            <th scope="col" className="bg-primary text-light">Ticker</th>
                                            <th scope="col" className="bg-primary text-light">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            bmoList && bmoList.length > 0 ? 
                                            // < UnAuthBOOwnwerList refPar={() => setRef(!ref)} lv={parentInfo?.Level} data={bmoList} />
                                                 bmoList && bmoList.map((bmoOwner: IBMOwnersPublic, index: number) => (
                                                    <tr key={index}
                                                        role="button"
                                                        onClick={bmoOwner.CategoryDescription == 'Corporate' ? () => handleNavigateToOwner(bmoOwner) 
                                                            : () => handleShowInfoModal(bmoOwner)}
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

                                                                    </ListGroup>

                                                                </Card>

                                                            </div>

                                                        </td>


                                                    </tr>
                                                )) 
                                                : <tr className="text-center">
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

export default UnAuthBmoOwnerView;