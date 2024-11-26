import React, { useEffect, useState } from "react";
import { Button, FormControl, FormSelect, Modal, ProgressBar, Spinner } from "react-bootstrap";
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { object, string, number, date, InferType } from 'yup';
import api from "../../config/api";
import { getUserInfo } from "../../controllers/auth";
import { calculatePercent, getCountries } from "../../utils/helpers";
import { ICountr, ICountry } from "../../interfaces/country";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CreateAgentModal: React.FC<any> = ({ show, off, lev, parent, custormerNumb, ownerId, totalOwners }) => {
    console.log({ hereIsP: parent })
    const [countries, setCountries] = useState<ICountr[]>()
    const [idTypes, setIdTypes] = useState<string[]>();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // console.log({hereisParent:parent,hereIdNumber:custormerNumb})
    const initialVal = {
        "businessName": "",
        "sourceOfWealth": "",
        "remark": '',
        "bvn": "",
        "idType": "",
        "idNumber": "",
        "countryId": "",
        "percentageHolding": '',
        "numberOfShares": '',
        "isPEP": "",
        "categoryId": "I",

    }



    let validationSchem = object({
        businessName: string().required().label('Business name'),
        countryId: string().required().label('Country'),
        percentageHolding: number().typeError('Must be a number').required().label('Percentage holding'),
        numberOfShares: number().typeError('Must be a number').required().label('No of share'),
        bvn: number().typeError('Must be a number').required().label('Bvn'),
        // isPEP: string().required().label('Politicaly Exposed Status'),
        idType: string().required().label('ID Type'),
        idNumber: string().required().label('ID Number'),
        sourceOfWealth: string().required().label('Source of wealth'),
        remark: string().required().label('Remark'),

    });


    const createNewBMO = async (body: any) => {
        setLoading(true)

        let parentInfo = {
            ...parent,
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
                parent?.Comments,
            CountryName
                :
                parent?.CountryName,
            CreatedBy
                :
                parent?.CreatedBy,
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
            CategoryId: 'I',
        }

        try {
            let userInfo = await getUserInfo();
            const apiBody = {
                "requesterName": `${userInfo?.profile.given_name} ${userInfo?.profile.family_name}`,
                "parent": { ...parentInfo },
                "beneficialOwners": [
                    {
                        ...body,
                        "categoryId": "I",
                        "isPEP": body?.isPEP == 'yes' ? true : false,

                    }
                ]
            }
            const res = await api.post(``, apiBody, `${userInfo?.access_token}`)
            if (res?.status == 200) {
                setLoading(false);
                toast.success('BO created succesfully');
                off()
            }
            if (res?.status == 400) {
                setLoading(false);
                toast.error(`${res?.data}`);
            }

        } catch (error: any) {
            console.log({ seeError: error })
            setLoading(false);
            toast.error(`${error?.data}`)
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
                    <p className="p-0 m-0 text-secondary">Create New Agent</p>
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
                                                First Name
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
                                                Last Name
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
                                    </div>

                                    <div className="d-flex  justify-content-between my-3  gap-3 w-100">
                                        <div className="w-50">
                                            <label className="" htmlFor="userEmail">
                                                Phone number
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
                                                Email
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
                                    </div>


                                    

                                    <div className="d-flex justify-content-between my-3  gap-3 w-100">
                                    <div className="w-50">
                                            <label className="" htmlFor="userEmail">
                                                Home address
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

                                        
                                    </div>

                                    <div className="d-flex  justify-content-between my-3  gap-3 w-100">
                                        <div className="w-50">
                                            <label className="" htmlFor="userEmail">
                                                Password
                                            </label>
                                            <div className="d-flex align-items-center">
                                                <Field
                                                    // value={values.password}
                                                    // type={secureText ? 'text' : 'password'}
                                                    style={{ outline: 'none' }}
                                                    className="rounded rounded-1 p-2  w-100 border border-1 border-grey"
                                                    id='password' name='password'
                                                />
                                                <i 
                                                // onClick={handlePasswordField}
                                                 role="button" className="bi bi-eye-slash" style={{ marginLeft: '-2em' }}></i>
                                            </div>

                                            <ErrorMessage
                                                name="password"
                                                component="div"
                                                className="text-danger fw-medium" />

                                        </div>

                                        <div className="w-50">
                                            <label className="" htmlFor="userEmail">
                                               Confirm Password
                                            </label>
                                            <div className="d-flex align-items-center">
                                                <Field
                                                    // value={values.password}
                                                    // type={secureText ? 'text' : 'password'}
                                                    style={{ outline: 'none' }}
                                                    className="rounded rounded-1 p-2  w-100 border border-1 border-grey"
                                                    id='password' name='password'
                                                />
                                                <i 
                                                // onClick={handlePasswordField} 
                                                role="button" className="bi bi-eye-slash" style={{ marginLeft: '-2em' }}></i>
                                            </div>

                                            <ErrorMessage
                                                name="password"
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