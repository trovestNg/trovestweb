import React, { useEffect, useState } from "react";
import { Container, Modal, Card, Button, Spinner, FormControl, Badge, FormSelect, ListGroup, ListGroupItem } from "react-bootstrap";
import { getUserInfo, loginUser, logoutUser } from "../../controllers/auth";
import api from "../../config/api";
import styles from './unAuth.module.css'
import { IBMO, IOwner, IParent } from "../../interfaces/bmo";
import apiUnAuth from "../../config/apiUnAuth";
import { useNavigate, useParams } from "react-router-dom";
import ChartModal from "../../components/modals/chartModal";
import MoreInfoModal from "../../components/modals/moreInfoModal";
import AddNewBenefOwnerTypeModal from "../../components/modals/addNewBenefOwnerTypeModal";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";
import CreateBMOOwnerIndModal from "../../components/modals/createBMOOwnerIndModal";
import { useDispatch, useSelector } from "react-redux";
import { clearNav, updateNav } from "../../store/slices/userSlice";
import CreateBMOOwnerCoperateModal from "../../components/modals/createBMOOwnerCoperateModal";
import CreateBMOOwnerFundsManagerModal from "../../components/modals/createBMOOwnerFundsManagerModal";
import CreateBMOOwnerImportModal from "../../components/modals/createBMOOwnerImportModal";
import AuthBOList from "../../components/paginations/ubo/auth-ubo-list";
import EditBMOOwnerIndModal from "../../components/modals/editBMOOwnerIndModal";
import EditBMOOwnerCoperateModal from "../../components/modals/editBMOOwnerCoperateModal";
import SureToDeleteBmoModal from "../../components/modals/sureToDeleteBmoModal";
import { IBMOwnersPublic, IUnAuthUserNavLink } from "../../interfaces/bmOwner";
import { emptyAuthUserNavArray, pushToAuthUserNavArray, reduceAuthUserNavArray, setAuthUserBMOOwnerProfile } from "../../store/slices/authUserSlice";
import SureToApproveBOModal from "../../components/modals/sureToApproveBOModal";
import { baseUrl } from "../../config/config";
import CreateBMOOwnerImportRootModal from "../../components/modals/createBMOOwnerImportRootModal";
import SureToRejectBOModal from "../../components/modals/sureToRejectBOModal";
import { calculatePercent } from "../../utils/helpers";
import EditBMOOwnerFundManagerModal from "../../components/modals/editBMOOwnerFundManagerModal";





const AuthCustomerViewPage = () => {
    const dispatch = useDispatch();
    const [bmoList, setBmoList] = useState<IBMOwnersPublic[]>([]);
    const [bmoOwner, setBmoOwner] = useState<IBMOwnersPublic>();
    const [parentInfo, setParentInfo] = useState<IBMOwnersPublic>();
    const { curstomerNumber, level } = useParams()
    const [loading, setLoading] = useState(false);
    const [viewChartModal, setViewChartModal] = useState(false);
    const [viewMoreInfotModal, setViewMoreInfoModal] = useState(false);
    const [userSearch, setUserSearch] = useState('');
    const [refreshComponent, setRefreshComponent] = useState(false);
    const navigate = useNavigate();
    const [refData, setRefData] = useState(false);
    const [addNewBenefOwnerModal, setAddNewBenefOwnerModal] = useState(false);
    const userClass = useSelector((state: any) => state.authUserSlice.authUserProfile.UserClass);
    const [bmoParentId, setBmoParentId] = useState<number>();

    const [addNewBenefOwnerIndividualModal, setAddNewBenefOwnerIndividualModal] = useState(false);
    const [addNewBenefOwnerCoperateModal, setAddNewBenefOwnerCoperateModal] = useState(false);
    const [addNewBenefOwnerFundsManagerModal, setAddNewBenefOwnerFundsManagerModal] = useState(false);
    const [addNewBenefOwnerImportModal, setAddNewBenefOwnerImportModal] = useState(false);

    const [editBenefOwnerIndividualModal, setEditBenefOwnerIndividualModal] = useState(false);
    const [editBenefOwnerCoperateModal, setEditBenefOwnerCoperateModal] = useState(false);
    const [editBenefOwnerFundModal, setEditBenefOwnerFundModal] = useState(false);
    const [deleteBmOwner, setDeleteBmOwner] = useState(false);
    const [approveBmOwner, setApproveBmOwner] = useState(false);
    const [rejectBmOwner, setRejectBmOwner] = useState(false);


    const [dloading, setDLoading] = useState(false);

    const [isLoaded, setIsloaded] = useState(false);
    const [selectedOwner, setSelectedOwner] = useState<any>();

    const unAvOwner = useSelector((state: any) => state.authUserSlice.authUserBmoCustormerProfile);
    const navArray = useSelector((state: any) => state.authUserSlice.authUserNavigationArray);

    const [dontAllowAdd, setDontAllowAd] = useState(false);

    useEffect(() => {
        const handlePopState = () => {
            if (navArray.length > 0) {
                const newArray = [...navArray];
                newArray.pop();

                // Dispatch the modified array back to the reducer
                dispatch(reduceAuthUserNavArray(newArray));
            }
        };

        // Add event listener for browser back action
        window.addEventListener('popstate', handlePopState);

        // Cleanup the event listener when component unmounts
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [navArray.length, dispatch, navArray]);

    const handlePercentageRestriction = () => {
        const res = calculatePercent(bmoList, 0);
        if (res == true) {
            setAddNewBenefOwnerModal(true)
        } else { }
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

    const triggerFileDownload = (url: string) => {
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Template.csv'); // You can name the file anything you want
        document.body.appendChild(link);
        link.click();

        // Clean up the DOM by removing the link
        // link.remove();
    };

    const downloadExcelReport = async () => {
        try {
            setDLoading(true)
            let userInfo = await getUserInfo();
            // const res = await api.get(``, );
            const res = await fetch(`${baseUrl}/report?format=xlsx&&customerNumber=${curstomerNumber}&&requesterName=${`${userInfo?.profile.given_name} ${userInfo?.profile.family_name}`}`)
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
            // const res = await api.get(``, );
            const res = await fetch(`${baseUrl}/report/customer/pdf?customerNumber=${curstomerNumber}&&requesterName=${`${userInfo?.profile.given_name} ${userInfo?.profile.family_name}`}`)
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

    // function downloadFile(fileUrl, fileName) {
    //     axios({
    //       url: fileUrl,  // The URL of your endpoint
    //       method: 'GET',
    //       responseType: 'blob',  // Important to specify the response as a blob
    //     })
    //       .then(response => {
    //         // Create a Blob from the response data
    //         const blob = new Blob([response.data], { type: response.data.type });
    //         const fileUrl = window.URL.createObjectURL(blob);

    //         // Create a link element and trigger the download
    //         const link = document.createElement('a');
    //         link.href = fileUrl;
    //         link.download = fileName;

    //         // Append the link to the body
    //         document.body.appendChild(link);

    //         // Programmatically click the link to trigger the download
    //         link.click();

    //         // Clean up by removing the link and revoking the object URL
    //         document.body.removeChild(link);
    //         window.URL.revokeObjectURL(fileUrl);
    //       })
    //       .catch(error => {
    //         console.error('Error downloading the file:', error);
    //       });
    //   }

    const deleteOwner = async () => {
        toast.success('here!')
        // setLoading(true)
        // // console.log({ seeBody: body })
        // let userInfo = await getUserInfo();
        // if (userInfo) {

        //     const apiBody={
        //         "requesterName": `${userInfo?.profile.given_name} ${userInfo?.profile.family_name}`,
        //         "comment": "Test delete",
        //         "ids": [
        //           bmoId
        //         ]
        //       }

        //     const res = await api.post(`delete`, apiBody, `${userInfo?.access_token}`)
        //     if (res?.status==200) {
        //         setLoading(false);
        //         toast.success('BO successfully deleted');
        //         // off()
        //     } else {
        //         toast.error('Operation failed! Check your network');
        //         setLoading(false);
        //     }

        // }
    }

    // const downloadExcelReport = async()=>{
    //     try {
    //         let userInfo = await getUserInfo();
    //         const res = await api.get(`upload/template/download?requesterName=${`${userInfo?.profile.given_name} ${userInfo?.profile.family_name}`}`, `${userInfo?.access_token}`);
    //         console.log({here:res})
    //         triggerFileDownload(res?.data)
    //     } catch (error) {

    //     }
    // }

    const handleListDownload = (val: string) => {
        if (val == 'pdf') {
            downloadPdfReport()
        } else if (val == 'csv') {
            downloadExcelReport()
        } else {
            return
        }
    }


    const fetched = async () => {
        setLoading(true)// toast.error('Await')
        let userInfo = await getUserInfo();
        if (userInfo) {
            try {

                const res = await api.get(`level/approved?requesterName=${userInfo.profile.given_name}&customerNumber=${curstomerNumber}`, userInfo?.access_token);
                if (res?.data) {
                    // const filter= .filter((bo:IBMOwnersPublic)=>!bo.IsMarkedForDelete)
                    setBmoList(res?.data?.Owners.reverse());
                    // calculatePercent(res?.data?.Owners)
                    setParentInfo(res?.data?.Parent)
                    setLoading(false);
                    setIsloaded(true)

                }
                else if (res?.status == 400) {
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

    }

    const handleClear = () => {
        // setBySearch(false);
        setUserSearch('')
        setBmoList([])
        // setRefreshData(!refreshData)
    }

    const handleAddNewBenefOwner = () => {
        setAddNewBenefOwnerModal(true);

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

    const handleDeleteBmoOwner = (bmOwner: any) => {
        setDeleteBmOwner(true);
        setSelectedOwner(bmOwner);
    }

    const handleApproveBo = () => {
        setViewMoreInfoModal(false);
        setApproveBmOwner(true)
    }
    const handleRejectBo = () => {
        setViewMoreInfoModal(false);
        setRejectBmOwner(true)
    }

    const handleNudgeAuthorizer = async (bmoId: any) => {
        // console.log({here:bmoId})
        let userInfo = await getUserInfo();
        if (userInfo) {
            try {
                // setOLoading(true)
                // let userInfo = await getUserInfo();
                const res = await api.get(`nudge?requsterName=${userInfo?.profile.given_name}&parentId=${bmoParentId}`, userInfo?.access_token);
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



    const handleViewChart = () => {
        setViewChartModal(!viewChartModal)
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

        window.history.pushState({}, '', `/ubo-portal/owner-details/${level && +level + 1}/${owner.Id}`);
        navigate(`/ubo-portal/owner-details/${level && +level + 1}/${owner.Id}`);
        // window.location.reload()


    }

    const handleShowInfoModal = (owner: IBMOwnersPublic) => {
        setBmoOwner(owner);
        setBmoParentId(owner?.ParentId)
        setViewMoreInfoModal(!viewMoreInfotModal);
    }

    const handleBackToHomePage = () => {
        dispatch(emptyAuthUserNavArray())
        navigate('/ubo-portal')
    }

    useEffect(() => {
        if (!isLoaded) {
            fetched()
        }
    }, [refData, curstomerNumber, isLoaded])
    return (
        <div className="w-100 p-0">
            {bmoList.length > 0 && <ChartModal bmoList={bmoList} profile={parentInfo} show={viewChartModal}
                off={() => setViewChartModal(false)} />}
            <MoreInfoModal
                handleApprv={handleApproveBo}
                handleReject={handleRejectBo}
                handleNudge={handleNudgeAuthorizer}
                lev={level} info={bmoOwner} show={viewMoreInfotModal}
                off={() => {
                    setViewMoreInfoModal(false);
                    setRefData(!refData);
                    setIsloaded(!isLoaded);
                    window.location.reload()

                }} />
            <AddNewBenefOwnerTypeModal action={handleAddNewBenefOwnerType} off={() => setAddNewBenefOwnerModal(false)} show={addNewBenefOwnerModal} />
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
                parentInfo={parentInfo} />

            <SureToRejectBOModal show={rejectBmOwner}
            Id={parentInfo?.Id}
                off={() => {
                    setRejectBmOwner(false);
                    setRefData(!refData);
                    setIsloaded(!isLoaded);
                    window.location.reload()
                }}
                parentInfo={parentInfo} />

            <CreateBMOOwnerIndModal
                parent={{ ...parentInfo, customerNumber: curstomerNumber, CountryId: "NG", }}
                totalOwners={bmoList}
                custormerNumb={curstomerNumber}
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
                parent={{ ...parentInfo, customerNumber: curstomerNumber, CountryId: "NG", }}
                totalOwners={bmoList}
                custormerNumb={curstomerNumber}
                lev={level}
                off={() => {
                    setAddNewBenefOwnerCoperateModal(false);
                    setRefData(!refData);
                    setIsloaded(!isLoaded);
                    window.location.reload()
                }}
                show={addNewBenefOwnerCoperateModal} />

            <CreateBMOOwnerFundsManagerModal
                parent={{ ...parentInfo, customerNumber: curstomerNumber, CountryId: "NG", }}
                custormerNumb={curstomerNumber}
                totalOwners={bmoList}
                off={() => {
                    setAddNewBenefOwnerFundsManagerModal(false);
                    setRefData(!refData);
                    setIsloaded(!isLoaded);
                    window.location.reload()
                }} show={addNewBenefOwnerFundsManagerModal} />

            <CreateBMOOwnerImportRootModal
                cusNum={curstomerNumber}
                off={() => {
                    setAddNewBenefOwnerImportModal(false); setRefData(!refData);
                    setRefData(!refData);
                    setIsloaded(!isLoaded);
                    window.location.reload()
                }}
                show={addNewBenefOwnerImportModal} />

            <EditBMOOwnerIndModal parentInf={parentInfo} ownerInfo={bmoOwner}
                totalOwners={bmoList}
                off={() => {
                    setEditBenefOwnerIndividualModal(false); setRefData(!refData);
                    setRefData(!refData);
                    setIsloaded(!isLoaded);
                    window.location.reload()
                }} show={editBenefOwnerIndividualModal} />
            
            <EditBMOOwnerFundManagerModal parentInf={parentInfo} ownerInfo={bmoOwner}
                totalOwners={bmoList}
                off={() => {
                    setEditBenefOwnerFundModal(false); setRefData(!refData);
                    setRefData(!refData);
                    setIsloaded(!isLoaded);
                    window.location.reload()
                }} show={editBenefOwnerFundModal} />

            <EditBMOOwnerCoperateModal
                parentInf={parentInfo}
                ownerInfo={bmoOwner}
                totalOwners={bmoList}
                off={() => {
                    setEditBenefOwnerCoperateModal(false);
                    setRefData(!refData);
                    setIsloaded(!isLoaded);
                    window.location.reload()

                }} show={editBenefOwnerCoperateModal} />

            

            <Button className="d-flex gap-2" onClick={handleBackToHomePage} variant="outline border border-primary">
                <i className="bi bi-arrow-left text-primary"></i>
                <p className="p-0 m-0 text-primary">Back To Homepage</p>

            </Button>
            <p className="p-0 m-0 text-primary fw-bold mt-3">{parentInfo?.BusinessName}</p>

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

                            onClick={handlePercentageRestriction} className="d-flex gap-2" style={{ minWidth: '15em' }}>
                            <i className="bi bi-plus-circle"></i>
                            <p className="p-0 m-0" >Add New Beneficial Owner</p>
                        </Button>
                    }

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
                                            bmoList && bmoList.length
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
                                            bmoList && bmoList.length > 0 ?
                                                bmoList &&
                                                // <AuthBOList lv={level} handleEditUBOOwner={handleUpdateBenefOwnerType} data={bmoList} handDel={handleDeleteBmoOwner} /> 
                                                bmoList.map((bmoOwner: IBMOwnersPublic, index: number) => (
                                                    <tr key={index}
                                                        role="button"
                                                        onClick={bmoOwner.CategoryDescription == 'Corporate' ? () => { bmoOwner?.IsAuthorized ? handleNavigateToOwner(bmoOwner) : userClass == 'Approver' ? handleNavigateToOwner(bmoOwner) : toast.error('Un Approved Bo') } :
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

                                                        {/* <td className={`text-${bmoOwner.IsAuthorized ? 'success' : 'danger'}`}>{bmoOwner.IsAuthorized ? 'Authorised' : 'UnAuthorised'}</td> */}
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
                                                                                            <div className="d-flex gap-2" >
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
                                                ))

                                                : <tr className="text-center">
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
                {
                    /*<div className="d-flex justify-content-between mt-2">
                        <p>1 of 10</p>
                        <div className="d-flex gap-2">
                            <Button>1</Button>
                            <Button>2</Button>
                            <Button>3</Button>
                        </div>
                    </div>
                    */
                }


            </div>



        </div>
    )

}

export default AuthCustomerViewPage;