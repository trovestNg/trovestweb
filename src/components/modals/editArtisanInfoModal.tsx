import React, { useEffect, useState } from "react";
import { Button, FormControl, FormSelect, Modal, ProgressBar, Spinner } from "react-bootstrap";
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { object, string, number, date, InferType, mixed, ref } from 'yup';
import api from "../../config/api";
import { calculatePercent, getCountries } from "../../utils/helpers";
import { ICountr, ICountry } from "../../interfaces/country";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import style from './upload.module.css';

const EditArtisanInfoModal: React.FC<any> = ({ show, off, agentInfo, agentId}) => {
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
       
        full_name: agentInfo?.full_name || '',
        last_name: agentInfo?.last_name || '',
        username: agentInfo?.username || '',
        email: agentInfo?.email || '',
        address: agentInfo?.address || '',
        mobile: agentInfo?.mobile || '',

    }

    const handleToggleSecured = (field: string) => {
        if (field == 'p') {
            setSecuredText(!secureText)
        } else {
            setSecuredTextConf(!secureTextConf)
        }

    }


    let validationSchem = object({
        full_name: string().required().label('Full name'),
        email: string().email().required().label('Email'),
        address: string().required().label('Address'),
        mobile: string().required().label('Phonenumber'),

    });


    const createNewAgent = async (body: any) => {
        console.log(body)
        
         try {
        
            setLoading(true)
            const res = await api.patch(`admin/update-artisan/${agentId}`,body,token);
            if(res?.data?.success){
                toast.success('Customer info updated succesfully');
                setLoading(false);
                setFileName('');
                setFileUrl('')
                off();
                window.location.reload()
            } else {
                toast.error('Error Updating customer info');
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
                    <p className="p-0 m-0 text-secondary">Update Customer Info</p>
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
                                            <label className="" htmlFor="full_name">
                                                Full name
                                            </label>
                                            <Field
                                                value={values.full_name}
                                                style={{ outline: 'none' }}
                                                className="rounded rounded-1 p-2  w-100 border border-1 border-grey"
                                                id='full_name' name='full_name'
                                            />
                                            <ErrorMessage
                                                name="full_name"
                                                component="div"
                                                className="text-danger fw-medium" />
                                        </div>

                                        <div className="w-50">
                                            <label className="" htmlFor="mobile">
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
                                    </div>

                                    <div className="d-flex  justify-content-between my-3  gap-3 w-100">
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

                                    </div>

                                    <div className="d-flex  justify-content-between my-3  gap-3 w-100">
                                        <div className="w-50">
                                            <Button className="mt-3 w-100 border border-2" type="reset" variant="outline">Cancel</Button>
                                        </div>

                                        <div className="w-50">
                                            <Button disabled={loading} className="w-100 rounded rounded-1" type="submit" variant="secondary mt-3">{loading ? <Spinner size="sm" /> : 'Update'}</Button>
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
export default EditArtisanInfoModal;