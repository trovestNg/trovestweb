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
import SureToDeletePolicyModal from "../../modals/sureToDeletePolicyModal";
import UpdatePolicyModal from "../../modals/updatePolicyModal";
import AuthorizerApprovedPolicyPagination from "../../paginations/authorizer/authorizer-approved-policy-pagiantion";


{/* <SureToDeletePolicyModal 
            action={(e:any)=>handlePolicyDelete(e)} 
            show={deletePolicyModal} 
            off={()=>setDeteletPolicyModal(false)}/>

            <UpdatePolicyModal 
            show={updatePolicyModal} 
            pol={policy}
            off={()=>{
                setUpdatePolicyModal(false);
                setRefreshData(!refreshData)
            }} */}

const ApproverApprovedPoliciesTab: React.FC<any> = ({ handleCreatePolicy }) => {
    
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
            // console.log({ gotten: userInfo })({ gotten: userInfo })
            if (userInfo) {
                let userName = userInfo?.profile?.sub.split('\\')[1]
                const res = await api.get(`Dashboard/authorizer-policy?userName=${userName}`, `${userInfo.access_token}`);
                
                if (res?.data) {
                    let approvedPolicies =  res?.data.filter(
                        (policy:IPolicy)=>policy.isAuthorized && !policy.markedForDeletion && !policy.isDeleted && !policy.isRejected)
                    setPolicies(approvedPolicies);
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
                        policy.fileName.toLowerCase().includes(query.toLowerCase()) &&policy.isAuthorized&&!policy.markedForDeletion ||
                        policy.policyDepartment.toLowerCase().includes(query.toLowerCase())&&policy.isAuthorized &&!policy.markedForDeletion
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
                    &&!policy.markedForDeletion &&policy.isAuthorized
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
        setSortByDept(false);
        setQuery('')
        setRefreshData(!refreshData)
    }




    const handleGetAllDepts = async () => {
        // setLoading(true)
        try {
            let userInfo = await getUserInfo();
            if(userInfo){
                const res = await getAllDepartments(`filter?subsidiaryName=FSDH+Merchant+Bank`, `${userInfo?.access_token}`);
            // console.log({ gotten: userInfo })({ dataHere: res })

            if (res?.data) {
                setDepts(res?.data)
            } else {

            }
            }
        } catch (error) {

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
        handleGetAllDepts();
    }, [refreshData])

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

    // const handleSendAuthorizationReminder = async (e: any,policy:IPolicy) => {
    //     e.stopPropagation();
    //     const res = await api.post(`Policy/nudge-authorizer?policyId=${policy.id}`,{"policyId" :policy.id}, data?.access_token);
    //     if (res?.status == 200) {
    //         toast.success('Reminder sent!');
    //         setRefreshData(!refreshData)
    //     } else {
    //         toast.error('Error sending reminder')
    //     }
    // }

    const handleDelete = async (e: any, policy: any) => {
        e.stopPropagation();
        setPolicyId(policy.id)
        setDeteletPolicyModal(true);
    }


    const handleGetAttestersList = (e: any, pol: IPolicy) => {
        e.stopPropagation();
        navigate(`/admn/attesters-list/${pol.id}`);
    }

    const handleViewPolicy = (e: any, pol: IPolicy) => {
        e.stopPropagation();
        navigate(`/admn/policy/${pol.id}`);
    }

    const handleGetDefaultersList = (e: any, pol: IPolicy) => {
        e.stopPropagation();
        navigate(`/admn/defaulters-list/${pol.id}`);
    }

    const handleDownloadPolicy = (e: any, pol: IPolicy) => {
        e.stopPropagation();
        // toast.success('Downloading file')
        window.open(pol.url, '_blank');

    }

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
                                <th scope="col" className="bg-primary text-light">Initiator</th>
                                {/* <th scope="col" className="bg-primary text-light">Authorizer</th> */}
                                <th scope="col" className="bg-primary text-light">Deadline Date</th>
                                <th scope="col" className="bg-primary text-light">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className=""><td className="text-center" colSpan={5}><Spinner className="spinner-grow text-primary" /></td></tr>
                        </tbody>
                    </table> :
                        <AuthorizerApprovedPolicyPagination data={policies} refData={()=>setRefreshData(!refreshData)}/>
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
export default ApproverApprovedPoliciesTab;