import React from "react";
import { Button, FormControl, FormSelect, Modal, ProgressBar } from "react-bootstrap";
import { Formik } from 'formik';
import { object, string, number, date, InferType } from 'yup';
import api from "../../config/api";
import { getUserInfo } from "../../controllers/auth";
import moment from "moment";
import { toast } from 'react-toastify';
import { shortenString } from "../../util";

const UpdatePolicyModal: React.FC<any> = ({ show, off, pol }) => {
    const initialVal = {
        "id": pol?.id,
        "deadlineDate": ''
    }

    let validationSchem = object({
        // policyDocument: string().required('Kindly upload a file'),
        deadlineDate: string().required('New date is required'),
        // fileDescription: string().required('Description cannot be empty'),

        // age: number().required().positive().integer(),
        // email: string().email(),
        // website: string().url().nullable(),
        // createdOn: date().default(() => new Date()),
    });

    const createNewPolicy = async (body: any) => {
        // // console.log({ gotten: userInfo })({
        //     sending : body
        // })
        let userInfo = await getUserInfo();
        if (userInfo) {
            const res = await api.post(`Policy/adjust/deadline`, body, `${userInfo?.access_token}`)
            if (res?.status == 200) {
                toast.success('Deadline updated succesfully!');
                off();
            } else {
                toast.error('Error updating deadline date')
            }
        }


    }
    return (
        <div>
            <Modal show={show} centered>
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
                            ({ handleChange, handleSubmit, errors, values, touched, handleBlur }) => (

                                <form onSubmit={handleSubmit} className="px-2">
                                    <div className="">
                                        <h6>File name</h6>
                                        <div className="d-flex">
                                            {' '}
                                            <i className="bi bi-file-earmark-pdf text-danger"></i>
                                            <h5>{pol?.fileName}</h5>
                                        </div>
                                        <div className="w-75">


                                            <h6 className="mt-3">File Description</h6>
                                            <p className=" d-flex gap-2"
                                                style={{ fontSize: '0.9em', wordBreak: 'break-word' }}>
                                                {
                                                    shortenString(pol?.fileDescription, 120)
                                                }
                                            </p>

                                        </div>
                                        <div className="">
                                            <p className="text-danger p-0 m-0"> Deadline date</p>
                                            <p>{moment(pol?.deadlineDate).format('MMM DD YYYY')}</p>

                                            <div className="">
                                                <p className="p-0 m-0">Select New Deadline Date</p>
                                                <FormControl
                                                    onChange={handleChange}
                                                    id="deadlineDate"
                                                    type="date" placeholder="Select date" style={{ marginTop: '5px', maxWidth: '200px' }} />
                                                <p
                                                    className="p-0 text-danger m-0 mt-1 px-2"
                                                    style={{ fontSize: '0.7em' }}>{touched.deadlineDate && errors['deadlineDate']}
                                                </p>
                                            </div>
                                        </div>


                                    </div>
                                    <div className="w-100 d-flex gap-4 mt-4 justify-content-end">
                                        <Button onClick={() => off()} variant="outline border py-1">Cancel</Button>
                                        <Button type="submit" variant="primary">
                                            Update Deadline
                                        </Button>
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