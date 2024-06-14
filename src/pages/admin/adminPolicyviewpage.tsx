import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import successIcon from '../../assets/icons/success.png';
import { Document, Page, pdfjs } from "react-pdf";
import { IPolicy } from "../../interfaces/policy";
import { getAPolicy } from "../../controllers/policy";
import { toast } from "react-toastify";
import { loginUser } from "../../controllers/auth";
import moment from "moment";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const AdminPolicyviewpage = () => {
    const userDat = localStorage.getItem('loggedInUser') || '';
    const data = JSON.parse(userDat);
    const navigate = useNavigate();
    const { id } = useParams();
    const [attestedSuccesmodal, setAttestedSuccessModal] = useState(false);
    const [policy, setPolicy] = useState<IPolicy>();



    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState(1);


    const getPolicy = async () => {
        try {
            const res = await getAPolicy(`policy/${id}`, `${data?.access_token}`);
            if (res?.data) {
                setPolicy(res?.data);
            } else {
                // toast.error('Session expired!, You have been logged out!!');
                // loginUser();

            }
            console.log({ response: res })
        } catch (error) {

        }
    }

    useEffect(() => {
        getPolicy();
    }, [])

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

    return (
        <div className="">
            <div><Button variant="outline border border-2" onClick={() => navigate(-1)}>Go Back</Button></div>
            <div className="w-100 d-flex justify-content-between gap-4">
                <div className="" style={{ minWidth: '70%' }}>
                    <div className="bg-dark mt-2 d-flex justify-content-between px-4 py-2 text-light ">
                        <div>zoom</div>
                        <div className="gap-3 d-flex w-25 align-items-center justify-content-between">
                            <Button onClick={goToPreviousPage} disabled={pageNumber <= 1} variant="outline text-light" className="p-0 m-0" style={{ cursor: 'pointer' }}><i className="bi bi-chevron-bar-left"></i></Button>
                            <p className="p-0 m-0">{pageNumber}/{numPages}</p>
                            <Button onClick={goToNextPage} disabled={pageNumber >= numPages} variant="outline text-light" className="p-0 m-0" style={{ cursor: 'pointer' }}><i className="bi bi-chevron-bar-right"></i></Button></div>




                        <div>

                        </div>

                    </div>



                    <div className="border border-3 p-3" style={{ height: '80vh', overflow: 'scroll' }}>

                        <Document file={policy?.url} onLoadSuccess={(doc) => onDocumentLoadSuccess(doc.numPages)}>
                            <Page pageNumber={pageNumber} />
                        </Document>


                    </div>



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
                        <p className=" d-flex gap-2" style={{fontSize:'0.8em'}}>
                            {/* <i className="bi bi-file-earmark"></i> */}
                           {policy?.fileDescription}
                        </p>

                        <p className=" d-flex gap-2 text-grey p-0 m-0">
                            {/* <i className="bi bi-file-earmark"></i> */}
                            Department
                        </p>
                        <p className=" d-flex gap-2">
                            {/* <i className="bi bi-file-earmark"></i> */}
                           {policy?.departmentId}
                        </p>
                        <hr/>
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
                    {
                        !policy?.isAuthorized &&
                        <div className="d-flex mt-4 gap-3">
                    <Button 
                    variant="border border-primary text-primary outline"
                    onClick={()=>navigate(`/admin/edit-policy/${id}`)}
                    
                    >Edit Policy</Button>
                    <Button
                    variant="border border-danger text-danger outline"
                    onClick={()=>navigate(-1)}
                    >Cancel Request</Button>
                    
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
export default AdminPolicyviewpage;