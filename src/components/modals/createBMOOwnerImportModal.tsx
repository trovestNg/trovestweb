import React, { useEffect, useState } from "react";
import { Button, FormControl, FormSelect, Modal, ProgressBar } from "react-bootstrap";
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as yup from 'yup';
import api from "../../config/api";
import { getUserInfo } from "../../controllers/auth";
import { getCountries } from "../../utils/helpers";
import { ICountry } from "../../interfaces/country";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CreateBMOOwnerImportModal: React.FC<any> = ({ show, off }) => {

    const navigate = useNavigate()
    const [fileName, setFileName] = useState('');
    const [fileUrl, setFileUrl] = useState('');

    // useEffect(() => {
    //     navigate(fileUrl)
    // }, [fileUrl])

    const initialVal = {
        "id": '',
        "businessName": "",
        "customerNumber": "",
        "bvn": "",
        "idType": "",
        "idNumber": "",
        "countryId": "",
        "percentageHolding": '',
        "numberOfShares": '',
        "isPEP": "",
        "categoryId": "",
        "rcNumber": "",
        "ticker": ""
    }


    let validationSchem = yup.object({
        policyDocument: yup.mixed()
            .required('A file is required')
            .test('fileType', 'Only PDF files are accepted', (value: any) => {
                return value && value.type === 'application/csv';
            }),

        // policyDocument: string().required('Kindly upload a file'),

        // fileDescription: string().required('Description cannot be empty'),

        // age: number().required().positive().integer(),
        // email: string().email(),
        // website: string().url().nullable(),
        // createdOn: date().default(() => new Date()),
    });

    const handleTempDownload = async () => {
        try {
            let userInfo = await getUserInfo();
            const res = await api.get(`upload/template/download?requesterName=${`${userInfo?.profile.given_name} ${userInfo?.profile.family_name}`}`, `${userInfo?.access_token}`);
            console.log({here:res})
            triggerFileDownload(res?.data)
        } catch (error) {

        }

    }

      // Function to trigger the download
  const triggerFileDownload = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Template.xml'); // You can name the file anything you want
    document.body.appendChild(link);
    link.click();

    // Clean up the DOM by removing the link
    // link.remove();
  };

    const handleFileChange = (event: any, setFieldValue: any) => {
        console.log(event)
        const file = event.currentTarget.files[0];

        if (file) {
            let path = URL.createObjectURL(file)
            setFileName(file.name);
            setFileUrl(path);
            setFieldValue('fileName', file);
        }
    };

    const createNewBMO = async (body: any) => {
        console.log({ seeBody: body })
        let userInfo = await getUserInfo();



        if (userInfo) {

            const apiBody = {
                "requesterName": `${userInfo?.profile.given_name} ${userInfo?.profile.family_name}`,
                "parent": {

                    //   "id": 0,
                    //   "businessName": "string",
                    //   "customerNumber": "string",
                    //   "bvn": "string",
                    //   "idType": "string",
                    //   "idNumber": "string",
                    //   "countryId": "string",
                    //   "percentageHolding": 0,
                    //   "numberOfShares": 0,
                    //   "isPEP": true,
                    //   "categoryId": "string",
                    //   "rcNumber": "string",
                    //   "ticker": "string",
                    //   "originalId": 0,
                    //   "navigation": "string"
                },
                "beneficialOwners": [
                    body
                    // {
                    //     "id": 0,
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

            const res = await api.post(`BeneficialOwner`, apiBody, `${userInfo?.access_token}`)
            if (res?.data.success) {
                toast.success('BMO added succesfully')
            } else {
                toast.error('Operation failed! Check your network')
            }

        }
    }

    const handleFormReset = () => {
        off();
        setFileName('');
        setFileUrl('')

    }

    return (
        <div>
            <Modal size="lg" show={show} centered>
                <Modal.Header className="d-flex justify-content-between"
                    style={{ fontFamily: 'title' }}>
                    <p className="p-0 m-0 text-primary">Bulk Upload of Beneficial Owners</p>
                    <i className="bi bi-x-circle" onClick={() => off()}></i>
                </Modal.Header>
                <Modal.Body >
                    <Formik
                        initialValues={initialVal}
                        validationSchema={validationSchem}
                        onReset={handleFormReset}
                        validateOnBlur
                        onSubmit={(val) => createNewBMO(val)
                        }
                    >{
                            ({ handleChange, handleSubmit, handleReset, values, setFieldValue }) => (
                                <Form onSubmit={handleSubmit} onReset={handleReset} className="gap-0 px-3 slide-form">
                                    <div className="text-center">
                                        Proceed to download CSV file template by clicking <span onClick={handleTempDownload} role="button" className="text-primary">Download CSV Template</span>
                                    </div>

                                    <label
                                        htmlFor="fileUpload"
                                        className="d-flex flex-column border-dash justify-content-center border border-2 rounded  align-items-center text-center w-100 mt-3"
                                        style={{ height: `250px` }}>
                                        <i className="bi px-2 py-0 text-primary rounded bi-cloud-upload fs-1"
                                            style={{ backgroundColor: 'rgba(0,73,135,0.05)' }}></i>
                                        <p className="text-primary p-0 m-0">
                                            {fileName == '' ? 'Drag & drop file here or click to upload' : ' Click to Replace File'}

                                        </p>
                                        <p className="p-0 m-0">CSV format only</p>
                                    </label>
                                    <input style={{ display: 'none' }}
                                        id="fileUpload"
                                        name="fileUpload" type="file"
                                        onChange={(event) => handleFileChange(event, setFieldValue)}
                                    />
                                    <div className="d-flex p-2 rounded border mt-2 align-items-center">
                                        <div></div>
                                        <div>
                                            {fileName == '' ?
                                                <div className="px-3 d-flex mt-2">
                                                    {fileName && <i className="bi bi-filetype-csv"></i>}
                                                    <a href={fileUrl} target="_blank" className="px-1 text-primary">{fileName}</a>
                                                </div> :
                                                <div className="mt-2 d-flex">
                                                    {fileName &&
                                                        <div className="px-3 d-flex">
                                                            <i className="bi bi-file-earmark-spreadsheet"></i>
                                                            <a href={fileUrl} target="_blank" className="px-1 text-primary">{fileName}</a>
                                                        </div>}
                                                </div>
                                            }
                                        </div>
                                    </div>



                                    <div className="d-flex  justify-content-between my-3  gap-3 w-100">
                                        <div className="w-50">
                                            <Button className="mt-3 w-100 border border-2" type="reset" variant="outline">Cancel</Button>
                                        </div>

                                        <div className="w-50">
                                            <Button className="w-100 rounded rounded-1" type="submit" variant="primary mt-3">Submit for Approval </Button>
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
export default CreateBMOOwnerImportModal;