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
import dangerElipse from '../../../assets/images/Ellipse-danger.png';
import SureToDeletePolicyModal from "../../modals/sureToDeletePolicyModal";
import UpdatePolicyModal from "../../modals/updatePolicyModal";
import { shortenString } from "../../../util";
import RejectReasonModal from "../../modals/rejectReasonModal";
import AdminAllPolicyPagination from "../../paginations/admin/admin-all-policy-pagiantion";

const AdminUploadedPoliciesTab: React.FC<any> = ({ handleCreatePolicy }) => {
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
    const [rejReasonModal, setRejReasonModal] = useState<boolean>(false);

    const [query, setQuery] = useState<string>('');
    const [sortCriteria, setSortCriteria] = useState<string>('name');


    const getInitiatorPolicies = async () => {
        setLoading(true)

       
            try {
                let userInfo = await getUserInfo();
                if (userInfo) {
            let userName = userInfo?.profile?.sub.split('\\')[1]
                    const res = await api.get(`Dashboard/initiator-policy?userName=${userName}`, `${userInfo.access_token}`);
                    if (res?.data) {
                        let allPolicy = res?.data.filter((pol: IPolicy) => !pol.markedForDeletion)
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
                const res = await api.get(`Dashboard/initiator-policy?userName=${userName}`, `${userInfo.access_token}`);
                if (res?.data) {
                    setLoading(false)
                    let filtered = res?.data.filter((policy: IPolicy) =>
                        policy.fileName.toLowerCase().includes(query.toLowerCase()) && !policy.markedForDeletion ||
                        policy.policyDepartment.toLowerCase().includes(query.toLowerCase()) && !policy.markedForDeletion
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
                const res = await api.get(`Dashboard/initiator-policy?userName=${userName}`, `${userInfo.access_token}`);
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




    const handleGetAllDepts = async () => {
        // setLoading(true)
        let userInfo = await getUserInfo();
            // console.log({ gotten: userInfo })({ gotten: userInfo })
            if (userInfo) {
                try {
                    const res = await getAllDepartments(`filter?subsidiaryName=FSDH+Merchant+Bank`, `${userInfo?.access_token}`);
                    // console.log({ gotten: userInfo })({ dataHere: res })
        
                    if (res?.data) {
                        setDepts(res?.data)
                    } else {
        
                    }
                    // console.log({ gotten: userInfo })({ response: res })
                } catch (error) {
        
                }
            }
        

    }

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

    const handleShowReasonForRej = (e: any, policy: IPolicy) => {
        e.stopPropagation();
        setPolicy(policy);
        setRejReasonModal(true);
        // navigate(`/admin/edit-policy/${policy.id}`)
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
        navigate(`/admin/attesters-list/${pol.id}/${pol.fileName}/${pol.deadlineDate}`);
    }

    const handleGetDefaultersList = (e: any, pol: IPolicy) => {
        e.stopPropagation();
        navigate(`/admin/defaulters-list/${pol.id}/${pol.fileName}/${pol.deadlineDate}`);
    }

    const handleDownloadPolicy = (e: any, pol: IPolicy) => {
        e.stopPropagation();
        // toast.success('Downloading file')
        window.open(pol.url, '_blank');

    }




    // useEffect(() => {
    //     fetchData();
    //     handleGetAllDepts();
    // }, [refreshData])

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

            <RejectReasonModal
                show={rejReasonModal}
                pol={policy}
                off={() => {
                    setRejReasonModal(false);
                }}
            />
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
                            variant="primary" style={{ minWidth: '100px', marginRight: '-5px', minHeight:'2.4em' }}>Search</Button>
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
                        <AdminAllPolicyPagination data={policies} refData={()=>setRefreshData(!refreshData)}/>
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
export default AdminUploadedPoliciesTab;