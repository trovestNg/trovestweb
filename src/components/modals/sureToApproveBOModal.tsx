import React, { useState } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import alertIcon from "../../assets/icons/alertIcon.png";
import { useNavigate } from "react-router-dom";
import { getUserInfo } from "../../controllers/auth";
import api from "../../config/api";
import { toast } from "react-toastify";

const SureToApproveBOModal : React.FC<any> = ({show, off,parentInfo})=>{

    const navigate = useNavigate();
    const [loading,setLoading] = useState(false);
    const [showCommentBox,setShowCommentBox] = useState(false);
    const [approveComment,setApproveComment] = useState('');

    const approveBo = async () => {
        setLoading(true)
        
        

        try {
            
            let userInfo = await getUserInfo();
            const bodyApprove= {
                // "requestorUsername": `${userInfo?.profile.given_name} ${userInfo?.profile.family_name}`,
                "requestorUsername":`${userInfo?.profile.given_name} ${userInfo?.profile.family_name}`,
                "comment": approveComment,
                "ids": [
                parentInfo?.Id == 0? +`${parentInfo.ParentId}`:parentInfo?.Id
                ]
              }

              const res = await api.post(`authorize`, bodyApprove, `${userInfo?.access_token}`)
            if (res?.status==200) {
                setLoading(false);
                toast.success('BO Approved succesfully');
                off()
            }

            if(res?.status==400){
                setLoading(false);
                toast.error(`${res?.data}`);
            }
            
            else {
                toast.error('Operation failed! Check your network');
                setLoading(false);
            }
            
        } catch (error) {
            
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
                        <p className="text-center px-3">You are about to approve this BO.</p>
                        
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
                                <input onChange={(e)=>setApproveComment(e.target.value)} className="p-3 border" type="textarea" style={{outline:'none'}}/>
                            </div>
                        }

                        {
                            showCommentBox &&
                            <Button onClick={approveBo} disabled={loading} className="py-2 mt-3"  style={{minWidth:'20em'}}>
                            {
                                loading?<Spinner/> :'Approve'
                            }
                            </Button>
                        }
                    </div>
                </Modal.Body>
            </Modal>
    </div>
)
} 
export default SureToApproveBOModal