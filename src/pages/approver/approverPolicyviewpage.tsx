import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import successIcon from '../../assets/icons/success.png';
import { Document, Page, pdfjs } from "react-pdf";
import { IPolicy } from "../../interfaces/policy";
import { getAPolicy } from "../../controllers/policy";
import { toast } from "react-toastify";
import { getUserInfo, loginUser } from "../../controllers/auth";
import moment from "moment";
import api from "../../config/api";
import RejectReasonModal from "../../components/modals/rejectReasonModal";
import SureToDeletePolicyModal from "../../components/modals/sureToDeletePolicyModal";
import SureToApprovePolicyModal from "../../components/modals/sureToApprovePolicyModal";
import { shortenString } from "../../util";
import DeletePolicyConfModal from "../../components/modals/deletePolicyConfModal";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const ApproverPolicyviewpage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [attestedSuccesmodal, setAttestedSuccessModal] = useState(false);

    const [rejectModal, setRejectModal] = useState(false);
    const [rejReas, setRejReas] = useState('');

    const [policyId, setPolicyId] = useState<number>(0)
    const [deletePolicyModal, setDeteletPolicyModal] = useState<boolean>(false);


    const [sureToApproveModal, setSureToApproveModal] = useState(false);

    const [policy, setPolicy] = useState<IPolicy>();
    const [loading, setLoading] = useState(false);
    const [refreshData, setRefreshData] = useState(false);


    const [scale, setScale] = useState(1.0);
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState(1);


    const handleZoomIn = () => setScale(scale + 0.1);
    const handleZoomOut = () => setScale(scale - 0.1);
    const handleResetZoom = () => setScale(1.0);

    const handleDelete = async () => {
        setDeteletPolicyModal(true);
    }

    const getPolicy = async () => {

        let userInfo = await getUserInfo();
        if (userInfo) {
            let userName = userInfo?.profile?.sub.split('\\')[1]
            try {
                const res = await getAPolicy(`policy/${id}`, `${userInfo?.access_token}`);
                if (res?.data) {
                    setPolicy(res?.data);
                } else {
                    // toast.error('Session expired!, You have been logged out!!');
                    // loginUser();

                }
                // console.log({ gotten: userInfo })({ response: res })
            } catch (error) {

            }
        }

    }

    useEffect(() => {
        getPolicy();
    }, [refreshData])

    const onDocumentLoadSuccess = (numPages: number) => {
        setNumPages(numPages);
    };

    const goToPreviousPage = () => {
        setPageNumber(prevPage => prevPage - 1);
    };

    const goToNextPage = () => {
        if (pageNumber < numPages) {
            setPageNumber(pageNumber + 1);
        }
    };

    const handleApprovePolicy = () => {
        setSureToApproveModal(true)
    }

    const handlePolicyDelete = async () => {
       
        let userInfo = await getUserInfo();
        if (userInfo) {
            let userName = userInfo?.profile?.sub.split('\\')[1]
            const res = await api.post(`Policy/delete/approve`, { "ids": [id], "username": userName }, userInfo?.access_token);
            if (res?.status == 200) {
                toast.success('Policy deleted succesfully!');
                setDeteletPolicyModal(false);
                setRefreshData(!refreshData);
                navigate(-1)
            } else {
                toast.error('Failed to delete policy')
            }
        }
        
    }


    const approvePolicy = async () => {
        setLoading(true)
        try {
            let userInfo = await getUserInfo();
            // console.log({ gotten: userInfo })({ gotten: userInfo })
            if (userInfo) {
                const res = await api.post(`Policy/authorize?policyId=${id}`,
                    { "id": id, authorizerName: `${userInfo.profile.given_name} ${userInfo.profile.family_name}` }, userInfo?.access_token);
                if (res?.status == 200) {
                    setLoading(false)
                    toast.success('Policy approved!');
                    window.location.reload();
                } else {
                    toast.error('Error approving policy')
                }
            } else {

            }

        } catch (error) {

        }

    }

    const handleRejectPolicy = () => {
        setRejectModal(true)
    }
    const rejectPolicy = async () => {
        setLoading(true)
        try {
            let userInfo = await getUserInfo();
            // console.log({ gotten: userInfo })({ gotten: userInfo })
            if (userInfo) {
                const res = await api.post(`Policy/reject`, {
                    "ids": [
                        id
                    ],
                    "authorizerUsername": `${userInfo.profile.given_name} ${userInfo.profile.family_name}`, "comment": rejReas
                }, userInfo?.access_token)
                if (res?.status == 200) {
                    setLoading(false)
                    toast.success('Policy rejected!');
                    setRejectModal(false)
                    setRefreshData(!refreshData);
                    navigate(-1);
                } else {
                    toast.error('Error rejecting policy')
                }
            } else {

            }

        } catch (error) {

        }

    }

    return (
        <div className="">
            <DeletePolicyConfModal 
            action={()=>handlePolicyDelete()} 
            show={deletePolicyModal} 
            off={()=>setDeteletPolicyModal(false)}/>

<SureToApprovePolicyModal 
            action={()=>approvePolicy()} 
            show={sureToApproveModal} 
            loading={loading}
            off={()=>setDeteletPolicyModal(false)}/>

            <div><Button variant="outline border border-2" onClick={() => navigate(-1)}>Go Back</Button></div>
            <div className="w-100 d-flex justify-content-between gap-4">
                <div className="" style={{ minWidth: '70%' }}>
                    <div className="bg-dark mt-2 d-flex justify-content-between px-4 py-2 text-light ">

                        <div className="d-flex gap-3">
                            zoom
                            <i className="bi bi-zoom-out" onClick={handleZoomOut}></i>
                            <i className="bi bi-zoom-in" onClick={handleZoomIn}></i>
                        </div>
                        <div className="gap-3 d-flex w-25 align-items-center justify-content-between">
                            <Button onClick={goToPreviousPage} disabled={pageNumber <= 1} variant="outline text-light" className="p-0 m-0" style={{ cursor: 'pointer' }}><i className="bi bi-chevron-bar-left"></i></Button>
                            <p className="p-0 m-0">{pageNumber}/{numPages}</p>
                            <Button onClick={goToNextPage} disabled={pageNumber >= numPages} variant="outline text-light" className="p-0 m-0" style={{ cursor: 'pointer' }}><i className="bi bi-chevron-bar-right"></i></Button></div>




                        <div>

                        </div>

                    </div>



                    <div className="border border-3 p-3" style={{ height: '80vh', overflow: 'scroll' }}>

                        <Document file={policy?.url} onLoadSuccess={(doc) => onDocumentLoadSuccess(doc.numPages)}>
                            <Page pageNumber={pageNumber} scale={scale} />

                        </Document>


                    </div>

                    {
                    <div className="d-flex justify-content-end px-4 py-2 text-primary ">
                       
                       {/* <div className="d-flex gap-3">
                       zoom
                       <i className="bi bi-zoom-out" onClick={handleZoomOut}></i>
                       <i className="bi bi-zoom-in" onClick={handleZoomIn}></i>
                       </div> */}
                       
                       <div className="gap-3 d-flex w-25 align-items-center justify-content-between">
                           <Button onClick={goToPreviousPage} disabled={pageNumber <= 1} variant="outline border-0" className="p-0 m-0" style={{ cursor: 'pointer' }}>
                            {/* <i className="bi bi-chevron-bar-left"></i> */}
                            Prev
                            </Button>
                           <p className="p-0 m-0">{pageNumber}/{numPages}</p>
                           <Button onClick={goToNextPage} disabled={pageNumber >= numPages} variant="outline border-0" className="p-0 m-0" style={{ cursor: 'pointer' }}>
                            {/* <i className="bi bi-chevron-bar-right"></i> */}
                            Next
                           </Button></div>

                   </div>}

                </div>

                <div className="d-flex flex-column gap-2" style={{ minWidth: '25%' }}>


                    <div className=" shadow shadow-sm border rounded rounded-3 p-3">
                        <p className=" d-flex gap-2 text-primary">
                            <i className="bi bi-file-earmark"></i>
                            File Details
                        </p>

                        <p className=" d-flex gap-2 text-gray p-0 m-0">
                            {/* <i className="bi bi-file-earmark"></i> */}
                            File Name
                        </p>
                        <p className=" d-flex gap-2">
                            {/* <i className="bi bi-file-earmark"></i> */}
                            {
                                policy?.fileName
                            }
                        </p>

                        <p className=" d-flex gap-2 text-grey p-0 m-0">
                            {/* <i className="bi bi-file-earmark"></i> */}
                            Description
                        </p>
                        <p className=" d-flex gap-2" style={{ fontSize: '0.8em' }}>
                            {/* <i className="bi bi-file-earmark"></i> */}
                            {
                            shortenString(policy?policy?.fileName:'', 40)
                            }
                        </p>

                        <p className=" d-flex gap-2 text-grey p-0 m-0">
                            {/* <i className="bi bi-file-earmark"></i> */}
                            Department
                        </p>
                        <p className=" d-flex gap-2">
                            {/* <i className="bi bi-file-earmark"></i> */}
                            {policy?.departmentId}
                        </p>
                        <hr />
                        <div className="d-flex justify-content-between">
                            <div>
                                <p className=" d-flex gap-2 text-grey p-0 m-0">
                                    {/* <i className="bi bi-file-earmark"></i> */}
                                    Date Uploaded
                                </p>
                                <p className=" d-flex gap-2 text-primary">
                                    {/* <i className="bi bi-file-earmark"></i> */}
                                    {moment(policy?.uploadTime).format('MMM DD YYYY')}
                                </p>
                            </div>

                            <div>
                                <p className=" d-flex gap-2 text-danger p-0 m-0">
                                    {/* <i className="bi bi-file-earmark"></i> */}
                                    Deadline Date
                                </p>
                                <p className=" d-flex gap-2 text-primary">
                                    {/* <i className="bi bi-file-earmark"></i> */}
                                    {moment(policy?.deadlineDate).format('MMM DD YYYY')}
                                </p>
                            </div>
                        </div>
                    </div>
                    {policy?.isRejected && <p className="m-0 p-0 mt-3">Reason for Rejection</p>}
                    {
                        policy && policy.isRejected &&
                        <div className="bg-primary text-light rounded rounded-3 p-3" style={{ minHeight: '10em' }}>

                            <p>
                                {policy.comment}
                            </p>
                        </div>
                    }
                    {
                        policy && !policy?.isAuthorized && !policy?.markedForDeletion &&
                        <div className="d-flex mt-4 gap-3">
                            {
                                !policy.isAuthorized &&
                                <Button
                                disabled ={policy.isRejected}
                                variant="success  outline"
                                onClick={handleApprovePolicy}

                            >Approve Policy</Button>}
                            {!policy.isRejected &&
                                <Button
                                variant="border border-danger text-danger outline"
                                onClick={handleRejectPolicy}
                            >Reject Policy</Button>}

                        </div>
                    }

                    {
                    policy?.markedForDeletion  && !policy.isDeleted &&
                        <div className="d-flex mt-4 gap-3">
                            <Button
                                variant="success  outline"
                                onClick={handleDelete}

                            >Approve Deletion</Button>
                            <Button
                                variant="border border-danger text-danger outline"
                                onClick={() => navigate(-1)}
                            >Cancel</Button>

                        </div>
                    }
                </div>

            </div>

            <Modal show={rejectModal} centered>
                <Modal.Header className="d-flex justify-content-between"
                    style={{ fontFamily: 'title' }}>
                    <div></div>
                    <i className="bi bi-x-circle" onClick={() => setRejectModal(false)}></i>
                </Modal.Header>
                <Modal.Body className="" >
                    <div className="d-flex justify-content-center flex-column align-items-center text-danger" style={{ fontSize: '1.2em' }}>
                        <i className="bi bi-x-circle" ></i>
                        <p>Reject</p>
                    </div>

                    <p className="text-center w-100 px-5">
                        Please share the reason for rejecting this policy so that adjustments can be made by the Initiator.
                    </p>


                    <div className="w-100 mt-5 d-flex justify-content-center">
                        <textarea

                            onChange={(e) => setRejReas(e.currentTarget.value)}
                            className="p-2 border rounded border-1 " placeholder="Reason :"
                            style={{
                                marginTop: '5px',
                                minWidth: '450px',
                                minHeight: '10em',
                                boxSizing: 'border-box',
                                lineHeight: '1.5',
                                overflow: 'auto',
                                outline: '0px'
                            }} />
                    </div>
                    <div className="d-flex justify-content-end gap-2 mt-3">
                        <Button onClick={() => {
                            setRejectModal(false)
                            setRejReas('')
                        }} variant="outline border border-1">Cancel</Button>
                        <Button disabled={!rejReas} variant="danger" onClick={rejectPolicy}>Reject</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}
export default ApproverPolicyviewpage;