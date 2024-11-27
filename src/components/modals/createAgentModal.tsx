import React, { useEffect, useState } from "react";
import { Button, FormControl, FormSelect, Modal, ProgressBar, Spinner } from "react-bootstrap";
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { object, string, number, date, InferType, mixed, ref } from 'yup';
import api from "../../config/api";
import { getUserInfo } from "../../controllers/auth";
import { calculatePercent, getCountries } from "../../utils/helpers";
import { ICountr, ICountry } from "../../interfaces/country";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import style from './upload.module.css';

const CreateAgentModal: React.FC<any> = ({ show, off, lev, parent, custormerNumb, ownerId, totalOwners }) => {
    const userToken = localStorage.getItem('token') || '';
    const token = JSON.parse(userToken);

    const [countries, setCountries] = useState<ICountr[]>()
    const [idTypes, setIdTypes] = useState<string[]>();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [fileName, setFileName] = useState('');
    const [fileUrl, setFileUrl] = useState('');
    const [secureText, setSecuredText] = useState(false);
    const [secureTextConf, setSecuredTextConf] = useState(false);


    const handleFileChange = (event: any, setFieldValue: any) => {
        console.log(event)
        const file = event.currentTarget.files[0];

        if (file) {
            let path = URL.createObjectURL(file)
            setFileName(file.name);
            setFileUrl(path);
            setFieldValue('image', file);
        }
    };

    // console.log({hereisParent:parent,hereIdNumber:custormerNumb})
    const initialVal = {
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        address: '',
        mobile: '',
        password: '',
        confirmPassword: '',
        image: null,

    }

    const handleToggleSecured = (field: string) => {
        if (field == 'p') {
            setSecuredText(!secureText)
        } else {
            setSecuredTextConf(!secureTextConf)
        }

    }


    let validationSchem = object({
        first_name: string().required().label('First name'),
        last_name: string().required().label('Last name'),
        email: string().email().required().label('Email'),
        address: string().required().label('Address'),
        mobile: string().required().label('Phonenumber'),
        password: string().required().label('Password'),
        confirmPassword: string()
            .oneOf([ref('password')], 'Passwords must match')
            .required('Confirm Password is required')
            .label('Confirm Password'),
        image: mixed()
            .required('A pic is required'),

    });


    const createNewAgent = async (body: any) => {
        console.log(body)
        
         try {
        let formData = new FormData()

        formData.append('first_name', body?.first_name)
        formData.append('last_name', body?.last_name)
        formData.append('username', body?.first_name)
        formData.append('image', body.image)
        formData.append('email', body?.email)
        formData.append('address', body?.address)
        formData.append('mobile', body?.mobile)
        formData.append('password', body?.password)
        formData.append('folder', 'admin')
        console.log(body)
            setLoading(true)
            const res = await api.postForm('admin/create-agent',formData,token);
            if(res?.data?.success){
                toast.success('New agent created succesfully!');
                setLoading(false);
                setFileName('');
                setFileUrl('')
                off()
            } else {
                toast.error('Error creating agent');
                setLoading(false)
            }
         } catch (error) {
            toast.error('Network error')
            setLoading(false)
         }


    }

    return (
        <div>
            <Modal size="lg" show={show} centered>
                <Modal.Header className="d-flex justify-content-between"
                    style={{ fontFamily: 'title' }}>
                    <p className="p-0 m-0 text-secondary">Create New Agent</p>
                    <i className="bi bi-x-circle" onClick={() => off()}></i>
                </Modal.Header>
                <Modal.Body >
                    <Formik
                        initialValues={initialVal}
                        validationSchema={validationSchem}
                        onReset={()=>{setFileUrl('');setFileName('');off()}}
                        validateOnBlur
                        onSubmit={(val) => createNewAgent(val)
                        }
                    >{
                            ({ handleSubmit, handleReset, values, setFieldValue, touched, errors }) => (
                                <Form onSubmit={handleSubmit} onReset={handleReset} className="gap-0 px-3 slide-form">

                                    <div className="d-flex  justify-content-between my-3  gap-3 w-100">
                                        <div className="w-50">
                                            <label className="" htmlFor="userEmail">
                                                First Name
                                            </label>
                                            <Field
                                                value={values.first_name}
                                                style={{ outline: 'none' }}
                                                className="rounded rounded-1 p-2  w-100 border border-1 border-grey"
                                                id='first_name' name='first_name'
                                            />
                                            <ErrorMessage
                                                name="first_name"
                                                component="div"
                                                className="text-danger fw-medium" />
                                        </div>

                                        <div className="w-50">
                                            <label className="" htmlFor="last_name">
                                                Last Name
                                            </label>
                                            <Field
                                                value={values.last_name}
                                                style={{ outline: 'none' }}
                                                className="rounded rounded-1 p-2  w-100 border border-1 border-grey"
                                                id='last_name' name='last_name'
                                            />
                                            <ErrorMessage
                                                name="last_name"
                                                component="div"
                                                className="text-danger fw-medium" />
                                        </div>
                                    </div>

                                    <div className="d-flex  justify-content-between my-3  gap-3 w-100">
                                        <div className="w-50">
                                            <label className="" htmlFor="userEmail">
                                                Phone number
                                            </label>
                                            <Field
                                                value={values.mobile}
                                                style={{ outline: 'none' }}
                                                className="rounded rounded-1 p-2  w-100 border border-1 border-grey"
                                                id='mobile' name='mobile'
                                            />
                                            <ErrorMessage
                                                name="mobile"
                                                component="div"
                                                className="text-danger fw-medium" />
                                        </div>

                                        <div className="w-50">
                                            <label className="" htmlFor="email">
                                                Email
                                            </label>
                                            <Field
                                                value={values.email}
                                                style={{ outline: 'none' }}
                                                className="rounded rounded-1 p-2  w-100 border border-1 border-grey"
                                                id='email' name='email'
                                            />
                                            <ErrorMessage
                                                name="email"
                                                component="div"
                                                className="text-danger fw-medium" />
                                        </div>
                                    </div>




                                    <div className="d-flex justify-content-between my-3 align-items-center  gap-3 w-100">
                                        <div className="w-50">
                                            <label className="" htmlFor="userEmail">
                                                Home address
                                            </label>
                                            <Field
                                                as='textarea'
                                                // value={values.idNumber}
                                                style={{ outline: 'none' }}
                                                className="rounded rounded-1 p-2 w-100 border border-1 border-grey"
                                                id='address' name='address' />
                                            <ErrorMessage
                                                name="address"
                                                component="div"
                                                className="text-danger fw-medium" />
                                        </div>

                                        <div className="w-50">
                                            <label className="" htmlFor="image">
                                                Profile pic
                                            </label>
                                            <div>
                                                <label htmlFor="image" className={`p-4 w-100 text-center text-primary border-1 m-0 ${style.fileUploadLabel}`}>
                                                    {<i className="bi bi-file-earmark-pdf"></i>}
                                                    {fileName == '' ? ' Click to upload file' : ' Click to Replace File'}

                                                </label>

                                                <input
                                                    id="image"
                                                    name="image"
                                                    type="file"
                                                    className={`p-2 ${style.fileInput}`}
                                                    onChange={(event) => handleFileChange(event, setFieldValue)}

                                                // {handleFileChange(event: any) => {
                                                //     setFieldValue("policyDocument", event.currentTarget.files[0]);
                                                // }}
                                                />
                                            </div>

                                            {fileName == '' ?
                                                <div className="px-3 d-flex mt-2">
                                                    {fileName && <i className="bi bi-file-earmark-pdf text-danger"></i>}
                                                    <a href={fileUrl} target="_blank" className="px-1 text-primary">{fileName}</a>
                                                </div> :
                                                <div className="mt-2 d-flex">
                                                    {fileName &&
                                                        <div className="px-3 d-flex">
                                                            {/* <i className="bi bi-file-earmark-pdf text-danger"></i> */}
                                                            <a href={fileUrl} target="_blank" className="px-1 text-primary">{fileName}</a>
                                                        </div>}
                                                </div>
                                            }
                                            <ErrorMessage
                                                name="image"
                                                component="div"
                                                className="text-danger fw-medium" />
                                        </div>

                                    </div>

                                    <div className="d-flex  justify-content-between my-3  gap-3 w-100">
                                        <div className="w-50">
                                            <label className="" htmlFor="password">
                                                Password
                                            </label>
                                            <div className="d-flex align-items-center">
                                                <Field
                                                    value={values.password}
                                                    type={secureText ? 'text' : 'password'}
                                                    style={{ outline: 'none' }}
                                                    className="rounded rounded-1 p-2  w-100 border border-1 border-grey"
                                                    id='password' name='password'
                                                />
                                                <i
                                                    onClick={() => handleToggleSecured('p')}
                                                    role="button" className="bi bi-eye-slash" style={{ marginLeft: '-2em' }}></i>
                                            </div>

                                            <ErrorMessage
                                                name="password"
                                                component="div"
                                                className="text-danger fw-medium" />

                                        </div>

                                        <div className="w-50">
                                            <label className="" htmlFor="confirmPassword">
                                                Confirm Password
                                            </label>
                                            <div className="d-flex align-items-center">
                                                <Field
                                                    value={values.confirmPassword}
                                                    type={secureTextConf ? 'text' : 'password'}
                                                    style={{ outline: 'none' }}
                                                    className="rounded rounded-1 p-2  w-100 border border-1 border-grey"
                                                    id='confirmPassword' name='confirmPassword'
                                                />
                                                <i
                                                    onClick={() => handleToggleSecured('c')}
                                                    role="button" className="bi bi-eye-slash" style={{ marginLeft: '-2em' }}></i>
                                            </div>

                                            <ErrorMessage
                                                name="confirmPassword"
                                                component="div"
                                                className="text-danger fw-medium" />

                                        </div>
                                    </div>

                                    <div className="d-flex  justify-content-between my-3  gap-3 w-100">
                                        <div className="w-50">
                                            <Button className="mt-3 w-100 border border-2" type="reset" variant="outline">Cancel</Button>
                                        </div>

                                        <div className="w-50">
                                            <Button disabled={loading} className="w-100 rounded rounded-1" type="submit" variant="secondary mt-3">{loading ? <Spinner size="sm" /> : 'Create'}</Button>
                                        </div>
                                    </div>
                                </Form>)
                        }
                    </Formik>
                </Modal.Body>
            </Modal>
        </div>
    )
}
export default CreateAgentModal;