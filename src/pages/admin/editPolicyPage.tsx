import React, { useEffect, useState } from "react";
import { Button, Card, Collapse, FormControl, FormSelect, Modal, ProgressBar } from "react-bootstrap";
import { ErrorMessage, Field, FieldArray, Form, Formik } from 'formik';
import { object, string, number, date, InferType } from 'yup';
import * as Yup from 'yup';
import api from "../../config/api";
import { getUserInfo } from "../../controllers/auth";
import { toast } from "react-toastify";
import { IPolicy, IPolicyEdit } from "../../interfaces/policy";
import { IDept } from "../../interfaces/dept";
import { useNavigate, useParams } from "react-router-dom";
import SureToCreatePolicyModal from "../../components/modals/sureToCreatePolicyModal";
import PolicyCreatedSuccessModal from "../../components/modals/policyCreatedSuccessModal";
import style from './upload.module.css';
import moment from "moment";
import SureToEditPolicyModal from "../../components/modals/sureToEditPolicyModal";


const EditPolicyPage: React.FC<any> = () => {
    const { attestationStatus, id } = useParams();
    const [ref,setRef] = useState(false);
    interface IAuthorizers {
        "id": number
        "authorizerName": string,
        "userName": string,
        "department": string,
        "subsidiary": string,
        "emailAddress": string
    }


    const [policyDoc, setPolicyDoc] = useState('');
    const [subSidiaries, setSubSidiaries] = useState<IDept[]>();
    const [authorizers, setAuthorizers] = useState<IAuthorizers[]>();
    const navigate = useNavigate();
    const [policy, setPolicy] = useState<IPolicy>();
    const [showCreatePrompt, setShowCreatePrompt] = useState(false)
    const [policyCreatedSucc, setpolicyCreatedSucc] = useState(false)
    const [createLoading, setCreateLoading] = useState(false)

    const [showSub, setShowSub] = useState(false);
    const [fileName, setFileName] = useState('');
    const [updatedPolDoc,setUpddatedPolDoc] = useState();

    const initialValues  = {
        ...policy,
        policyDocument: null,
        Subsidiary: null
    }

    const validationSchema = Yup.object({
        fileName: Yup.string().required('Policy title is required'),
        policyDocument: Yup.mixed()
            .required('A file is required')
            .test('fileType', 'Only PDF files are accepted', (value: any) => {
                return value && value.type === 'application/pdf';
            }),
        fileDescription: Yup.string().required('Policy description is required'),
        deadlineDate: Yup.string().required('Select deadline date'),
        reminderFrequency: Yup.string().required('Select reminder frequency'),
        Subsidiary: Yup.array().of(Yup.string().required('Select at least one subsidiary')),
    });





    const remFreq = [
        {
            id: 0,
            name: "Daily"
        },
        {
            id: 1,
            name: "Weekly"
        },
        {
            id: 2,
            name: "Monthly"
        },
    ]

    const handleGetDepts = async () => {
        let userInfo = await getUserInfo();

        if (userInfo) {
            try {
                const res = await api.get(`Subsidiaries`, `${userInfo?.access_token}`);
                // console.log({ gotten: userInfo })({ dataHere: res })
    
                if (res?.data) {
                    setSubSidiaries(res?.data)
                } else {
    
                }
                // console.log({ gotten: userInfo })({ response: res })
            } catch (error) {
    
            }
        }
        // setLoading(true)
        

    }

    const handleGetAuthorizers = async () => {
        // setLoading(true)

        let userInfo = await getUserInfo();

        if (userInfo) {
            try {
                const res = await api.get(`Policy/authorizer`, `${userInfo?.access_token}`);
                // // console.log({ gotten: userInfo })({ dataHere: res })
    
                if (res?.data) {
                    setAuthorizers(res?.data)
                } else {
    
                }
                // console.log({ gotten: userInfo })({ response: res })
            } catch (error) {
    
            }

        }
        

    }

    const handleFileChange = (event: any, setFieldValue: any) => {
        const file = event.currentTarget.files[0];
        if (file) {
            setFileName(file.name);
            setFieldValue('policyDocument', file);
        }
    };

    const getCurrentDate = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
      };

    const createNewPolicy = async (body: any) => {
        // // console.log({ gotten: userInfo })({ bodyHere: body });

        // let editObj = {
        //     policyDocument: body?.policyDocument,
        //     fileDescription: body?.fileDescription,
        //     policyName: body?.fileName,
        //     // Department: '',
        //     Subsidiary: body?.Subsidiary,
        //     Authorizer: body?.authorizedBy,
        //     policyId: id,
        //     Frequency: body?.reminderFrequency,
        //     DeadlineDate: body?.deadlineDate,
        // }


        setCreateLoading(true)
        let convertedToInt = body?.Subsidiary.map((id: any) => +id)
        let formData = new FormData()

        formData.append('policyDocument', body?.policyDocument)
        formData.append('fileDescription', body?.fileDescription)
        formData.append('policyName', body?.fileName)
        formData.append('Subsidiary', convertedToInt)
        formData.append('Frequency', body?.reminderFrequency)
        formData.append('Authorizer', body?.authorizedBy)
        formData.append('policyId', body?.id)
        formData.append('DeadlineDate', body?.deadlineDate)
        // formData.append('Department', dep)

        let userInfo = await getUserInfo();

        if (userInfo) {
            let userInfo = await getUserInfo();
            let userName = userInfo?.profile?.sub.split('\\')[1]

            const res = await api.post(`policy/edit?userName=${userName}`, formData, `${userInfo?.access_token}`)
            // console.log({ gotten: userInfo })({updated:res})
            if (res?.status == 200) {
                setShowCreatePrompt(false)
                // setpolicyCreatedSucc(true)
                toast.success("Succesfully Updated!");
                navigate(-1)
                setRef(!ref)
                // setCreateLoading(false)
            } else {
                toast.error('Error editing policy, kindly try again');
                setCreateLoading(false)
            }
        }


    }

    const handlePolicyEdit = (body:any)=>{
        console.log({wantToSend:body});
        setUpddatedPolDoc(body);
        setShowCreatePrompt(true);
        let updated = {

        }

        

    }

    const getPolicy = async () => {
        let userInfo = await getUserInfo();
        if (userInfo) {
            try {
                const res = await api.get(`policy/${id}`, `${userInfo.access_token}`);
                if (res?.data) {
                    setPolicy(res?.data);
                } else {
                    // toast.error('Session expired!, You have been logged out!!');
                    // loginUser();

                }
                // console.log({ gotten: userInfo })({ response: res })
            } catch (error) {

            }

        } else {
            // loginUser()
        }

    }



    useEffect(() => {
        getPolicy();
        handleGetDepts();
        handleGetAuthorizers()
    }, [ref])

    return (
        <div>
            <div><Button variant="outline border border-2" onClick={() => navigate(-1)}>Go Back</Button></div>
            

            <Formik
                initialValues={initialValues}
                enableReinitialize
                validationSchema={validationSchema}
                validateOnBlur
                onSubmit={handlePolicyEdit}
            >
                {({ values, setFieldValue, handleReset, handleBlur, handleSubmit, handleChange, touched, errors }) => (
                    <Form onSubmit={handleSubmit} onReset={handleReset} className="d-flex flex-column align-items-center">
                        <div>



                            <div className="p-2" style={{ marginTop: '5px', minWidth: '400px' }}  >
                                <p className="p-0 m-0">Policy Title</p>
                                <FormControl
                                    id="fileName"
                                    name="fileName"
                                    className="py-2"
                                    value={values.fileName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Enter Policy Title" />
                                <p
                                    className="p-0 text-danger m-0 mt-1"
                                    style={{ fontSize: '0.7em' }}>{touched && errors['fileName']}
                                </p>

                            </div>

                            <div style={{ marginTop: '5px', minWidth: '400px' }}>
                                <div style={{ paddingLeft: '10px' }}>
                                    <p>Upload File (PDF)</p>
                                    <label htmlFor="policyDocument" className={`p-4 w-100 text-center text-primary border-1 m-0 ${style.fileUploadLabel}`}>
                                        {<i className="bi bi-file-earmark-pdf"></i>}
                                        {fileName == '' ? ' Click to Upload file' : ' Click to Replace File'}

                                    </label>
                                    <input
                                        id="policyDocument"
                                        name="policyDocument"
                                        type="file"
                                        className={`p-2 ${style.fileInput}`}
                                        onChange={(event) => handleFileChange(event, setFieldValue)}
                                    />
                                </div>
                                <p
                                    className="p-0  px-2 text-danger m-0 mt-1"
                                    style={{ fontSize: '0.7em' }}>{touched.policyDocument && errors['policyDocument']}
                                </p>
                            </div>
                            {fileName == '' ?
                                <div className="px-3 d-flex mt-2">
                                    {values.fileName && <i className="bi bi-file-earmark-pdf text-danger"></i>}
                                    <a  href={values.url} target="_blank" className="px-1 text-primary">{values.fileName}</a>
                                </div> :
                                <div className="mt-2 d-flex">
                                    {fileName &&
                                        <div className="px-3 d-flex">
                                            <i className="bi bi-file-earmark-pdf text-danger"></i>
                                            <p className="px-1 text-primary">{fileName}</p>
                                        </div>}
                                </div>
                            }

                            <div className="p-2" style={{ marginTop: '5px', minWidth: '400px' }}>
                                <p className="p-0 m-0">Policy Description</p>
                                <textarea
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    id="fileDescription"
                                    value={values.fileDescription}
                                    name="fileDescription"
                                    className="p-2 border rounded border-1 " placeholder="Enter Policy Description"
                                    style={{
                                        marginTop: '5px',
                                        minWidth: '400px',
                                        minHeight: '8em',
                                        padding: '0px',
                                        boxSizing: 'border-box',
                                        lineHeight: '1.5',
                                        overflow: 'auto',
                                        outline: '0px'
                                    }} />
                                <p
                                    className="p-0 text-danger m-0 mt-1"
                                    style={{ fontSize: '0.7em' }}>{touched.fileDescription && errors['fileDescription']}
                                </p>
                            </div>

                            <div className="p-2" style={{ marginTop: '5px', minWidth: '400px' }}>
                                <p className="p-0 m-0">Select Deadline Date</p>
                                <FormControl
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className="py-2"
                                    min={getCurrentDate()}
                                    value={moment(values.deadlineDate).format('yyyy-MM-D')}
                                    id="deadlineDate"
                                    name="deadlineDate"
                                    type="date" style={{ marginTop: '5px', maxWidth: '400px' }} />
                                <p
                                    className="p-0 text-danger m-0 mt-1"
                                    style={{ fontSize: '0.7em' }}>{touched.deadlineDate && errors['deadlineDate']}
                                </p>

                            </div>

                            <div className="px-2" >
                                <label 
                                onClick={() => setShowSub(!showSub)}
                                className="d-flex justify-content-between rounded border border-1 w-100 py-2 px-2">
                                    Select Subsidiaries
                                    <i
                                        className={`bi bi-chevron-${showSub ? 'up' : 'down'}`} style={{ cursor: 'pointer' }}></i>
                                </label>
                                <Collapse
                                    in={showSub}
                                >
                                    <Card className="py-1 px-2">
                                        <div className="d-flex flex-column" role="group">
                                            {subSidiaries && subSidiaries.map((option) => (
                                                <label key={option.id} className="d-flex gap-2">
                                                    <Field
                                                        type="checkbox"
                                                        name="Subsidiary"
                                                        value={JSON.stringify(option.id)}
                                                    />
                                                    {option.name}
                                                </label>
                                            ))}
                                        </div>
                                    </Card>
                                </Collapse>

                                <p
                                    className="p-0 text-danger m-0 mt-1"
                                    style={{ fontSize: '0.7em' }}>{touched.Subsidiary && errors['Subsidiary']}
                                </p>
                            </div>




                            <div className="p-2" style={{ marginTop: '5px', minWidth: '400px' }}>

                                <p className="p-0 m-0">Set Reminder Frequency</p>
                                <FormSelect
                                    id="reminderFrequency"
                                    name="reminderFrequency"
                                    className="py-2"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    style={{ marginTop: '5px', maxWidth: '400px' }}>
                                    <option value={values.reminderFrequency}>{values.reminderFrequency}</option>
                                    {
                                        remFreq.map((sub, index) =>
                                            <option key={index} value={sub.name}>{sub.name}</option>
                                        )
                                    }
                                </FormSelect>

                                <p
                                    className="p-0 text-danger m-0 mt-1"
                                    style={{ fontSize: '0.7em' }}>{touched.reminderFrequency && errors['reminderFrequency']}
                                </p>
                            </div>

                            <div className="p-2" style={{ marginTop: '5px', minWidth: '400px' }}>
                                <p className="p-0 m-0">Select Authorizer</p>
                                <FormSelect
                                    id="authorizedBy"
                                    name="authorizedBy"
                                    className="py-2"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    style={{ marginTop: '5px', maxWidth: '400px' }}>
                                    <option value={values.authorizedBy}>{values.authorizedBy}</option>
                                    {
                                        authorizers && authorizers.map((sub, index) =>
                                            <option key={index} value={sub.authorizerName}>{sub.authorizerName}</option>
                                        )
                                    }
                                </FormSelect>

                                <p
                                    className="p-0 text-danger m-0 mt-1"
                                    style={{ fontSize: '0.7em' }}>{touched.authorizedBy && errors['authorizedBy']}
                                </p>
                            </div>



                            <div className="mt-2">
                                <Button type="submit" variant="primary mt-3">Submit for Approval </Button>
                            </div>
                        </div>
                        <SureToEditPolicyModal loading={createLoading} action={()=>createNewPolicy(updatedPolDoc)} off={() => setShowCreatePrompt(false)} show={showCreatePrompt} />
                        <PolicyCreatedSuccessModal off={() => setpolicyCreatedSucc(false)} show={policyCreatedSucc} />
                    </Form>
                )}
            </Formik>

        </div>
    )
}
export default EditPolicyPage;