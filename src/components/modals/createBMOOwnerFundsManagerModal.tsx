import React, { useEffect, useState } from "react";
import { Button, FormControl, FormSelect, Modal, ProgressBar } from "react-bootstrap";
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { object, string, number, date, InferType } from 'yup';
import api from "../../config/api";
import { getUserInfo } from "../../controllers/auth";
import { getCountries } from "../../utils/helpers";
import { ICountry } from "../../interfaces/country";
import { toast } from "react-toastify";

const CreateBMOOwnerFundsManagerModal: React.FC<any> = ({ show, off }) => {
    const [countries, setCountries] = useState<ICountry[]>()
    const initialVal = {
        "id": '',
        "businessName": "",
        "customerNumber": "",
        "bvn": "",
        "idType": "",
        "idNumber": "",
        "countryId": "",
        "percentageHolding": '',
        "numberOfShares": '',
        "isPEP": "",
        "categoryId": "",
        "rcNumber": "",
        "ticker": ""
    }



    let validationSchem = object({
        businessName: string().required().label('Business name'),
        countryId: string().required().label('Country'),
        percentageHolding: number().typeError('Must be a number').required().label('Percentage holding'),
        numberOfShares: number().typeError('Must be a number').required().label('No of share'),
        bvn: number().typeError('Must be a number').required().label('Bvn'),
        isPEP: string().required().label('Politicaly Exposed Status'),
        idType: string().required().label('ID Type'),
        idNumber: number().typeError('Must be a number').required().label('ID Number'),

        // policyDocument: string().required('Kindly upload a file'),

        // fileDescription: string().required('Description cannot be empty'),

        // age: number().required().positive().integer(),
        // email: string().email(),
        // website: string().url().nullable(),
        // createdOn: date().default(() => new Date()),
    });

    const handleCreateNewBMO = () => {


    }

    const createNewBMO = async (body: any) => {
        console.log({seeBody:body})
        let userInfo = await getUserInfo();



        if (userInfo) {

            const apiBody = {
                "requesterName": `${userInfo?.profile.given_name} ${userInfo?.profile.family_name}`,
                "parent": {
                    
                    //   "id": 0,
                    //   "businessName": "string",
                    //   "customerNumber": "string",
                    //   "bvn": "string",
                    //   "idType": "string",
                    //   "idNumber": "string",
                    //   "countryId": "string",
                    //   "percentageHolding": 0,
                    //   "numberOfShares": 0,
                    //   "isPEP": true,
                    //   "categoryId": "string",
                    //   "rcNumber": "string",
                    //   "ticker": "string",
                    //   "originalId": 0,
                    //   "navigation": "string"
                },
                "beneficialOwners": [
                    body
                    // {
                    //     "id": 0,
                    //     "businessName": "string",
                    //     "customerNumber": "string",
                    //     "bvn": "string",
                    //     "idType": "string",
                    //     "idNumber": "string",
                    //     "countryId": "string",
                    //     "percentageHolding": 0,
                    //     "numberOfShares": 0,
                    //     "isPEP": true,
                    //     "categoryId": "string",
                    //     "rcNumber": "string",
                    //     "ticker": "string"
                    // }
                ]
            }

            const res = await api.post(``, apiBody, `${userInfo?.access_token}`)
            if(res?.data.success){
                toast.success('BMO added succesfully')
            } else{
                toast.error('Operation failed! Check your network')
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
                    <p className="p-0 m-0 text-primary">Funds Manager Beneficial Owner</p>
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
                                                value={values.businessName}
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
                                                Nationality
                                            </label>

                                            <Field
                                                as="select"
                                                style={{ outline: 'none' }}
                                                className="rounded rounded-1 p-2 outline form-control-outline w-100 border border-1 border-grey"
                                                id='countryId' name='countryId'>
                                                <option value={''}>Select</option>
                                                {
                                                    countries && countries.map((country: ICountry) => (
                                                        <option value={country.idd.suffixes}>{country.name.common}</option>
                                                    ))
                                                }
                                            </Field>
                                            <ErrorMessage
                                                name="countryId"
                                                component="div"
                                                className="text-danger fw-medium" />
                                        </div>
                                    </div>

                                    <div className="d-flex  justify-content-between my-3  gap-3 w-100">
                                    <div className="w-50">
                                            <label className="" htmlFor="isPEP">
                                                PEP
                                            </label>
                                            <Field
                                                as="select"
                                                style={{ outline: 'none' }}
                                                className="rounded rounded-1 p-2 outline form-control-outline w-100 border border-1 border-grey"
                                                id='isPEP' name='isPEP'>
                                                <option value={''}>Select</option>
                                                <option value={'yes'}>Yes</option>
                                                <option value={'no'}>No</option>

                                            </Field>
                                            <ErrorMessage
                                                name="isPEP"
                                                component="div"
                                                className="text-danger fw-medium" />
                                        </div>

                                        <div className="w-50">
                                            
                                        </div>
                                    </div>


                                    <div className="d-flex  justify-content-between my-3  gap-3 w-100">
                                        <div className="w-50">
                                            <Button className="mt-3 w-100 border border-2" type="reset" variant="outline">Cancel</Button>
                                        </div>

                                        <div className="w-50">
                                            <Button className="w-100 rounded rounded-1" type="submit" variant="primary mt-3">Submit for Approval </Button>
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
export default CreateBMOOwnerFundsManagerModal;