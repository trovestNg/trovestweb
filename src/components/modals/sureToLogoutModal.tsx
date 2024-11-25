import React from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import alertIcon from "../../assets/icons/alertIcon.png";
import { useNavigate } from "react-router-dom";

const SureToLogoutModal : React.FC<any> = ({show, off, action, loading})=>{
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
                        <p className="text-primary mt-2" style={{ fontFamily: 'title' }}>Are you sure?</p>
                        <p className="text-center px-3">You are about to logout.</p>
                        
                        <Button onClick={action} disabled={loading} className="py-2 mt-3"  style={{minWidth:'20em'}}>
                            {
                                loading?<Spinner/> :'Yes, Please proceed'
                            }
                            </Button>
                    </div>
                </Modal.Body>
            </Modal>
    </div>
)
} 
export default SureToLogoutModal