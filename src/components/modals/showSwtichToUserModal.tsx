import React from "react";
import { Button, Modal } from "react-bootstrap";
import alertIcon from "../../assets/icons/switch-icon.png";
import { useNavigate } from "react-router-dom";

const ShowSwtichToUserModal : React.FC<any> = ({show, off, action})=>{
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
                        <p className="text-primary mt-2" style={{ fontFamily: 'title' }}>Switch to User View</p>
                        <p className="text-center px-3">You're about to switch to the User view. Click the button below to proceed.</p>
                        <p className="text-primary" onClick={() => action()} style={{textDecoration:'underline', cursor:'pointer'}}>Proceed to switch</p>
                    </div>
                </Modal.Body>
            </Modal>
    </div>
)
} 
export default ShowSwtichToUserModal