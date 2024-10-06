import React, { useEffect, useState } from "react";
import { Button, FormControl, FormSelect, Modal, ProgressBar, Spinner } from "react-bootstrap";
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { object, string, number, date, InferType } from 'yup';
import api from "../../config/api";
import { getUserInfo } from "../../controllers/auth";
import { getCountries } from "../../utils/helpers";
import { ICountr, ICountry } from "../../interfaces/country";
import { toast } from "react-toastify";

const EditeBMOOwnerIndModal: React.FC<any> = ({ show, off, parentInf,custormerNumb,lev, ownerInfo}) => {
    const [countries, setCountries] = useState<ICountr[]>()
    const [idTypes, setIdTypes] = useState<string[]>();
    const [loading,setLoading] = useState(false);

    // console.log({hereisParent:parent,hereIdNumber:custormerNumb})
    const initialVal = {
        "businessName": ownerInfo?.BusinessName || '',
        "bvn": ownerInfo?.BVN || null,
        "idType": ownerInfo?.idType || ownerInfo?.IdType,
        "idNumber": ownerInfo?.IdNumber || '',
        "countryId": ownerInfo?.CountryId || '',
        "percentageHolding": ownerInfo?.PercentageHolding || '',
        "numberOfShares": ownerInfo?.NumberOfShares || '',
        "isPEP": ownerInfo?.IsPEP ? 'Yes': 'No',
        "categoryId": "I",
        "Id": ownerInfo?.Id || '',
        "sourceOfWealth": ownerInfo?.sourceOfWealth || ownerInfo?.SourceOfWealth || '',
        "remark":ownerInfo?.remark || ownerInfo?.Remark ||'',
        
    }



    let validationSchem = object({
        businessName: string().required().label('Business name'),
        countryId: string().required().label('Country'),
        percentageHolding: number().typeError('Must be a number').required().label('Percentage holding'),
        numberOfShares: number().typeError('Must be a number').required().label('No of share'),
        bvn: number().typeError('Must be a number').required().label('Bvn'),
        isPEP: string().required().label('Politicaly Exposed Status'),
        idType: string().required().label('ID Type'),
        idNumber: string().required().label('ID Number'),
        sourceOfWealth: string().required().label('Source of wealth'),
        remark: string().required().label('Remark'),
        // ticker: string().required().label('Ticker'),

        // policyDocument: string().required('Kindly upload a file'),

        // fileDescription: string().required('Description cannot be empty'),

        // age: number().required().positive().integer(),
        // email: string().email(),
        // website: string().url().nullable(),
        // createdOn: date().default(() => new Date()),
    });


    const createNewBMO = async (body: any) => {
        setLoading(true)
        // console.log({ seeBody: body })
        let userInfo = await getUserInfo();



        if (userInfo) {

            const apiBody = {
                "requesterName": `${userInfo?.profile.given_name} ${userInfo?.profile.family_name}`,
                "parent": {...parentInf,originalId:custormerNumb,CategoryId:'I',CountryId:"NG", Level:+lev},
                "beneficialOwners": [
                    {
                        ...body,
                        "customerNumber": custormerNumb,
                        "rcNumber": "",
                        "categoryId": "I",
                        "isPEP":body?.isPEP=='yes'?true:false,
                        "IdType":body?.idType,
                        "BVN":body?.bvn
                        
                    }
                   
                    // {
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
            if (res?.status==200) {
                setLoading(false);
                toast.success('BO Updated succesfully');
                off()
            } else {
                toast.error('Operation failed! Check your network');
                setLoading(false);
            }

        }
    }

    const handleGetCountries = async () => {
        try {
            let userInfo = await getUserInfo();
            const res = await api.get(`countries?requesterName=${userInfo?.profile.given_name}`, `${userInfo?.access_token}`);
            console.log({countHere:res})
            // const sortedCountries = res?.data.sort((a: any, b: any) =>
            //     a.name.common.localeCompare(b.name.common)
            // );
            setCountries(res?.data)
        } catch (error) {

        }
    }

    const handleGetIdTypes = async () => {
        try {
            let userInfo = await getUserInfo();
            const res = await api.get(`idTypes?requesterName=${userInfo?.profile.given_name}`, `${userInfo?.access_token}`)
           
            setIdTypes(res?.data)
        } catch (error) {

        }
    }


    useEffect(() => {
        handleGetCountries();
        handleGetIdTypes()
    }, [])

    return (
        <div>
            <Modal size="lg" show={show} centered>
                <Modal.Header className="d-flex justify-content-between"
                    style={{ fontFamily: 'title' }}>
                    <p className="p-0 m-0 text-primary">Edit Beneficial Owner Individual </p>
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
                                                    countries && countries.map((country: ICountr,index:number) => (
                                                        <option key={index} value={country.id}>{country.displayName}</option>
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
                                            <label className="" htmlFor="userEmail">
                                                Holding %
                                            </label>
                                            <Field
                                                // value={values.percentageHolding}
                                                style={{ outline: 'none' }}
                                                className="rounded rounded-1 p-2 outline form-control-outline w-100 border border-1 border-grey"
                                                id='percentageHolding' name='percentageHolding' />
                                            <ErrorMessage
                                                name="percentageHolding"
                                                component="div"
                                                className="text-danger fw-medium" />
                                        </div>

                                        <div className="w-50">
                                            <label className="" htmlFor="userEmail">
                                                No of Shares
                                            </label>
                                            <Field
                                                value={values.numberOfShares}
                                                style={{ outline: 'none' }}
                                                className="rounded rounded-1 p-2 outline form-control-outline w-100 border border-1 border-grey"
                                                id='numberOfShares' name='numberOfShares' />
                                            <ErrorMessage
                                                name="numberOfShares"
                                                component="div"
                                                className="text-danger fw-medium" />
                                        </div>
                                    </div>

                                    <div className="d-flex  justify-content-between my-3  gap-3 w-100">
                                        <div className="w-50">
                                            <label className="" htmlFor="userEmail">
                                                BVN
                                            </label>
                                            <Field
                                                // value={values.bvn}
                                                style={{ outline: 'none' }}
                                                className="rounded rounded-1 p-2 outline form-control-outline w-100 border border-1 border-grey"
                                                id='bvn' name='bvn' />
                                            <ErrorMessage
                                                name="bvn"
                                                component="div"
                                                className="text-danger fw-medium" />
                                        </div>

                                        <div className="w-50">
                                            <label className="" htmlFor="isPEP">
                                                PEP
                                            </label>
                                            <Field
                                                as="select"
                                                style={{ outline: 'none' }}
                                                className="rounded rounded-1 p-2 outline form-control-outline w-100 border border-1 border-grey"
                                                id='isPEP' name='isPEP'>
                                                <option value={values.isPEP?'yes':'no'}>{values.isPEP?'Yes':'No'}</option>
                                                <option value={'yes'}>Yes</option>
                                                <option value={'no'}>No</option>

                                            </Field>
                                            <ErrorMessage
                                                name="isPEP"
                                                component="div"
                                                className="text-danger fw-medium" />
                                        </div>
                                    </div>


                                    <div className="d-flex justify-content-between my-3  gap-3 w-100">
                                        <div className="w-50">
                                            <label className="" htmlFor="userEmail">
                                                ID Type
                                            </label>
                                            <Field
                                                as="select"
                                                style={{ outline: 'none' }}
                                                className="rounded rounded-1 p-2 outline form-control-outline w-100 border border-1 border-grey"
                                                id='idType' name='idType'>
                                                <option value={values.idType}>{values.idType}</option>
                                                {
                                                    idTypes?.map((idType:string,index:number)=>(<option key={index}  value={idType}>{idType}</option>)
                                                    )
                                                }

                                            </Field>
                                            <ErrorMessage
                                                name="idType"
                                                component="div"
                                                className="text-danger fw-medium" />
                                        </div>

                                        <div className="w-50">
                                            <label className="" htmlFor="userEmail">
                                                ID Number
                                            </label>
                                            <Field
                                                // value={values.idNumber}
                                                style={{ outline: 'none' }}
                                                className="rounded rounded-1 p-2 w-100 border border-1 border-grey"
                                                id='idNumber' name='idNumber' />
                                            <ErrorMessage
                                                name="idNumber"
                                                component="div"
                                                className="text-danger fw-medium" />
                                        </div>

                                        
                                    </div>


                                    <div className="d-flex justify-content-between my-3  gap-3 w-100">
                                    <div className="w-50">
                                            <label className="" htmlFor="userEmail">
                                                Source of Wealth
                                            </label>
                                            <Field
                                                
                                                style={{ outline: 'none' }}
                                                className="rounded rounded-1 p-2 outline form-control-outline w-100 border border-1 border-grey"
                                                id='sourceOfWealth' name='sourceOfWealth'>

                                            </Field>
                                            <ErrorMessage
                                                name="sourceOfWealth"
                                                component="div"
                                                className="text-danger fw-medium" />
                                        </div>

                                        <div className="w-50">
                                            <label className="" htmlFor="userEmail">
                                                Remark
                                            </label>
                                            <Field
                                            as='textarea'
                                                // value={values.idNumber}
                                                style={{ outline: 'none' }}
                                                className="rounded rounded-1 p-2 w-100 border border-1 border-grey"
                                                id='remark' name='remark' />
                                            <ErrorMessage
                                                name="remark"
                                                component="div"
                                                className="text-danger fw-medium" />
                                        </div>

                                        
                                    </div>

                                    

                                    <div className="d-flex  justify-content-between my-3  gap-3 w-100">
                                        <div className="w-50">
                                            <Button className="mt-3 w-100 border border-2" type="reset" variant="outline">Cancel</Button>
                                        </div>

                                        <div className="w-50">
                                            <Button disabled={loading} className="w-100 rounded rounded-1" type="submit" variant="primary mt-3">{loading? <Spinner size="sm"/>:'Submit for Approval'}</Button>
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
export default EditeBMOOwnerIndModal;