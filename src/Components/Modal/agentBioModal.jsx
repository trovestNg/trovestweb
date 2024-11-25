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
import { adminUpdateAgentBio } from "../../Sagas/Requests";
import { useParams } from "react-router-dom";




const UpdateAgentBio = ({ on, off, check, success, onSuccess, offSuccess, initialInfo,agId }) => {

    const [agentInfo, setAgentInfo] = useState({
        first_name:initialInfo?.first_name,
        last_name :initialInfo?.last_name,
        mobile :initialInfo?.mobile,
        email:initialInfo?.email,
        address: initialInfo?.address
    });

    const [imageFile, setimageFile] = useState('')
    const [profileImage, setprofileImage] = useState('')
    const [loading, setLoading] = useState(false);
    const [prevInfo, setPrevInfo] = useState ({});
    
    const [fName, setFName] = useState('');
    const [lName, setLName] = useState('');
    const [phone, setPhone] = useState('');
    const [mail, setMail] = useState('');
    const [adress, setAdress] = useState('');
    const { agentId } = useParams();

    const token = localStorage.getItem(user_storage_token);

    let initialValues = {
        firstName: agentInfo?.first_name, lastName: prevInfo?.last_name, phoneNumber: '',
        email: '', password: '', confirmPassword: '',
        username: '',
        address: '', image: ''
    };

    const fetchAgentInfo = async () => {
        setLoading(true);
        const res = await api.get(`/admin/agent/${agId}`, token);
        console.log('fetched prev :',res);
        if (res?.data?.success) {
          setFName(res?.data?.data?.agent?.first_name);
          setLName(res?.data?.data?.agent?.last_name);
          setPhone(res?.data?.data?.agent?.mobile);
          setMail(res?.data?.data?.agent?.email);
          setAdress(res?.data?.data?.agent?.address);
          
          setLoading(false);
        }
      };


  

    const handleInfoUpdate = async ()=>{
        setLoading(true);
        const body = {
            firstName : fName,
            lastName : lName,
            phoneNumber : phone,
            newMail : mail,
            newAddress : adress,
        }
        const payload = {
            token : token,
            agentId : agentId,
            info : body
        }
        // console.log('prev Info :',body)
        if(body.firstName  == '' || body.lastName  == '' || body.phoneNumber  == '' || body.newMail  == '' || body.newAddress === ''){
            toast.error('No field can be empty!!');
            setLoading(false)
            return ;
        } else {
            try {
                setLoading(true)
                const res = await adminUpdateAgentBio(payload);
            if(res?.data?.success){
                setLoading(false)
                toast.success('Agent profile updated successfully!');
                off()
            }
                
            } catch (error) {
                console.log(error);
                
            }
        }


    }

    console.log('done :',agentInfo);
    // const validationSchema = yup.object().shape({
    //     firstName: yup.string().typeError('Must be a string').required('Firstt name is required'),
    //     lastName: yup.string().typeError('Must be a string').required('Last name is required'),
    //     phoneNumber: yup.string().typeError('Must be a string').required('Phone number Is required'),
    //     email: yup.string().typeError('Must be a string').required('Email Is required'),
    //     password: yup.string().typeError('Must be a string').required('Password Is required'),
    //     confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required('Pls confirm password'),
    //     address: yup.string().typeError('Must be a string').required('Address Is required'),
    // });

    // function handleChangeImage(event) {
    //     const file = event.target.files[0];
    //     Compress.imageFileResizer(
    //         file, // the file from input
    //         500, // width
    //         500, // height
    //         "PNG", // compress format WEBP, JPEG, PNG
    //         90, // quality
    //         0, // rotation
    //         (uri) => {
    //             setimageFile(URL.createObjectURL(uri));
    //             setprofileImage(uri);
    //             const image = {
    //                 name: 'admin-image',
    //                 uri: uri,
    //                 // uri: URL.createObjectURL(uri),
    //                 "type": "image/jpeg"
    //             }
    //         },
    //         "blob"
    //     );
    // }


    useEffect(()=>{
        fetchAgentInfo()
    },[])
    return (
        <Formik
            initialValues={initialValues}
            
            onSubmit={(val) => console.log(val)}
        >
            {({ values, handleChange, handleSubmit, errors }) => (
                <>
                    <Modal show={on} centered size='lg'>
                        <Modal.Header className="bg-info text-light">
                            <Col>Update Agent Bio</Col>
                            <Col onClick={off} className='d-flex px-3 justify-content-end'
                                style={{ cursor: 'pointer' }}
                            >X</Col>
                        </Modal.Header>
                        <ModalBody className="d-flex justify-content-center">
                            <Form className="w-75 gap-3 d-flex justify-content-center">
                                <Row className="d-flex text-info flex-row w-100 m-0 w-100">
                                    <Col className="">
                                        <InputGroup className='bg-transparent border  px-2 gap-2 border-info rounded d-flex justify-content-start align-items-center'>
                                            <i className="bi bi-person-fill"></i>
                                            <input type="input" onChange={(e)=>setFName(e.target.value)} name="firstName" defaultValue={initialInfo?.first_name} placeholder="First name" className='py-2 px-2 bg-transparent  outline-0 border border-0' style={{ outline: 'none', fontFamily: 'Montserrat', minWidth: '13em' }} />

                                        </InputGroup>
                                    </Col>
                                    <Col>

                                    <InputGroup className='bg-transparent border  px-2 gap-2 border-info rounded d-flex justify-content-start align-items-center'>
                                    <i className="bi bi bi-people-fill"></i>
                                            <input type="input" onChange={(e)=>setLName(e.target.value)} name="lastName" defaultValue={initialInfo?.last_name} placeholder="Last name" className='py-2 px-2 bg-transparent  outline-0 border border-0' style={{ outline: 'none', fontFamily: 'Montserrat', minWidth: '13em' }} />

                                        </InputGroup>
                                    </Col>
                                </Row>

                                <Row className="d-flex m-0 flex-row w-100 mt-3  w-100">
                                    <Col>

                                    <InputGroup className='bg-transparent border  px-2 gap-2 border-info rounded d-flex justify-content-start align-items-center'>
                                    <i className="bi bi-telephone-fill"></i>
                                            <input defaultValue={initialInfo?.mobile} type="tel" maxLength={12} onChange={(e)=>setPhone(e.target.value)} name="phoneNumber" placeholder="Phone number" className='py-2 px-2 bg-transparent  outline-0 border border-0' style={{ outline: 'none', fontFamily: 'Montserrat', minWidth: '13em' }} />

                                        </InputGroup>
                                    </Col>
                                    <Col>

                                    <InputGroup className='bg-transparent border  px-2 gap-2 border-info rounded d-flex justify-content-start align-items-center'>
                                    <i className="bi bi-envelope-fill"></i>
                                            <input defaultValue={initialInfo?.email} type='email' name="email" onChange={(e)=>setMail(e.target.value)} placeholder="Email" className='py-2 px-2 bg-transparent  outline-0 border border-0' style={{ outline: 'none', fontFamily: 'Montserrat', minWidth: '13em' }} />

                                        </InputGroup>
                                    </Col>
                                </Row>

                                <Row className="d-flex m-0 flex-row w-100 mt-3  w-100">
                                    <Col>
                                        <InputGroup defaultValue={values.address} className='bg-transparent border  gap-2 border-info rounded d-flex justify-content-start align-items-center'>
                                            <textarea type="input" onChange={(e)=>setAdress(e.target.value)} defaultValue={initialInfo?.address} name="address" placeholder="Address" className="bg-transparent w-100" style={{ width: '200px', height: '5em', outline: 'none' }} />
                                        </InputGroup>
                                    </Col>
                                    <Col>
                                    </Col>
                                </Row>
                                {/* disabled={Object.keys(errors).length !== 0} */}
                                <Row className="d-flex m-0 flex-row mt-3 w-100">
                                    <Col>
                                        <InputGroup className="">
                                            <Button variant="info" onClick={handleInfoUpdate} >{
                                                loading ? <Spinner className="spinner-grow-sm" style={{ fontSize: '0.5em' }} /> : 'Update'
                                            }</Button>
                                        </InputGroup>
                                    </Col>
                                    <Col>
                                        <InputGroup>
                                            <Button variant="info" type="rest" onClick={off}>Cancel</Button>
                                        </InputGroup>
                                    </Col>
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
export default UpdateAgentBio;