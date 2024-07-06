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
import { resetAdminPassword } from "../../Sagas/Requests";

import { setAdminAction } from "../../Reducers/admin.reducer";
import Compress from "react-image-file-resizer";
// import PrimaryInput from "../../../Components/inputs/PrimaryInput";
import PrimaryInput from "../inputs/PrimaryInput";
// import PrimaryButton from "../../../Components/buttons/primaryButton";
import PrimaryButton from "../buttons/primaryButton";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
     user_storage_name,
     user_storage_type,
    } from "../../config";




const ResetAdminPassword = ({ on, off, check, success, onSuccess, offSuccess, info,reload }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate()

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

    const logUserOut = () => {
        DisplayMessage("logged Out", "success");
        localStorage.removeItem(user_storage_name);
        localStorage.removeItem(user_storage_type);
        localStorage.removeItem(user_storage_token);
        localStorage.removeItem('current_user');
        localStorage.removeItem('userToken');

        const data = {
            agents: [],
            data: {},
            token: "",
        };
        dispatch(setAdminAction(data));
        return navigate("/");
    };

    async function handleResetPassword(value, action) {
        setLoading(true);
        try {

            let payload ={ pass :value?.password, token:token, userId:info?._id } 

            const response = await resetAdminPassword(payload);
            const { success, message } = response?.data
            if (response?.data && success === true) {
                off();
                reload();
                toast.success('New password succesfully created!')
                setLoading(false);
                logUserOut();
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
                               {`Reset your passwords`}
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

                            <form onSubmit={handleSubmit} onReset={handleReset} className="w-100 mt-4" style={{ fontFamily: 'primary-font' }}>
                                
                                <div className="w-100 d-flex gap-5 justify-content-center">
                                    <div>
                                        <PrimaryInput
                                        icon2={"bi bi-eye-slash-fill"}
                                        type='password'
                                            value={values.password}
                                            blure={handleBlur}
                                            change={handleChange}
                                            placeHolder={'New Password'}
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
                                            placeHolder={'Confirm New password'}
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
                                <p className="w-50 mt-5 text-center ">Note : Once you reset your password, you will be logged out so you can login again with the new password created.</p>
                            </form>
                            
                            
                        </ModalBody>
                    </Modal>
                </>
            )}
        </Formik>

    )
}
export default ResetAdminPassword;