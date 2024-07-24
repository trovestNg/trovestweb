import React, { useEffect, useState } from "react";
import { Button, Card, Collapse, FormControl, FormSelect, Modal, ProgressBar } from "react-bootstrap";
import { ErrorMessage, Field, FieldArray, Form, Formik } from 'formik';
import { object, string, number, date, InferType } from 'yup';
import * as Yup from 'yup';
import api from "../../config/api";
import { getUserInfo } from "../../controllers/auth";
import { toast } from "react-toastify";
import { IPolicy } from "../../interfaces/policy";
import { IDept } from "../../interfaces/dept";
import { useNavigate } from "react-router-dom";
import SureToCreatePolicyModal from "../../components/modals/sureToCreatePolicyModal";
import PolicyCreatedSuccessModal from "../../components/modals/policyCreatedSuccessModal";
import style from './upload.module.css';

const CreateNewPolicyPage: React.FC<any> = () => {
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
    const [newPolicy,setNewPolicy] = useState();
    const navigate = useNavigate();

    const [showCreatePrompt, setShowCreatePrompt] = useState(false)
    const [policyCreatedSucc, setpolicyCreatedSucc] = useState(false)
    const [createLoading, setCreateLoading] = useState(false)

    const [showSub, setShowSub] = useState(false);
    const [fileName,setFileName] = useState('');
    const [fileUrl,setFileUrl] = useState('');

    const initialValues = {
        policyName: '',
        policyDocument: null,
        fileDescription: '',
        DeadlineDate: '',
        Subsidiary: null,
        Frequency: '',
        Authorizer: '',

    };

    const validationSchema = Yup.object({
        policyName: Yup.string().required('Policy title is required'),
        fileDescription: Yup.string().required('Policy description is required'),
        DeadlineDate: Yup.string().required('Select deadline date'),
        Frequency: Yup.string().required('Select reminder frequency'),
        Authorizer: Yup.string().required('Selecte an authorizer'),
        Subsidiary: Yup.array().of(Yup.string().required('Select Subsidiary')),
        policyDocument: Yup.mixed()
            .required('A file is required')
            .test('fileType', 'Only PDF files are accepted', (value: any) => {
                return value && value.type === 'application/pdf';
            }),
    });

    



    const remFreq = [
        {
            id: 0,
            name: "Daily"
        },
        {
            id: 1,
            name: "Bi-Weekly"
        },
        {
            id: 2,
            name: "Monthly"
        },
        {
            id: 3,
            name: "Yearly"
        },
        {
            id: 4,
            name: "Every 3 Years"
        },
    ]

    const handleGetDepts = async () => {
        // setLoading(true)
        try {
            let userInfo = await getUserInfo();
            let userName = userInfo?.profile?.sub.split('\\')[1]
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

    const handleGetAuthorizers = async () => {
        // setLoading(true)
        try {
            let userInfo = await getUserInfo();
            let userName = userInfo?.profile?.sub.split('\\')[1]
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

    const handleFileChange = (event:any, setFieldValue:any) => {
        console.log(event)
        const file = event.currentTarget.files[0];
        
        if (file) {
            let path = URL.createObjectURL(file)
          setFileName(file.name);
          setFileUrl(path);
          setFieldValue('policyDocument', file);
        }
      };

    const createNewPolicy = async (body: any) => {
        // console.log({ gotten: userInfo })({ bodyHere: body });
        setCreateLoading(true)
        let convertedToInt = body?.Subsidiary.map((id: any) => +id)
        let formData = new FormData()

        formData.append('policyDocument', body?.policyDocument)
        formData.append('fileDescription', body?.fileDescription)
        formData.append('policyName', body?.policyName)
        formData.append('Subsidiary', convertedToInt)
        formData.append('Frequency', body?.Frequency)
        formData.append('Authorizer', body?.Authorizer)
        formData.append('DeadlineDate', body?.DeadlineDate)

        let userInfo = await getUserInfo();

        if (userInfo) {
            let userInfo = await getUserInfo();
            let userName = userInfo?.profile?.sub.split('\\')[1]
            const res = await api.post(`policy/upload?userName=${userName}`, formData, `${userInfo?.access_token}`)
            // console.log({ gotten: userInfo })(res)
            if (res?.statusText == "Created") {
                setShowCreatePrompt(false)
                setpolicyCreatedSucc(true)
                setCreateLoading(false);
            } else {
                toast.error('Error uploading policy, kindly try again');
                setCreateLoading(false)
            }
        }


    }

    const getCurrentDate = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
      };

    const handlePolicyCreation = (body:any)=>{
        console.log({wantToSend:body});
        setNewPolicy(body);
        setShowCreatePrompt(true);
        let updated = {

        }

        

    }

    useEffect(() => {
        handleGetDepts();
        handleGetAuthorizers()
    }, [])

    return (
        <div>
            <div><Button variant="outline border border-2" onClick={() => navigate(-1)}>Go Back</Button></div>
            {/* <Formik
                    initialValues={initialVal}
                    validationSchema={validationSchem}
                    validateOnBlur
                    onSubmit={(val) => createNewPolicy(val)
                    }
                >{
                        ({ handleChange, handleSubmit, errors, touched, handleBlur }) => (
                            <form onSubmit={handleSubmit} className="w-100 px-2 d-flex align-items-center flex-column">

                              
                                    

                                    

                                    

                                   

                                    <div className="p-2" style={{ marginTop: '5px', minWidth: '400px' }}>
                                        <p className="p-0 m-0">Subsidiary</p>
                                        <FormSelect
                                            id="Department"
                                            className="py-2"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            style={{ marginTop: '5px', maxWidth: '400px' }}>
                                            <option>Select</option>
                                            {
                                                subsidiaries.map((sub,index)=>
                                                    <option key={index} value={sub.id}>{sub.name}</option>
                                                )
                                            }
                                        </FormSelect>

                                        <p
                                            className="p-0 text-danger m-0 mt-1"
                                            style={{ fontSize: '0.7em' }}>{touched.Department && errors['Department']}
                                        </p>
                                    </div>

                                    
                                
                                

                                
                            </form>)
                    }
                </Formik> */}

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handlePolicyCreation}
            >
                {({ values, setFieldValue, handleReset, handleBlur, handleSubmit, handleChange, touched, errors }) => (
                    <Form onSubmit={handleSubmit} onReset={handleReset} className="d-flex flex-column align-items-center">
                        <div>



                            <div className="p-2" style={{ marginTop: '5px', minWidth: '400px' }}  >
                                <p className="p-0 m-0">Policy Title</p>
                                <FormControl
                                    id="policyName"
                                    name="policyName"
                                    className="py-2"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Enter Policy Title" />
                                <p
                                    className="p-0 text-danger m-0 mt-1"
                                    style={{ fontSize: '0.7em' }}>{touched.policyName && errors['policyName']}
                                </p>

                            </div>

                            <div  style={{ marginTop: '5px', minWidth: '400px' }}>
                                <div style={{paddingLeft:'10px'}}>
                                <p>Upload File (PDF)</p>
                            <label htmlFor="policyDocument" className={`p-4 w-100 text-center text-primary border-1 m-0 ${style.fileUploadLabel}`}>
                                {<i className="bi bi-file-earmark-pdf"></i>}
                                {fileName==''?' Click to upload file':' Click to Replace File'}
                                
                                </label>
                                
                                <input
                                    id="policyDocument"
                                    name="policyDocument"
                                    type="file"
                                    className={`p-2 ${style.fileInput}`}
                                    onChange={(event) => handleFileChange(event, setFieldValue)}
                                    
                                    // {handleFileChange(event: any) => {
                                    //     setFieldValue("policyDocument", event.currentTarget.files[0]);
                                    // }}
                                />
                                </div>
                                <p
                                    className="p-0 px-3 text-danger m-0 mt-1"
                                    style={{ fontSize: '0.7em' }}>{touched.policyDocument && errors['policyDocument']}
                                </p>
                            </div>
                            {fileName == '' ?
                                <div className="px-3 d-flex mt-2">
                                    {fileName && <i className="bi bi-file-earmark-pdf text-danger"></i>}
                                    <a  href={fileUrl} target="_blank" className="px-1 text-primary">{fileName}</a>
                                </div> :
                                <div className="mt-2 d-flex">
                                    {fileName &&
                                        <div className="px-3 d-flex">
                                            <i className="bi bi-file-earmark-pdf text-danger"></i>
                                            <a  href={fileUrl} target="_blank" className="px-1 text-primary">{fileName}</a>
                                        </div>}
                                </div>
                            }
                            

                            {/* {
                                <div className="mt-1 text-primary d-flex">
                                     {
                                        
                                        
                                        && fileName
                                     }
                                </div>
                               
                            } */}

                            <div className="p-2" style={{ marginTop: '5px', minWidth: '400px' }}>
                                <p className="p-0 m-0">Policy Description 
                                    <span className="text-danger" style={{fontSize:'0.7em'}}> (Max 100)</span></p>
                                <textarea
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    maxLength={100}
                                    id="fileDescription"
                                    name="fileDescription"
                                    className="p-2 border rounded border-1 " placeholder="Enter Policy Description"
                                    style={{
                                        marginTop: '5px',
                                        minWidth: '400px',
                                        minHeight: '8em',
                                        padding: '0px',
                                        boxSizing:'border-box',
                                        lineHeight:'1.5',
                                        overflow:'auto',
                                        outline:'0px'
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
                                    id="DeadlineDate"
                                    name="DeadlineDate"
                                    min={getCurrentDate()}
                                    type="date" placeholder="Select date" style={{ marginTop: '5px', maxWidth: '400px' }} />
                                <p
                                    className="p-0 text-danger m-0 mt-1"
                                    style={{ fontSize: '0.7em' }}>{touched.DeadlineDate && errors['DeadlineDate']}
                                </p>
                            </div>

                            <div className="px-2" >
                                <label 
                                onClick={() => setShowSub(!showSub)}
                                className="d-flex justify-content-between rounded border border-1 py-2 px-2">
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
                                                        id="Subsidiary"
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


                            {/* <div className="px-2">
                                <label>Select Subsidiaries</label>
                                <Collapse
                                    in={true}
                                >
                                    <Card>
                                        <div className="d-flex flex-column" role="group">
                                            {subsidiaries.map((option) => (
                                                <label key={option.id}>
                                                    <Field
                                                        type="checkbox"
                                                        name="department"
                                                        value={option.id}
                                                    />
                                                    {option.name}
                                                </label>
                                            ))}
                                        </div>
                                    </Card>
                                </Collapse>

                                <ErrorMessage name="department" component="div" />
                            </div> */}

                            <div className="p-2" style={{ marginTop: '5px', minWidth: '400px' }}>

                                <p className="p-0 m-0">Set Reminder Frequency</p>
                                <FormSelect
                                    id="Frequency"
                                    className="py-2"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    style={{ marginTop: '5px', maxWidth: '400px' }}>
                                    <option value={''}>Select</option>
                                    {
                                        remFreq.map((sub, index) =>
                                            <option key={index} value={sub.name}>{sub.name}</option>
                                        )
                                    }
                                </FormSelect>

                                <p
                                    className="p-0 text-danger m-0 mt-1"
                                    style={{ fontSize: '0.7em' }}>{touched.Frequency && errors['Frequency']}
                                </p>
                            </div>

                            <div className="p-2" style={{ marginTop: '5px', minWidth: '400px' }}>
                                <p className="p-0 m-0">Select Authorizer</p>
                                <FormSelect
                                    id="Authorizer"
                                    className="py-2"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    style={{ marginTop: '5px', maxWidth: '400px' }}>
                                    <option value={''}>Select</option>
                                    {
                                        authorizers && authorizers.map((sub, index) =>
                                            <option key={index} value={sub.authorizerName}>{sub.authorizerName}</option>
                                        )
                                    }
                                </FormSelect>

                                <p
                                    className="p-0 text-danger m-0 mt-1"
                                    style={{ fontSize: '0.7em' }}>{touched.Authorizer && errors['Authorizer']}
                                </p>
                            </div>



                            <div className="mt-2">
                                <Button type="submit"  variant="primary mt-3">Submit for Approval </Button>
                            </div>
                        </div>
                        <SureToCreatePolicyModal loading={createLoading} action={()=>createNewPolicy(newPolicy)} off={() => setShowCreatePrompt(false)} show={showCreatePrompt} />
                        <PolicyCreatedSuccessModal off={() =>{ 
                            setpolicyCreatedSucc(false)
                            window.location.reload()
                            }} show={policyCreatedSucc} />
                    </Form>
                )}
            </Formik>

        </div>
    )
}
export default CreateNewPolicyPage;