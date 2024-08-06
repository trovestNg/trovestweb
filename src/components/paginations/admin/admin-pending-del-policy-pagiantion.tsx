import React, { useState } from "react";
import moment from "moment";
import { shortenString } from "../../../util";
import { useNavigate } from "react-router-dom";
import successElipse from '../../../assets/images/Ellipse-success.png';
import warningElipse from '../../../assets/images/Ellipse-warning.png';
import dangerElipse from '../../../assets/images/Ellipse-danger.png';
import { Card, ListGroup, ListGroupItem, OverlayTrigger, Pagination, Tooltip } from "react-bootstrap";
import { IPolicy } from "../../../interfaces/policy";
import { getUserInfo } from "../../../controllers/auth";
import api from "../../../config/api";
import { toast } from "react-toastify";
import SureToDeletePolicyModal from "../../modals/sureToDeletePolicyModal";
import UpdatePolicyModal from "../../modals/updatePolicyModal";
import RejectReasonModal from "../../modals/rejectReasonModal";

const AdminPendingDelPolicyPagination: React.FC<any> = ({ data, refData }) => {
    console.log(data.length)
    const navigate = useNavigate();
    const totalPages = Math.ceil(data.length / 10);
    const [currentPage, setCurrentPage] = useState(1);

    const indexOfLastItem = currentPage * 10;
    const indexOfFirstItem = indexOfLastItem - 10;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

    const [policy, setPolicy] = useState<IPolicy>();
    const [policyId, setPolicyId] = useState<number>(0)

    const [updatePolicyModal, setUpdatePolicyModal] = useState<boolean>(false);
    const [deletePolicyModal, setDeteletPolicyModal] = useState<boolean>(false);
    const [rejReasonModal, setRejReasonModal] = useState<boolean>(false);

    const handleGetAttestersList = (e: any, pol: IPolicy) => {
        e.stopPropagation();
        navigate(`/admin/attesters-list/${pol.id}?deadlineDate=${encodeURIComponent(pol.deadlineDate)}&fileName=${encodeURIComponent(pol.fileName)}`);
    }

    const handleGetDefaultersList = (e: any, pol: IPolicy) => {
        e.stopPropagation();
        navigate(`/admin/defaulters-list/${pol.id}?deadlineDate=${encodeURIComponent(pol.deadlineDate)}&fileName=${encodeURIComponent(pol.fileName)}`);
    }

    const handleUpdate = (e: any, policy: IPolicy) => {
        e.stopPropagation();
        setPolicy(policy);
        setUpdatePolicyModal(true);
        // navigate(`/admin/edit-policy/${policy.id}`)
    }

    const handleDownloadPolicy = (e: any, pol: IPolicy) => {
        e.stopPropagation();
        // toast.success('Downloading file')
        window.open(pol.url, '_blank');

    }

    const handleDelete = async (e: any, policy: any) => {
        e.stopPropagation();
        setPolicyId(policy.id)
        setDeteletPolicyModal(true);
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
                refData()
            } else {
                toast.error('Failed to delete policy')
            }
        }

    }

    const handleEdit = (e: any, policy: IPolicy) => {
        e.stopPropagation();
        navigate(`/admin/edit-policy/${policy.id}`)
    }

    const handleSendAuthorizationReminder = async (e: any, policy: IPolicy) => {
        e.stopPropagation();
        let userInfo = await getUserInfo();
        if (userInfo) {
            const res = await api.post(`Policy/nudge-authorizer?policyId=${policy.id}`, { "policyId": policy.id }, userInfo?.access_token);
            if (res?.status == 200) {
                toast.success('Reminder sent!');
                refData()
            } else {
                toast.error('Error sending reminder')
            }
        }


    }

    let handleSubName = (subsidiaryArray: any) => {
        let names: string[] = subsidiaryArray.map((subs: any) => subs.subsidiaryName);
        // console.log({subName : })
        let shortened = shortenString(names.toString(), 30)
        return shortened
    }

    let handleFullSub = (subsidiaryArray: any) => {
        let names: string[] = subsidiaryArray.map((subs: any) => subs.subsidiaryName);
        // console.log({subName : })

        return names.toString()
    }

    const renderTooltip = (props: any) => (
        <Tooltip id="button-tooltip" {...props}>
            <p>{props}</p>
        </Tooltip>
    );

    const handleGroupClick = async (e: any, policy: any) => {
        e.stopPropagation();
        // setPolicyId(policy.id)
        // setDeteletPolicyModal(true);
    }


    const renderPaginationItems = () => {
        const items = [];
        for (let i = 1; i <= totalPages; i++) {
            items.push(
                <Pagination.Item
                    key={i}
                    active={i === currentPage}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </Pagination.Item>
            );
        }
        return items;
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };
    return (
        <div>
            <SureToDeletePolicyModal
                action={(e: any) => handlePolicyDelete(e)}
                show={deletePolicyModal}
                off={() => setDeteletPolicyModal(false)} />

            <UpdatePolicyModal
                show={updatePolicyModal}
                pol={policy}
                off={() => {
                    setUpdatePolicyModal(false);
                    refData()
                }}
            />

            <RejectReasonModal
                show={rejReasonModal}
                pol={policy}
                off={() => {
                    setRejReasonModal(false);
                }}
            />
            <table className="table table-striped w-100">
                <thead className="thead-dark">
                    <tr >
                        <th scope="col" className="bg-primary text-light">#</th>
                        <th scope="col" className="bg-primary text-light">Policy Title</th>
                        <th scope="col" className="bg-primary text-light">Subsidiary</th>
                        <th scope="col" className="bg-primary text-light">Authorizer</th>
                        {/* <th scope="col" className="bg-primary text-light">Department</th> */}
                        <th scope="col" className="bg-primary text-light">Date Deleted</th>
                        <th scope="col" className="bg-primary text-light">Action</th>
                    </tr>
                </thead>
                <tbody>

                    {currentItems.length <= 0 ? <tr><td className="text-center" colSpan={6}>No Data Available</td></tr> :
                        currentItems.map((policy: any, index: number) => (
                            <tr key={index} style={{ cursor: 'pointer' }}
                                onClick={() => navigate(`/admin/view-deleted/${policy.id}`)}
                            >
                                <th scope="row">{index + 1}</th>
                                <td className="text-primary"><i className="bi bi-file-earmark-pdf text-danger"></i> {`${shortenString(policy.fileName, 40)}`}</td>
                                <td>
                                    <OverlayTrigger placement="top" overlay={renderTooltip(handleFullSub(policy?.subsidiaries))}>
                                        <span>{handleSubName(policy?.subsidiaries)}</span>
                                    </OverlayTrigger>
                                </td>
                                <td>{policy.authorizedBy}</td>
                                {/* <td>{policy.policyDepartment}</td> */}
                                <td>{moment(policy.deleteRequestedTime).format('MMM DD YYYY')}</td>
                                {/* <td className={`text-${policy.isAuthorized ? 'success' : 'warning'}`}>
                                                <img src={policy.isAuthorized ? successElipse : warningElipse} height={'10px'} />
                                                {'  '}
                                                <span >{policy.isAuthorized ? 'Approved' : 'Pending'}</span>
                                            </td> */}
                                <td className="table-icon" >
                                    <i className=" bi bi-three-dots" onClick={(e) => e.stopPropagation()}></i>
                                    <div className="content ml-5" style={{ position: 'relative', zIndex: 1500 }}>
                                        {
                                            policy.isAuthorized &&
                                            <Card className="p-2  shadow-sm rounded border-0"
                                                style={{ minWidth: '15em', marginLeft: '-10em', position: 'absolute' }}>
                                                <ListGroup

                                                >
                                                    <ListGroupItem

                                                    >
                                                        <span className="w-100 d-flex justify-content-between">
                                                            <div className="d-flex gap-2">
                                                                <i className="bi bi-eye"></i>
                                                                View Policy
                                                            </div>
                                                        </span>
                                                    </ListGroupItem>

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

                                                    <ListGroupItem
                                                        onClick={(e) => handleSendAuthorizationReminder(e, policy)}
                                                    >
                                                        <span className="w-100 d-flex justify-content-between">
                                                            <div className="d-flex gap-2">
                                                                <i className="bi bi-file-text"></i>
                                                                Send Reminder
                                                            </div>
                                                        </span>
                                                    </ListGroupItem>

                                                    {/* <ListGroupItem
                                                                    disabled={policy?.markedForDeletion}
                                                                    onClick={(e) => handleDelete(e, policy)}
                                                                >
                                                                    <span className="w-100 d-flex justify-content-between">
                                                                        <div className="d-flex gap-2">
                                                                            <i className="bi bi-trash"></i>
                                                                            Delete
                                                                        </div>
                                                                    </span>
                                                                </ListGroupItem> */}
                                                </ListGroup>
                                            </Card>}


                                        {
                                            !policy.isAuthorized &&
                                            <Card className="p-2  shadow-sm rounded border-0"
                                                style={{ minWidth: '15em', marginLeft: '-10em', position: 'absolute' }}>
                                                <ListGroup

                                                >
                                                    <ListGroupItem

                                                    >
                                                        <span className="w-100 d-flex justify-content-between">
                                                            <div className="d-flex gap-2">
                                                                <i className="bi bi-eye"></i>
                                                                View Policy
                                                            </div>
                                                        </span>
                                                    </ListGroupItem>
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
                                                        onClick={(e) => handleSendAuthorizationReminder(e, policy)}
                                                    >
                                                        <span className="w-100 d-flex justify-content-between">
                                                            <div className="d-flex gap-2">
                                                                <i className="bi bi-file-text"></i>
                                                                Send Reminder
                                                            </div>
                                                        </span>
                                                    </ListGroupItem>

                                                    {/* <ListGroupItem
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

            {
                data.length <= 0 ? '' :
                    <div className="d-flex justify-content-between align-items-center">
                        <p className="p-0 m-0">{`Showing Page ${currentPage} of ${totalPages} pages`}</p>
                        {
                            data.length <= 0 ? '' :
                                <Pagination>
                                    <Pagination.First
                                        onClick={() => handlePageChange(1)}
                                        disabled={currentPage === 1} />
                                    <Pagination.Prev
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1} />
                                    {renderPaginationItems()}
                                    <Pagination.Next
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages} />
                                    <Pagination.Last
                                        onClick={() => handlePageChange(totalPages)}
                                        disabled={currentPage === totalPages} />
                                </Pagination>
                        }
                    </div>}
        </div>
    )
}

export default AdminPendingDelPolicyPagination;