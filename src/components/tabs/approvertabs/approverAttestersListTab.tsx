import React, { useEffect, useState } from "react";
import { Badge, Button, Card, Form, FormControl, FormSelect, ListGroup, ListGroupItem, Spinner, Table } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { IPolicy } from "../../../interfaces/policy";
import { IDept } from "../../../interfaces/dept";
import moment from "moment";
import { getPolicies } from "../../../controllers/policy";
import receiptImg from '../../../assets/images/receipt.png';
import { getAllDepartments } from "../../../controllers/department";
import { toast } from 'react-toastify';
import { getUserInfo, loginUser } from "../../../controllers/auth";
import api from "../../../config/api";
import successElipse from '../../../assets/images/Ellipse-success.png';
import warningElipse from '../../../assets/images/Ellipse-warning.png';
import { shortenString } from "../../../util";
import { IUser } from "../../../interfaces/user";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

import Papa from 'papaparse'
import { saveAs } from 'file-saver';

const ApproverAttestersListTab: React.FC<any> = ({ handleCreatePolicy }) => {

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
    const [policies, setPolicies] = useState<IUser[]>([]);
    const [depts, setDepts] = useState<IDept[]>([]);
    const [loading, setLoading] = useState(false);
    const [sortByDept, setSortByDept] = useState(false);
    const [bySearch, setBySearch] = useState(false);
    const [selectedDept, setSelectedDept] = useState('');
    const [userSearch, setUserSearch] = useState('');
    const { id, fileName, deadlineDate } = useParams();
    const [query, setQuery] = useState<string>('');
    const [policyName, setPolicyName] = useState<string>('')


    const getUploadedPolicies = async () => {
        // setLoading(true)
        try {
            let userInfo = await getUserInfo();
            // console.log({ gotten: userInfo })({ gotten: userInfo })
            if (userInfo) {
                const res = await api.get(`Attest/${id}`, `${userInfo.access_token}`);
                // console.log({ gotten: userInfo })({listHere:res?.data})
                if (res?.data) {
                    setPolicies(res?.data)
                    setPolicyName(res?.data[0]?.policyName)
                    setLoading(false)
                } else {
                   
                    
                    setLoading(false)
                }
                // console.log({ gotten: userInfo })({ response: res })
            }

        } catch (error) {

        }
    }

    const handleDownloadPolicy = (pol: any) => {
        // toast.success('Downloading file')
        window.open(pol, '_blank');

    }

    const handleSearch = () => {
        setBySearch(true);
        setRefreshData(!refreshData)
    }

    const handleSearchByPolicyNameOrDept = async () => {

        try {
            setLoading(true)
            let userInfo = await getUserInfo();
            // // console.log({ gotten: userInfo })({ gotten: userInfo })
            if (userInfo) {
                const res = await api.get(`Policy/defaulters?policyId=${id}`, `${userInfo.access_token}`);
                // // console.log({ gotten: userInfo })({ listHere: res?.data })
                if (res?.data) {
                    let filtered = res?.data.filter((policy: IUser) => policy.userName.toLowerCase().includes(userSearch.toLowerCase())
                    );
                    setPolicies(filtered.reverse());
                    setPolicyName(res?.data[0]?.policyName)
                    setLoading(false)
                } else {


                    setLoading(false)
                }

            }

        } catch (error) {

        }
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

        // Create rows from the policies array
        const rows = policies.map((policy, index) => ({
            userName: policy.userName,
            email: policy.email,
            department: policy.department,
            attestationTime: moment(policy.attestationTime).format('YYYY-MM-DD') || 'N/A',
            deadlineTime: moment(policy.deadlineTime).format('YYYY-MM-DD') || 'N/A',
            serialNumber: index + 1
        }));

        autoTable(doc, {
            head: [columns.map(col => col.header)],
            body: rows.map(row => columns.map(col => row[col.dataKey] as string)),
            startY: 20,
        });

        doc.save(`${fileName}-Attesters List.pdf`);
    };

    const headers: any = [
        { label: 'S/N', key: 'serial' },
        { label: 'Staff Name', key: 'displayName' },
        { label: 'Emails', key: 'email' },
        { label: 'Department', key: 'department' },
        { label: 'Deadline Date', key: 'deadline' }
    ];

    const generateCSV = (data: IUser[], headers: { label: string; key: keyof IUser }[]) => {
        // Map data to match the headers
        const csvData = data.map((item, index) => ({
            serial: index + 1,
            displayName: `${item.firstName} ${item.lastName}`,
            email: item.email,
            department: item.department,
            deadline: moment(item.deadlineTime).format('MMM DD YYYY')
        }));

        // Convert the data to CSV format with headers
        const csv = Papa.unparse({
            fields: headers.map(header => header.label),
            data: csvData.map((item: any) => headers.map(header => item[header.key]))
        });

        // Create a Blob from the CSV string
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

        // Use FileSaver.js to save the file
        saveAs(blob, 'data.csv');
    };

    const handleListDownload = (val: string) => {
        if (val == 'pdf') {
            downloadPdf()
        } else if (val == 'csv') {
            generateCSV(policies, headers)
        } else {
            return
        }
    }


    const fetchData = () => {
        if (sortByDept) {
            // getBySort();
        } else if (bySearch) {
            handleSearchByPolicyNameOrDept();
        } else {
            getUploadedPolicies();
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
        <div className="w-100">
            <div className="d-flex w-100 justify-content-between">
                <div className="d-flex gap-4">
                    <div className="d-flex align-items-center gap-2" style={{ position: 'relative' }}>
                        <FormControl
                            onChange={(e) => setUserSearch(e.target.value)}
                            placeholder="Search by name of user"
                            value={userSearch}
                            className="py-2" style={{ minWidth: '350px' }} />
                        <i
                            className="bi bi-x-lg"
                            onClick={handleClear}
                            style={{ marginLeft: '310px', display: userSearch == '' ? 'none' : 'flex', cursor: 'pointer', float: 'right', position: 'absolute' }}></i>

                        <Button
                            disabled={userSearch == ''}
                            onClick={() => handleSearch()}
                            variant="primary" style={{ minWidth: '100px', marginRight: '-5px', minHeight: '2.4em' }}>Search</Button>
                    </div>


                </div>
                {
                    policies.length >= 1 &&
                    <div className="">
                        <FormSelect onChange={(e) => handleListDownload(e.currentTarget.value)}>
                            <option>Download List</option>
                            <option value={'csv'}>CSV</option>
                            <option value={'pdf'}>PDf</option>
                        </FormSelect>
                    </div>}
            </div>

            <div className="mt-4" >
                {
                    loading ? <table className="table table-stripped w-100">
                        <thead className="thead-dark">
                            <tr >
                                <th scope="col" className="bg-primary text-light">#</th>
                                <th scope="col" className="bg-primary text-light">Staff Name</th>
                                <th scope="col" className="bg-primary text-light">Emails</th>
                                <th scope="col" className="bg-primary text-light">Department</th>
                                <th scope="col" className="bg-primary text-light">Date Attested</th>
                                <th scope="col" className="bg-primary text-light">Deadline Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className=""><td className="text-center" colSpan={7}><Spinner className="spinner-grow text-primary" /></td></tr>
                        </tbody>
                    </table> :
                        <table className="table table-striped w-100">
                            <thead className="thead-dark">
                                <tr >
                                    <th scope="col" className="bg-primary text-light">#</th>
                                    <th scope="col" className="bg-primary text-light">Staff Name</th>
                                    <th scope="col" className="bg-primary text-light">Emails</th>
                                    <th scope="col" className="bg-primary text-light">Department</th>
                                    <th scope="col" className="bg-primary text-light">Date Attested</th>
                                    <th scope="col" className="bg-primary text-light">Deadline Date</th>
                                </tr>
                            </thead>
                            <tbody className="">
                                {policies.length <= 0 ? <tr><td className="text-center" colSpan={7}>No Data Available</td></tr> :
                                    policies.map((policy, index) => (
                                        <tr key={index} style={{ cursor: 'pointer' }}
                                        // onClick={() => navigate(`/admin/policy/${policy.id}/${policy.isAuthorized}`)}
                                        >
                                            <th scope="row">{index + 1}</th>
                                            <td className="text-primary"><i className="bi bi-file-earmark-pdf text-danger"></i> {`${shortenString(policy.userName, 40)}`}</td>
                                            <td>{policy.email}</td>
                                            <td>{policy.department}</td>
                                            <td>{moment(policy.attestationTime).format('MMM DD YYYY')}</td>
                                            <td>{moment(policy.deadlineTime).format('MMM DD YYYY')}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                }
            </div>
            {/* {
               policies && policies.length <= 0 ? '' :
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
export default ApproverAttestersListTab;