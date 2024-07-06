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
import { adminCreateAgent, resetAgentPassword } from "../../Sagas/Requests";
import Compress from "react-image-file-resizer";
// import PrimaryInput from "../../../Components/inputs/PrimaryInput";
import PrimaryInput from "../inputs/PrimaryInput";
// import PrimaryButton from "../../../Components/buttons/primaryButton";
import PrimaryButton from "../buttons/primaryButton";
import { setAdminAction } from "../../Reducers/admin.reducer";




const ResetAgentPassword = ({ on, off, check, success, onSuccess, offSuccess, info,reload }) => {
    const token = localStorage.getItem('userToken') || '';
    const [imageFile, setimageFile] = useState('')
    const [profileImage, setprofileImage] = useState('')
    const [loading, setLoading] = useState(false);
    const [secureText, setSecureText] = useState(true);
    const [secureCText, setSecureCText] = useState(true);

    const initialValues={
     password: '', 
     confirmPassword: ''
    };


    const validationSchema = yup.object().shape({
        password: yup.string().typeError('Must be a string').required('Password Is required'),
        confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required('Pls confirm password'),
        
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

    async function handleResetPassword(value, action) {
        setLoading(true);
        try {

            let payload ={ pass :value?.password, token:token, userId:info?._id } 

            const response = await resetAgentPassword (payload)
            const { success, message } = response?.data
            if (response?.data && success === true) {
                off();
                reload();
                toast.success('Agent new password created!')
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
            onSubmit={(val, actions) => handleResetPassword(val, actions)}
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
                            <div className="text-capitalize">
                               {`Reset password for Agent ${info?.first_name} ${info?.last_name}`}
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
                                    <PrimaryButton disabled={loading} type={'submit'} textColor={'light'} bgColor={'info'} mWidth={'8em'}
                                        title={loading ? <Spinner size="sm" /> : 'Create'} />
                                    <PrimaryButton type='reset' border={'border'} action={off} textColor={'dark'} variant={'grey'} mWidth={'8em'} title={'Cancel'} />
                                </div>

                            </form>
                            
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
export default ResetAgentPassword;