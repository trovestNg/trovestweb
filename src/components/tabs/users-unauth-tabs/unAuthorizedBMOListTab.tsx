import React, { useEffect, useState } from "react";
import { Badge, Button, Card, Form, FormControl, FormSelect, ListGroup, ListGroupItem, Spinner, Table } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { IPolicy } from "../../../interfaces/policy";
import { IDept } from "../../../interfaces/dept";
import moment from "moment";
import receiptImg from '../../../assets/images/receipt.png';
import { getAllDepartments } from "../../../controllers/department";
import { toast } from 'react-toastify';
import { getUserInfo, loginUser } from "../../../controllers/auth";
import api from "../../../config/api";
import successElipse from '../../../assets/images/Ellipse-success.png';
import warningElipse from '../../../assets/images/Ellipse-warning.png';
import jumboBg from '../../../assets/images/ubo-jumbo-bg.svg';
import { shortenString } from "../../../util";
import { IBMO } from "../../../interfaces/user";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import AuthorizerAttestersListPagination from "../../paginations/authorizer/authorizer-attesters-list-pagiantion";


import Papa from 'papaparse'
import { saveAs } from 'file-saver';
import apiUnAuth from "../../../config/apiUnAuth";
import UnAuthUserPagination from "../../paginations/authorizer/unauth-user-pagiantion";

const UnAuthorizedBMOListTab: React.FC<any> = ({ handleCreatePolicy }) => {

    type TPolicy = {
        attestationTime: string,
        deadlineTime: string
        department: string
        email: string
        userName: string
        serialNumber: number
    }


    type Column = {
        header: string;
        dataKey: keyof TPolicy;
    };

    const [refreshData, setRefreshData] = useState(false);
    const navigate = useNavigate();
    const [bmos, setBmos] = useState<IBMO[]>([]);
    const [depts, setDepts] = useState<IDept[]>([]);
    const [loading, setLoading] = useState(false);
    const [sortByDept, setSortByDept] = useState(false);
    const [bySearch, setBySearch] = useState(false);
    const [selectedDept, setSelectedDept] = useState('');
    const [userSearch, setUserSearch] = useState('');
    const { id } = useParams();

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const deadlineDate = queryParams.get('deadlineDate');
    const fileName = queryParams.get('fileName');



    const [query, setQuery] = useState<string>('');
    const [policyName, setPolicyName] = useState<string>('')


    const getBMOList = async () => {
        // setLoading(true)
        try {
            const res = await apiUnAuth.get('customers');
            // console.log({ gotten: res })
            if (res?.data) {
                // setBmos(res?.data?.customerAccounts)
                setLoading(false)
                setBmos([])
                // setPolicyName(res?.data[0]?.policyName)

            }


        } catch (error) {
            console.log(error)
        }
    }

    const handleSearch = () => {
        setBySearch(true);
        setRefreshData(!refreshData)
    }

    const handleSearchByPolicyNameOrDept = async () => {
        // toast.error('Await')
        try {
            const res = await apiUnAuth.get('customers');
            console.log(res)
            if (res) {
                let filtered = res?.data?.customerAccounts.filter((bmo: IBMO) => bmo.customerName.toLowerCase().includes(userSearch.toLowerCase()))
                setBmos(filtered);
                //   setPolicyName(res?.data[0]?.policyName)
                setLoading(false)
            }
        } catch (error) {

        }
        // try {
        //     
        //     console.log({ listHere: res?.data })
        //     
        //         
        //        
        //     }
        // }
        // catch (error) {
        //     console.log(error)
        // }
    }



    const downloadPdf = () => {
        const doc = new jsPDF();
        // Define the columns
        const columns: Column[] = [
            { header: 'S/N', dataKey: 'serialNumber' },
            { header: 'Staff Name', dataKey: 'userName' },
            { header: 'Emails', dataKey: 'email' },
            { header: 'Department', dataKey: 'department' },
            { header: 'Date Attested', dataKey: 'attestationTime' },
            { header: 'Deadline Date', dataKey: 'deadlineTime' }
        ];

        // Create rows from the bmos array
        const rows = bmos.map((bmo, index) => ({
            userName: bmo.customerName,
            email: bmo.customerNumber,
            department: bmo.customerType,
            attestationTime: moment(bmo.kycReferenceNumber).format('YYYY-MM-DD') || 'N/A',
            deadlineTime: moment(bmo.level).format('YYYY-MM-DD') || 'N/A',
            serialNumber: index + 1
        }));

        autoTable(doc, {
            head: [columns.map(col => col.header)],
            body: rows.map(row => columns.map(col => row[col.dataKey] as string)),
            startY: 20,
        });

        doc.save(`${bmos[0].customerName}.pdf`);
    };

    const headers: any = [
        { label: 'S/N', key: 'serial' },
        { label: 'Staff Name', key: 'userName' },
        { label: 'Emails', key: 'email' },
        { label: 'Department', key: 'department' },
        { label: 'Date Attested	', key: 'attestation' },
        { label: 'Deadline Date', key: 'deadline' },
    ];

    const generateCSV = (data: IBMO[], headers: { label: string; key: keyof IBMO }[]) => {
        // Map data to match the headers
        const csvData = data.map((item, index) => ({
            serial: index + 1,
            userName: `${item.customerName}`,
            email: item.customerNumber,
            department: item.customerType,
            deadline: moment(item.kycReferenceNumber).format('MMM DD YYYY'),
            attestation: moment(item.level).format('MMM DD YYYY')
        }));

        // Convert the data to CSV format with headers
        const csv = Papa.unparse({
            fields: headers.map(header => header.label),
            data: csvData.map((item: any) => headers.map(header => item[header.key]))
        });

        // Create a Blob from the CSV string
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

        // Use FileSaver.js to save the file
        saveAs(blob, `${fileName}-Attesters List.csv`);
    };

    const handleListDownload = (val: string) => {
        if (val == 'pdf') {
            downloadPdf()
        } else if (val == 'csv') {
            generateCSV(bmos, headers)
        } else {
            return
        }
    }

    const handleSendReminder = async () => {
        setLoading(true)
        try {
            let userInfo = await getUserInfo();
            let userName = userInfo?.profile?.sub.split('\\')[1]
            if (userInfo) {
                const res = await api.post(`Policy/nudge-authorizer?policyId=${id}`, { "policyId": id }, userInfo?.access_token);
                if (res?.status == 200) {
                    toast.success('Reminder sent!');
                    setRefreshData(!refreshData)
                    setLoading(false)
                } else {
                    toast.error('Error sending reminder')
                }
            }

        } catch (error) {

        }
    }


    const fetchData = () => {
        if (sortByDept) {
            // getBySort();
        } else if (bySearch) {
            handleSearchByPolicyNameOrDept();
        } else {
            getBMOList();
        }
    }

    const handleClear = () => {
        setBySearch(false);
        setUserSearch('')
        setRefreshData(!refreshData)
    }


    useEffect(() => {
        fetchData();
        // handleGetDepts();
    }, [refreshData])

    return (
        <div className="w-100 p-2" style={{ height: '85vh' }}>
            
            <div className="d-flex w-100 justify-content-center mt-2">
                <div className="d-flex align-items-center gap-4">
                    


                </div>
                {
                    bmos.length >= 1 &&
                    <div className="d-flex gap-2">
                        {/* <Button
                        disabled={loading}
                            variant="primary"
                            style={{ minWidth: '10em' }}
                            onClick={handleSendReminder}
                        >Send Reminder</Button> */}

                        <FormSelect onChange={(e) => handleListDownload(e.currentTarget.value)}>
                            <option>Download List</option>
                            <option value={'csv'}>CSV</option>
                            <option value={'pdf'}>PDf</option>
                        </FormSelect>
                    </div>
                }
            </div>

            <div className="mt-3" >
                {
                    bmos.length < 1 ? <table className="table table-stripped w-100">
                        <thead className="thead-dark">
                            <tr >
                                <th scope="col" className="bg-primary text-light">#</th>
                                <th scope="col" className="bg-primary text-light">Business Name</th>
                                <th scope="col" className="bg-primary text-light">RN/BN/CAC/IT Number</th>
                                <th scope="col" className="bg-primary text-light">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className=""><td className="text-center fw-bold" colSpan={7}>Use the search bar to search for a BMO</td></tr>
                        </tbody>
                    </table> : <div className="py-2">
                        {bmos.length >= 1 && <UnAuthUserPagination data={bmos} />}
                    </div>

                }
            </div>
            {/* {
               bmos && bmos.length <= 0 ? '' :
                    <div className="d-flex justify-content-between align-items-center">
                        <p className="p-0 m-0">Showing 1 to 10 of 100 entries</p>
                        <nav aria-label="...">
                            <ul className="pagination">
                                <li className="page-item disabled">
                                    <a className="page-link" href="#" aria-disabled="true">Previous</a>
                                </li>
                                <li className="page-item"><a className="page-link" href="#">1</a></li>
                                <li className="page-item active" aria-current="page">
                                    <a className="page-link" href="#">2</a>
                                </li>
                                <li className="page-item"><a className="page-link" href="#">3</a></li>
                                <li className="page-item">
                                    <a className="page-link" href="#">Next</a>
                                </li>
                            </ul>
                        </nav>
                    </div>} */}
        </div>
    )

}
export default UnAuthorizedBMOListTab;