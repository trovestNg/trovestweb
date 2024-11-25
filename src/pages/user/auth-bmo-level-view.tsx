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
import { clearNav, handleSetBmoCustormer, reduceNavLink, updateNav } from "../../store/slices/userSlice";
import AddNewBenefOwnerTypeModal from "../../components/modals/addNewBenefOwnerTypeModal";
import CreateBMOOwnerIndModal from "../../components/modals/createBMOOwnerIndModal";
import CreateBMOOwnerCoperateModal from "../../components/modals/createBMOOwnerCoperateModal";
import CreateBMOOwnerFundsManagerModal from "../../components/modals/createBMOOwnerFundsManagerModal";
import CreateBMOOwnerImportModal from "../../components/modals/createBMOOwnerImportModal";
import { userInfo } from "os";
import { pushToAuthUserNavArray, reduceAuthUserNavArray, removeFromAuthUserNavArray, setAuthUserBMOOwnerProfile } from "../../store/slices/authUserSlice";
import { IBMOwnersPublic, IUnAuthUserNavLink } from "../../interfaces/bmOwner";
import EditBMOOwnerIndModal from "../../components/modals/editBMOOwnerIndModal";
import EditBMOOwnerCoperateModal from "../../components/modals/editBMOOwnerCoperateModal";
import SureToDeleteBmoModal from "../../components/modals/sureToDeleteBmoModal";
import SureToApproveBOModal from "../../components/modals/sureToApproveBOModal";
import { baseUrl } from "../../config/config";
import CreateBMOOwnerImportNodeModal from "../../components/modals/createBMOOwnerImportNodeModal";
import SureToRejectBOModal from "../../components/modals/sureToRejectBOModal";
import EditBMOOwnerFundManagerModal from "../../components/modals/editBMOOwnerFundManagerModal";




const AuthOwnerViewPage = () => {
    const [bmoList, setBmoList] = useState<IBMOwnersPublic[]>([]);
    const [bmoOwner, setBmoOwner] = useState<IBMOwnersPublic>();
    const [parentInfo, setParentInfo] = useState<IParent>();
    const { level, ownerId } = useParams()
    const [loading, setLoading] = useState(false);
    const [viewChartModal, setViewChartModal] = useState(false);
    const [viewMoreInfotModal, setViewMoreInfoModal] = useState(false);
    const [userSearch, setUserSearch] = useState('');
    const [refData, setRefData] = useState(false);
    const [bmoParentId, setBmoParentId] = useState<number>();

    const userClass = useSelector((state: any) => state.authUserSlice.authUserProfile.UserClass);
    const [bmoId, setBmoId] = useState('');

    const navigate = useNavigate();

    const [addNewBenefOwnerModal, setAddNewBenefOwnerModal] = useState(false);

    const [addNewBenefOwnerIndividualModal, setAddNewBenefOwnerIndividualModal] = useState(false);
    const [addNewBenefOwnerCoperateModal, setAddNewBenefOwnerCoperateModal] = useState(false);
    const [addNewBenefOwnerFundsManagerModal, setAddNewBenefOwnerFundsManagerModal] = useState(false);
    const [addNewBenefOwnerImportModal, setAddNewBenefOwnerImportModal] = useState(false);

    const [editBenefOwnerIndividualModal, setEditBenefOwnerIndividualModal] = useState(false);
    const [editBenefOwnerFundModal, setEditBenefOwnerFundModal] = useState(false);
    const [editBenefOwnerCoperateModal, setEditBenefOwnerCoperateModal] = useState(false);
    const [deleteBmOwner, setDeleteBmOwner] = useState(false);
    const [approveBmOwner, setApproveBmOwner] = useState(false);
    const [dontAllowAdd, setDontAllowAd] = useState(false);
    const [rejectBmOwner, setRejectBmOwner] = useState(false);

    const [selectedOwner, setSelectedOwner] = useState<any>();

    const [isLoaded, setIsloaded] = useState(false);


    const [dloading, setDLoading] = useState(false);


    const dispatch = useDispatch()

    const unAvOwner = useSelector((state: any) => state.authUserSlice.authUserBmoOwnerProfile);
    const navArray = useSelector((state: any) => state.authUserSlice.authUserNavigationArray);

    const handleRejectBo = () => {
        setViewMoreInfoModal(false);
        setRejectBmOwner(true)
    }


    const calculatePercent = (ownersShares: any[]) => {

        let total = 0;
        for (let x = 0; x < ownersShares.length; x++) {
            total = total + (ownersShares[x].PercentageHolding ? ownersShares[x].PercentageHolding : 0) || 0
        }

        if (total >= 100) {
            toast.error('Already 100% no more shares')
        } else {
            setAddNewBenefOwnerModal(true)
        }
        return total
    }

    const handleDeleteBmoOwner = (bmOwner: any) => {
        setDeleteBmOwner(true);
        setSelectedOwner(bmOwner);
    }

    type Column = {
        header: string;
        dataKey: keyof IOwner;
    };
    const downloadPdf = () => {
        const doc = new jsPDF();
        // Define the columns
        const columns: Column[] = [

            { header: 'S/N', dataKey: 'serialNumber' },
            { header: 'Beneficial Owner', dataKey: 'BusinessName' },
            { header: 'Account Type', dataKey: 'CategoryDescription' },
            { header: 'Nationality', dataKey: 'CountryName' },
            { header: '% Holding', dataKey: 'PercentageHolding' },
            { header: 'No of Shares', dataKey: 'NumberOfShares' },
            { header: 'PEP', dataKey: 'IsPEP' },
            { header: 'Ticker', dataKey: 'Ticker' }
        ];

        // Create rows from the policies array
        const rows: any = bmoList && bmoList.map((policy, index) => ({
            BusinessName: policy.BusinessName,
            CategoryDescription: policy.CategoryDescription,
            CountryName: policy.CountryName,
            PercentageHolding: policy.PercentageHolding,
            CustomerNumber: policy.BVN,
            NumberOfShares: policy.NumberOfShares,
            IsPEP: policy.IsPEP,
            Ticker: policy.Ticker,
            serialNumber: index + 1
        }));

        autoTable(doc, {
            head: [columns.map(col => col.header)],
            body: rows && rows.map((row: { [x: string]: string; }) => columns.map(col => row[col.dataKey] as string)),
            startY: 20,
        });

        doc.save(`${parentInfo?.BusinessName} BMO List.pdf`);
    };

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

    const downloadExcelReport = async () => {
        try {
            setDLoading(true)
            let userInfo = await getUserInfo();
            // const res = await api.get(`report?format=xlsx&&customerNumber=${curstomerNumber}&&`, );

            // const res= await fetch(`${baseUrl}/report?format=xlsx&&customerNumber=${curstomerNumber}&&requesterName=${`Public`}`)
            // http://192.168.250.253:7230/api/BeneficialOwner/report/level?format=xlsx&&parentIid=32388&requesterName=Public
            
            const res= await fetch(`${baseUrl}/report/level?format=xlsx&&parentIid=${parentInfo?.Id}&requesterName=${`${userInfo?.profile.given_name} ${userInfo?.profile.family_name}`}`)
            if (res.status == 200) {
                res.blob().then(blob => {
                    let a = document.createElement('a');
                    a.href = window.URL.createObjectURL(blob);
                    a.download = parentInfo?.BusinessName + ' Owners List.' + 'xlsx';
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

    const downloadPdfReport = async () => {
        try {
            setDLoading(true)
            let userInfo = await getUserInfo();
            // const res = await api.get(`report?format=xlsx&&customerNumber=${curstomerNumber}&&`, );

            // const res= await fetch(`${baseUrl}/report?format=xlsx&&customerNumber=${curstomerNumber}&&requesterName=${`Public`}`)

            const res = await fetch(`${baseUrl}/report/otherLevels/pdf?parentId=${parentInfo?.Id}&requesterName=${`${userInfo?.profile.given_name} ${userInfo?.profile.family_name}`}`)
            if (res.status == 200) {
                res.blob().then(blob => {
                    let a = document.createElement('a');
                    a.href = window.URL.createObjectURL(blob);
                    a.download = parentInfo?.BusinessName + ' Owners List.' + 'pdf';
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


    const fetched = async () => {
        setLoading(true)// toast.error('Await')
        let userInfo = await getUserInfo();
        if (userInfo) {
            try {

                const res = await api.get(`owner/level/navigate/approved?requesterName=${userInfo.profile.given_name}&ownerId=${ownerId}`, userInfo?.access_token);
                if (res?.status == 200) {
                    // const filter= .filter((bo:IBMOwnersPublic)=>!bo.IsMarkedForDelete)
                    setBmoList(res?.data?.Owners.reverse());
                    // calculatePercent(res?.data?.Owners)
                    setParentInfo(res?.data?.Parent)
                    setLoading(false)
                    setIsloaded(true)
                }
                else if (res?.status == 400) {
                    setParentInfo(unAvOwner);
                    setBmoList([]);
                    setLoading(false)
                    setIsloaded(true)
                }
                else {
                    setParentInfo(unAvOwner);
                    setBmoList([]);
                    setLoading(false)
                    setIsloaded(true)
                }
            } catch (error) {
                setParentInfo(unAvOwner);
                setBmoList([]);
                // setBmoList([])
                setLoading(false)
                setIsloaded(true)
            }

        }

    }

    const handleClear = () => {
        // setBySearch(false);
        setUserSearch('')
        setBmoList([])
        // setRefreshData(!refreshData)
    }

    const handleAddNewBenefOwner = () => {
        setAddNewBenefOwnerModal(true)
    }

    const handleAddNewBenefOwnerType = (e: any) => {
        switch (e) {
            case 1:
                setAddNewBenefOwnerIndividualModal(true);
                break;
            case 2:
                setAddNewBenefOwnerCoperateModal(true);
                break;
            case 3:
                setAddNewBenefOwnerFundsManagerModal(true);
                break;
            case 4:
                setAddNewBenefOwnerImportModal(true);
                break;
            default:
                break;
        }
        setAddNewBenefOwnerModal(false)
    }


    const handleUpdateBenefOwnerType = (e: IBMOwnersPublic) => {

        switch (e.CategoryDescription) {
            case e.CategoryDescription = 'Individual':

                setEditBenefOwnerIndividualModal(true);
                setBmoOwner(e)
                break;
            case e.CategoryDescription = 'Fund Manager':
                setEditBenefOwnerFundModal(true);
                setBmoOwner(e)
                break;
            case e.CategoryDescription = 'Coperate':

                setEditBenefOwnerCoperateModal(true);
                setBmoOwner(e)
                break;
            default:
                break;
        }
        setAddNewBenefOwnerModal(false)
    }

    const handleShowInfoModal = (owner: IBMOwnersPublic) => {
        setBmoOwner(owner);
        setBmoParentId(owner?.ParentId)
        setViewMoreInfoModal(!viewMoreInfotModal);
    }

    const handleNavigateNavs = (currentNav: any, navIndex: number) => {
        // console.log({ currentNavList: navArray });
        // console.log({clickedNav:currentNav, itsIndex:navIndex})

        const slicedNavList = navArray.slice(0, navIndex + 1);
        // console.log({ slicedResultt: slicedNavList });
        dispatch(removeFromAuthUserNavArray(slicedNavList));
        // navigate(-1)
        if (navIndex == 0) {
            navigate(`/ubo-portal/custormer-details/${1}/${currentNav?.customerNumber}`)
            setIsloaded(!isLoaded)
        } else {
            navigate(`/ubo-portal/owner-details/${level && +level - 1}/${currentNav?.ownerId}`)
            setIsloaded(!isLoaded)
        }


    }
    const handleViewChart = () => {
        setViewChartModal(!viewChartModal)
    }

    const handleListDownload = (val: string) => {
        if (val == 'pdf') {
            downloadPdfReport()
        } else if (val == 'csv') {
            downloadExcelReport()
        } else {
            return
        }
    }

    const handleApproveBo = async () => {
        setLoading(true)
        // console.log({ seeBody: body })
        let userInfo = await getUserInfo();



        if (userInfo) {

            const bodyApprove = {
                // "requestorUsername": `${userInfo?.profile.given_name} ${userInfo?.profile.family_name}`,
                "requestorUsername": `${userInfo?.profile.given_name} ${userInfo?.profile.family_name}`,
                "comment": "Testing Approve",
                "ids": [
                    parentInfo?.Id == 0 ? parentInfo.ParentId : parentInfo?.Id
                ]
            }

            const res = await api.post(`authorize`, bodyApprove, `${userInfo?.access_token}`)
            if (res?.status == 200) {
                setLoading(false);
                toast.success('BO Approved succesfully');
                setApproveBmOwner(false);
                setDontAllowAd(false);
                setRefData(!refData);
            } else {
                toast.error('Operation failed! Check your network');
                setLoading(false);
            }

        }
    }

    const handleNudgeAuthorizer = async (bmoId: any) => {
        // console.log({here:bmoId})
        let userInfo = await getUserInfo();
        if (userInfo) {
            try {
                // setOLoading(true)
                // let userInfo = await getUserInfo();
                const res = await api.get(`nudge?requsterName=${userInfo?.profile.given_name}&parentId=${parentInfo?.Id}`, userInfo?.access_token);
                if (res?.status == 200) {
                    setViewMoreInfoModal(false)
                    toast.success('Authorizer nudged for approval')
                } else {
                    toast.error('Failed to nudge Authorizer')
                }

            } catch (error) {

            }
        }

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
            CustomerNumber: owner.CustomerNumber,
            Id: 0,
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
            Ticker: owner.Ticker
        }
        dispatch(pushToAuthUserNavArray(payload));
        dispatch(setAuthUserBMOOwnerProfile(unAvOwner));
        setIsloaded(false)
        window.history.pushState({}, '', `/ubo-portal/owner-details/${level && +level + 1}/${owner.Id}`);
        navigate(`/ubo-portal/owner-details/${level && +level + 1}/${owner.Id}`);
        // window.location.reload()


    }

    const handleBackToHomePage = () => {
        dispatch(clearNav([]))
        navigate('/ubo-portal')
    }
    useEffect(() => {
        if (!isLoaded) {
            fetched()
        }

    }, [refData, ownerId, isLoaded, level])
    return (
        <div className="w-100 p-0">
            <MoreInfoModal handleApprv={handleApproveBo} lev={level} info={bmoOwner} off={() => setViewMoreInfoModal(false)} show={viewMoreInfotModal} />
            <AddNewBenefOwnerTypeModal action={handleAddNewBenefOwnerType}
                off={() => setAddNewBenefOwnerModal(false)} show={addNewBenefOwnerModal} />
            <SureToDeleteBmoModal
                parentInfo={parentInfo}
                clickedOwner={selectedOwner}
                show={deleteBmOwner}
                off={() => {
                    setDeleteBmOwner(false);
                    setRefData(!refData);
                    setIsloaded(!isLoaded);
                    window.location.reload()
                }}
            />

            <SureToApproveBOModal show={approveBmOwner}
                off={() => {
                    setApproveBmOwner(false);
                    setRefData(!refData);
                    setIsloaded(!isLoaded);
                    window.location.reload()
                }}
                Id={parentInfo?.Id}

                parentInfo={parentInfo} />

            <SureToRejectBOModal show={rejectBmOwner}
                off={() => {
                    setRejectBmOwner(false);
                    setRefData(!refData);
                    setIsloaded(!isLoaded);
                    window.location.reload()
                }}
                Id={parentInfo?.Id}
                parentInfo={parentInfo} />

            <CreateBMOOwnerIndModal
                parent={{ ...parentInfo, originalId: ownerId }}
                lev={level}
                off={() => {
                    setAddNewBenefOwnerIndividualModal(false);
                    setRefData(!refData);
                    setIsloaded(!isLoaded);
                    window.location.reload()
                }
                }
                show={addNewBenefOwnerIndividualModal} />

            <CreateBMOOwnerCoperateModal
                parent={{ ...parentInfo, originalId: ownerId }}
                lev={level}
                off={() => {
                    setAddNewBenefOwnerCoperateModal(false);
                    setRefData(!refData);
                    setIsloaded(!isLoaded);
                    window.location.reload()
                }}
                show={addNewBenefOwnerCoperateModal} />


            <CreateBMOOwnerFundsManagerModal
                parent={{ ...parentInfo, originalId: ownerId }}
                lev={level}
                off={() => {
                    setAddNewBenefOwnerFundsManagerModal(false);
                    setRefData(!refData);
                    setIsloaded(!isLoaded);
                    window.location.reload()
                }}
                show={addNewBenefOwnerFundsManagerModal} />

            <CreateBMOOwnerImportNodeModal
                cusNum={ownerId}
                off={() => {
                    setAddNewBenefOwnerImportModal(false); setRefData(!refData);
                    setIsloaded(!isLoaded);
                    window.location.reload()
                }}
                show={addNewBenefOwnerImportModal} />

            <EditBMOOwnerIndModal parentInf={parentInfo} ownerInfo={bmoOwner}
                off={() => {
                    setEditBenefOwnerIndividualModal(false); setRefData(!refData);
                    setIsloaded(!isLoaded);
                    window.location.reload()
                }}
                show={editBenefOwnerIndividualModal} />

            <EditBMOOwnerCoperateModal
                parentInf={parentInfo}
                ownerInfo={bmoOwner}
                off={() => {
                    setEditBenefOwnerCoperateModal(false);
                    setRefData(!refData);
                    setIsloaded(!isLoaded);
                    window.location.reload()

                }} show={editBenefOwnerCoperateModal} />

            <EditBMOOwnerFundManagerModal
                parentInf={parentInfo}
                ownerInfo={bmoOwner}
                off={() => {
                    setEditBenefOwnerCoperateModal(false);
                    setRefData(!refData);
                    setIsloaded(!isLoaded);
                    window.location.reload()

                }} show={editBenefOwnerFundModal} />


            {bmoList.length > 0 && <ChartModal bmoList={bmoList} profile={parentInfo} show={viewChartModal} off={() => setViewChartModal(false)} />}
            {/* <MoreInfoModal info={bmoOwner} off={() => setViewMoreInfoModal(false)} show={viewMoreInfotModal} /> */}

            <Button className="d-flex gap-2" onClick={handleBackToHomePage} variant="outline border border-primary">
                <i className="bi bi-arrow-left text-primary"></i>
                <p className="p-0 m-0 text-primary">Back To Homepage</p>

            </Button>
            {
                level && +level >= 1 &&
                <div className=" mt-2 d-flex align-items-center">
                    {
                        navArray.map((page: any, index: number) =>
                        (<Button onClick={() => handleNavigateNavs(page, index)}
                            style={{ outline: 'none' }}
                            disabled={navArray.length === index + 1}
                            className="p-0 m-0 border text-uppercase border-0" variant="outline">{navArray.length === index + 1 ? page.name : `${page.name}>`}</Button>))
                    }
                    {/* <p role="button" onClick={()=>navigate(-1)} className="p-0 m-0">{`Level-${level&& +level -1}`}</p> */}
                </div>
            }
            <div className="w-100 d-flex justify-content-between">
                <div className="d-flex gap-2 align-items-center mt-3">
                    {parentInfo &&
                        <>
                            <h5 className="p-0 m-0 text-primary fw-bold">Beneficial Owner Level </h5>
                            <Badge className="d-flex justify-content-center align-items-center text-center" style={{ borderRadius: '20px', height: '20px', width: '20px' }}>{level}</Badge>
                        </>
                    }
                </div>
                <div className="d-flex gap-2">
                    {
                        userClass == 'Initiator' &&
                        <Button

                            onClick={() => calculatePercent(bmoList)} className="d-flex gap-2" style={{ minWidth: '15em' }}>
                            <i className="bi bi-plus-circle"></i>
                            <p className="p-0 m-0" >Add New Beneficial Owner</p>
                        </Button>}

                    {bmoList.length > 0 && <FormSelect style={{ maxWidth: '8em' }} onChange={(e) => handleListDownload(e.currentTarget.value)}>
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

                                    <th scope="col" className="fw-medium"></th>
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
                                    <td>
                                        {
                                            !parentInfo?.IsAuthorized && userClass == 'Approver' &&
                                            <div className="d-flex gap-2">
                                                <Button onClick={handleApproveBo} variant="outline text-success border border-1 border-success">Authorize</Button>
                                                <Button onClick={handleRejectBo} variant="outline text-danger border border-1 border-danger">Reject</Button>
                                            </div>
                                        }

                                        {
                                            !parentInfo?.IsAuthorized && userClass == 'Initiator' &&
                                            <div className="d-flex gap-2">
                                                <Button onClick={handleNudgeAuthorizer} variant="outline text-success border border-1 border-success">Nudge Authorizer</Button>

                                            </div>
                                        }

                                    </td>
                                </tr>
                            }
                            </tbody>

                        </table>
                }

            </div>


            <div className="d-flex flex-column w-100 justify-content-center mt-4">
                {bmoList.length > 0 && <div className="d-flex justify-content-between w-100">
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
                                            <th scope="col" className="bg-primary text-light">Status</th>
                                            <th scope="col" className="bg-primary text-light">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            <tr className="fw-bold"><td className="text-center" colSpan={10}><Spinner /></td></tr>
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
                                            <th scope="col" className="bg-primary text-light">Status</th>
                                            <th scope="col" className="bg-primary text-light">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            bmoList && bmoList.length > 0 ? bmoList && bmoList.map((bmoOwner: IBMOwnersPublic, index: number) => (
                                                <tr key={index}
                                                    role="button"
                                                    onClick={bmoOwner.CategoryDescription == 'Corporate' ?
                                                        () => { bmoOwner?.IsAuthorized ? handleNavigateToOwner(bmoOwner) : userClass == 'Approver' ? handleNavigateToOwner(bmoOwner) : toast.error('Un Approved Bo') } :
                                                        () => handleShowInfoModal(bmoOwner)}
                                                >
                                                    <th scope="row">{index + 1}</th>
                                                    <td className="">{bmoOwner.BusinessName}</td>
                                                    <td>{bmoOwner.CategoryDescription}</td>
                                                    <td>{bmoOwner.CountryName}</td>
                                                    <td>{bmoOwner.PercentageHolding}%</td>
                                                    <td>{bmoOwner.NumberOfShares}</td>
                                                    <td>{bmoOwner.IsPEP ? 'Yes' : 'No'}</td>
                                                    <td>{bmoOwner.Ticker ? bmoOwner.Ticker : 'N/A'}</td>
                                                    <td className={`text-${bmoOwner.IsAuthorized ? 'success' : !bmoOwner.IsAuthorized && !bmoOwner.IsRejected ? 'warning' : !bmoOwner.IsAuthorized && bmoOwner.IsRejected ? 'danger' : 'primary'}`}>

                                                        <span >{bmoOwner.IsAuthorized && 'Authorised'}{!bmoOwner.IsAuthorized && !bmoOwner.IsRejected && 'Pending'} {!bmoOwner.IsAuthorized && bmoOwner.IsRejected && 'Rejected'}</span>

                                                    </td>
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
                                                                        userClass == 'Initiator' &&
                                                                        <div onClick={(e) => e.stopPropagation()}>
                                                                            {
                                                                                !bmoOwner.IsAuthorized &&
                                                                                <ListGroupItem
                                                                                    onClick={(e) => { bmoOwner.IsMarkedForDelete ? toast.error('Is pending deletion') : handleUpdateBenefOwnerType(bmoOwner) }}
                                                                                >
                                                                                    <span className="w-100 d-flex justify-content-between">
                                                                                        <div className="d-flex gap-2">
                                                                                            <i className="bi bi-calendar-event"></i>
                                                                                            Edit
                                                                                        </div>
                                                                                    </span>
                                                                                </ListGroupItem>}
                                                                            <ListGroupItem
                                                                                className="text-danger"
                                                                                onClick={(e) => { bmoOwner.IsMarkedForDelete ? toast.error('Already marked for delete') : handleDeleteBmoOwner(bmoOwner) }}
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
                                                <td colSpan={10}>
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

export default AuthOwnerViewPage;