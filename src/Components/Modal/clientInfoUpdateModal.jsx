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
import { updateClientInfo } from "../../Sagas/Requests";
import { useParams } from "react-router-dom";




const UpdateClientInfo = ({ on, off, check, success, onSuccess, offSuccess, initialInfo, agId }) => {

    console.log('Old info', initialInfo?.first_name);
    const [agentInfo, setAgentInfo] = useState({});

    const { client_id } = useParams();
    console.log('here info :', initialInfo)
    const [imageFile, setimageFile] = useState('')
    const [profileImage, setprofileImage] = useState('')
    const [loading, setLoading] = useState(false);
    const [secureText, setSecureText] = useState(true);
    const [secureCText, setSecureCText] = useState(true);
    const [prevInfo, setPrevInfo] = useState({});
    const [fName, setFName] = useState('');
    const token = localStorage.getItem(user_storage_token);
    const [newPhone,setNewPhone] = useState('');
    const [confNewPass,setConfNewPass] = useState('');
    const { agentId } = useParams();
    

    let initialValues = {
        newPassword: '',
        confNewPassword: '',

    };


    const loadData = async () => {
        try {
          const res = await api.get(`/admin/artisan/${client_id}`, token);
    
          if (res?.data?.success) {
            console.log('suc')
          }
        } catch (error) {}
      };
   


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



    const handleUpdateInfo = async ()=> {
        setLoading(true)
        const payload = {
            token : token,
            artisanId : client_id,
            body : newPhone

        }
        try {
            const res = await updateClientInfo(payload);
        if(res?.data?.success){
            setLoading(false)
            toast.success('Phone number successfully updated!');
            setNewPhone('');
            off();
        }
        else{
            toast.error('Failed to update info!')
        }
        } catch (error) {
            
        }
    }

    useEffect(() => {
        loadData();
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
                            <Col>Update Client Info</Col>
                            <Col onClick={()=>{
                                setNewPhone('');
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
                                            <p className="p-0 m-0">Input New Phone Number</p>
                                            <InputGroup className='bg-transparent border  px-2 gap-2 border-info rounded d-flex justify-content-between align-items-center'>
                                            <div className="">
                                                
                                                <input type='tel' maxLength={11} onChange={(e)=>setNewPhone(e.target.value)} className='py-2 px-2 bg-transparent  outline-0 border border-0' style={{ outline: 'none', fontFamily: 'Montserrat' }} />
                                            </div>
                                               
                                            </InputGroup>
                                        </div>

                                    </div>

                                </Row>


                                {/* disabled={Object.keys(errors).length !== 0} */}
                                <Row className="d-flex m-0  mt-5 w-100 gap-2 justify-content-start">
                                
                                       
                                            <Button variant="info" onClick={()=>handleUpdateInfo()} disabled={newPhone == ''}  style={{maxWidth:'8em'}}>{
                                                loading ? <Spinner className="spinner-grow-sm" style={{ fontSize: '0.5em' }} /> : 'Update'
                                            }</Button>
                                            <Button variant="info" onClick={()=>{
                                                setNewPhone('');
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
export default UpdateClientInfo;