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

const CreateNewPolicyPage: React.FC<any> = () => {
    const [policyDoc, setPolicyDoc] = useState('');
    const [subSidiaries, setSubSidiaries] = useState<IDept[]>();
    const userDat = localStorage.getItem('loggedInUser') || '';
    const data = JSON.parse(userDat);
    const userName = data?.profile?.sub.split('\\').pop();
    const navigate = useNavigate();

    const [showCreatePrompt, setShowCreatePrompt] =useState(false)
    const [policyCreatedSucc, setpolicyCreatedSucc] =useState(false)
    const [createLoading,setCreateLoading] = useState(false)

    const [showSub,setShowSub] = useState(false)

    const initialValues = {
        policyName: '',
        policyDocument: null,
        fileDescription: '',
        DeadlineDate: '',
        Department: [],
        Frequency: '',
        Authorizer: '',

    };

    const validationSchema = Yup.object({
        policyName: Yup.string().required('Policy title is required'),
        fileDescription: Yup.string().required('Policy description is required'),
        DeadlineDate: Yup.string().required('Select deadline date'),
        Frequency: Yup.string().required('Select reminder frequency'),
        Authorizer: Yup.string().required('Selecte an authorizer'),
        Department: Yup.array().of(Yup.string().required('Department is required')),
        policyDocument: Yup.mixed()
            .required('A file is required')
            .test('fileType', 'Only PDF files are accepted', (value: any) => {
                return value && value.type === 'application/pdf';
            }),
    });

    const handleFileChange = (event: any) => {
        const file = event.target.files[0];
        if (file) {
            setPolicyDoc(file)
        } else {
            toast.error('No file selected!');
            setPolicyDoc('');
        }
    };

    const subsidiaries = [
        {
            id: "0",
            name: "ABUJA BRANCH"
        },
        {
            id: "1",
            name: "ADMIN"
        },
        {
            id: "2",
            name: "BRAND STRATEGY & MARKETING"
        },
        {
            id: "3",
            name: "Info Tech"
        },
    ]

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

    const authorizers = [
        {
            id: 0,
            name: "Olubukola Lanipekun-Lawal"

        },
        {
            id: 1,
            name: "Taiwo Sanusi"
        },
        {
            id: 2,
            name: "Peju Siyanbola"
        },
    ]

    const handleGetDepts = async () => {
        // setLoading(true)
        try {
            const res = await api.get(`Subsidiaries`, `${data?.access_token}`);
            console.log({ dataHere: res })

            if (res?.data) {
                setSubSidiaries(res?.data)
            } else {
                
            }
            console.log({ response: res })
        } catch (error) {

        }

    }

    const createNewPolicy = async (body: any) => {
        console.log({ bodyHere: body });
        setCreateLoading(true)
  let formData = new FormData()
        
        formData.append('policyDocument', body?.policyDocument)
        formData.append('fileDescription', body?.fileDescription)
        formData.append('policyName', body?.policyName)
        formData.append('Department', body?.Department)
        formData.append('Frequency', body?.Frequency)
        formData.append('Authorizer', body?.Authorizer)
        formData.append('DeadlineDate', body?.DeadlineDate)

        let userInfo = await getUserInfo();

        if (userInfo) {

            const res = await api.post(`policy/upload?userName=majadi`, formData, `${userInfo?.access_token}`)
            console.log(res)
            if(res?.statusText=="Created"){
                setShowCreatePrompt(false)
                setpolicyCreatedSucc(true)
                setCreateLoading(false)
            } else{
                toast.error('Error uploading policy, kindly try again');
                setCreateLoading(false)
            }
        }


    }

    useEffect(()=>{
        handleGetDepts();
    },[])

    return (
        <div>
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
                // validationSchema={validationSchema}
                onSubmit={createNewPolicy}
            >
                {({ values, setFieldValue, handleReset, handleBlur,handleSubmit, handleChange, touched,errors }) => (
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

                            <div className="p-2" style={{ marginTop: '5px', minWidth: '400px' }}>
                                <p className="p-0 m-0">Upload File (PDF)</p>
                                <input
                                    id="policyDocument"
                                    name="policyDocument"
                                    type="file"
                                    onChange={(event: any) => {
                                        setFieldValue("policyDocument", event.currentTarget.files[0]);
                                    }}
                                />
<p
                                            className="p-0 text-danger m-0 mt-1"
                                            style={{ fontSize: '0.7em' }}>{touched.policyDocument && errors['policyDocument']}
                                        </p>
                            </div>

                            <div className="p-2" style={{ marginTop: '5px', minWidth: '400px' }}>
                                <p className="p-0 m-0">Policy Description</p>
                                <FormControl
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    id="fileDescription"
                                    name="fileDescription"
                                    className="py-4" type="textfield" placeholder="Enter Policy Description" style={{ marginTop: '5px', maxWidth: '400px' }} />
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
                                    type="date" placeholder="Select date" style={{ marginTop: '5px', maxWidth: '400px' }} />
                                <p
                                            className="p-0 text-danger m-0 mt-1"
                                            style={{ fontSize: '0.7em' }}>{touched.DeadlineDate && errors['DeadlineDate']}
                                        </p>
                            </div>

                            <div className="px-2">
                                <label className="d-flex justify-content-between rounded border border-1 w-100 py-2 px-2">
                                    Select Subsidiaries
                                    <i 
                                    onClick={()=>setShowSub(!showSub)}
                                    className={`bi bi-chevron-${showSub?'up':'down'}`} style={{cursor:'pointer'}}></i>
                                    </label>
                                <Collapse
                                    in={showSub}
                                >
                                    <Card className="py-1 px-2">
                                        <div className="d-flex flex-column" role="group">
                                            {subSidiaries &&subSidiaries.map((option) => (
                                                <label key={option.id}>
                                                    <Field
                                                        type="checkbox"
                                                        name="Department"
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
                                            style={{ fontSize: '0.7em' }}>{touched.Department && errors['Department']}
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

                                <p className="p-0 m-0">Reminder Frequency</p>
                                <FormSelect
                                    id="Frequency"
                                    className="py-2"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    style={{ marginTop: '5px', maxWidth: '400px' }}>
                                    <option>Select</option>
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
                                <p className="p-0 m-0">Authorizer</p>
                                <FormSelect
                                    id="Authorizer"
                                    className="py-2"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    style={{ marginTop: '5px', maxWidth: '400px' }}>
                                    <option>Select</option>
                                    {
                                        authorizers.map((sub, index) =>
                                            <option key={index} value={sub.name}>{sub.name}</option>
                                        )
                                    }
                                </FormSelect>

                                <p
                                            className="p-0 text-danger m-0 mt-1"
                                            style={{ fontSize: '0.7em' }}>{touched.Authorizer && errors['Authorizer']}
                                        </p>
                            </div>



                            <div className="mt-2">
                                <Button onClick={()=>setShowCreatePrompt(true)} variant="primary mt-3">Submit for Approval </Button>
                            </div>
                        </div>
                        <SureToCreatePolicyModal loading={createLoading} action={handleSubmit} off={()=>setShowCreatePrompt(false)} show={showCreatePrompt}/>
                        <PolicyCreatedSuccessModal off={()=>setpolicyCreatedSucc(false)} show={policyCreatedSucc}/>
                    </Form>
                )}
            </Formik>
            
        </div>
    )
}
export default CreateNewPolicyPage;