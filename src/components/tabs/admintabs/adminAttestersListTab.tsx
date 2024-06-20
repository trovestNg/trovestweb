import React, { useEffect, useState } from "react";
import { Badge, Button, Card, Form, FormControl, FormSelect, ListGroup, ListGroupItem, Spinner, Table } from "react-bootstrap";
import { useNavigate,useParams } from "react-router-dom";
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

const AdminAttestersListTab: React.FC<any> = ({ handleCreatePolicy }) => {
    // const userDat = localStorage.getItem('loggedInUser') || '';
    // const data = JSON.parse(userDat);
    // const userName = data?.profile?.sub.split('\\').pop();
    const [refreshData, setRefreshData] = useState(false);
    const navigate = useNavigate();
    const [policies, setPolicies] = useState<IUser[]>([]);
    const [depts, setDepts] = useState<IDept[]>([]);
    const [loading, setLoading] = useState(false);
    const [sortByDept, setSortByDept] = useState(false);
    const [bySearch, setBySearch] = useState(false);
    const [selectedDept, setSelectedDept] = useState('');
    const [userSearch, setUserSearch] = useState('');
    const { id } = useParams();
    const [query, setQuery] = useState<string>('');
    const [policyName,setPolicyName] = useState<string>('')


    const getUploadedPolicies = async () => {
        // setLoading(true)
        try {
            let userInfo = await getUserInfo();
            console.log({ gotten: userInfo })
            if (userInfo) {
                const res = await api.get(`Attest/${id}`, `${userInfo.access_token}`);
                console.log({listHere:res?.data})
                if (res?.data) {
                    setPolicies(res?.data)
                    setPolicyName(res?.data[0]?.policyName)
                    setLoading(false)
                } else {
                   
                    toast.error('Network error!')
                    setLoading(false)
                }
                console.log({ response: res })
            }

        } catch (error) {

        }
    }

  

    // const handleGetDepts = async () => {
    //     // setLoading(true)
    //     try {
    //         const res = await getAllDepartments(`filter?subsidiaryName=FSDH+Merchant+Bank`, `${data?.access_token}`);
    //         console.log({ dataHere: res })

    //         if (res?.data) {
    //             setDepts(res?.data)
    //         } else {

    //         }
    //         console.log({ response: res })
    //     } catch (error) {

    //     }

    // }

    const handleSearch = () => {

        setBySearch(true);
        setRefreshData(!refreshData)

    }

    const handleSearchByPolicyNameOrDept = async () => {
        // setLoading(true)
        try {
            let userInfo = await getUserInfo();
            let userName = userInfo?.profile?.sub.split('\\')[1]
            const res = await api.get(`Dashboard/initiator-policy?userName=${userName}`, `${userInfo?.access_token}`);
            if (res?.data) {

                setLoading(false)

                let filtered = res?.data.filter((policy: IPolicy) =>
                    policy.fileName.toLowerCase().includes(query.toLowerCase()) && !policy.isAuthorized && !policy.markedForDeletion
                );
                setPolicies(filtered.reverse());



            }
        } catch (error) {
            console.log(error)
        }


    }

    // const getBySort = async () => {
    //     setLoading(true)
    //     try {
    //         const res = await getPolicies(`filterByDepartment?departmentName=${selectedDept}`, `${data?.access_token}`);
    //         if (res?.data) {
    //             setPolicies(res?.data);
    //             setLoading(false);
    //         } else {
    //             toast.error('Fail to sort!')
    //             setLoading(false);
    //             setSortByDept(false);
    //         }
    //         console.log({ response: res })
    //     } catch (error) {

    //     }
    // }

    const handleDeptSelection = (val: string) => {
        setSelectedDept(val);
        setSortByDept(true)
        setRefreshData(!refreshData)
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

    const handleClick = (e: any) => {
        e.stopPropagation();
        toast.error('hii')
    }

    const handleGetAttestersList = (e: any,pol:IPolicy) => {
        e.stopPropagation();
        navigate(`/admin/attesters-list/${pol.id}`);
    }


    useEffect(() => {
        fetchData();
        // handleGetDepts();
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
                    {/* <Form.Select onChange={(e) => handleDeptSelection(e.currentTarget.value)} className="custom-select" style={{ maxWidth: '170px' }}>
                        <option>Select Department</option>
                        {
                            depts.map((dept) => <option key={dept.id} value={dept.name}>{dept.name}</option>)
                        }
                    </Form.Select> */}

                </div>
                <div className="">
                    <Button
                        variant="primary"
                        style={{ minWidth: '100px' }}
                        onClick={() => handleCreatePolicy()}
                    >Download List</Button>
                </div>
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
                                { policies.length <= 0 ? <tr><td className="text-center" colSpan={7}>No Data Available</td></tr> :
                                   policies.map((policy, index) => (
                                        <tr key={index} style={{ cursor: 'pointer' }}
                                        // onClick={() => navigate(`/admin/policy/${policy.id}/${policy.isAuthorized}`)}
                                        >
                                            <th scope="row">{index + 1}</th>
                                            <td><i className="bi bi-file-earmark-pdf text-danger"></i> {`${shortenString(policy.userName,40)}`}</td>
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
export default AdminAttestersListTab;