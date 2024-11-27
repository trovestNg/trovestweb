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

const ResetAgentPasswordModal: React.FC<any> = ({ show, off, agentInfo, agentId}) => {
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
        password: '',
        confirmPassword: '',
    }

    const handleToggleSecured = (field: string) => {
        if (field == 'p') {
            setSecuredText(!secureText)
        } else {
            setSecuredTextConf(!secureTextConf)
        }

    }
    let validationSchem = object({
        password: string().required().label('Password'),
        confirmPassword: string()
            .oneOf([ref('password')], 'Passwords must match')
            .required('Confirm Password is required')
            .label('Confirm Password'),

    });


    const createNewAgent = async (body: any) => {
        console.log(body)
        
         try {
        
            setLoading(true)
            const res = await api.patch(`admin/agent/password/${agentId}`,body,token);
            if(res?.data?.success){
                toast.success('Password Reset Succefully.');
                setLoading(false);
                setFileName('');
                setFileUrl('')
                off();
                window.location.reload()
            } else {
                toast.error('Error resetting password.');
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
                    <p className="p-0 m-0 text-secondary">Reset agent password</p>
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
                                            <label className="" htmlFor="password">
                                               Input New Password
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
                                                Confirm New Password
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
                                            <Button disabled={loading} className="w-100 rounded rounded-1" type="submit" variant="secondary mt-3">{loading ? <Spinner size="sm" /> : 'Reset'}</Button>
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
export default ResetAgentPasswordModal;