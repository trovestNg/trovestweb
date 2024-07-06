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
import { superCreateAdmin} from "../../Sagas/Requests";
import Compress from "react-image-file-resizer";
// import PrimaryInput from "../../../Components/inputs/PrimaryInput";
import PrimaryInput from "../inputs/PrimaryInput";
// import PrimaryButton from "../../../Components/buttons/primaryButton";
import PrimaryButton from "../buttons/primaryButton";




const CreateAdmin = ({ on, off, check, success, onSuccess, offSuccess }) => {
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

            const response = await superCreateAdmin(formdata, token)
            if (response?.data?.success) {
                off();
                action.resetForm();
                setLoading(false);
                toast.success('Admin created succesfully')
            }
            else {
                DisplayMessage(response?.data?.message, 'warning')
                setLoading(false)
            }
        } catch (error) {
            DisplayMessage(error.message, 'error')
            setLoading(false)
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
                        <Modal.Header className="bg-primary text-light">
                            <div>
                                Create new admin
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
                                        maxWidth={'18em'}
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
                                        maxWidth={'18em'}
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
                                    <PrimaryButton disabled={loading} type={'submit'} textColor={'light'} bgColor={'primary'} mWidth={'8em'}
                                        title={loading ? <Spinner size="sm" /> : 'Create'} />
                                    <PrimaryButton type='reset' border={'border'} action={off} textColor={'dark'} variant={'grey'} mWidth={'8em'} title={'Cancel'} />
                                   

                                </div>

                            </form>
                           
                        </ModalBody>
                    </Modal>
                   
                </>
            )}
        </Formik>

    )
}
export default CreateAdmin;