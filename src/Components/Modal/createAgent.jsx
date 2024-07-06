import React, { useState } from "react";
import { Button, FormControl, InputGroup, Spinner, Modal, ModalBody, Col, Row, Form } from "react-bootstrap";
import { Formik } from "formik";
import * as yup from 'yup';
import { toast } from "react-toastify";
// import { user_storage_token } from "../../../config";
import { user_storage_token } from "../../config";
import DisplayMessage from "../Message";
// import DisplayMessage from "../../../Components/Message";
// import { adminCreateAgent } from '../../../Sagas/Requests';
import { adminCreateAgent } from "../../Sagas/Requests";
import Compress from "react-image-file-resizer";
// import PrimaryInput from "../../../Components/inputs/PrimaryInput";
import PrimaryInput from "../inputs/PrimaryInput";
// import PrimaryButton from "../../../Components/buttons/primaryButton";
import PrimaryButton from "../buttons/primaryButton";




const CreateAgent = ({ on, off, check, success, onSuccess, offSuccess }) => {
    const token = localStorage.getItem('userToken') || '';
    const [imageFile, setimageFile] = useState('')
    const [profileImage, setprofileImage] = useState('')
    const [loading, setLoading] = useState(false);
    const [secureText, setSecureText] = useState(true);
    const [secureCText, setSecureCText] = useState(true);

    const [initialValues, setInitialValues] = useState({
        firstName: '', lastName: '', phoneNumber: '',
        email: '', password: '', confirmPassword: '',
        username: '',
        address: '', profilePic: ''
    });


    const validationSchema = yup.object().shape({
        firstName: yup.string().typeError('Must be a string').required('First name is required'),
        lastName: yup.string().typeError('Must be a string').required('Last name is required'),
        phoneNumber: yup.string().typeError('Must be a string').required('Phone number Is required'),
        email: yup.string().email().typeError('Must be a valid email').required('Email Is required'),
        password: yup.string().typeError('Must be a string').required('Password Is required'),
        confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required('Pls confirm password'),
        address: yup.string().typeError('Must be a string').required('Address Is required'),
    });

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

    async function createAdminAccount(value, action) {
        setLoading(true);
        try {
            let formdata = new FormData();
            formdata.append("first_name", value.firstName);
            formdata.append("last_name", value.lastName);
            formdata.append("folder", "admin");
            formdata.append("username", value.firstName);
            formdata.append("image", profileImage);
            formdata.append("email", value.email);
            formdata.append("address", value.address);
            formdata.append("mobile", value.phoneNumber);
            formdata.append("password", value.password);

            const response = await adminCreateAgent(formdata, token)
            const { success, message } = response?.data
            if (response?.data && success === true) {
                off();
                action.resetForm();
                onSuccess();
                setLoading(false);
            }
            else {
                DisplayMessage(message, 'warning')
                setLoading(false)
            }
        } catch (error) {
            DisplayMessage(error.message, 'error')
        }
    }

    const resetData = () => {
        off()
    }

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            validateOnBlur
            onReset={resetData}
            onSubmit={(val, actions) => createAdminAccount(val, actions)}
        >
            {({
                values,
                handleChange,
                handleSubmit,
                handleReset,
                resetForm,
                errors,
                handleBlur,
                touched }) => (
                <>
                    <Modal show={on} centered size='lg' style={{ fontFamily: 'primary-font' }}>
                        <Modal.Header className="bg-info text-light">
                            <div>
                                Create new agent
                            </div>
                            <PrimaryButton
                                mWidth={'3em'}
                                textColor={'light'} variant={'grey'} icon={"bi bi-x-circle"}
                                action={() => {
                                    handleReset()
                                }} />
                            {/* <Button
                                style={{ cursor: 'pointer' }}
                            >
                                <i

                                    onClick={() => {
                                        off()
                                    }}
                                    className=""></i>
                            </Button> */}

                            {/* <Col  className='d-flex  px-3 justify-content-end'
                                
                            >X</Col> */}
                        </Modal.Header>
                        <ModalBody className="d-flex justify-content-center">
                            <form onSubmit={handleSubmit} onReset={handleReset} className="w-100" style={{ fontFamily: 'primary-font' }}>
                                <div className="w-100 justify-content-center d-flex gap-5">
                                    <div>
                                        <PrimaryInput
                                            value={values.firstName}
                                            blure={handleBlur}
                                            touched={touched['firstName']}
                                            name={'firstName'}
                                            change={handleChange}
                                            error={errors.firstName}
                                            icon={"bi-person-fill"}
                                            placeHolder={"First name"}
                                        />
                                    </div>
                                    <div>
                                        <PrimaryInput
                                            value={values.lastName}
                                            blure={handleBlur}
                                            error={errors.lastName}
                                            touched={touched['lastName']}
                                            change={handleChange}
                                            placeHolder={'Last name'}
                                            name={'lastName'}
                                            icon={"bi bi bi-people-fill"} />
                                    </div>
                                </div>

                                <div className="w-100 d-flex gap-5 justify-content-center">
                                    <div>
                                        <PrimaryInput
                                            value={values.phoneNumber}
                                            blure={handleBlur}
                                            change={handleChange}
                                            error={errors.phoneNumber}
                                            touched={touched['phoneNumber']}
                                            placeHolder={'Phone number'}
                                            type={'number'}
                                            name={'phoneNumber'}
                                            icon={"bi bi-telephone-fill"} />
                                    </div>
                                    <div>
                                        <PrimaryInput
                                            value={values.email}
                                            blure={handleBlur}
                                            change={handleChange}
                                            placeHolder={'Email'}
                                            touched={touched['email']}
                                            type={'email'}
                                            name={'email'}
                                            error={errors.email}
                                            icon={"bi bi-envelope-fill"} />
                                    </div>
                                </div>

                                <div className="w-100 d-flex gap-5 justify-content-center">
                                    <div>
                                        <PrimaryInput
                                        icon2={"bi bi-eye-slash-fill"}
                                        type='password'
                                            value={values.password}
                                            blure={handleBlur}
                                            change={handleChange}
                                            placeHolder={'Password'}
                                            name={'password'}
                                            icon={"bi bi-lock-fill"}
                                            error={errors.password}
                                            touched={touched['password']}
                                        />
                                    </div>
                                    <div>
                                        <PrimaryInput
                                        type='password'
                                        icon2={"bi bi-eye-slash-fill"}
                                            value={values.confirmPassword}
                                            blure={handleBlur}
                                            change={handleChange}
                                            placeHolder={'Confirm password'}
                                            error={errors.confirmPassword}
                                            touched={touched['confirmPassword']}
                                            name={'confirmPassword'} icon={"bi bi-lock-fill"} />
                                    </div>
                                </div>

                                <div className="w-100 d-flex gap-5 px-5 mt-4" style={{ marginLeft: '3em' }}>
                                    <div>
                                        <InputGroup className='bg-transparent   gap-2  rounded d-flex justify-content-start align-items-center'>

                                            <textarea
                                                value={values.address}
                                                type="input" onChange={handleChange} name="address" placeholder="Address" className="bg-transparent w-100" style={{ minWidth: '300px', height: '5em', outline: 'none' }} />
                                            <p
                                                className="text-danger mt-1"
                                                style={{
                                                    width: "20em",
                                                    minWidth: "15em",
                                                    fontSize: "0.7em",
                                                    textAlign: "start",
                                                }}
                                            >
                                                {touched['address'] && errors.address}
                                            </p>
                                        </InputGroup>
                                    </div>
                                    <div>
                                        <p>Upload picture</p>
                                        <InputGroup className="border-info">
                                            <input
                                                type='file' name="profilePic" placeholder="Image" style={{ width: '200px' }} onChange={(event) => {
                                                    handleChangeImage(event)
                                                }} />
                                            <p
                                                className="text-danger mt-1"
                                                style={{
                                                    width: "20em",
                                                    minWidth: "15em",
                                                    fontSize: "0.7em",
                                                    textAlign: "start",
                                                }}
                                            >
                                                {touched['profilePic'] && errors.profilePic}
                                            </p>
                                        </InputGroup>
                                    </div>
                                </div>

                                <div className="w-100 d-flex gap-5 px-5 mt-4" style={{ marginLeft: '3em' }}>
                                    <PrimaryButton disabled={loading} type={'submit'} textColor={'light'} bgColor={'info'} mWidth={'8em'}
                                        title={loading ? <Spinner size="sm" /> : 'Create'} />
                                    <PrimaryButton type='reset' border={'border'} action={off} textColor={'dark'} variant={'grey'} mWidth={'8em'} title={'Cancel'} />
                                    {/* <InputGroup className="">
                                        <Button variant="info" onClick={handleSubmit} disabled={Object.keys(errors).length !== 0}>{
                                            loading ? <Spinner className="spinner-grow-sm" style={{ fontSize: '0.5em' }} /> : 'Create'
                                        }</Button>
                                    </InputGroup>

                                    <InputGroup>
                                        <Button variant="info" onClick={off}>Cancel</Button>
                                    </InputGroup> */}

                                </div>

                            </form>
                            {/* <Form className="w-75 gap-3 d-flex justify-content-center">

                                <Row className="d-flex text-info flex-row w-100 m-0 w-100">
                                    <Col className="">
                                        <InputGroup className='bg-transparent border  px-2 gap-5 border-info rounded d-flex justify-content-start align-items-center'>
                                            <i className="bi bi-person-fill"></i>
                                            <input type="input" onChange={handleChange} name="firstName" placeholder="First name" className='py-2 px-2 bg-transparent  outline-0 border border-0' style={{ outline: 'none', fontFamily: 'Montserrat', minWidth: '13em' }} />

                                        </InputGroup>
                                    </Col>
                                    <Col>

                                        <InputGroup className='bg-transparent border  px-2 gap-2 border-info rounded d-flex justify-content-start align-items-center'>
                                            <i className="bi bi bi-people-fill"></i>
                                            <input type="input" onChange={handleChange} name="lastName" placeholder="Last name" className='py-2 px-2 bg-transparent  outline-0 border border-0' style={{ outline: 'none', fontFamily: 'Montserrat', minWidth: '13em' }} />

                                        </InputGroup>
                                    </Col>
                                </Row>

                                <Row className="d-flex m-0 flex-row w-100 mt-3  w-100">
                                    <Col>

                                        <InputGroup className='bg-transparent border  px-2 gap-2 border-info rounded d-flex justify-content-start align-items-center'>
                                            <i className="bi bi-telephone-fill"></i>
                                            <input type="input" onChange={handleChange} name="phoneNumber" placeholder="Phone number" className='py-2 px-2 bg-transparent  outline-0 border border-0' style={{ outline: 'none', fontFamily: 'Montserrat', minWidth: '13em' }} />

                                        </InputGroup>
                                    </Col>
                                    <Col>

                                        <InputGroup className='bg-transparent border  px-2 gap-2 border-info rounded d-flex justify-content-start align-items-center'>
                                            <i className="bi bi-envelope-fill"></i>
                                            <input type='email' name="email" onChange={handleChange} placeholder="Email" className='py-2 px-2 bg-transparent  outline-0 border border-0' style={{ outline: 'none', fontFamily: 'Montserrat', minWidth: '13em' }} />

                                        </InputGroup>
                                    </Col>
                                </Row>

                                <Row className="d-flex gap-2 m-0 flex-row w-100 mt-3  w-100">
                                    <Col>
                                        <InputGroup className='bg-transparent border  px-2 gap-2 border-info rounded d-flex justify-content-start align-items-center'>
                                            <i className="bi bi-lock-fill"></i>
                                            <input type={secureText && 'password'} onChange={handleChange} name="password" placeholder="Password" className='py-2 px-2 bg-transparent  outline-0 border border-0' style={{ outline: 'none', fontFamily: 'Montserrat', minWidth: '10em' }} />
                                            <i className={secureText ? "bi bi-eye-fill" : "bi bi-eye-slash-fill"} onClick={() => setSecureText(!secureText)}></i>
                                        </InputGroup>
                                    </Col>
                                    <Col>
                                        <InputGroup className='bg-transparent border  px-2 gap-2 border-info rounded d-flex justify-content-start align-items-center'>
                                            <i className="bi bi-lock-fill"></i>
                                            <input type={secureCText && 'password'} onChange={handleChange} name="confirmPassword" placeholder="Confirm password" className='py-2 px-2 bg-transparent  outline-0 border border-0' style={{ outline: 'none', fontFamily: 'Montserrat', minWidth: '10em' }} />
                                            <i className={secureCText ? "bi bi-eye-fill" : "bi bi-eye-slash-fill"} onClick={() => setSecureCText(!secureCText)} ></i>
                                        </InputGroup>
                                    </Col>
                                </Row>

                                <Row className="d-flex m-0 flex-row w-100 mt-3  w-100">
                                    <Col>
                                        <InputGroup className='bg-transparent border  gap-2 border-info rounded d-flex justify-content-start align-items-center'>
                                            <textarea type="input" onChange={handleChange} name="address" placeholder="Address" className="bg-transparent w-100" style={{ width: '200px', height: '5em', outline: 'none' }} />
                                        </InputGroup>
                                    </Col>
                                    <Col>
                                        <p>Upload picture</p>
                                        <InputGroup className="border-info">
                                            <input type='file' name="image" placeholder="Image" style={{ width: '200px' }} onChange={(event) => {
                                                handleChangeImage(event)
                                            }} />
                                        </InputGroup>
                                    </Col>
                                </Row>

                                <Row className="d-flex m-0 flex-row mt-3 w-100">
                                    <Col>
                                        <InputGroup className="">
                                            <Button variant="info" onClick={handleSubmit} disabled={Object.keys(errors).length !== 0}>{
                                                loading ? <Spinner className="spinner-grow-sm" style={{ fontSize: '0.5em' }} /> : 'Create'
                                            }</Button>
                                        </InputGroup>
                                    </Col>
                                    <Col>
                                        <InputGroup>
                                            <Button variant="info" onClick={off}>Cancel</Button>
                                        </InputGroup>
                                    </Col>
                                </Row>
                            </Form> */}
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
export default CreateAgent;