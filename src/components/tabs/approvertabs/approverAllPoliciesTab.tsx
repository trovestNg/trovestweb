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
import dangerElipse from '../../../assets/images/Ellipse-danger.png';

const ApproverAllPoliciesTab: React.FC<any> = ({ handleCreatePolicy }) => {

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


    const getApproverPolicies = async () => {
        setLoading(true)
        try {
            let userInfo = await getUserInfo();
            // console.log({ gotten: userInfo })({ gotten: userInfo })
            if (userInfo) {
                let userName = userInfo?.profile?.sub.split('\\')[1]
                const res = await api.get(`Dashboard/authorizer-policy?userName=${userName}`, `${userInfo.access_token}`);
                if (res?.data) {
                    let allPolicy = res?.data.filter((pol: IPolicy) => !pol.markedForDeletion&&!pol.isDeleted)
                    setPolicies(allPolicy.reverse());
                    setLoading(false)
                } else {
                    // loginUser()
                    // toast.error('Session expired!, You have been logged out!!')
                }
                // console.log({ gotten: userInfo })({ response: res })
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
            // console.log({ gotten: userInfo })({ gotten: userInfo })
            if (userInfo) {
                let userName = userInfo?.profile?.sub.split('\\')[1]
                const res = await api.get(`Dashboard/authorizer-policy?userName=${userName}`, `${userInfo.access_token}`);
                if (res?.data) {

                    setLoading(false)

                    let filtered = res?.data.filter((policy: IPolicy) =>
                        policy.fileName.toLowerCase().includes(query.toLowerCase()) && !policy.markedForDeletion&&!policy.isDeleted ||
                        policy.policyDepartment.toLowerCase().includes(query.toLowerCase())&& !policy.markedForDeletion&&!policy.isDeleted
                    );
                    setPolicies(filtered.reverse());

                } else {
                    // loginUser()
                    // toast.error('Session expired!, You have been logged out!!')
                }
                // console.log({ gotten: userInfo })({ response: res })
            }

        } catch (error) {

        }

    };

    const handleSortByDepartment = async () => {
        // s
        setLoading(true)
        try {
            let userInfo = await getUserInfo();
            // console.log({ gotten: userInfo })({ gotten: userInfo })
            if (userInfo) {
                let userName = userInfo?.profile?.sub.split('\\')[1]
                const res = await api.get(`Dashboard/authorizer-policy?userName=${userName}`, `${userInfo.access_token}`);
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
                // console.log({ gotten: userInfo })({ response: res })
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
    //         const res = await getAllDepartments(`filter?subsidiaryName=FSDH+Merchant+Bank`, `${data?.access_token}`);
    //         // console.log({ gotten: userInfo })({ dataHere: res })

    //         if (res?.data) {
    //             setDepts(res?.data)
    //         } else {

    //         }
    //         // console.log({ gotten: userInfo })({ response: res })
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
            getApproverPolicies();
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
        navigate(`/admn/edit-policy/${policy.id}`)
    }

    const handleUpdate = (e: any, policy: IPolicy) => {
        e.stopPropagation();
        setPolicy(policy);
        setUpdatePolicyModal(true);
        // navigate(`/admn/edit-policy/${policy.id}`)
    }

    const handlePolicyDelete = async (e: any) => {
        e.stopPropagation();
        let userInfo = await getUserInfo();
        if (userInfo) {
            let userName = userInfo?.profile?.sub.split('\\')[1]
            const res = await api.post(`Policy/delete/request`, { "id": policyId, "username": userName }, userInfo?.access_token);
            if (res?.status == 200) {
                toast.success('Delete request sent for approval!');
                setDeteletPolicyModal(false);
                setRefreshData(!refreshData)
            } else {
                toast.error('Failed to delete policy')
            }
        }

    }

    const handleSendReminder = async (e: any, policy: IPolicy) => {
        setLoading(true)
        e.stopPropagation();
        try {
            let userInfo = await getUserInfo();
            if (userInfo) {
                const res = await api.post(`Policy/reminder?policyId=${policy.id}`,
                    { "id": policy.id, authorizerName: `${userInfo.profile.given_name} ${userInfo.profile.family_name}` }, userInfo?.access_token);
                if (res?.status == 200) {
                    setLoading(false)
                    toast.success('Reminder Sent!');
                    setRefreshData(!refreshData)
                } else {
                    toast.error('Error sending reminder!')
                    setLoading(false)
                }
            } else {

            }

        } catch (error) {

        }

    }

    const handleDownloadPolicy = (e: any, pol: IPolicy) => {
        e.stopPropagation();
        // toast.success('Downloading file')
        window.open(pol.url, '_blank');

    }

    const handleRejectPolicy = async (e: any, policy: IPolicy) => {
        setLoading(true)
        e.stopPropagation();
        try {
            let userInfo = await getUserInfo();
            // console.log({ gotten: userInfo })({ gotten: userInfo })
            if (userInfo) {
                const res = await api.post(`Policy/reject`, {
                    "ids": [
                        policy.id
                    ],
                    "authorizerUsername": `${userInfo.profile.given_name} ${userInfo.profile.family_name}`, "comment": 'wrong docs'
                }, userInfo?.access_token)
                if (res?.status == 200) {
                    setLoading(false)
                    toast.success('Policy rejected!');
                    setRefreshData(!refreshData)
                } else {
                    toast.error('Error rejecting policy')
                }
            } else {

            }

        } catch (error) {

        }

    }

    const handleDelete = async (e: any, policy: any) => {
        e.stopPropagation();
        setPolicyId(policy.id)
        setDeteletPolicyModal(true);
    }


    const handleGetAttestersList = (e: any, pol: IPolicy) => {
        e.stopPropagation();
        navigate(`/admn/attesters-list/${pol.id}/${pol.fileName}/${pol.deadlineDate}`);
    }

    const handleGetDefaultersList = (e: any, pol: IPolicy) => {
        e.stopPropagation();
        navigate(`/admn/defaulters-list/${pol.id}/${pol.fileName}/${pol.deadlineDate}`);
    }




    useEffect(() => {
        fetchData();
        // handleGetAllDepts();
    }, [refreshData])

    return (
        <div className="w-100">
            <SureToDeletePolicyModal
                action={(e: any) => handlePolicyDelete(e)}
                show={deletePolicyModal}
                off={() => setDeteletPolicyModal(false)} />

            <UpdatePolicyModal
                show={updatePolicyModal}
                pol={policy}
                off={() => {
                    setUpdatePolicyModal(false);
                    setRefreshData(!refreshData)
                }}
            />

            {/* <RejectReasonModal
                show={rejReasonModal}
                pol={policy}
                off={() => {
                    setRejReasonModal(false);
                }}
            /> */}
            <div className="d-flex w-100 justify-content-between">
                <div className="d-flex gap-4">
                    <div className="d-flex align-items-center gap-2" style={{ position: 'relative' }}>
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
                            variant="primary" style={{ minWidth: '100px', marginRight: '-5px', minHeight: '2.4em' }}>Search</Button>
                    </div>
                    

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
                            <tr className=""><td className="text-center" colSpan={7}><Spinner className="spinner-grow text-primary" /></td></tr>
                        </tbody>
                    </table> :
                        <table className="table table-striped w-100">
                            <thead className="thead-dark">
                                <tr >
                                    <th scope="col" className="bg-primary text-light">#</th>
                                    <th scope="col" className="bg-primary text-light">Policy Title</th>
                                    <th scope="col" className="bg-primary text-light">Initiator</th>
                                    <th scope="col" className="bg-primary text-light">Date Uploaded</th>
                                    <th scope="col" className="bg-primary text-light">Status</th>
                                    <th scope="col" className="bg-primary text-light">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {policies.length <= 0 ? <tr><td className="text-center" colSpan={7}>No Data Available</td></tr> :
                                    policies.map((policy, index) => (
                                        <tr key={index} style={{ cursor: 'pointer' }}
                                            onClick={() => navigate(`/admn/policy/${policy.id}/${policy.isAuthorized}`)}
                                        >
                                            <th scope="row">{index + 1}</th>
                                            <td className="text-primary"><i className="bi bi-file-earmark-pdf text-danger"></i> {`${shortenString(policy.fileName, 40)}`}</td>

                                            <td>{policy.uploadedBy}</td>
                                            <td>{moment(policy.uploadTime).format('MMM DD YYYY')}</td>
                                            <td className={`text-${policy.isAuthorized?'success':!policy.isAuthorized  && !policy.isRejected?'warning':!policy.isAuthorized  && policy.isRejected?'danger':'primary'}`}>
                                                <img src={policy.isAuthorized?successElipse:!policy.isAuthorized  && !policy.isRejected?warningElipse:!policy.isAuthorized  && policy.isRejected?dangerElipse:''} height={'10px'} />
                                                {'  '}
                                                <span >{policy.isAuthorized &&'Approved'}{!policy.isAuthorized  && !policy.isRejected &&'Pending'} {!policy.isAuthorized  && policy.isRejected &&'Rejected'}</span>
                                                {/* : !policy.isAuthorized && ? 'Pending ' : policy.isAuthorized && policy.isRejected?'Rejected':'' */}
                                                {/* <span onClick={(e) => handleShowReasonForRej(e, policy)}>{policy.isRejected && <i className="bi bi-file-earmark-excel text-danger"></i>}</span> */}
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
                                                                    onClick={(e) => handleGetAttestersList(e, policy)}
                                                                >
                                                                    <span className="w-100 d-flex justify-content-between">
                                                                        <div className="d-flex gap-2">
                                                                            <i className="bi bi-clipboard-check"></i>
                                                                            Attesters List
                                                                        </div>

                                                                        {/* <i className="bi bi-chevron-right"></i> */}
                                                                    </span>
                                                                </ListGroupItem>

                                                                <ListGroupItem className="multi-layer"
                                                                    onClick={(e) => handleGetDefaultersList(e, policy)}
                                                                >
                                                                    <span className="w-100 d-flex justify-content-between">
                                                                        <div className="d-flex gap-2">
                                                                            <i className="bi bi-clipboard-x"></i>
                                                                            Defaulters List
                                                                        </div>

                                                                        {/* <i className="bi bi-chevron-right"></i> */}
                                                                    </span>
                                                                </ListGroupItem>

                                                                <ListGroupItem className="multi-layer"
                                                                    
                                                                >
                                                                    <span className="w-100 d-flex justify-content-between">
                                                                        <div className="d-flex gap-2">
                                                                            <i className="bi bi-eye"></i>
                                                                           View Policy
                                                                        </div>

                                                                        <i className="bi bi-chevron-right"></i>
                                                                    </span>
                                                                </ListGroupItem>

                                                                

                                                                <ListGroupItem
                                                                    onClick={(e) => handleDownloadPolicy(e, policy)}

                                                                >
                                                                    <span className="w-100 d-flex justify-content-between">
                                                                        <div className="d-flex gap-2">
                                                                            <i className="bi bi-download"></i>
                                                                           Download
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
                                                                    
                                                                >
                                                                    <span className="w-100 d-flex justify-content-between">
                                                                        <div className="d-flex gap-2">
                                                                            <i className="bi bi-eye"></i>
                                                                            View
                                                                        </div>
                                                                    </span>
                                                                </ListGroupItem>

                                                                <ListGroupItem
                                                                    onClick={(e) => handleDownloadPolicy(e, policy)}

                                                                >
                                                                    <span className="w-100 d-flex justify-content-between">
                                                                        <div className="d-flex gap-2">
                                                                            <i className="bi bi-download"></i>
                                                                           Download
                                                                        </div>
                                                                    </span>
                                                                </ListGroupItem>

{/*                                                                 

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
                                                                </ListGroupItem> */}
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
export default ApproverAllPoliciesTab;