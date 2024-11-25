import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal, Spinner, Badge, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import successIcon from '../../assets/icons/success.png';
import { Document, Page, pdfjs } from "react-pdf";
import { IPolicy } from "../../interfaces/policy";
import { getAPolicy } from "../../controllers/policy";
import { toast } from "react-toastify";
import { getUserInfo, loginUser } from "../../controllers/auth";
import moment from "moment";
import api from "../../config/api";
import { shortenString } from "../../util";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PolicyViewPage = () => {
    const navigate = useNavigate();
    const { attestationStatus, id } = useParams();
    const [attestedSuccesmodal, setAttestedSuccessModal] = useState(false);
    const [policy, setPolicy] = useState<IPolicy>();
    const [attesting, setAttesting] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [attested, setAttested] = useState(attestationStatus);

    const initialTime = 10;

    const [timer, setTimer] = useState(initialTime);
    const [enableButton, setEnableButton] = useState(false);

    const [scale, setScale] = useState(1.0);

    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState(1);


    const getPolicy = async () => {
        let userInfo = await getUserInfo();
        if (userInfo) {
            try {
                const res = await getAPolicy(`policy/${id}`, `${userInfo.access_token}`);
                if (res?.data) {
                    setPolicy(res?.data);
                } else {
                    // toast.error('Session expired!, You have been logged out!!');
                    // loginUser();

                }
                // console.log({ gotten: userInfo })({ response: res })
            } catch (error) {

            }

        } else {
            // loginUser()
        }

    }

   useEffect(() => {
        const timer = setInterval(() => {
          setTimer((prevTime:any) => {
            if (prevTime <= 1) {
              clearInterval(timer);
            //   setShowModal(true); // Show modal when time is up
              return 0;
            }
            return prevTime - 1;
          });
        }, 1000);
    
        return () => clearInterval(timer); // Cleanup timer on component unmount
      }, [timer]);
    
      const handleStay = useCallback(() => {
        setTimer(initialTime); // Reset time
        // setShowModal(false); // Hide modal if it's shown
      }, [initialTime]);
    
      useEffect(() => {
        if (timer === 0) {
            // setTimer(initialTime)
        //   setShowModal(true); // Show modal when 10 seconds are left
        }
      }, [timer]);

    useEffect(() => {
        getPolicy();
    }, [refresh])

    const onDocumentLoadSuccess = (numPages: number) => {
        setNumPages(numPages);
    };

    const goToPreviousPage = () => {
        setPageNumber(prevPage => prevPage - 1);
    };

    const goToNextPage = () => {
        if (pageNumber < numPages) {
            setPageNumber(pageNumber + 1);
            handleStay()
        }
    };

    const handleZoomIn = () => setScale(scale + 0.1);
    const handleZoomOut = () => setScale(scale - 0.1);
    const handleResetZoom = () => setScale(1.0);

    const handlyPolicyAttest = async () => {
        setAttesting(true)
        try {
            let userInfo = await getUserInfo();
            // console.log({ gotten: userInfo })({gotten: userInfo})
            if (userInfo) {
                let userName = userInfo?.profile?.sub.split('\\')[1]
                let body = {
                    subsidiary: userInfo.profile?.subsidiary,
                    policyId: policy?.id,
                    userID: userName,
                    username: `${userInfo.profile?.given_name} ${userInfo.profile?.family_name}`,
                    department: userInfo.profile?.department
                }
                const res = await api.post('Attest', body, userInfo.access_token);
                // console.log({ gotten: userInfo })({ attested: res })
                if (res) {
                    // toast.success('Attestation Succe');
                    setRefresh(!refresh);
                    setAttested('true')
                    setAttestedSuccessModal(true);
                    setAttesting(false)
                } else {
                    setAttesting(false);
                }
            }

        } catch (error) {

        }
    }

    const renderTooltip = (props: any) => (
        <Tooltip id="button-tooltip" {...props}>
            <p className="p-0 m-0">{props}</p>
        </Tooltip>
    );

    return (
        <div className="">
            <h5 className="text-primary">Policy Information</h5>
            <div className="mt-3"><Button variant="outline border border-2" onClick={() => navigate(-1)}>Go Back</Button></div>

            <div className="w-100 d-flex justify-content-between gap-4">
                <div className="" style={{ minWidth: '70%' }}>
                    <div className="bg-dark mt-2 d-flex justify-content-between px-4 py-2 text-light ">

                        <div className="d-flex gap-3">
                            zoom
                            <i className="bi bi-zoom-out" onClick={handleZoomOut}></i>
                            <i className="bi bi-zoom-in" onClick={handleZoomIn}></i>
                        </div>

                        <div className="d-flex gap-5">
                            <div className="gap-3 d-flex w-25 align-items-center justify-content-between">
                                <Button onClick={goToPreviousPage} disabled={pageNumber <= 1} variant="outline text-light" className="p-0 m-0" style={{ cursor: 'pointer' }}><i className="bi bi-chevron-bar-left"></i></Button>
                                <p className="p-0 m-0">{pageNumber}/{numPages}</p>
                                <OverlayTrigger placement="top" overlay={renderTooltip(timer>0?'Read policy! you can next when timer equals 0s': 'Now Click to next')}>
                                    <div>
                                         <Button onClick={goToNextPage} disabled={pageNumber >= numPages || timer > 0} variant="outline text-light"
                                    className="p-0 m-0" style={{ cursor: 'pointer' }}><i className="bi bi-chevron-bar-right"></i> </Button> 
                                    </div>

                                    </OverlayTrigger>
                               
                                     
                                    { pageNumber !== numPages && <Badge className="bg-light text-primary">{timer}s</Badge>}   
                                </div>
                                
                        </div>

                    </div>



                    <div className="border border-3 p-3" style={{ height: '65vh', overflow: 'scroll' }}>

                        <Document
                            file={policy?.url}
                            onLoadSuccess={(doc) => onDocumentLoadSuccess(doc.numPages)}
                        >
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
                                <OverlayTrigger placement="top" overlay={renderTooltip(timer>0?'Read policy! you can next when timer equals 0s': 'Now Click to next')}>
                                    <div>
                                    <Button onClick={goToNextPage} disabled={pageNumber >= numPages || timer > 0} variant="outline border-0" className="p-0 m-0" style={{ cursor: 'pointer' }}>
                                    {/* <i className="bi bi-chevron-bar-right"></i> */}
                                    Next
                                </Button>
                                { pageNumber !== numPages && <Badge className="bg-light text-primary">{timer}s</Badge>}
                               </div>
                                </OverlayTrigger>
                                
                                </div>

                        </div>}

                </div>

                <div className="d-flex flex-column gap-2" style={{ minWidth: '20%' }}>
                    {
                        attestationStatus == 'false' ?
                            <div className="bg-primary text-light rounded rounded-3 p-3 py-1">
                                <p className="d-flex gap-2 p-0 m-0 py-1">
                                    <i className="bi bi-info-circle"></i>
                                    Note :</p>
                                <p className="py-1 m-0" style={{ fontSize: '12px' }}>
                                    Kindly review this policy until the final page and proceed to the bottom to confirm.
                                </p>
                            </div> : ''
                    }

                    <div className=" shadow shadow-sm border rounded rounded-3 p-3">
                        <p className=" d-flex gap-2 text-primary" >
                            <i className="bi bi-file-earmark"></i>
                            File Details
                        </p>

                        <p className=" d-flex gap-2 text-gray p-0 m-0" style={{ fontSize: '12px' }}>
                            {/* <i className="bi bi-file-earmark"></i> */}
                            File Name
                        </p>
                        <p className=" d-flex gap-2">
                            {/* <i className="bi bi-file-earmark"></i> */}
                            {
                                policy?.fileName
                            }
                        </p>

                        <p className=" d-flex gap-2 text-grey p-0 m-0"
                            style={{ fontSize: '13px' }}
                        >
                            {/* <i className="bi bi-file-earmark"></i> */}
                            Description
                        </p>
                        <p className=" d-flex gap-2"
                            style={{ fontSize: '0.9em', wordBreak: 'break-word' }}>
                            {
                                shortenString(policy ? policy?.fileDescription : '', 120)
                            }
                        </p>

                        <p className=" d-flex gap-2 text-grey p-0 m-0"
                            style={{ fontSize: '12px' }}
                        >
                            {/* <i className="bi bi-file-earmark"></i> */}
                            Department
                        </p>
                        <p className=" d-flex gap-2">
                            {/* <i className="bi bi-file-earmark"></i> */}
                            {policy?.policyDepartment}
                        </p>
                        <hr />
                        <div className="d-flex justify-content-between">
                            <div className="">

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
                        attested == 'false' ?
                            <>
                                <Button
                                    disabled={pageNumber !== numPages || attesting} onClick={() => handlyPolicyAttest()}
                                    className="W-100 py-3 mt-3">
                                    {
                                        attesting ? <Spinner /> : `Click To Attest To This Policy`
                                    }
                                </Button>
                                {/* <i className="bi bi-caret-up-fill text-center text-primary"></i> */}
                                <p className="text-center m-0 py-0">
                                    When you've finished reading all the policy pages, this button will activate
                                </p>
                            </>

                            :
                            <>
                                <p
                                    className="W-100 mt-3 text-center bg-light text-primary shadow-sm py-2">
                                    You have attested to this policy
                                </p>
                                {/* <i className="bi bi-caret-up-fill text-center text-primary"></i> */}
                                <p className="text-center m-0 py-0">
                                    You've attested to this policy, but feel free to review it again if needed. Your understanding is valued.
                                </p>
                            </>
                    }
                </div>

            </div>

            <Modal show={attestedSuccesmodal} centered>

                <Modal.Body className="w-100 text-end">
                    <i className="bi bi-x-circle text-end w-100" style={{ cursor: 'pointer', fontSize: '1.3em' }} onClick={() => setAttestedSuccessModal(false)}></i>
                    <div className="p-3 py-5 d-flex justify-content-center align-items-center flex-column">
                        <img src={successIcon} height={'134px'} />
                        <p className="text-primary" style={{ fontFamily: 'title' }}>Policy Attested Successfully </p>
                        <p className="text-center">Thanks for attesting! Please check your list for any policies not yet attested. Your commitment is valued.</p>
                        <Button onClick={() => navigate('/policy-portal/unattested-policy')} className="text-light mt-3 p-3" >Return to the list of Not Attested Policies
                        </Button>
                        <Link className="mt-4" to={'/policy-portal'} >Back to dashboard</Link>

                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}
export default PolicyViewPage;