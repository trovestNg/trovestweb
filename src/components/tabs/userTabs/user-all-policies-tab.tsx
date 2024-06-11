import React, { useEffect, useState } from "react";
import { Badge, Button, Form, FormControl, FormSelect, Spinner, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { IPolicy } from "../../../interfaces/policy";
import { IUserPolicy } from "../../../interfaces/user";
import { IDept } from "../../../interfaces/dept";
import moment from "moment";
import { getPolicies } from "../../../controllers/policy";
import receiptImg from '../../../assets/images/receipt.png';
import { getAllDepartments } from "../../../controllers/department";
import { toast } from 'react-toastify';
import { getUserInfo, loginUser } from "../../../controllers/auth";
import api from "../../../config/api";
import { shortenString } from "../../../util";
import successElipse from '../../../assets/images/Ellipse-success.png';
import warningElipse from '../../../assets/images/Ellipse-warning.png';

const UserAllPoliciesTab: React.FC<any> = () => {
    const userDat = localStorage.getItem('loggedInUser') || '';
    const data = JSON.parse(userDat);
    const userName = data?.profile?.sub.split('\\').pop();
    const [refreshData, setRefreshData] = useState(false);
    const navigate = useNavigate();

    const [policies, setPolicies] = useState<IUserPolicy[]>([]);
    const [filteredData, setFilteredData] = useState<IUserPolicy[]>([]);
    const [sortedData, setSortedData] = useState<IUserPolicy[]>([]);

    const [depts, setDepts] = useState<IDept[]>([]);
    const [loading, setLoading] = useState(false);

    const [sortByDept, setSortByDept] = useState(false);
    const [searchByName, setBySearch] = useState(false);

    const [selectedDept, setSelectedDept] = useState('');
    const [userSearch, setUserSearch] = useState('')


    const [query, setQuery] = useState<string>('');
    const [sortCriteria, setSortCriteria] = useState<string>('name');



    const getAllPolicies = async () => {
        setLoading(true)
        try {
            let userInfo = await getUserInfo();
            console.log({ gotten: userInfo })
            if (userInfo) {
                const res = await api.get(`Policy/user-policy?userName=${userName}`, `${userInfo.access_token}`);
                if (res?.data) {
                    setPolicies(res?.data);
                    setLoading(false)
                } else {
                    // loginUser()
                    // toast.error('Session expired!, You have been logged out!!')
                }
                console.log({ response: res })
            }

        } catch (error) {

        }
    }

    const handleSearchByPolicyNameOrDept = async () => {
        // toast.error('Searching by name of dept or title!')
        setLoading(true)
        try {
            let userInfo = await getUserInfo();
            console.log({ gotten: userInfo })
            if (userInfo) {
                const res = await api.get(`Policy/user-policy?userName=${userName}`, `${userInfo.access_token}`);
                if (res?.data) {

                    setLoading(false)

                    let filtered = res?.data.filter((policy: IUserPolicy) =>
                        policy.fileName.toLowerCase().includes(query.toLowerCase()) ||
                        policy.policyDepartment.toLowerCase().includes(query.toLowerCase())
                    );
                    setPolicies(filtered);

                } else {
                    // loginUser()
                    // toast.error('Session expired!, You have been logged out!!')
                }
                console.log({ response: res })
            }

        } catch (error) {

        }

    };

    const handleSortByDepartment = async () => {
        // s
        setLoading(true)
        try {
            let userInfo = await getUserInfo();
            console.log({ gotten: userInfo })
            if (userInfo) {
                const res = await api.get(`Policy/user-policy?userName=${userName}`, `${userInfo.access_token}`);
                if (res?.data) {

                    setLoading(false)

                    let filtered = res?.data.filter((policy: IUserPolicy) =>
                        policy.policyDepartment.toLowerCase().includes(sortCriteria.toLowerCase())
                    );
                    setPolicies(filtered);

                } else {
                    // loginUser()
                    // toast.error('Session expired!, You have been logged out!!')
                }
                console.log({ response: res })
            }

        } catch (error) {

        }

    };

    const handleSearch = () => {
        setBySearch(true);
        setRefreshData(!refreshData)
    }

    const handleClear = () => {
        setBySearch(false);
        setQuery('')
        setRefreshData(!refreshData)
    }

   


    const handleGetAllDepts = async () => {
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

    const handleDeptSelection = (val: string) => {
        if(val == 'all'){
            setBySearch(false)
            setSortByDept(false)
            setRefreshData(!refreshData)
        } else {
            setSortCriteria(val);
            setBySearch(false);
            setSortByDept(true)
            setRefreshData(!refreshData)
        }
        
    }


    const fetchData = () => {
        if (searchByName) {
            handleSearchByPolicyNameOrDept()
        } else if (sortByDept) {
            handleSortByDepartment()
        } else {
            getAllPolicies();
        }

    }


    useEffect(() => {
        fetchData();
        handleGetAllDepts();
    }, [refreshData])

    return (
        <div className="w-100">
            <div className="d-flex w-100 justify-content-between">
                <div className="d-flex gap-4">
                    <div className="d-flex align-items-center" style={{position:'relative'}}>
                        <FormControl
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search by Name, Department..."
                            value={query}
                            className="py-2" style={{ minWidth: '350px' }} />
                                <i 
                                className="bi bi-x-lg" 
                                onClick={handleClear}
                                style={{marginLeft:'310px', display:query==''?'none':'flex',cursor:'pointer', float:'right', position:'absolute'}}></i>
                            
                        <Button
                            disabled={query == ''}
                            onClick={() => handleSearch()}

                            variant="primary" style={{ minWidth: '100px', marginLeft: '-5px' }}>Search</Button>
                    </div>
                    <Form.Select onChange={(e) => handleDeptSelection(e.currentTarget.value)} className="custom-select"
                     style={{ maxWidth: '170px' }}>
                        <option value={'all'}>Select Department</option>
                        {
                            depts.map((dept) => <option key={dept.id} value={dept.name}>{dept.name}</option>)
                        }
                    </Form.Select>

                </div>
                {/* <div className="">
                    <Button variant="primary" style={{ minWidth: '100px' }}>Create New Policy</Button>
                </div> */}
            </div>

            <div className="mt-4" >
                {
                    loading ? <table className="table table-stripped w-100">
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
                                <tr >
                                    <th scope="col" className="bg-primary text-light">#</th>
                                    <th scope="col" className="bg-primary text-light">Policy Title</th>
                                    <th scope="col" className="bg-primary text-light">Department</th>
                                    <th scope="col" className="bg-primary text-light">Deadline to Attest</th>
                                    <th scope="col" className="bg-primary text-light">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {policies.length <= 0 ? <tr><td className="text-center" colSpan={5}>No Data Available</td></tr> :
                                    policies.map((policy, index) => (
                                        <tr key={index} style={{ cursor: 'pointer' }}
                                            onClick={() => navigate(`/policy-portal/policy/${policy.isAttested}/${policy.id}`)}
                                        >
                                            <th scope="row">{index + 1}</th>
                                            <td><i className="bi bi-file-earmark-pdf text-danger"></i> {shortenString(policy.fileName, 40)}</td>
                                            <td>{policy.policyDepartment}</td>
                                            <td>{moment(policy.deadlineDate).format('MMM DD YYYY')}</td>
                                            <td className={`text-${policy.isAttested ? 'success' : 'warning'}`}>
                                                <img src={policy.isAttested ? successElipse : warningElipse} height={'10px'} />
                                                {'  '}
                                                <span >{policy.isAttested ? 'Attested' : 'Not attested'}</span>
                                            </td>
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
export default UserAllPoliciesTab;