import React, { useEffect, useState } from "react";
import { Button, FormControl, FormSelect, Modal, ProgressBar, Spinner } from "react-bootstrap";
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { object, string, number } from 'yup';
import api from "../../config/api";
import { getUserInfo } from "../../controllers/auth";
import { getCountries } from "../../utils/helpers";
import { ICountr, ICountry } from "../../interfaces/country";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CreateBMOOwnerCoperateModal: React.FC<any> = ({ show, off, parent, custormerNumb, lev, ownerId }) => {
    const [countries, setCountries] = useState<ICountr[]>()
    const [idTypes, setIdTypes] = useState<string[]>();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const initialVal = {
        "businessName": "",
        "countryId": "",
        "sourceOfWealth": "",
        "remark":'',
        "percentageHolding": '',
        "numberOfShares": '',
        "isPEP": "",
        "categoryId": "",
        "rcNumber": "",
        "Ticker": ""
    }



    let validationSchem = object({
        businessName: string().required().label('Business name'),
        countryId: string().required().label('Country'),
        percentageHolding: number().typeError('Must be a number').required().label('Percentage holding'),
        numberOfShares: number().typeError('Must be a number').required().label('No of share'),
        // isPEP: string().required().label('Politicaly Exposed Status'),
        rcNumber: string().required().label('Reg Number'),
        sourceOfWealth: string().required().label('Source of wealth'),
        remark: string().required().label('Source of wealth'),
        Ticker: string().required().label('Ticker'),

        // policyDocument: string().required('Kindly upload a file'),

        // fileDescription: string().required('Description cannot be empty'),

        // age: number().required().positive().integer(),
        // email: string().email(),
        // website: string().url().nullable(),
        // createdOn: date().default(() => new Date()),
    });

    const createNewBMO = async (body: any) => {
        setLoading(true)
        // console.log({seeBody:body})
        let userInfo = await getUserInfo();



        if (userInfo) {
            let parentInfo = {
                AuthorizeBy
                    :
                    parent?.AuthorizeBy,
                AuthorizeDate
                    :
                    parent?.AuthorizeDate,
                BVN
                    :
                    parent?.BVN,
                BusinessName
                    :
                    parent?.BusinessName,
                Category
                    :
                    parent?.Category,
                CategoryDescription
                    :
                    parent?.CategoryDescription,
                Comments
                    :
                    parent?. Comments,
                CountryId
                    :
                    parent?. CountryId,
                CountryName
                    :
                    parent?.CountryName,
                CreatedBy
                    :
                    parent?. CreatedBy,
                CreatedDate
                    :
                   parent?.CreatedDate,
                Id
                    :
                    parent?.Id,
                IdNumber
                    :
                    parent?.IdNumber,
                IdType
                    :
                    parent?.IdType,
                IsAuthorized
                    :
                    parent?.IsAuthorized,
                IsPEP
                    :
                    parent?.IsPEP,
                IsRejected
                    :
                    parent?.IsRejected,
                LastUpdatedBy
                    :
                    parent?.LastUpdatedBy,
                LastUpdatedDate
                    :
                    parent?.LastUpdatedDate,
                Level
                    :
                    parent?.Level,
                NumberOfShares
                    :
                    parent?.NumberOfShares,
                ParentId
                    :
                    parent?.ParentId,
                PercentageHolding
                    :
                    parent?.PercentageHolding,
                RcNumber
                    :
                    parent?.RcNumber,
                RejectedBy
                    :
                    parent?.RejectedBy,
                RejectedDate
                    :
                    parent?.RejectedDate,
                RiskLevel
                    :
                    parent?.RiskLevel,
                RiskScore
                    :
                    parent?.RiskScore,
                Ticker
                    :
                    parent?.Ticker,
            }

            const apiBody = {
                "requesterName": `${userInfo?.profile.given_name} ${userInfo?.profile.family_name}`,
                "parent": { ...parentInfo, originalId: custormerNumb?custormerNumb:ownerId, CategoryId: 'C', CountryId: "NG", Level: +lev },
                "beneficialOwners": [
                    {
                        ...body,
                        "categoryId": "C",
                        "isPEP": body?.isPEP == 'yes' ? true : false,

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

            console.log({ sending: apiBody })

            const res = await api.post(``, apiBody, `${userInfo?.access_token}`)
            if (res?.status==200) {
                setLoading(false);
                toast.success('BO added succesfully');
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
            console.log({ countHere: res })
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
                    <p className="p-0 m-0 text-primary">Corporate Beneficial Owner </p>
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
                                                    countries && countries.map((country: ICountr) => (
                                                        <option value={country.id}>{country.displayName}</option>
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
                                            <label className="" htmlFor="Ticker">
                                                Ticker
                                            </label>
                                            <Field
                                                value={values.Ticker}
                                                style={{ outline: 'none' }}
                                                className="rounded rounded-1 p-2 outline form-control-outline w-100 border border-1 border-grey"
                                                id='Ticker' name='Ticker' />
                                            <ErrorMessage
                                                name="Ticker"
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
                                                <option value={''}>Select</option>
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
                                                RC Number/CAC/BN
                                            </label>
                                            <Field
                                                value={values.rcNumber}
                                                style={{ outline: 'none' }}
                                                className="rounded rounded-1 p-2 w-100 border border-1 border-grey"
                                                id='rcNumber' name='rcNumber' />

                                            <ErrorMessage
                                                name="rcNumber"
                                                component="div"
                                                className="text-danger fw-medium" />
                                        </div>

                                        <div className="w-50">

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
                                                id='soruceOfWealth' name='sourceOfWealth'>

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
                                            <Button  className="w-100 rounded rounded-1" type="submit" variant="primary mt-3">{loading ? <Spinner size="sm" /> : 'Submit for Approval'}</Button>
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
export default CreateBMOOwnerCoperateModal;