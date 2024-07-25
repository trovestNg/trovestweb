import React, { useEffect, useState } from "react";
import { Badge, Button, Card, Form, FormControl, FormSelect, ListGroup, ListGroupItem, Spinner, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { IPolicy } from "../../../interfaces/policy";
import { IDept } from "../../../interfaces/dept";
import moment from "moment";
import { getPolicies } from "../../../controllers/policy";
import receiptImg from '../../../assets/images/receipt.png';
import { getAllDepartments } from "../../../controllers/department";
import {toast} from 'react-toastify';
import { getUserInfo, loginUser } from "../../../controllers/auth";
import api from "../../../config/api";
import SureToDeletePolicyModal from "../../modals/sureToDeletePolicyModal";
import UpdatePolicyModal from "../../modals/updatePolicyModal"
import AdminRejectedPolicyPagination from "../../paginations/admin/admin-rejected-policy-pagiantion";

const AdminRejectedApprovalsTab: React.FC<any> = ({handleCreatePolicy}) => {
    
    const [refreshData, setRefreshData] = useState(false);
    const navigate = useNavigate();
    const [policies, setPolicies] = useState<IPolicy[]>([]);
    const [depts, setDepts] = useState<IDept[]>([]);
    const [loading, setLoading] = useState(false);
    const [sortByDept, setSortByDept] = useState(false);
    const [bySearch, setBySearch] = useState(false);
    const [selectedDept, setSelectedDept] = useState('');
    const [userSearch, setUserSearch] = useState('')

    const [policy, setPolicy] = useState<IPolicy>();

    const [policyId, setPolicyId] = useState<number>(0)
    const [deletePolicyModal, setDeteletPolicyModal] = useState<boolean>(false);

    const [updatePolicyModal, setUpdatePolicyModal] = useState<boolean>(false);

    const [query, setQuery] = useState<string>('');
    const [sortCriteria, setSortCriteria] = useState<string>('name');


    const getUploadedPolicies = async () => {
        setLoading(true)
        try {
            let userInfo = await getUserInfo();
           
            if(userInfo){
                let userName = userInfo?.profile?.sub.split('\\')[1]
                const res = await api.get(`Dashboard/initiator-policy?userName=${userName}`, `${userInfo.access_token}`);
                
                if (res?.data) {
                    let rejectedPolicies =  res?.data.filter((policy:IPolicy)=>policy.isRejected && !policy.markedForDeletion)
                    setPolicies(rejectedPolicies);
                    setLoading(false)
                } else {
                    // loginUser()
                    // toast.error('Session expired!, You have been logged out!!')
                }
                
            }
           
        } catch (error) {

        }
    }

    // const handleGetDepts = async () => {
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

    const handleSearch = () => {
        
        setBySearch(true);
        setRefreshData(!refreshData)

    }

    const handleSearchByPolicyNameOrDept = async () => {
        // toast.error('Searching by name of dept or title!')
        setLoading(true)
        try {
            let userInfo = await getUserInfo();
            // // console.log({ gotten: userInfo })({ gotten: userInfo })
            if (userInfo) {
                let userName = userInfo?.profile?.sub.split('\\')[1]
                const res = await api.get(`Dashboard/initiator-policy?userName=${userName}`, `${userInfo.access_token}`);
                if (res?.data) {

                    setLoading(false)

                    let filtered = res?.data.filter((policy: IPolicy) =>
                        policy.fileName.toLowerCase().includes(query.toLowerCase()) && policy.isRejected && !policy.markedForDeletion
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

    const handleDeptSelection = (val: string) => {
        setSelectedDept(val);
        setSortByDept(true)
        setRefreshData(!refreshData)
    }

    const handleClick = (e: any) => {
        e.stopPropagation();
      
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


    useEffect(() => {
        fetchData();
        // handleGetDepts();
    }, [refreshData])

    const handleEdit = (e: any, policy: IPolicy) => {
        e.stopPropagation();
        navigate(`/admin/edit-policy/${policy.id}`)
    }

    const handleClear = () => {
        setBySearch(false);
        setQuery('')
        setRefreshData(!refreshData)
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
        if(userInfo){
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
        if(userInfo){
            let userName = userInfo?.profile?.sub.split('\\')[1]

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
        // toast.success('Downloading file')
        window.open(pol.url, '_blank');

    }

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

            <div className="d-flex w-100 justify-content-between">
                <div className="d-flex gap-4">
                <div className="d-flex align-items-center gap-2" style={{ position: 'relative' }}>
                        <FormControl
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search by Name of policy..."
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
                                <th scope="col" className="bg-primary text-light">Rejected By</th>
                                <th scope="col" className="bg-primary text-light">Reason for Rejection</th>
                                <th scope="col" className="bg-primary text-light">Date Rejected</th>
                                <th scope="col" className="bg-primary text-light">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className=""><td className="text-center" colSpan={5}><Spinner className="spinner-grow text-primary" /></td></tr>
                        </tbody>
                    </table> :
                       <AdminRejectedPolicyPagination data={policies} refData={() => setRefreshData(!refreshData)}/>
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
export default AdminRejectedApprovalsTab;