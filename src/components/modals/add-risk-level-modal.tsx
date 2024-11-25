import React, { useEffect, useState } from "react";
import { Button, FormControl, FormSelect, Modal, ProgressBar, Spinner } from "react-bootstrap";
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { object, string, number, date, InferType } from 'yup';
import { getUserInfo } from "../../controllers/auth";
import { getCountries } from "../../utils/helpers";
import { ICountry } from "../../interfaces/country";
import { toast } from "react-toastify";
import apiUnAuth from "../../config/apiUnAuth";
import api from "../../config/api";

const AddRiskLevelModal: React.FC<any> = ({ userData,show, off }) => {
    const [countries, setCountries] = useState<ICountry[]>();
    const [loading,setLoading] = useState(false);
    const initialVal = {
        "id": userData?.Id,
        "businessName": userData?.BusinessName || '',
        "riskLevel": userData?.RiskLevel,
        
    }



    let validationSchem = object({
        businessName: string().required().label('Business name'),
        // id: number().typeError('Must be a number').required().label('ID Number'),
        riskLevel: string().required().label('Risk Level'),

        // policyDocument: string().required('Kindly upload a file'),

        // fileDescription: string().required('Description cannot be empty'),

        // age: number().required().positive().integer(),
        // email: string().email(),
        // website: string().url().nullable(),
        // createdOn: date().default(() => new Date()),
    });


    const createNewBMO = async (body: any) => {
        // toast.error('Hit!')
        setLoading(true)
        // console.log({seeBody:body})
        let userInfo = await getUserInfo();

        if (userInfo) {
            let apiBody = {
                "requesterName": `${userInfo?.profile.given_name} ${userInfo?.profile.family_name}`,
                "data": [
                  {
                    "beneficialOwnerId": body?.id,
                    "riskScore":body?.riskLevel=='LOW'?1:body?.riskLevel=='MEDIUM'?2:3
                  }
                ]
              }

            const res = await api.post(`riskLevel`, apiBody, `${userInfo?.access_token}`)
            if(res?.status==200){
                toast.success('Risk Level added succesfully');
                setLoading(false);
                off()
            } else{
                toast.error('Operation failed! Check your network');
                setLoading(false);
                
            }

        }
    }

    const handleGetCountries = async () => {
        const res = await getCountries();
        const sortedCountries = res.data.sort((a: any, b: any) =>
            a.name.common.localeCompare(b.name.common)
        );
        setCountries(sortedCountries)
    }


    useEffect(() => {
        handleGetCountries()
    }, [])

    return (
        <div>
            <Modal size="lg" show={show} centered>
                <Modal.Header className="d-flex justify-content-between"
                    style={{ fontFamily: 'title' }}>
                    <p className="p-0 m-0 text-primary">Add Risk Assessment </p>
                    <i className="bi bi-x-circle" onClick={() => off()}></i>
                </Modal.Header>
                <Modal.Body >
                    <Formik
                        initialValues={initialVal}
                        validationSchema={validationSchem}
                        onReset={off}
                        validateOnBlur
                        onSubmit={(val) => createNewBMO(val)
                        }
                    >{
                            ({ handleChange, handleSubmit, handleReset, values }) => (
                                <Form onSubmit={handleSubmit} onReset={handleReset} className="gap-0 px-3 slide-form">

                                    <div className="d-flex  justify-content-between my-3  gap-3 w-100">
                                        <div className="w-50">
                                            <label className="" htmlFor="userEmail">
                                                Name
                                            </label>
                                            <Field
                                            disabled
                                                // value={values.businessName}
                                                style={{ outline: 'none' }}
                                                className="rounded rounded-1 p-2  w-100 border border-1 border-grey"
                                                id='businessName' name='businessName'
                                            />
                                            <ErrorMessage
                                                name="businessName"
                                                component="div"
                                                className="text-danger fw-medium" />
                                        </div>

                                        <div className="w-50">
                                            <label className="" htmlFor="userEmail">
                                            Risk Rating 
                                            </label>

                                            <Field
                                                as="select"
                                                style={{ outline: 'none' }}
                                                className="rounded rounded-1 p-2 outline form-control-outline w-100 border border-1 border-grey"
                                                id='riskLevel' name='riskLevel'>
                                                <option className="text-success" value={values.riskLevel}>{values.riskLevel?values.riskLevel:'Select'}</option>
                                                <option className="text-success" value={'LOW'}>Low</option>
                                                <option className="text-warning" value={'MEDIUM'}>Medium</option>
                                                <option className="text-danger" value={'HIGH'}>High</option>
                                            </Field>
                                            <ErrorMessage
                                                name="riskLevel"
                                                component="div"
                                                className="text-danger fw-medium" />
                                        </div>
                                    </div>

                                    


                                    <div className="d-flex  justify-content-end my-3  gap-3 w-100">
                                        {/* <div className="w-50">
                                            <Button className="mt-3 w-100 border border-2" type="reset" variant="outline">Cancel</Button>
                                        </div> */}

                                        <div className="w-50">
                                            <Button className="w-100 rounded rounded-1" type="submit" variant="primary mt-3">{loading?<Spinner size="sm"/>:`Update Risk Assessment`}</Button>
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
export default AddRiskLevelModal;