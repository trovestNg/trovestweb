import React, { useState } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import alertIcon from "../../assets/icons/alertIcon.png";
import { useNavigate } from "react-router-dom";
import { getUserInfo } from "../../controllers/auth";
import api from "../../config/api";
import { toast } from "react-toastify";

const SureToRejectBOModal : React.FC<any> = ({show, off,parentInfo})=>{

    const navigate = useNavigate();
    const [loading,setLoading] = useState(false);
const [showCommentBox,setShowCommentBox] = useState(false);
const [deleteComment,setDeleteComment] = useState('');

    const rejectBo = async () => {
        setLoading(true)
        // console.log({ seeBody: body })
        let userInfo = await getUserInfo();



        if (userInfo) {

            const bodyApprove= {
                // "requestorUsername": `${userInfo?.profile.given_name} ${userInfo?.profile.family_name}`,
                "requestorUsername": `${userInfo?.profile.given_name} ${userInfo?.profile.family_name}`,
                "comment": deleteComment,
                "ids": [
                parentInfo?.Id == 0? +`${parentInfo.ParentId}`:parentInfo?.Id
                ]
              }

            const res = await api.post(`reject`, bodyApprove, `${userInfo?.access_token}`)
            if (res?.status==200) {
                setLoading(false);
                toast.success('BO Rejected succesfully');
                off()
            } else {
                toast.error('You cannot reject a bo created by you');
                setLoading(false);
            }

        }
    }
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
                        <p className="text-center px-3">You are about to reject this Beneficiary Owner.</p>
                        
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
                            <Button onClick={rejectBo} disabled={loading} className="py-2 mt-3"  style={{minWidth:'20em'}}>
                            {
                                loading?<Spinner/> :'Reject'
                            }
                            </Button>
                        }
                    </div>
                </Modal.Body>
            </Modal>
    </div>
)
} 
export default SureToRejectBOModal