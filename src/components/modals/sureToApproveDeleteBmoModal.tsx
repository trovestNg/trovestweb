import React, { useState } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import alertIcon from "../../assets/icons/alertIcon.png";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../config/api";

const SureToApproveDeleteBmoModal : React.FC<any> = ({show,Id, off,clickedOwner})=>{
const [loading,setLoading] = useState(false);
const [showCommentBox,setShowCommentBox] = useState(false);
const [deleteComment,setDeleteComment] = useState('');

console.log({delThis:clickedOwner})

   
   
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
                        <p className="text-center px-3">You are about to approve deletion of this BO.</p>
                        
                        {
                            !showCommentBox &&
                            <Button onClick={()=>setShowCommentBox(true)} disabled={loading} className="py-2 mt-3"  style={{minWidth:'20em'}}>
                            {
                            'Yes, Please proceed'
                            }
                            </Button>}

                        {
                            showCommentBox &&
                            <div className="mt-2">
                                <p className="p-0 m-0">Any Comment? (optional)</p>
                                <input onChange={(e)=>setDeleteComment(e.target.value)} className="p-3 border" type="textarea" style={{outline:'none'}}/>
                            </div>
                        }

                        {
                            showCommentBox &&
                            <Button  disabled={loading} className="py-2 mt-3"  style={{minWidth:'20em'}}>
                            {
                                loading?<Spinner/> :'Delete'
                            }
                            </Button>
                        }
                    </div>
                </Modal.Body>
            </Modal>
    </div>
)
} 
export default SureToApproveDeleteBmoModal