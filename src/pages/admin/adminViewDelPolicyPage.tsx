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
import UpdatePolicyModal from "../../components/modals/updatePolicyModal";
import SureToDeletePolicyModal from "../../components/modals/sureToDeletePolicyModal";
import { shortenString } from "../../util";
import SureToUnDoDeletePolicyModal from "../../components/modals/sureToUnDoDeletePolicyModal";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const AdminViewDelPolicyPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [attestedSuccesmodal, setAttestedSuccessModal] = useState(false);
    const [loading,setLoading] = useState(false)
    const [policy, setPolicy] = useState<IPolicy>();

    const [updateDeadlineModal, setUpdateDeadlineModal] = useState(false);
    const [confDelModal, setConfDelModal] = useState(false);
    const [confUndoDelModal, setConUndofDelModal] = useState(false);
    const [scale, setScale] = useState(1.0);

    const [ref, setRef] = useState(false);



    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState(1);


    const getPolicy = async () => {
        let userInfo = await getUserInfo();
        if (userInfo) {
            try {
                const res = await getAPolicy(`policy/${id}`, `${userInfo?.access_token}`);
                if (res?.data) {
                    setPolicy(res?.data);
                } else {
                    // toast.error('Session expired!, You have been logged out!!');
                    // loginUser();

                }
                // // console.log({ gotten: userInfo })({ response: res })
            } catch (error) {

            }

        } else {

        }

    }

    useEffect(() => {
        getPolicy();
    }, [ref])

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

    const handleUpdateDeadline = () => {
        setUpdateDeadlineModal(true)
    }

    const offUpdateDeadline = () => {
        setUpdateDeadlineModal(false)
        setRef(!ref)
    }


    const handlePolicyDelete = async (e: any) => {
        setLoading(true)
        try {
            let userInfo = await getUserInfo();
            let userName = userInfo?.profile?.sub.split('\\')[1]
            if (userInfo) {
                const res = await api.post(`Policy/delete/request`, { "id": policy?.id, "username": userName }, userInfo.access_token);
                if (res?.status == 200) {
                    toast.success('Delete request sent for approval!');
                    setConfDelModal(false);
                    setLoading(false)
                    navigate(-1)
                } else {
                    toast.error('Failed to delete policy')
                }
            }

        } catch (error) {

        }
    }

    let handleSubName = (subsidiaryArray: any) => {
        let names: string[] = subsidiaryArray.map((subs: any) => subs.subsidiaryName);
        // console.log({subName : })
        let shortened = shortenString(names.toString(), 30)
        return shortened
    }

    const handleUndoPolicyDelete = async (e: any) => {
        setLoading(true)
        try {
            let userInfo = await getUserInfo();
            let userName = userInfo?.profile?.sub.split('\\')[1]
            if (userInfo) {
                const res = await api.post(`Policy/reset-mark-for-deletion`, 
                    { "id": policy?.id, "username": userName ,"markForDeletion": false}, userInfo.access_token);
                if (res?.status == 200) {
                    toast.success('Delete request Canceled for this policy!');
                    setConfDelModal(false);
                    setLoading(false)
                    navigate(-1)
                } else {
                    toast.error('Failed to Undo delete')
                    setLoading(false)
                }
            }

        } catch (error) {

        }
    }

    const handleZoomIn = () => setScale(scale + 0.1);
  const handleZoomOut = () => setScale(scale - 0.1);
  const handleResetZoom = () => setScale(1.0);

    return (
        <div className="">
            <UpdatePolicyModal
                show={updateDeadlineModal}
                pol={policy}
                off={offUpdateDeadline}
            />

            <SureToDeletePolicyModal
                show={confDelModal}
                action={handlePolicyDelete}
                off={() => setConfDelModal(false)}
            />

<SureToUnDoDeletePolicyModal
                show={confUndoDelModal}
                action={handleUndoPolicyDelete}
                off={() => setConUndofDelModal(false)}
            />
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



                    <div className="border border-3 p-3" style={{ height: '65vh', overflow: 'scroll' }}>

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
                        <p className=" d-flex gap-2" 
                        style={{ fontSize: '0.9em', wordBreak:'break-word' }}>
                            {
                                shortenString(policy?policy?.fileDescription:'', 120)
                           }
                        </p>

                        <p className=" d-flex gap-2 text-grey p-0 m-0">
                            {/* <i className="bi bi-file-earmark"></i> */}
                            Department
                        </p>
                        <p className=" d-flex gap-2">
                            {/* <i className="bi bi-file-earmark"></i> */}
                            {policy?.policyDepartment}
                        </p>

                        <p className=" d-flex gap-2 text-grey p-0 m-0">
                            {/* <i className="bi bi-file-earmark"></i> */}
                            Subsidiary
                        </p>
                        <p className=" d-flex gap-2">
                            {/* <i className="bi bi-file-earmark"></i> */}
                            {
                            policy && handleSubName(policy?.subsidiaries) 
                            }
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
                                    {policy?.uploadTime && moment(policy?.uploadTime).format('MMM DD YYYY')}
                                </p>
                            </div>

                            <div>
                                <p className=" d-flex gap-2 text-danger p-0 m-0">
                                    {/* <i className="bi bi-file-earmark"></i> */}
                                    Deadline Date
                                </p>
                                <p className=" d-flex gap-2 text-primary">
                                    {/* <i className="bi bi-file-earmark"></i> */}
                                    {policy?.uploadTime && moment(policy?.deadlineDate).format('MMM DD YYYY')}
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
                        !policy?.isAuthorized &&
                        <div className="d-flex mt-4 gap-3">
                            <Button
                                variant="border border-primary text-primary outline"
                                onClick={() => navigate(`/admin/edit-policy/${id}`)}

                            >Edit Policy</Button>
                          
                                <Button
                                disabled={loading}
                                variant="border border-danger text-danger outline"
                                onClick={() => setConUndofDelModal(true)}
                            >Cancel Deletion</Button> 
                        </div>}

                    {
                        policy?.isAuthorized &&
                        <div className="d-flex mt-4 gap-3">
                            <Button
                                variant="border border-primary text-primary outline"
                                onClick={handleUpdateDeadline}

                            >Update Deadline</Button>
                            <Button
                                disabled={loading}
                                variant="border border-danger text-danger outline"
                                onClick={() => setConUndofDelModal(true)}
                            >Cancel Deletion</Button>

                        </div>}
                </div>

            </div>

            <Modal show={attestedSuccesmodal} centered>
                <Modal.Header className="">
                    <i className="bi bi-x-circle text-end w-100" style={{ cursor: 'pointer' }} onClick={() => setAttestedSuccessModal(false)}></i>
                </Modal.Header>
                <Modal.Body>
                    <div className="p-3 d-flex justify-content-center align-items-center flex-column">
                        <img src={successIcon} height={'134px'} />
                        <p className="text-primary" style={{ fontFamily: 'title' }}>Policy Attested Successfully </p>
                        <p className="text-center">Thanks for attesting! Please check your list for any policies not yet attested. Your commitment is valued.</p>
                        <Link to={''} onClick={() => navigate(-1)}>Return to the list of policies</Link>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}
export default AdminViewDelPolicyPage;