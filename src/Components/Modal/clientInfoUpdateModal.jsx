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
import { adminUpdateArtisanBio } from "../../Sagas/Requests";




const UpdateClientInfo = ({ on, off, check, success, onSuccess, offSuccess, initialInfo, agId }) => {

    // console.log('Old info', initialInfo?.first_name);
    // const [agentInfo, setAgentInfo] = useState({});

    const { client_id } = useParams();
    // console.log('here info :', initialInfo)
    const [imageFile, setimageFile] = useState('')
    const [profileImage, setprofileImage] = useState('')
    const [loading, setLoading] = useState(false);
    const [secureText, setSecureText] = useState(true);
    const [secureCText, setSecureCText] = useState(true);
    const [prevInfo, setPrevInfo] = useState({});
    const token = localStorage.getItem(user_storage_token);
    const [newPhone, setNewPhone] = useState('');
    const [confNewPass, setConfNewPass] = useState('');

    const [clientBio, setClientBio] = useState({
        "full_name": initialInfo?.full_name,
        "mobile": initialInfo?.mobile,
        "email": initialInfo?.email,
        "address": initialInfo?.address
    })


    const fetchClientInfo = async () => {
        
        try {
            const res = await api.get(`/admin/artisan/${client_id}`, token);

            if (res?.data?.success) {
                console.log('sucesss started!!',res)
                setClientBio({
                    "full_name": res?.data?.data?.artisan?.full_name,
                    "mobile" : res?.data?.data?.artisan?.mobile,
                    "address" : res?.data?.data?.artisan?.address,
                    "email" : res?.data?.data?.artisan?.email,
                })
                
            }
        } catch (error) { }
    };



    const handleInitialVal = () => {

    }

    // console.log('done :', prevInfo);
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


    const handleUpdateInfo = async () => {

        setLoading(true)
        const payload = {
            token: token,
            artisanId: client_id,
            body: clientBio

        }


        // console.log("see me here ",clientBio);
        if (clientBio.full_name == '' || clientBio.mobile == '' || clientBio.address == '' ) {
            toast.error('No other field aside email field can be empty!!');
            setLoading(false);
            return;
        } else {
            try {
                const res = await adminUpdateArtisanBio(payload);
                if (res?.data?.success) {
                    setLoading(false)
                    toast.success('Info succesfully updated');
                    off();
                }
                else {
                    toast.error('Failed to update info!');
                    setLoading(false)
                }
            } catch (error) {
    
            }
        }
    }

    useEffect(() => {
        fetchClientInfo();
    }, [])
    return (
        <>
            <Modal show={on} centered size='lg'>
                <Modal.Header className="bg-info text-light">
                    <Col>Update Artisan Bio</Col>
                    <Col onClick={off} className='d-flex px-3 justify-content-end'
                        style={{ cursor: 'pointer' }}
                    >X</Col>
                </Modal.Header>
                <ModalBody className="d-flex justify-content-center">
                    <Form className="w-75 gap-3 d-flex justify-content-center">
                        <Row className="d-flex text-info flex-row w-100 m-0 w-100">
                            <Col className="gap-0">
                                <p className="p-0 m-0">Full name</p>
                                <InputGroup className='bg-transparent border  px-2 gap-2 border-info rounded d-flex justify-content-start align-items-center'>
                                    <i className="bi bi-person-fill"></i>
                                    <input type="input" onChange={(e) => setClientBio({ ...clientBio, "full_name": e.target.value })}
                                        name="firstName" defaultValue={initialInfo?.full_name}
                                        className='py-2 px-2 bg-transparent  outline-0 border border-0'
                                        style={{ outline: 'none', fontFamily: 'Montserrat', minWidth: '13em' }} />

                                </InputGroup>
                            </Col>
                            <Col>
                                <p className="p-0 m-0">Phone number</p>
                                <InputGroup className='bg-transparent border  px-2 gap-2 border-info rounded d-flex justify-content-start align-items-center'>
                                    <i className="bi bi-telephone-fill"></i>
                                    <input
                                        defaultValue={initialInfo?.mobile}
                                        type="tel" maxLength={12}
                                        onChange={(e) => setClientBio({ ...clientBio, "mobile": e.target.value })}
                                        name="phoneNumber" className='py-2 px-2 bg-transparent  outline-0 border border-0'
                                        style={{ outline: 'none', fontFamily: 'Montserrat', minWidth: '13em' }} />

                                </InputGroup>
                            </Col>
                        </Row>

                        <Row className="d-flex m-0 flex-row w-100 mt-3  w-100">
                            <Col>
                                <p className="p-0 m-0">Email (optional)</p>
                                <InputGroup className='bg-transparent border  px-2 gap-2 border-info rounded d-flex justify-content-start align-items-center'>
                                    <i className="bi bi-envelope-fill"></i>
                                    <input
                                        defaultValue={initialInfo?.email}
                                        type='email' name="email"
                                        onChange={(e) => setClientBio({ ...clientBio, "email": e.target.value })}
                                        className='py-2 px-2 bg-transparent  outline-0 border border-0'
                                        style={{ outline: 'none', fontFamily: 'Montserrat', minWidth: '13em' }} />

                                </InputGroup>
                            </Col>
                            <Col>
                                {/* <InputGroup defaultValue={values.address} className='bg-transparent border  gap-2 border-info rounded d-flex justify-content-start align-items-center'>
                                            <textarea type="input" onChange={(e)=>setAdress(e.target.value)} defaultValue={initialInfo?.address} name="address" placeholder="Address" className="bg-transparent w-100" style={{ width: '200px', height: '5em', outline: 'none' }} />
                                        </InputGroup> */}
                            </Col>
                        </Row>

                        <Row className="d-flex m-0 flex-row w-100 mt-3  w-100">
                            <Col>
                                <p className="p-0 m-0">Address</p>
                                <InputGroup
                                    className='bg-transparent border  gap-2 border-info rounded d-flex justify-content-start align-items-center'>
                                    <textarea type="input"
                                        onChange={(e) => setClientBio({ ...clientBio, "address": e.target.value })}
                                        defaultValue={initialInfo?.address} name="address"
                                        className="bg-transparent w-100" style={{ width: '200px', height: '5em', outline: 'none' }} />
                                </InputGroup>
                            </Col>
                            <Col>
                            </Col>
                        </Row>
                        {/* disabled={Object.keys(errors).length !== 0} */}
                        <Row className="d-flex m-0 flex-row mt-3 w-100">
                            <Col>
                                <InputGroup className="">
                                    <Button variant="info" onClick={handleUpdateInfo} >{
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

    )
}
export default UpdateClientInfo;