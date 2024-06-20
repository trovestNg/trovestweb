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
import SureToDeletePolicyModal from "../../modals/sureToDeletePolicyModal";
import UpdatePolicyModal from "../../modals/updatePolicyModal";
import { shortenString } from "../../../util";

const AdminDeletedPoliciesTab: React.FC<any> = ({ handleCreatePolicy }) => {
    // const userDat = localStorage.getItem('loggedInUser') || '';
    // const data = JSON.parse(userDat);
    // const userName = data?.profile?.sub.split('\\').pop();
    const [refreshData, setRefreshData] = useState(false);
    const navigate = useNavigate();

    const [policies, setPolicies] = useState<IPolicy[]>([]);
    const [policy, setPolicy] = useState<IPolicy>();

    const [depts, setDepts] = useState<IDept[]>([]);
    const [loading, setLoading] = useState(false);

    const [sortByDept, setSortByDept] = useState(false);
    const [searchByName, setBySearch] = useState(false);

    const [selectedDept, setSelectedDept] = useState('');
    const [userSearch, setUserSearch] = useState('')

    const [policyId, setPolicyId] = useState<number>(0)
    const [deletePolicyModal, setDeteletPolicyModal] = useState<boolean>(false);

    const [updatePolicyModal, setUpdatePolicyModal] = useState<boolean>(false);

    const [query, setQuery] = useState<string>('');
    const [sortCriteria, setSortCriteria] = useState<string>('name');


    const getInitiatorPolicies = async () => {
        setLoading(true)
        try {
            let userInfo = await getUserInfo();
            console.log({ gotten: userInfo })
            if (userInfo) {
                let userInfo = await getUserInfo();
            let userName = userInfo?.profile?.sub.split('\\')[1]
                const res = await api.get(`Dashboard/initiator-policy?userName=${userName}`, `${userInfo?.access_token}`);
                if (res?.data) {
                    let allPolicy = res?.data.filter((pol: IPolicy) => pol.isDeleted)
                    setPolicies(allPolicy.reverse());
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



    //sdfdsds

    const handleSearchByPolicyNameOrDept = async () => {
        // toast.error('Searching by name of dept or title!')
        setLoading(true)
        try {
            let userInfo = await getUserInfo();
            console.log({ gotten: userInfo })
            if (userInfo) {
                let userInfo = await getUserInfo();
            let userName = userInfo?.profile?.sub.split('\\')[1]
                const res = await api.get(`Dashboard/initiator-policy?userName=${userName}`, `${userInfo?.access_token}`);
                if (res?.data) {

                    setLoading(false)

                    let filtered = res?.data.filter((policy: IPolicy) =>
                        policy.fileName.toLowerCase().includes(query.toLowerCase()) && policy.isDeleted||
                        policy.policyDepartment.toLowerCase().includes(query.toLowerCase()) && policy.isDeleted
                    );
                    setPolicies(filtered.reverse());

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
                let userInfo = await getUserInfo();
            let userName = userInfo?.profile?.sub.split('\\')[1]
                const res = await api.get(`Dashboard/initiator-policy?userName=${userName}`, `${userInfo?.access_token}`);
                if (res?.data) {

                    setLoading(false)

                    let filtered = res?.data.filter((policy: IPolicy) =>
                        policy.policyDepartment.toLowerCase().includes(sortCriteria.toLowerCase())
                        && !policy.markedForDeletion
                    );
                    setPolicies(filtered.reverse());

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
        setSortByDept(false);
        setRefreshData(!refreshData)
    }

    const handleClear = () => {
        setBySearch(false);
        setQuery('')
        setRefreshData(!refreshData)
    }




    // const handleGetAllDepts = async () => {
    //     // setLoading(true)
    //     try {
    //         let userInfo = await getUserInfo();
    //         let userName = userInfo?.profile?.sub.split('\\')[1]
    //         const res = await getAllDepartments(`filter?subsidiaryName=FSDH+Merchant+Bank`, `${userInfo?.access_token}`);
    //         console.log({ dataHere: res })

    //         if (res?.data) {
    //             setDepts(res?.data)
    //         } else {

    //         }
    //         console.log({ response: res })
    //     } catch (error) {

    //     }

    // }

    const handleDeptSelection = (val: string) => {
        if (val == 'all') {
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
            getInitiatorPolicies();
        }

    }


    useEffect(() => {
        fetchData();
        // handleGetAllDepts();
    }, [refreshData])


    //dsfsfdsf

    const handleClick = (e: any) => {
        e.stopPropagation();
        toast.error('hii')
    }

    const handleEdit = (e: any, policy: IPolicy) => {
        e.stopPropagation();
        navigate(`/admin/edit-policy/${policy.id}`)
    }

    const handleUpdate = (e: any, policy: IPolicy) => {
        e.stopPropagation();
        setPolicy(policy);
        setUpdatePolicyModal(true);
        // navigate(`/admin/edit-policy/${policy.id}`)
    }

    const handlePolicyDelete = async (e: any) => {
        e.stopPropagation();
        let userInfo = await getUserInfo();
            if (userInfo) {
                const res = await api.post(`Policy/delete/request`, { "id": policyId, "username": "majadi" }, userInfo?.access_token);
                if (res?.status == 200) {
                    toast.success('Delete request sent for approval!');
                    setDeteletPolicyModal(false);
                    setRefreshData(!refreshData)
                } else {
                    toast.error('Failed to delete policy')
                }
            }
       
    }

    const handleSendAuthorizationReminder = async (e: any, policy: IPolicy) => {
        e.stopPropagation();
        let userInfo = await getUserInfo();
            if (userInfo) {
                const res = await api.post(`Policy/nudge-authorizer?policyId=${policy.id}`, { "policyId": policy.id }, userInfo?.access_token);
        if (res?.status == 200) {
            toast.success('Reminder sent!');
            setRefreshData(!refreshData)
        } else {
            toast.error('Error sending reminder')
        }
            }

        
    }

    const handleDelete = async (e: any, policy: any) => {
        e.stopPropagation();
        setPolicyId(policy.id)
        setDeteletPolicyModal(true);
    }


    const handleGetAttestersList = (e: any, pol: IPolicy) => {
        e.stopPropagation();
        navigate(`/admin/attesters-list/${pol.id}`);
    }

    const handleGetDefaultersList = (e: any, pol: IPolicy) => {
        e.stopPropagation();
        navigate(`/admin/defaulters-list/${pol.id}`);
    }

    const handleDownloadPolicy = (e: any, pol: IPolicy) => {
        e.stopPropagation();
        toast.success('Downloading file')
        
    }

    


    useEffect(() => {
        fetchData();
        // handleGetAllDepts();
    }, [refreshData])

    return (
        <div className="w-100">
            <SureToDeletePolicyModal 
            action={(e:any)=>handlePolicyDelete(e)} 
            show={deletePolicyModal} 
            off={()=>setDeteletPolicyModal(false)}/>

            <UpdatePolicyModal 
            show={updatePolicyModal} 
            pol={policy}
            off={()=>{
                setUpdatePolicyModal(false);
                setRefreshData(!refreshData)
            }}
            />
            <div className="d-flex w-100 justify-content-between">
                <div className="d-flex gap-4">
                    <div className="d-flex align-items-center" style={{ position: 'relative' }}>
                        <FormControl
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search by Name, Department..."
                            value={query}
                            className="py-2" style={{ minWidth: '350px' }} />
                        <i
                            className="bi bi-x-lg"
                            onClick={handleClear}
                            style={{ marginLeft: '310px', display: query == '' ? 'none' : 'flex', cursor: 'pointer', float: 'right', position: 'absolute' }}></i>

                        <Button
                            disabled={query == ''}
                            onClick={() => handleSearch()}

                            variant="primary" style={{ minWidth: '100px', marginLeft: '-5px' }}>Search</Button>
                    </div>
                    {/* <Form.Select onChange={(e) => handleDeptSelection(e.currentTarget.value)} className="custom-select"
                        style={{ maxWidth: '170px' }}>
                        <option value={'all'}>Select Department</option>
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
                                <th scope="col" className="bg-primary text-light">Initiator</th>
                                <th scope="col" className="bg-primary text-light">Department</th>
                                <th scope="col" className="bg-primary text-light">Date Deleted</th>
                                <th scope="col" className="bg-primary text-light">Action</th>
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
                                <th scope="col" className="bg-primary text-light">Policy Title</th>
                                <th scope="col" className="bg-primary text-light">Initiator</th>
                                <th scope="col" className="bg-primary text-light">Department</th>
                                <th scope="col" className="bg-primary text-light">Date Deleted</th>
                                <th scope="col" className="bg-primary text-light">Action</th>
                            </tr>
                        </thead>
                            <tbody>
                                {policies.length <= 0 ? <tr><td className="text-center" colSpan={7}>No Data Available</td></tr> :
                                    policies.map((policy, index) => (
                                        <tr key={index} style={{ cursor: 'pointer' }}
                                            onClick={() => navigate(`/admin/policy/${policy.id}/${policy.isAuthorized}`)}
                                        >
                                            <th scope="row">{index + 1}</th>
                                            <td><i className="bi bi-file-earmark-pdf text-danger"></i> {`${shortenString(policy.fileName, 40)}`}</td>

                                            <td>{policy.uploadedBy}</td>
                                            <td>{policy.policyDepartment}</td>
                                            <td>{moment(policy.deleteRequestedTime).format('MMM DD YYYY')}</td>
                                            {/* <td className={`text-${policy.isAuthorized ? 'success' : 'warning'}`}>
                                                <img src={policy.isAuthorized ? successElipse : warningElipse} height={'10px'} />
                                                {'  '}
                                                <span >{policy.isAuthorized ? 'Approved' : 'Pending'}</span>
                                            </td> */}
                                            <td className="table-icon">
                                                <i className=" bi bi-three-dots"></i>
                                                <div className="content ml-5" style={{ position: 'relative' }}>
                                                    {
                                                        policy.isAuthorized &&
                                                        <Card className="p-2  shadow-sm rounded border-0"
                                                            style={{ minWidth: '15em', marginLeft: '-10em', position: 'absolute' }}>
                                                            <ListGroup>
                                                                <ListGroupItem className="multi-layer"
                                                                   onClick={(e) => handleGetAttestersList(e, policy)}
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
                                                                                    onClick={(e) => handleGetAttestersList(e, policy)}
                                                                                >
                                                                                    <span className="w-100 d-flex justify-content-between">
                                                                                        <div className="d-flex gap-2">
                                                                                            <i className="bi bi-file-text"></i>
                                                                                            View List
                                                                                        </div>
                                                                                    </span>
                                                                                </ListGroupItem>

                                                                                {/* <ListGroupItem>
                                                                                    <span className="w-100 d-flex justify-content-between">
                                                                                        <div className="d-flex gap-2">
                                                                                            <i className="bi bi-download"></i>
                                                                                            Download List
                                                                                        </div>
                                                                                    </span>
                                                                                </ListGroupItem> */}
                                                                            </ListGroup>
                                                                        </Card>
                                                                    </div>
                                                                </ListGroupItem>

                                                                <ListGroupItem className="multi-layer"
                                                                onClick={(e) => handleGetDefaultersList(e, policy)}
                                                                >
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
                                                                                <ListGroupItem
                                                                                
                                                                                onClick={(e) => handleGetDefaultersList(e, policy)}
                                                                                >
                                                                                    <span className="w-100 d-flex justify-content-between">
                                                                                        <div className="d-flex gap-2">
                                                                                            <i className="bi bi-file-text"></i>
                                                                                            View List
                                                                                        </div>
                                                                                    </span>
                                                                                </ListGroupItem>

                                                                                {/* <ListGroupItem>
                                                                                    <span className="w-100 d-flex justify-content-between">
                                                                                        <div className="d-flex gap-2">
                                                                                            <i className="bi bi-download"></i>
                                                                                            Download List
                                                                                        </div>
                                                                                    </span>
                                                                                </ListGroupItem> */}
                                                                            </ListGroup>
                                                                        </Card>
                                                                    </div>
                                                                </ListGroupItem>

                                                                <ListGroupItem
                                                                onClick={(e) => handleUpdate(e, policy)}
                                                                >
                                                                    <span className="w-100 d-flex justify-content-between">
                                                                        <div className="d-flex gap-2">
                                                                            <i className="bi bi-calendar-event"></i>
                                                                            Update Deadline
                                                                        </div>
                                                                    </span>
                                                                </ListGroupItem>

                                                                <ListGroupItem
                                                                    disabled={policy?.markedForDeletion}
                                                                    onClick={(e) => handleDelete(e, policy)}
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
                                                                    onClick={(e) => handleEdit(e, policy)}
                                                                >
                                                                    <span className="w-100 d-flex justify-content-between">
                                                                        <div className="d-flex gap-2">
                                                                            <i className="bi bi-file-text"></i>
                                                                            Edit Policy
                                                                        </div>
                                                                    </span>
                                                                </ListGroupItem>

                                                                <ListGroupItem
                                                                onClick={(e) => handleDownloadPolicy(e, policy)}
                                                               
                                                                >
                                                                    <span className="w-100 d-flex justify-content-between">
                                                                        <div className="d-flex gap-2">
                                                                            <i className="bi bi-download"></i>
                                                                            Download Policy
                                                                        </div>
                                                                    </span>
                                                                </ListGroupItem>

                                                                <ListGroupItem
                                                                onClick={(e)=>handleSendAuthorizationReminder(e,policy)}
                                                                >
                                                                    <span className="w-100 d-flex justify-content-between">
                                                                        <div className="d-flex gap-2">
                                                                            <i className="bi bi-file-text"></i>
                                                                            Send Reminder
                                                                        </div>
                                                                    </span>
                                                                </ListGroupItem>

                                                                <ListGroupItem
                                                                    disabled={policy?.markedForDeletion}
                                                                    onClick={(e) => handleDelete(e, policy)}
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
            {/* {
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
                    </div>} */}
        </div>
    )

}
export default AdminDeletedPoliciesTab;