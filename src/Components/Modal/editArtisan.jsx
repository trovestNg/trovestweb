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
import { adminUpdateAgentBio } from "../../Sagas/Requests";
import Compress from "react-image-file-resizer";
// import PrimaryInput from "../../../Components/inputs/PrimaryInput";
import PrimaryInput from "../inputs/PrimaryInput";
// import PrimaryButton from "../../../Components/buttons/primaryButton";
import PrimaryButton from "../buttons/primaryButton";
import { useFormik } from "formik";
import { adminUpdateArtisanBio } from "../../Sagas/Requests";





const EditArtisan = ({ on, off, check, success, onSuccess, offSuccess, info, reload }) => {
    
    const token = localStorage.getItem('userToken') || '';
    const [imageFile, setimageFile] = useState('')
    const [profileImage, setprofileImage] = useState('')
    const [loading, setLoading] = useState(false);
    const [secureText, setSecureText] = useState(true);
    const [secureCText, setSecureCText] = useState(true);

    const initialValues = info? {
        ...info
    } : {

    }


    const validationSchema = yup.object().shape({
        full_name: yup.string().typeError('Must be a string').required('Full name is required'),
        mobile: yup.string().typeError('Must be a string').required('Phone number Is required'),
        email: yup.string().email().typeError('Must be a valid email').required('Email Is required'),
        address: yup.string().typeError('Must be a string').required('Address Is required'),
    });

  

    async function onSubmit (value, action) {
        setLoading(true);
        try {

            let body = {
                "full_name" : value?.full_name,
                "mobile" : value?.mobile,
                "email" : value?.email,
                "address" : value?.address
            }

            let payload = {
                token: token,
                body: body,
                artisanId: value?._id
            }
            const response = await adminUpdateArtisanBio(payload)
            const { success, message } = response?.data
            if (response?.data && success === true) {
                off();
                reload();
                setLoading(false);
                toast.success('Profile Updated Succesfully!')
            }
            else {
                DisplayMessage(message, 'warning')
                setLoading(false)
            }
        } catch (error) {
            DisplayMessage(error.message, 'error')
        }
    }

    const onReset =(val,action)=>{
        off()
    }

    const formik = useFormik({
        initialValues,
        onSubmit,
        onReset,
        validationSchema,
    })

    return (



        <form onSubmit={formik.handleSubmit} onReset={formik.handleReset} className="w-100" style={{ fontFamily: 'primary-font' }}>
            <div className="w-100 justify-content-start d-flex gap-5">
                <div className="px-5 mx-4">
                    <PrimaryInput
                        value={formik.values.full_name}
                        blure={formik.handleBlur}
                        touched={formik.touched['full_name']}
                        name={'full_name'}
                        change={formik.handleChange}
                        error={formik.errors.full_name}
                        icon={"bi-person-fill"}
                        placeHolder={"Full name"}
                    />
                </div>
            </div>

            <div className="w-100 d-flex gap-5 justify-content-center">
                <div>
                    <PrimaryInput
                        value={formik.values.mobile}
                        blure={formik.handleBlur}
                        change={formik.handleChange}
                        error={formik.errors.mobile}
                        touched={formik.touched['mobile']}
                        placeHolder={'Phone number'}
                        type={'number'}
                        name={'mobile'}
                        icon={"bi bi-telephone-fill"} />
                </div>
                <div>
                    <PrimaryInput
                        value={formik.values.email}
                        blure={formik.handleBlur}
                        change={formik.handleChange}
                        placeHolder={'Email'}
                        touched={formik.touched['email']}
                        type={'email'}
                        name={'email'}
                        error={formik.errors.email}
                        icon={"bi bi-envelope-fill"} />
                </div>
            </div>

            {/* <div className="w-100 d-flex gap-5 justify-content-center">
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
                                </div> */}

            <div className="w-100 d-flex gap-5 px-5 mt-4" style={{ marginLeft: '3em' }}>
                <div>
                    <InputGroup className='bg-transparent   gap-2  rounded d-flex justify-content-start align-items-center'>

                        <textarea
                            value={formik.values.address}
                            type="input" onChange={formik.handleChange} name="address" placeholder="Address" className="bg-transparent w-100" style={{ minWidth: '300px', height: '5em', outline: 'none' }} />
                        <p
                            className="text-danger mt-1"
                            style={{
                                width: "20em",
                                minWidth: "15em",
                                fontSize: "0.7em",
                                textAlign: "start",
                            }}
                        >
                            {formik.touched['address'] && formik.errors.address}
                        </p>
                    </InputGroup>
                </div>
               
            </div>

            <div className="w-100 d-flex gap-5 px-5 mt-4" style={{ marginLeft: '3em' }}>
               
                <PrimaryButton disabled={loading} type={'submit'} textColor={'light'} bgColor={'info'} mWidth={'8em'}
                    title={loading ? <Spinner size="sm" /> : 'Update'} />
                <PrimaryButton border={'border'} type={'reset'} textColor={'dark'} variant={'grey'} mWidth={'8em'} title={'Cancel'} />
               

            </div>

        </form>

    )
}
export default EditArtisan;