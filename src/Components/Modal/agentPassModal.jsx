import React, { useState, useEffect, useMemo } from "react";
import { Button, FormControl, InputGroup, Spinner, Modal, ModalBody, Col, Row, Form } from "react-bootstrap";
import { Formik } from "formik";
import * as yup from 'yup';
import { toast } from "react-toastify";
import { user_storage_token } from "../../config";
import DisplayMessage from "../Message";
import { adminCreateAgent } from "../../Sagas/Requests";
import Compress from "react-image-file-resizer";
import api from "../../app/controllers/endpoints/api";
import { resetAgentPassword } from "../../Sagas/Requests";
import { useParams } from "react-router-dom";




const UpdateAgentPass = ({ on, off, check, success, onSuccess, offSuccess, initialInfo, agId }) => {

    console.log('Old info', initialInfo?.first_name);
    const [agentInfo, setAgentInfo] = useState({});


    console.log('here info :', initialInfo)
    const [imageFile, setimageFile] = useState('')
    const [profileImage, setprofileImage] = useState('')
    const [loading, setLoading] = useState(false);
    const [secureText, setSecureText] = useState(true);
    const [secureCText, setSecureCText] = useState(true);
    const [prevInfo, setPrevInfo] = useState({});
    const [fName, setFName] = useState('');
    const token = localStorage.getItem(user_storage_token);
    const [newPass,setNewPass] = useState('');
    const [confNewPass,setConfNewPass] = useState('');
    const { agentId } = useParams();
    

    let initialValues = {
        newPassword: '',
        confNewPassword: '',

    };


    const fetchAgentInfo = async () => {
        setLoading(true);
        const res = await api.get(`/admin/agent/${agId}`, token);
        console.log(res);
        if (res?.data?.success) {
            setAgentInfo(res?.data?.data?.agent);
            setLoading(false);
        }
    };

    console.log('final', agentInfo?.first_name)
    useEffect(() => {
        setFName(initialInfo?.first_name);
    }, [initialInfo])

    useMemo(() => initialInfo, [initialInfo]);

    const handleInitialVal = () => {

    }

    console.log('done :', prevInfo);
    // const validationSchema = yup.object().shape({
    //     firstName: yup.string().typeError('Must be a string').required('Firstt name is required'),
    //     lastName: yup.string().typeError('Must be a string').required('Last name is required'),
    //     phoneNumber: yup.string().typeError('Must be a string').required('Phone number Is required'),
    //     email: yup.string().typeError('Must be a string').required('Email Is required'),
    //     password: yup.string().typeError('Must be a string').required('Password Is required'),
    //     confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required('Pls confirm password'),
    //     address: yup.string().typeError('Must be a string').required('Address Is required'),
    // });

    function handleChangeImage(event) {
        const file = event.target.files[0];
        Compress.imageFileResizer(
            file, // the file from input
            500, // width
            500, // height
            "PNG", // compress format WEBP, JPEG, PNG
            90, // quality
            0, // rotation
            (uri) => {
                setimageFile(URL.createObjectURL(uri));
                setprofileImage(uri);
                const image = {
                    name: 'admin-image',
                    uri: uri,
                    // uri: URL.createObjectURL(uri),
                    "type": "image/jpeg"
                }
            },
            "blob"
        );
    }



    const handleResetPass = async (value)=> {
        console.log(value)
        
        if(value?.newPassword !== value?.confNewPass){
            console.log('p :', value?.newPassword, 'conf p:',value?.confNewPass)
            toast.success('Passwords not equal');
            return ;
        } else{
            try {
                setLoading(true);
                const payload = {
                    pass : value?.newPassword, token : token, userId : agentId
                }
               const res = await resetAgentPassword(payload);
               console.log(res)
               if(res?.data?.success){
                setLoading(false);
                setNewPass('');
                setConfNewPass('');
                off();
                toast.success('Agent password successfully changed');
               } else {
                setLoading(false);
                toast.error('Password reset failed, check your internet');
               }
                
            } catch (error) {
                console.log(error);
            }
        }
        
        
    }

    useEffect(() => {
        fetchAgentInfo()
    }, [])
    return (
        <Formik
            initialValues={initialValues}
            onSubmit={(val) => console.log(val)}
        >
            {({ values, handleChange, handleSubmit, errors }) => (
                <>
                    <Modal show={on} centered size='lg'>
                        <Modal.Header className="bg-info text-light">
                            <Col>Reset Agent Password</Col>
                            <Col onClick={()=>{
                                setNewPass('');
                                setConfNewPass('');
                                off();

                            }} className='d-flex px-3 justify-content-end'
                                style={{ cursor: 'pointer' }}
                            >X</Col>
                        </Modal.Header>
                        <ModalBody className="d-flex justify-content-center">
                            <Form className="w-75 gap-3 d-flex justify-content-center">


                                <Row className="d-flex  m-0 flex-row w-100 mt-3  w-100">
                                    <div className="d-flex gap-4 flex-column">
                                        <div style={{maxWidth:'18rem'}}>
                                            <p className="p-0 m-0">Input New Password</p>
                                            <InputGroup className='bg-transparent border  px-2 gap-2 border-info rounded d-flex justify-content-between align-items-center'>
                                            <div className="">
                                                <i className="bi bi-lock-fill"></i>
                                                <input type={secureText && 'password'} onChange={(e)=>setNewPass(e.target.value)} className='py-2 px-2 bg-transparent  outline-0 border border-0' style={{ outline: 'none', fontFamily: 'Montserrat' }} />
                                            </div>
                                                <i className={secureText ? "bi bi-eye-fill" : "bi bi-eye-slash-fill"} onClick={() => setSecureText(!secureText)}></i>
                                            </InputGroup>
                                        </div>


                                        <div style={{maxWidth:'18rem'}}>
                                        <p className="p-0 m-0">Confirm New Password</p>
                                            <InputGroup className='bg-transparent border  px-2 gap-2 border-info rounded d-flex justify-content-between align-items-center'>
                                                <div className="">
                                                <i className="bi bi-lock-fill"></i>
                                                <input type={secureCText && 'password'} onChange={(e)=>setConfNewPass(e.target.value)}className='py-2 px-2 bg-transparent  outline-0 border border-0' style={{ outline: 'none', fontFamily: 'Montserrat' }} />
                                                </div>
                                                <i className={secureCText ? "bi bi-eye-fill" : "bi bi-eye-slash-fill"} onClick={() => setSecureCText(!secureCText)} ></i>
                                            </InputGroup>

                                        </div>

                                    </div>

                                </Row>


                                {/* disabled={Object.keys(errors).length !== 0} */}
                                <Row className="d-flex m-0  mt-3 w-100 gap-2 justify-content-end">
                                
                                       
                                            <Button variant="info" onClick={()=>handleResetPass({newPassword: newPass, confNewPass : confNewPass })} disabled={newPass == '' || confNewPass ==''}  style={{maxWidth:'8em'}}>{
                                                loading ? <Spinner className="spinner-grow-sm" style={{ fontSize: '0.5em' }} /> : 'Update'
                                            }</Button>
                                            <Button variant="info" onClick={()=>{
                                                setNewPass('');
                                                setConfNewPass('');
                                                off();
                                            }} style={{maxWidth:'8em'}}>Exit</Button>
                                       
                            
                                </Row>
                            </Form>
                        </ModalBody>
                    </Modal>
                    <Modal show={success} centered>
                        <Modal.Header className='bg-info text-light py-0' style={{ fontFamily: 'Montserrat-Bold' }}>
                            <Col xs={10}>Confirmation</Col>
                            <Col xs={2} className='d-flex px-3 justify-content-end py-3 h-100'
                                onClick={() => offSuccess()}
                                style={{ cursor: 'pointer' }}>X</Col>
                        </Modal.Header>
                        <ModalBody className='d-flex flex-column py-4 justify-content-center align-items-center'>
                            <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '5em' }}></i>
                            <p className='px-5 text-center m-0'
                                style={{ fontFamily: 'Montserrat' }}
                            > Agent Created Succesfully</p>
                        </ModalBody>
                    </Modal>
                </>
            )}
        </Formik>

    )
}
export default UpdateAgentPass;