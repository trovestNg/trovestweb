import React, { useEffect, useState } from "react";
import { Badge, Button, Form, FormControl, FormSelect, Spinner, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { IPolicy } from "../../../interfaces/policy";
import { IDept } from "../../../interfaces/dept";
import moment from "moment";
import { getPolicies } from "../../../controllers/policy";
import receiptImg from '../../../assets/images/receipt.png';
import { getAllDepartments } from "../../../controllers/department";
import { toast } from 'react-toastify';
import { getUserInfo, loginUser } from "../../../controllers/auth";
import api from "../../../config/api";

const AdminUploadedPoliciesTab: React.FC<any> = ({ handleCreatePolicy }) => {
    const userDat = localStorage.getItem('loggedInUser') || '';
    const data = JSON.parse(userDat);
    const [refreshData, setRefreshData] = useState(false);
    const navigate = useNavigate();
    const [policies, setPolicies] = useState<IPolicy[]>([]);
    const [depts, setDepts] = useState<IDept[]>([]);
    const [loading, setLoading] = useState(false);
    const [sortByDept, setSortByDept] = useState(false);
    const [bySearch, setBySearch] = useState(false);
    const [selectedDept, setSelectedDept] = useState('');
    const [userSearch, setUserSearch] = useState('');

    const getUploadedPolicies = async () => {
        setLoading(true)
        try {
            let userInfo = await getUserInfo();
            console.log({ gotten: userInfo })
            if (userInfo) {
                const res = await api.get(`Policy/uploaded`, `${userInfo.access_token}`);
                if (res?.data) {
                    setPolicies(res?.data);
                    setLoading(false)
                } else {
                    loginUser()
                    toast.error('Session expired!, You have been logged out!!')
                }
                console.log({ response: res })
            }

        } catch (error) {

        }
    }

    const handleGetDepts = async () => {
        // setLoading(true)
        try {
            const res = await getAllDepartments(`filter?subsidiaryName=FSDH+Merchant+Bank`, `${data?.access_token}`);
            console.log({ dataHere: res })

            if (res?.data) {
                setDepts(res?.data)
            } else {

            }
            console.log({ response: res })
        } catch (error) {

        }

    }

    const handleSearch = () => {

        setBySearch(true);
        setRefreshData(!refreshData)

    }

    const getBySearch = async () => {
        setLoading(true)
        try {
            const res = await getPolicies(`Policy/searchByWord?searchWord=${userSearch}`, `${data?.access_token}`);
            if (res?.data) {
                // let searched = res?.data.filter((data:IPolicy)=>data.fileName.includes(userSearch));
                setPolicies(res?.data);
                // if(allAttested.length >= res?.data.length){
                //     setPolicies([]);
                // } else{

                // }

                setLoading(false)
            } else {
                toast.error('Search failed!');
                setBySearch(false);
                setLoading(false);
            }
            console.log({ response: res })
        } catch (error) {

        }
    }

    const getBySort = async () => {
        setLoading(true)
        try {
            const res = await getPolicies(`filterByDepartment?departmentName=${selectedDept}`, `${data?.access_token}`);
            if (res?.data) {
                setPolicies(res?.data);
                setLoading(false);
            } else {
                toast.error('Fail to sort!')
                setLoading(false);
                setSortByDept(false);
            }
            console.log({ response: res })
        } catch (error) {

        }
    }

    const handleDeptSelection = (val: string) => {
        setSelectedDept(val);
        setSortByDept(true)
        setRefreshData(!refreshData)
    }


    const fetchData = () => {
        if (sortByDept) {
            getBySort();
        } else if (bySearch) {
            getBySearch();
        } else {
            getUploadedPolicies();
        }
    }


    useEffect(() => {
        fetchData();
        handleGetDepts();
    }, [refreshData])

    return (
        <div className="w-100">
            <div className="d-flex w-100 justify-content-between">
                <div className="d-flex gap-4">
                    <div className="d-flex">
                        <FormControl
                            onChange={(e) => setUserSearch(e.target.value)}
                            placeholder="Search by Name, Department..."
                            className="py-2" style={{ minWidth: '350px' }} />
                        <Button
                            disabled={userSearch == ''}
                            onClick={() => handleSearch()}

                            variant="primary" style={{ minWidth: '100px', marginLeft: '-5px' }}>Search</Button>
                    </div>
                    <Form.Select onChange={(e) => handleDeptSelection(e.currentTarget.value)} className="custom-select" style={{ maxWidth: '170px' }}>
                        <option>Select Department</option>
                        {
                            depts.map((dept) => <option key={dept.id} value={dept.name}>{dept.name}</option>)
                        }
                    </Form.Select>

                </div>
                <div className="">
                    <Button
                        variant="primary"
                        style={{ minWidth: '100px' }}
                        onClick={()=>handleCreatePolicy()}
                    >Create New Policy</Button>
                </div>
            </div>

            <div className="mt-4" >
                {
                    loading ? <table className="table w-100">
                        <thead className="thead-dark">
                            <tr >
                                <th scope="col" className="bg-primary text-light">#</th>
                                <th scope="col" className="bg-primary text-light">Policy Title</th>
                                <th scope="col" className="bg-primary text-light">Department</th>
                                <th scope="col" className="bg-primary text-light">Deadline to Attest</th>
                                <th scope="col" className="bg-primary text-light">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className=""><td className="text-center" colSpan={5}><Spinner className="spinner-grow text-primary" /></td></tr>
                        </tbody>
                    </table> :
                        <table className="table w-100">
                            <thead className="thead-dark">
                               
                                    <th scope="col" className="bg-primary text-light">#</th>
                                    <th scope="col" className="bg-primary text-light">Policy Title</th>
                                    <th scope="col" className="bg-primary text-light">Department</th>
                                    <th scope="col" className="bg-primary text-light">Deadline to Attest</th>
                                    <th scope="col" className="bg-primary text-light">Status</th>
                               
                            </thead>
                            <tbody>
                                {policies.length <= 0 ? <tr>
                                    <td className="text-center" colSpan={5}>
                                        <img src={receiptImg} height={85} />
                                        <p className="p-0 m-0 text-primary" style={{ fontFamily: 'title' }}>You have attested all policies</p>
                                        <p >
                                            You are up to date all all polices please check back from time to time to stay updated on these polices
                                        </p>
                                    </td></tr> :
                                    policies.map((policy, index) => (
                                        <tr key={index} style={{ cursor: 'pointer' }}
                                            onClick={() => navigate(`/policy-portal/policy/${policy.id}`)}
                                        >
                                            <th scope="row">{index + 1}</th>
                                            <td><i className="bi bi-file-earmark-pdf text-danger"></i> {policy.fileName}</td>
                                            <td>{policy.departmentId}</td>
                                            <td>{moment(policy.deadlineDate).format('MMM DD YYYY')}</td>
                                            <td className={`text-${policy.isAuthorized ? 'success' : 'warning'}`}>
                                                <i className="bi bi-dot"></i>
                                                <span >{policy.isAuthorized ? 'Attested' : 'Not Attested'}</span></td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                }
            </div>
            {
                policies.length <= 0 ? '' :
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
                    </div>}
        </div>
    )

}
export default AdminUploadedPoliciesTab;