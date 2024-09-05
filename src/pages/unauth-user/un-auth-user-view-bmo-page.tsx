import React, { useEffect, useState } from "react";
import { Container, Modal, Card, Button, Spinner, FormControl, Badge, FormSelect, ListGroup, ListGroupItem } from "react-bootstrap";
import { getUserInfo, loginUser, logoutUser } from "../../controllers/auth";
import api from "../../config/api";
import UnAuthorizedBMOListTab from "../../components/tabs/users-unauth-tabs/unAuthorizedBMOListTab";
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
import AuthBOList from "../../components/paginations/ubo/un-auth-ubo-list";
import UnAuthBOList from "../../components/paginations/ubo/un-auth-ubo-list";





const UnAuthUserViewBmoPage = () => {
    const dispatch = useDispatch();
    const [bmoList, setBmoList] = useState<IOwner[]>([]);
    const [bmoOwner, setBmoOwner] = useState<IOwner>();
    const [parentInfo, setParentInfo] = useState<IParent>();
    const { curstomerNumber } = useParams()
    const [loading, setLoading] = useState(false);
    const [viewChartModal, setViewChartModal] = useState(false);
    const [viewMoreInfotModal, setViewMoreInfoModal] = useState(false);
    const [userSearch, setUserSearch] = useState('');
    const [refreshComponent, setRefreshComponent] = useState(false);
    const navigate = useNavigate();
    const [refData, setRefData] = useState(false)
    const [addNewBenefOwnerModal, setAddNewBenefOwnerModal] = useState(false);

    const [addNewBenefOwnerIndividualModal, setAddNewBenefOwnerIndividualModal] = useState(false);
    const [addNewBenefOwnerCoperateModal, setAddNewBenefOwnerCoperateModal] = useState(false);
    const [addNewBenefOwnerFundsManagerModal, setAddNewBenefOwnerFundsManagerModal] = useState(false);
    const [addNewBenefOwnerImportModal, setAddNewBenefOwnerImportModal] = useState(false);



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

    const generateCSV = (data: IOwner[], headers: { label: string; key: keyof IOwner }[]) => {
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

    const handleShowInfoModal = (owner: IOwner) => {
        setBmoOwner(owner);
        setViewMoreInfoModal(!viewMoreInfotModal);
    }

    const handleViewChart = () => {
        setViewChartModal(!viewChartModal)
    }

    const handleNavigateToLevel = (owner: IOwner, id: number) => {
        let payload = {
            name: owner.BusinessName,
            id: owner.Id
        }
        dispatch(updateNav(payload))
        navigate(`/custormer-details/${parentInfo && parentInfo?.Level + 1}/${id}`)

    }
    const handleBackToHomePage = () => {
        dispatch(clearNav([]))
       navigate('/')
    }

    useEffect(() => {
        fetch();
    }, [refData])
    return (
        <div className="w-100 p-0">
            {bmoList.length > 0 && <ChartModal bmoList={bmoList} profile={parentInfo} show={viewChartModal} off={() => setViewChartModal(false)} />}
            <MoreInfoModal info={bmoOwner} off={() => setViewMoreInfoModal(false)} show={viewMoreInfotModal} />
            <AddNewBenefOwnerTypeModal action={handleAddNewBenefOwnerType} off={() => setAddNewBenefOwnerModal(false)} show={addNewBenefOwnerModal} />
            
            <CreateBMOOwnerIndModal off={() => setAddNewBenefOwnerIndividualModal(false)} show={addNewBenefOwnerIndividualModal} />
            <CreateBMOOwnerCoperateModal off={() => setAddNewBenefOwnerCoperateModal(false)} show={addNewBenefOwnerCoperateModal} />
            <CreateBMOOwnerFundsManagerModal off={() => setAddNewBenefOwnerFundsManagerModal(false)} show={addNewBenefOwnerFundsManagerModal} />
            <CreateBMOOwnerImportModal off={() => setAddNewBenefOwnerImportModal(false)} show={addNewBenefOwnerImportModal} />

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
                            <Badge className="d-flex justify-content-center align-items-center text-center" style={{ borderRadius: '20px', height: '20px', width: '20px' }}>{parentInfo?.Level}</Badge>
                        </>
                    }
                </div>
                <div className="d-flex gap-2">
                    {/* <Button onClick={handleAddNewBenefOwner} className="d-flex gap-2" style={{ minWidth: '15em' }}>
                        <i className="bi bi-plus-circle"></i>
                        <p className="p-0 m-0" >Add New Beneficial Owner</p></Button> */}
                    {bmoList && <FormSelect style={{ maxWidth: '8em' }} onChange={(e) => handleListDownload(e.currentTarget.value)}>
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
                                            bmoList.length > 0 && bmoList.length
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
                    <Button onClick={() => handleViewChart()} variant="outline border  d-flex gap-2 border-primary text-primary">
                        <i className="bi bi-pie-chart p-0 m-0"></i>
                        <p className="p-0 m-0" >View Chart</p>
                    </Button>
                </div>}
                <div style={{ height: '35vh', overflowY: 'scroll' }}>
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
                                            <UnAuthBOList lv={parentInfo?.Level} data={bmoList}/>: <tr className="text-center">
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
{/* <div className="d-flex justify-content-between mt-2">
    <p>1 of 10</p>
    <div className="d-flex gap-2">
        <Button>1</Button>
        <Button>2</Button>
        <Button>3</Button>
    </div>
</div> */}


            </div>



        </div>
    )

}

export default UnAuthUserViewBmoPage;