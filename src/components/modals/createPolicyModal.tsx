import React from "react";
import { Button, FormControl, FormSelect, Modal, ProgressBar } from "react-bootstrap";
import { Formik } from 'formik';
import { object, string, number, date, InferType } from 'yup';
import api from "../../config/api";
import { getUserInfo } from "../../controllers/auth";

const CreatePolicyModal: React.FC<any> = ({ show, off }) => {
    const initialVal = {
        policyDocument: 'File name',
        fileDescription: '',
        policyName: '',
        Department: '',
        Dept: '',
        Frequency: '',
        DeadlineDate: ''
    }

    let validationSchem = object({
        // policyDocument: string().required('Kindly upload a file'),
        policyName: string().required('File title cannot be empty'),
        // fileDescription: string().required('Description cannot be empty'),

        // age: number().required().positive().integer(),
        // email: string().email(),
        // website: string().url().nullable(),
        // createdOn: date().default(() => new Date()),
    });

    const createNewPolicy = async (body:any)=>{
        const newBody = {
            "policyName": [
                body?.policyName
            ],
            "policyDocument": [
                body?.policyDocument
            ],
            "fileDescription": [
                body?.fileDescription
            ]
        }
        let userInfo = await getUserInfo();

        if(userInfo){
           
            const res = await api.post(`policy/upload?UploaderName=${userInfo?.profile.given_name} ${userInfo?.profile.family_name}`,newBody, `${userInfo?.access_token}`)
            console.log(res)
        }
        

    }
    return (
        <div>
            <Modal size="lg" show={show} centered>
                <Modal.Header className="d-flex justify-content-between"
                    style={{ fontFamily: 'title' }}>
                    <p className="p-0 m-0">Create new policy</p>
                    <i className="bi bi-x-circle" onClick={() => off()}></i>
                </Modal.Header>
                <Modal.Body >
                    <Formik
                        initialValues={initialVal}
                        validationSchema={validationSchem}
                        validateOnBlur
                        onSubmit={(val) => createNewPolicy(val)
                        }
                    >{
                            ({ handleChange, handleSubmit, errors, touched, handleBlur }) => (
                                <form onSubmit={handleSubmit} className="px-2">

                                    <div className="d-flex  justify-content-between w-100">
                                        <div className="p-2">
                                            <p className="p-0 m-0">Title</p>
                                            <FormControl
                                                id="policyName"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                placeholder="Enter Policy Title" style={{ marginTop: '5px', minWidth: '350px' }} />
                                            <p
                                                className="p-0 text-danger m-0 mt-1"
                                                style={{ fontSize: '0.7em' }}>{touched.policyName && errors['policyName']}</p>

                                        </div>

                                        <div className="p-2  w-50">
                                            <p className="p-0 m-0">Upload File (PDF)</p>
                                            <input
                                                onChange={handleChange}
                                                id="policyDocument" type='file' />
                                            
                                        </div>
                                    </div>

                                    <div className="d-flex  justify-content-between w-100">
                                        <div className="p-2">
                                            <p className="p-0 m-0">Description</p>
                                            <FormControl
                                                onChange={handleChange}
                                                id="fileDescription"
                                                className="py-4" type="textfield" placeholder="Enter Policy Description" style={{ marginTop: '5px', minWidth: '350px' }} />
                                        </div>

                                        <div className="p-2  w-50">
                                            <p className="p-0 m-0">Deadline Date</p>
                                            <FormControl
                                                onChange={handleChange}
                                                id="DeadlineDate"
                                                type="date" placeholder="Select date" style={{ marginTop: '5px', maxWidth: '200px' }} />
                                        </div>
                                    </div>

                                    <div className="d-flex  justify-content-between w-100">
                                        <div className="p-2  w-50">
                                            <p className="p-0 m-0">Subsidiary</p>
                                            <FormSelect
                                                id="Department"
                                                onChange={handleChange}
                                                style={{ marginTop: '5px', maxWidth: '350px' }}>
                                                <option>Select</option>
                                            </FormSelect>
                                        </div>

                                        <div className="p-2  w-50">

                                            <p className="p-0 m-0">Reminder Frequency</p>
                                            <FormSelect
                                                id="Frequency"
                                                onChange={handleChange}
                                                style={{ marginTop: '5px', maxWidth: '350px' }}>
                                                <option>Select</option>
                                            </FormSelect>
                                        </div>
                                    </div>
                                    <div className="p-2">
                                        <p className="p-0 m-0">Authorizer</p>
                                        <FormSelect
                                            id="Dept"
                                            onChange={handleChange}
                                            style={{ marginTop: '5px', maxWidth: '350px' }}>
                                            <option>Select</option>
                                        </FormSelect>
                                    </div>

                                    <Button type="submit" variant="primary mt-3">Submit for Approval </Button>
                                </form>)
                        }
                    </Formik>
                </Modal.Body>
            </Modal>
        </div>
    )
}
export default CreatePolicyModal;