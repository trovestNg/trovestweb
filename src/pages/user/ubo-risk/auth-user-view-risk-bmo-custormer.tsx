import React, { useEffect, useState } from "react";
import { Container, Modal, Card, Button, Spinner, FormControl, Badge, FormSelect, ListGroup, ListGroupItem } from "react-bootstrap";
import { getUserInfo } from "../../../controllers/auth";
import api from "../../../config/api";
import { IOwner } from "../../../interfaces/bmo";
import apiUnAuth from "../../../config/apiUnAuth";
import { useNavigate, useParams } from "react-router-dom";
import ChartModal from "../../../components/modals/chartModal";
import MoreInfoModal from "../../../components/modals/moreInfoModal";
import AddNewBenefOwnerTypeModal from "../../../components/modals/addNewBenefOwnerTypeModal";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";
import CreateBMOOwnerIndModal from "../../../components/modals/createBMOOwnerIndModal";
import { useDispatch, useSelector } from "react-redux";
import CreateBMOOwnerCoperateModal from "../../../components/modals/createBMOOwnerCoperateModal";
import CreateBMOOwnerFundsManagerModal from "../../../components/modals/createBMOOwnerFundsManagerModal";
import CreateBMOOwnerImportModal from "../../../components/modals/createBMOOwnerImportModal";
import EditeBMOOwnerIndModal from "../../../components/modals/editBMOOwnerIndModal";
import EditBMOOwnerCoperateModal from "../../../components/modals/editBMOOwnerCoperateModal";
import SureToDeleteBmoModal from "../../../components/modals/sureToDeleteBmoModal";
import { IBMOwnersPublic,IUnAuthUserNavLink } from "../../../interfaces/bmOwner";
// import { emptyAuthUserNavArray, pushToAuthUserNavArray, reduceAuthUserNavArray, setAuthUserBMOOwnerProfile } from "../../store/slices/authUserSlice";
import { emptyAuthUserNavArray, pushToAuthUserNavArray, reduceAuthUserNavArray, setAuthUserBMOOwnerProfile } from "../../../store/slices/authUserSlice";
import EditBMOOwnerIndModal from "../../../components/modals/editBMOOwnerIndModal";
import AddRiskLevelModal from "../../../components/modals/add-risk-level-modal";





const UserViewRiskBMOOwnerPage = () => {
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

    const [addNewBenefOwnerIndividualModal, setAddNewBenefOwnerIndividualModal] = useState(false);
    const [addNewBenefOwnerCoperateModal, setAddNewBenefOwnerCoperateModal] = useState(false);
    const [addNewBenefOwnerFundsManagerModal, setAddNewBenefOwnerFundsManagerModal] = useState(false);
    const [addNewBenefOwnerImportModal, setAddNewBenefOwnerImportModal] = useState(false);

    const [editBenefOwnerIndividualModal, setEditBenefOwnerIndividualModal] = useState(false);
    const [editBenefOwnerCoperateModal, setEditBenefOwnerCoperateModal] = useState(false);
    const [deleteBmOwner, setDeleteBmOwner] = useState(false);

    const [addRiskLevelModal, setAddRiskLevelModal] = useState(false);

    const [bmoId, setBmoId] = useState('');

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

    const calculatePercent = (ownersShares:any[]) => {
        
        let total = 0;
        for (let x = 0; x < ownersShares.length; x++) {
            total = total + (ownersShares[x].PercentageHolding?ownersShares[x].PercentageHolding:0) || 0
        }

        if(total >= 100){
            setDontAllowAd(true)
        }
        return total
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

    const handleListDownload = (val: string) => {
        if (val == 'pdf') {
            downloadPdf()
        } else if (val == 'csv') {
            generateCSV(bmoList, headers)
        } else {
            return
        }
    }


    const fetch = async () => {
        setLoading(true)
        // toast.error('Await')
        try {
            const res = await apiUnAuth.get(`level/approved?customerNumber=${curstomerNumber}`);
            if (res.data) {
                setBmoList(res?.data?.Owners.reverse());
                calculatePercent(res?.data?.Owners)
                setParentInfo(res?.data?.Parent)
                setLoading(false)
            } else if (res.status = 404) {
                setParentInfo(unAvOwner);
                setBmoList([]);
                setLoading(false)
            }
            else {
                setBmoList([]);
                setLoading(false)
            }
        } catch (error) {
            console.log({ seeError: error })
            setBmoList([]);
            setLoading(false)
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
            case e.CategoryDescription = 'Coperate':

                setEditBenefOwnerCoperateModal(true);
                setBmoOwner(e)
                break;
            default:
                break;
        }
        setAddNewBenefOwnerModal(false)
    }

    const handleAddRiskLevel = (e: any) => {
        setBmoOwner(e)
        setAddRiskLevelModal(true);
        
    }

    const handleDeleteBmoOwner = (bmoId: any) => {
        setDeleteBmOwner(true);
        setBmoId(bmoId);
    }

    const deleteBmoOwner = async () => {
        try {
            let userInfo = await getUserInfo();
            const res = await api.post(`BeneficialOwner`, {}, `${userInfo?.access_token}`)
        } catch (error) {

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

        window.history.pushState({}, '', `/bo-risk-portal/owner-details/${level && +level + 1}/${owner.Id}`);
        navigate(`/bo-risk-portal/owner-details/${level && +level + 1}/${owner.Id}`);

    }


    

    const handleShowInfoModal = (owner: IBMOwnersPublic) => {
        setBmoOwner(owner);
        setViewMoreInfoModal(!viewMoreInfotModal);
    }

    const handleBackToHomePage = () => {
        dispatch(emptyAuthUserNavArray())
        navigate('/bo-risk-portal')
    }

    useEffect(() => {
        fetch();
    }, [refData, curstomerNumber])
    return (
        <div className="w-100 p-0">
            {bmoList.length > 0 && <ChartModal bmoList={bmoList} profile={parentInfo} show={viewChartModal} off={() => setViewChartModal(false)} />}
            <MoreInfoModal lev={level} info={bmoOwner} off={() => setViewMoreInfoModal(false)} show={viewMoreInfotModal} />
            <AddNewBenefOwnerTypeModal action={handleAddNewBenefOwnerType} off={() => setAddNewBenefOwnerModal(false)} show={addNewBenefOwnerModal} />
            <SureToDeleteBmoModal show={deleteBmOwner} off={() => setDeleteBmOwner(false)} />

            <CreateBMOOwnerIndModal
                parent={parentInfo}
                custormerNumb={curstomerNumber}
                lev={level}
                off={() => { setAddNewBenefOwnerIndividualModal(false); setRefData(!refData) }}
                show={addNewBenefOwnerIndividualModal} />

            <CreateBMOOwnerCoperateModal
                parent={parentInfo}
                custormerNumb={curstomerNumber}
                lev={level}
                off={() => {
                    setAddNewBenefOwnerCoperateModal(false);
                    setRefData(!refData)
                }}
                show={addNewBenefOwnerCoperateModal} />

            <AddRiskLevelModal userData={bmoOwner} off={() => { setAddRiskLevelModal(false); setRefData(!refData) }} 
            show={addRiskLevelModal} />

            <CreateBMOOwnerImportModal
                off={() => { setAddNewBenefOwnerImportModal(false); setRefData(!refData) }}
                show={addNewBenefOwnerImportModal} />

            <EditBMOOwnerIndModal parentInf={parentInfo} ownerInfo={bmoOwner}
                off={() => { setEditBenefOwnerIndividualModal(false); setRefData(!refData) }} show={editBenefOwnerIndividualModal} />

            <EditBMOOwnerCoperateModal
                parentInf={parentInfo}
                ownerInfo={bmoOwner}
                off={() => {
                    setEditBenefOwnerCoperateModal(false);
                    setRefData(!refData)

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
                <div className="d-flex gap-2 ">
                    {/* <Button
                    
                    // disabled={dontAllowAdd}
                        onClick={()=>handleAddRiskLevel(bmoOwner)} className="d-flex gap-2 justify-content-center" style={{ minWidth: '18em' }}>
                        <i className="bi bi-plus-circle"></i>
                        <p className="p-0 m-0" >Add New BO Risk Assessment </p></Button> */}
                    {
                    bmoList.length > 0 &&
                    <FormSelect style={{ maxWidth: '8em' }} onChange={(e) => handleListDownload(e.currentTarget.value)}>
                        <option>Download</option>
                        <option value={'csv'}>CSV</option>
                        <option value={'pdf'}>PDf</option>
                    </FormSelect>}
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
                                            <th scope="col" className="bg-primary text-light">Risk Rating</th>
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
                                            <th scope="col" className="bg-primary text-light">Risk Rating</th>
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
                                                        onClick={bmoOwner.CategoryDescription == 'Corporate' ? () => handleNavigateToOwner(bmoOwner) : () => handleShowInfoModal(bmoOwner)}
                                                    >
                                                        <th scope="row">{index + 1}</th>
                                                        <td className="">{bmoOwner.BusinessName}</td>
                                                        <td>{bmoOwner.CategoryDescription}</td>
                                                        <td className={`text-${bmoOwner.RiskScore==1?'success':'danger'}`}>{bmoOwner.RiskLevel}</td>
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
                                                                                {/* <ListGroupItem
                                                                                    onClick={(e) => handleUpdateBenefOwnerType(bmoOwner)}
                                                                                >
                                                                                    <span className="w-100 d-flex justify-content-between">
                                                                                        <div className="d-flex gap-2">
                                                                                            <i className="bi bi-calendar-event"></i>
                                                                                            Edit
                                                                                        </div>
                                                                                    </span>
                                                                                </ListGroupItem> */}

                                                                                <ListGroupItem
                                                                                    onClick={(e) => handleAddRiskLevel(bmoOwner)}
                                                                                >
                                                                                    <span className="w-100 d-flex justify-content-between">
                                                                                        <div className="d-flex gap-2">
                                                                                        <i className="bi bi-node-plus"></i>
                                                                                            Add Risk Assesment
                                                                                        </div>
                                                                                    </span>
                                                                                </ListGroupItem>
                                                                                {/* <ListGroupItem
                                                                                    className="text-danger"
                                                                                    onClick={(e) => handleDeleteBmoOwner(bmoOwner.Id)}
                                                                                >
                                                                                    <span className="w-100 d-flex justify-content-between">
                                                                                        <div className="d-flex gap-2">
                                                                                            <i className="bi bi-trash"></i>
                                                                                            Delete
                                                                                        </div>
                                                                                    </span>
                                                                                </ListGroupItem> */}
                                                                            </div>
                                                                        }
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

export default UserViewRiskBMOOwnerPage;