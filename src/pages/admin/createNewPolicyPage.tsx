import React, { useState } from "react";
import { Button, Card, FormControl, FormSelect, Modal, ProgressBar } from "react-bootstrap";
import { Formik } from 'formik';
import { object, string, number, date, InferType } from 'yup';
import api from "../../config/api";
import { getUserInfo } from "../../controllers/auth";
import { toast } from "react-toastify";
import { IPolicy } from "../../interfaces/policy";

const CreateNewPolicyPage: React.FC<any> = () => {
    const [policyDoc,setPolicyDoc] = useState('')

    const initialVal = {
        policyName: '',
        fileDescription: '',
        Department: '',
        Frequency: '',
        DeadlineDate: '',
        authorizers : '',
    }

    let validationSchem = object({
        // policyDocument: string().required('Kindly upload a file'),
        policyName: string().required('File title cannot be empty'),
        fileDescription: string().required('Description cannot be empty'),
        Department: string().required('Select subsidiaries'),
        Frequency: string().required('Select reminder frequency'),
        DeadlineDate: string().required('Select deadline date'),
        authorizers: string().required('Select authorizers'),
        // age: number().required().positive().integer(),
        // email: string().email(),
        // website: string().url().nullable(),
        // createdOn: date().default(() => new Date()),
    });

    const handleFileChange = (event:any) => {
        const file = event.target.files[0];
        if (file) {
          setPolicyDoc(file)
        } else{
            toast.error('No file selected!');
            setPolicyDoc('');
        }
      };

      const subsidiaries = [
        {
            id: 0,
            name:"ABUJA BRANCH"
        },
        {
            id: 1,
            name:"ADMIN"
        },
        {
            id: 2,
            name:"BRAND STRATEGY & MARKETING"
        },
    ]

    const remFreq = [
        {
            id: 0,
            name:"Daily"
        },
        {
            id: 1,
            name:"Weekly"
        },
        {
            id: 2,
            name:"Monthly"
        },
    ]

    const authorizers = [
        {
            id: 0,
            name:"Olubukola Lanipekun-Lawal"

        },
        {
            id: 1,
            name:"Taiwo Sanusi"
        },
        {
            id: 2,
            name:"Peju Siyanbola"
        },
    ]

    const createNewPolicy = async (body:any) => {
        console.log({bodyHere:body})
        let formdata = new FormData()

        let depts = ["2","3"] 

        depts.forEach((item, index) => {
            formdata.append(`Department[${index}]`, item);
          });
          
        formdata.append("DeadlineDate",body.DeadlineDate);
        formdata.append("Frequency","Weekly");
        formdata.append("fileDescription",body.fileDescription);
        formdata.append("policyName",body.policyName);
        formdata.append("Authorizer","Peju Siyanbola");
        formdata.append("policyDocument",policyDoc);

       
    

        let userInfo = await getUserInfo();

        if (userInfo) {

            const res = await api.post(`policy/upload?UploaderName=${userInfo?.profile.given_name} ${userInfo?.profile.family_name}`, formdata, `${userInfo?.access_token}`)
            console.log(res)
        }


    }
    return (
       <div>
                <Formik
                    initialValues={initialVal}
                    validationSchema={validationSchem}
                    validateOnBlur
                    onSubmit={(val) => createNewPolicy(val)
                    }
                >{
                        ({ handleChange, handleSubmit, errors, touched, handleBlur }) => (
                            <form onSubmit={handleSubmit} className="w-100 px-2 d-flex align-items-center flex-column">

                              
                                    <div className="p-2"  style={{ marginTop: '5px', minWidth: '400px' }}  >
                                        <p className="p-0 m-0">Policy Title</p>
                                        <FormControl
                                            id="policyName"
                                            className="py-2"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            placeholder="Enter Policy Title"/>
                                        <p
                                            className="p-0 text-danger m-0 mt-1"
                                            style={{ fontSize: '0.7em' }}>{touched.policyName && errors['policyName']}
                                        </p>

                                    </div>

                                    <div className="p-2" style={{ marginTop: '5px', minWidth: '400px' }}>
                                        <p className="p-0 m-0">Upload File (PDF)</p>
                                        <input
                                            onChange={(e)=>handleFileChange(e)}
                                             type='file' />

                                    </div>

                                    <div className="p-2" style={{ marginTop: '5px', minWidth: '400px' }}>
                                        <p className="p-0 m-0">Policy Description</p>
                                        <FormControl
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            id="fileDescription"
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
                                            type="date" placeholder="Select date"style={{ marginTop: '5px', maxWidth: '400px' }} />
                                            <p
                                            className="p-0 text-danger m-0 mt-1"
                                            style={{ fontSize: '0.7em' }}>{touched.DeadlineDate && errors['DeadlineDate']}
                                        </p>
                                    </div>

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
                                                remFreq.map((sub,index)=>
                                                    <option key={index} value={sub.id}>{sub.name}</option>
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
                                        id="authorizers"
                                        className="py-2"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        style={{ marginTop: '5px', maxWidth: '400px' }}>
                                        <option>Select</option>
                                        {
                                                authorizers.map((sub,index)=>
                                                    <option key={index} value={sub.id}>{sub.name}</option>
                                                )
                                            }
                                    </FormSelect>

                                    <p
                                            className="p-0 text-danger m-0 mt-1"
                                            style={{ fontSize: '0.7em' }}>{touched.authorizers && errors['authorizers']}
                                        </p>
                                </div>

                                <Button disabled={!policyDoc} type="submit" variant="primary mt-3">Submit for Approval </Button>
                            </form>)
                    }
                </Formik>
                </div>
    )
}
export default CreateNewPolicyPage;