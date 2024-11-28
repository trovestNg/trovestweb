import React, { useEffect, useState } from "react";
import { Button, FormControl, FormSelect, Modal, ProgressBar, Spinner } from "react-bootstrap";
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { object, string, number, date, InferType, mixed, ref } from 'yup';
import api from "../../config/api";
import { calculatePercent, convertToThousand, getCountries } from "../../utils/helpers";
import { ICountr, ICountry } from "../../interfaces/country";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import style from './upload.module.css';

const DebitArtisanModal: React.FC<any> = ({ show, off, agentInfo, agentId, currentBalance }) => {
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

        amount: '',
    }

    const handleToggleSecured = (field: string) => {
        if (field == 'p') {
            setSecuredText(!secureText)
        } else {
            setSecuredTextConf(!secureTextConf)
        }

    }


    let validationSchem = object({
        amount: number().required('Enter amount to debit').label('Amount'),
    });


    const createNewAgent = async (body: any) => {
        if(+body?.debitAmount > +currentBalance){
            toast.error('You cannot debit more than available balance.')
        } else {
            try {

                setLoading(true)
                const res = await api.post(`admin/payout/${agentId}`, body, token);
                console.log({here:res})
                if (res?.data?.success) {
                    toast.success('Customer successful debited');
                    setLoading(false);
                    setFileName('');
                    setFileUrl('')
                    off();
                    window.location.reload()
                } else {
                    toast.error(res?.data?.message);
                    setLoading(false)
                }
            } catch (error) {
                toast.error('Network error')
                setLoading(false)
            }
        }
    }

    return (
        <div>
            <Modal size="lg" show={show} centered>
                <Modal.Header className="d-flex justify-content-between"
                    style={{ fontFamily: 'title' }}>
                    <p className="p-0 m-0 text-secondary">Debit Customer</p>
                    <i className="bi bi-x-circle" onClick={() => off()}></i>
                </Modal.Header>
                <Modal.Body >
                    <Formik
                        initialValues={initialVal}
                        validationSchema={validationSchem}
                        onReset={() => { setFileUrl(''); setFileName(''); off() }}
                        validateOnBlur
                        onSubmit={(val) => createNewAgent(val)
                        }
                    >{
                            ({ handleSubmit, handleReset, values, setFieldValue, touched, errors }) => (
                                <Form onSubmit={handleSubmit} onReset={handleReset} className="gap-0 px-3 slide-form">

                                    <div className="d-flex  justify-content-between my-3  gap-3 w-100">
                                        <p className="text-danger">{`Available balance : ${convertToThousand(currentBalance)}`}</p>

                                    </div>

                                    <div className="d-flex  justify-content-between my-3  gap-3 w-100">
                                        <div className="w-50">
                                            <label className="" htmlFor="debitAmount">
                                                Enter amount to debit
                                            </label>
                                            <Field
                                            type='number'
                                                // value={values.email}
                                                style={{ outline: 'none' }}
                                                className="rounded rounded-1 p-2  w-100 border border-1 border-grey"
                                                id='amount' name='amount'
                                            />
                                            <ErrorMessage
                                                name="amount"
                                                component="div"
                                                className="text-danger fw-medium" />
                                        </div>
                                    </div>


                                    <div className="d-flex mt-5 justify-content-between my-3  gap-3 w-100">
                                        <div className="w-50">
                                            <Button disabled={loading} className="w-100 rounded rounded-1" type="submit" variant="secondary mt-3">{loading ? <Spinner size="sm" /> : 'Debit'}</Button>
                                        </div>

                                        <div className="w-50">
                                            <Button className="mt-3 w-100 border border-2" type="reset" variant="outline">Cancel</Button>
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
export default DebitArtisanModal;