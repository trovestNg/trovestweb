import React, { useEffect, useState } from "react";
import { Badge, Button, Form, FormControl, FormSelect, Spinner, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { IUserPolicy } from "../../../interfaces/user";
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

const UserNotAttestedPoliciesTab: React.FC<any> = () => {
    const [refreshData, setRefreshData] = useState(false);
    const navigate = useNavigate();
    const [policies, setPolicies] = useState<IUserPolicy[]>([]);
    const [depts, setDepts] = useState<IDept[]>([]);
    const [loading, setLoading] = useState(false);

    const [sortByDept, setSortByDept] = useState(false);
    const [searchByName, setBySearch] = useState(false);
    const [query, setQuery] = useState<string>('');
    const [sortCriteria, setSortCriteria] = useState<string>('name');


    const getAllPolicies = async () => {
        setLoading(true)
        try {
            let userInfo = await getUserInfo();
            let userName = userInfo?.profile?.sub.split('\\')[1]
            const res = await api.get(`Policy/user-policy?userName=${userName}`, `${userInfo?.access_token}`);
            if (res?.data) {
                let unAttested = res?.data.filter((policy: IUserPolicy) => !policy.isAttested && !policy.isDeleted);
                setPolicies(unAttested);
                setLoading(false)
            }

        } catch (error) {
            // console.log({ gotten: userInfo })(error)
        }


    }

    const handleSearchByPolicyNameOrDept = async () => {
        setLoading(true)
        try {
            let userInfo = await getUserInfo();
            let userName = userInfo?.profile?.sub.split('\\')[1]
            const res = await api.get(`Policy/user-policy?userName=${userName}`, `${userInfo?.access_token}`);
            if (res?.data) {
                let unAttested = res?.data.filter((policy: IUserPolicy) => !policy.isAttested && !policy.isDeleted);

                let filtered = unAttested.filter((policy: IUserPolicy) =>
                    policy.fileName.toLowerCase().includes(query.toLowerCase()) ||
                    policy.policyDepartment.toLowerCase().includes(query.toLowerCase())
                );
                setPolicies(filtered);
                setLoading(false)
            }

        } catch (error) {
            // console.log({ gotten: userInfo })(error)
        }


    }



    // const handleSortByDepartment = async () => {
    //     // toast.error('Sorting by name of dept! :'+sortCriteria.toLowerCase())
    //     setLoading(true)
    //     try {
    //         let userInfo = await getUserInfo();
    //         // console.log({ gotten: userInfo })({ gotten: userInfo })
    //         if (userInfo) {
    //             const res = await api.get(`Policy/user-policy?userName=${userName}`, `${userInfo.access_token}`);
    //             if (res?.data) {

    //                 setLoading(false)

    //                 let filtered = res?.data.filter((policy: IUserPolicy) =>
    //                     policy.policyDepartment.toLowerCase().includes(sortCriteria.toLowerCase())
    //                 );
    //                 setPolicies(filtered);

    //             } else {
    //                 // loginUser()
    //                 // toast.error('Session expired!, You have been logged out!!')
    //             }
    //             // console.log({ gotten: userInfo })({ response: res })
    //         }

    //     } catch (error) {

    //     }

    // };

    const handleSearch = () => {
        setBySearch(true);
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
            // handleSortByDepartment()
        } else {
            getAllPolicies();
        }

    }


    useEffect(() => {
        fetchData();
        // handleGetAllDepts();
    }, [refreshData])

    return (
        <div className="w-100">
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
                    {/* <Form.Select onChange={(e) => handleDeptSelection(e.currentTarget.value)} className="custom-select" style={{ maxWidth: '170px' }}>
                    <option value={'all'}>Select Department</option>
                        {
                            depts.map((dept) => <option key={dept.id} value={dept.name}>{dept.name}</option>)
                        }
                    </Form.Select> */}

                </div>
                {/* <div className="">
                    <Button variant="primary" style={{ minWidth: '100px' }}>Create New Policy</Button>
                </div> */}
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
                        <table className="table table-striped border border-1 w-100">
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
                                {policies.length <= 0 ? <tr>
                                    <td className="text-center" colSpan={5}>
                                        <img src={receiptImg} height={85} />
                                        <p className="p-0 m-0 text-primary" style={{ fontFamily: 'title' }}>
                                            {sortByDept || searchByName ? '' : 'You have attested all policies'}
                                        </p>
                                        <p >
                                            {
                                                sortByDept || searchByName ? 'No Data available' : ' You are up to date all all polices please check back from time to time to stay updated on these polices'
                                            }

                                        </p>
                                    </td></tr> :
                                    policies.map((policy, index) => (
                                        <tr key={index} style={{ cursor: 'pointer' }}
                                            onClick={() => navigate(`/policy-portal/policy/false/${policy.id}`)}
                                        >
                                            <th scope="row">{index + 1}</th>
                                            <td><i className="bi bi-file-earmark-pdf text-danger"></i> {policy.fileName}</td>
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
export default UserNotAttestedPoliciesTab;