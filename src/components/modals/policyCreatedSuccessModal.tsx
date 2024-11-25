import React from "react";
import { Button, Modal } from "react-bootstrap";
import alertIcon from "../../assets/icons/success.png";
import { useNavigate } from "react-router-dom";

const PolicyCreatedSuccessModal : React.FC<any> = ({show, off, action})=>{
    const navigate = useNavigate();
return (
    <div>
        <Modal show={show} centered>
                <Modal.Header className="">
                    <i className="bi bi-x-circle text-end w-100" 
                    onClick={()=>off()}
                    style={{ cursor: 'pointer' }} 
                   ></i>
                </Modal.Header>
                <Modal.Body>
                    <div className="py-2 d-flex justify-content-center align-items-center flex-column">
                        <img src={alertIcon} height={'114px'} />
                        <p className="text-primary mt-2" style={{ fontFamily: 'title' }}>Sent Successfully</p>
                        <p className="text-center px-3">Policy has been sent successfully to the Authorizer for approval. </p>
                        
                        <Button onClick={()=>off()} variant="outline border" className="py-2 mt-3">Upload New Policy</Button>
                        <Button onClick={()=>navigate(-1)} className="py-2 mt-3">Back to Dashboard</Button>
                    </div>
                </Modal.Body>
            </Modal>
    </div>
)
} 
export default PolicyCreatedSuccessModal