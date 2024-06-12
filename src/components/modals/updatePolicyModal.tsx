import React from "react";
import { Button, FormControl, FormSelect, Modal, ProgressBar } from "react-bootstrap";
import { Formik } from 'formik';
import { object, string, number, date, InferType } from 'yup';
import api from "../../config/api";
import { getUserInfo } from "../../controllers/auth";

const UpdatePolicyModal: React.FC<any> = ({ show, off, pol }) => {
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

    const createNewPolicy = async (body: any) => {
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

        if (userInfo) {

            const res = await api.post(`policy/upload?UploaderName=${userInfo?.profile.given_name} ${userInfo?.profile.family_name}`, newBody, `${userInfo?.access_token}`)
            console.log(res)
        }


    }
    return (
        <div>
            <Modal size="lg" show={show} centered>
                <Modal.Header className="d-flex justify-content-between text-light bg-primary"
                    style={{ fontFamily: 'title' }}>
                    <p className="p-0 m-0">Update Deadline</p>
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
                                    <div className="d-flex">
                                        <div className="w-50">
                                            <h6>File name</h6>
                                            <div className="d-flex">
                                                <i className="bi bi-file-earmark-pdf text-danger"></i>
                                                <h5>{pol?.fileName}</h5>
                                            </div>
                                            <div>
                                                <h6 className="mt-3">File Description</h6>
                                                <p>{pol?.fileDescription}</p>
                                            </div>
                                        </div>
                                        <div className="w-50">
                                            <p className="text-danger p-0 m-0"> Deadline date</p>
                                            <p>{pol?.deadlineDate}</p>

                                            <div className="p-2">
                                                <p className="p-0 m-0">New Deadline Date</p>
                                                <FormControl
                                                    onChange={handleChange}
                                                    id="DeadlineDate"
                                                    type="date" placeholder="Select date" style={{ marginTop: '5px', maxWidth: '200px' }} />
                                            </div>
                                        </div>


                                    </div>
                                    <div className="w-100 d-flex gap-4 mt-4 justify-content-center">
                                        <Button type="submit" variant="primary">Update</Button>
                                        <Button type="reset"  variant="outline border py-1">Cancel</Button>
                                    </div>

                                </form>)
                        }
                    </Formik>
                </Modal.Body>
            </Modal>
        </div>
    )
}
export default UpdatePolicyModal;