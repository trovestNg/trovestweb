import React, { useEffect, useState } from "react";
import { Badge, Button, Card, Form, FormControl, FormSelect, ListGroup, ListGroupItem, Spinner, Table } from "react-bootstrap";
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
import successElipse from '../../../assets/images/Ellipse-success.png';
import warningElipse from '../../../assets/images/Ellipse-warning.png';
import { shortenString } from "../../../util";

const AdminUploadedPoliciesTab: React.FC<any> = ({ handleCreatePolicy }) => {
    const userDat = localStorage.getItem('loggedInUser') || '';
    const data = JSON.parse(userDat);
    const userName = data?.profile?.sub.split('\\').pop();
    const [refreshData, setRefreshData] = useState(false);
    const navigate = useNavigate();
    const [policies, setPolicies] = useState<IPolicy[]>([]);
    const [depts, setDepts] = useState<IDept[]>([]);
    const [loading, setLoading] = useState(false);
    const [sortByDept, setSortByDept] = useState(false);
    const [bySearch, setBySearch] = useState(false);
    const [selectedDept, setSelectedDept] = useState('');
    const [userSearch, setUserSearch] = useState('')


    const getUploadedPolicies = async () => {
        setLoading(true)
        try {
            let userInfo = await getUserInfo();
            console.log({ gotten: userInfo })
            if (userInfo) {
                const res = await api.get(`Dashboard/initiator-policy?userName=${userName}`, `${userInfo.access_token}`);
                if (res?.data) {
                    setPolicies(res?.data);
                    setLoading(false)
                } else {
                    loginUser()
                    // toast.error('Session expired!, You have been logged out!!')
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

    const handleClick = (e: any) => {
        e.stopPropagation();
        toast.error('hii')
    }

    const handleEdit = (e:any,policy:IPolicy)=>{
        e.stopPropagation();
        navigate(`/admin/edit-policy/${policy.id}`)
    }

    const handlePolicyDelete = async (e: any,policy:IPolicy) => {
        e.stopPropagation();
        const res = await api.post(`Policy/delete/request`,{"id":policy.id,"username":userName},data?.access_token);
        if(res?.status==200){
            toast.success('Delete request sent for approval!');
            setRefreshData(!refreshData)
        } else{
            toast.error('Failed to delete policy')
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
                        onClick={() => handleCreatePolicy()}
                    >Create New Policy</Button>
                </div>
            </div>

            <div className="mt-4" >
                {
                    loading ? <table className="table table-stripped w-100">
                        <thead className="thead-dark">
                        <tr >
                                    <th scope="col" className="bg-primary text-light">#</th>
                                    <th scope="col" className="bg-primary text-light">Policy Title</th>
                                    <th scope="col" className="bg-primary text-light">Authorizer</th>
                                    <th scope="col" className="bg-primary text-light">Date Uploaded</th>
                                    <th scope="col" className="bg-primary text-light">Status</th>
                                    <th scope="col" className="bg-primary text-light">Action</th>
                                </tr>
                        </thead>
                        <tbody>
                            <tr className=""><td className="text-center" colSpan={5}><Spinner className="spinner-grow text-primary" /></td></tr>
                        </tbody>
                    </table> :
                        <table className="table table-striped w-100">
                            <thead className="thead-dark">
                                <tr >
                                    <th scope="col" className="bg-primary text-light">#</th>
                                    <th scope="col" className="bg-primary text-light">Policy Title</th>
                                    <th scope="col" className="bg-primary text-light">Authorizer</th>
                                    <th scope="col" className="bg-primary text-light">Date Uploaded</th>
                                    <th scope="col" className="bg-primary text-light">Status</th>
                                    <th scope="col" className="bg-primary text-light">Action</th>
                                </tr>
                            </thead>
                            <tbody className="" style={{ height: '500px' }}>
                                {policies.length <= 0 ? <tr><td className="text-center" colSpan={5}>No Data Available</td></tr> :
                                    policies.map((policy, index) => (
                                        <tr key={index} style={{ cursor: 'pointer' }}
                                            onClick={() => navigate(`/admin/policy/${policy.id}/${policy.isAuthorized}`)}
                                        >
                                            <th scope="row">{index + 1}</th>
                                            <td><i className="bi bi-file-earmark-pdf text-danger"></i> {`${shortenString(policy.fileName,40)}`}</td>
                                           
                                            <td>{policy.authorizedBy}</td>
                                            <td>{moment(policy.uploadTime).format('MMM DD YYYY')}</td>
                                            <td className={`text-${policy.isAuthorized ? 'success' : 'warning'}`}>
                                                <img src={policy.isAuthorized ? successElipse : warningElipse} height={'10px'} />
                                                {'  '}
                                                <span >{policy.isAuthorized ? 'Approved' : 'Pending'}</span>
                                            </td>
                                            <td className="table-icon">
                                                <i className=" bi bi-three-dots"></i>
                                                <div className="content ml-5" style={{ position: 'relative' }}>
                                                    {
                                                        policy.isAuthorized &&
                                                        <Card className="p-2  shadow-sm rounded border-0"
                                                        style={{ minWidth: '15em', marginLeft: '-10em', position: 'absolute' }}>
                                                        <ListGroup>
                                                            <ListGroupItem className="multi-layer"
                                                            
                                                            >
                                                                <span className="w-100 d-flex justify-content-between">
                                                                    <div className="d-flex gap-2">
                                                                    <i className="bi bi-clipboard-check"></i>
                                                                        Attesters List
                                                                    </div>

                                                                    <i className="bi bi-chevron-right"></i>
                                                                </span>
                                                                <div className="container">
                                                                    <Card
                                                                        className="p-2  shadow-sm rounded border-0"
                                                                        style={{
                                                                            minWidth: '15em',
                                                                            marginLeft: '-16.5em',
                                                                            marginTop: '-2.5em',
                                                                            position: 'absolute'
                                                                        }}
                                                                    >
                                                                        <ListGroup>
                                                                            <ListGroupItem
                                                                            onClick={(e) => handleClick(e)}
                                                                            >
                                                                                <span className="w-100 d-flex justify-content-between">
                                                                                    <div className="d-flex gap-2">
                                                                                        <i className="bi bi-file-text"></i>
                                                                                        View List
                                                                                    </div>
                                                                                </span>
                                                                            </ListGroupItem>

                                                                            <ListGroupItem>
                                                                                <span className="w-100 d-flex justify-content-between">
                                                                                    <div className="d-flex gap-2">
                                                                                    <i className="bi bi-download"></i>
                                                                                        Download List
                                                                                    </div>
                                                                                </span>
                                                                            </ListGroupItem>
                                                                        </ListGroup>
                                                                    </Card>
                                                                </div>
                                                            </ListGroupItem>

                                                            <ListGroupItem className="multi-layer">
                                                                <span className="w-100 d-flex justify-content-between">
                                                                    <div className="d-flex gap-2">
                                                                    <i className="bi bi-clipboard-x"></i>
                                                                       Defaulters List
                                                                    </div>

                                                                    <i className="bi bi-chevron-right"></i>
                                                                </span>
                                                                <div className="container">
                                                                    <Card
                                                                        className="p-2  shadow-sm rounded border-0"
                                                                        style={{
                                                                            minWidth: '15em',
                                                                            marginLeft: '-16.5em',
                                                                            marginTop: '-2.5em',
                                                                            position: 'absolute'
                                                                        }}
                                                                    >
                                                                        <ListGroup>
                                                                            <ListGroupItem>
                                                                                <span className="w-100 d-flex justify-content-between">
                                                                                    <div className="d-flex gap-2">
                                                                                        <i className="bi bi-file-text"></i>
                                                                                        View List
                                                                                    </div>
                                                                                </span>
                                                                            </ListGroupItem>

                                                                            <ListGroupItem>
                                                                                <span className="w-100 d-flex justify-content-between">
                                                                                    <div className="d-flex gap-2">
                                                                                    <i className="bi bi-download"></i>
                                                                                        Download List
                                                                                    </div>
                                                                                </span>
                                                                            </ListGroupItem>
                                                                        </ListGroup>
                                                                    </Card>
                                                                </div>
                                                            </ListGroupItem>

                                                            <ListGroupItem>
                                                                <span className="w-100 d-flex justify-content-between">
                                                                    <div className="d-flex gap-2">
                                                                    <i className="bi bi-calendar-event"></i>
                                                                        Update Deadline
                                                                    </div>
                                                                </span>
                                                            </ListGroupItem>

                                                            <ListGroupItem
                                                            disabled={policy?.markedForDeletion}
                                                            onClick={(e)=>handlePolicyDelete(e,policy)}
                                                            >
                                                                <span className="w-100 d-flex justify-content-between">
                                                                    <div className="d-flex gap-2">
                                                                    <i className="bi bi-trash"></i>
                                                                        Delete
                                                                    </div>
                                                                </span>
                                                            </ListGroupItem>
                                                        </ListGroup>
                                                    </Card>}


                                                    {
                                                        !policy.isAuthorized &&
                                                        <Card className="p-2  shadow-sm rounded border-0"
                                                        style={{ minWidth: '15em', marginLeft: '-10em', position: 'absolute' }}>
                                                        <ListGroup>
                                                            <ListGroupItem
                                                            onClick={(e)=>handleEdit(e,policy)}
                                                            >
                                                            <span className="w-100 d-flex justify-content-between">
                                                                    <div className="d-flex gap-2">
                                                                        <i className="bi bi-file-text"></i>
                                                                        Edit Policy
                                                                    </div>
                                                                </span>
                                                            </ListGroupItem>

                                                            <ListGroupItem>
                                                            <span className="w-100 d-flex justify-content-between">
                                                                    <div className="d-flex gap-2">
                                                                    <i className="bi bi-download"></i>
                                                                        Download Policy
                                                                    </div>
                                                                </span>
                                                            </ListGroupItem>

                                                            <ListGroupItem>
                                                                <span className="w-100 d-flex justify-content-between">
                                                                    <div className="d-flex gap-2">
                                                                        <i className="bi bi-file-text"></i>
                                                                        Send Reminder
                                                                    </div>
                                                                </span>
                                                            </ListGroupItem>

                                                            <ListGroupItem
                                                            disabled={policy?.markedForDeletion}
                                                            onClick={(e)=>handlePolicyDelete(e,policy)}
                                                            >
                                                                <span className="w-100 d-flex justify-content-between">
                                                                    <div className="d-flex gap-2">
                                                                        <i className="bi bi-file-text"></i>
                                                                        Delete
                                                                    </div>
                                                                </span>
                                                            </ListGroupItem>
                                                        </ListGroup>
                                                    </Card>}

                                                </div>

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
export default AdminUploadedPoliciesTab;