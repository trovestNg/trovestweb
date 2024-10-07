import React, { useEffect, useState } from "react";
import { Button, FormControl, FormSelect, Modal, ProgressBar, Spinner } from "react-bootstrap";
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as yup from 'yup';
import api from "../../config/api";
import { getUserInfo } from "../../controllers/auth";
import { getCountries } from "../../utils/helpers";
import { ICountry } from "../../interfaces/country";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../config/config";

const CreateBMOOwnerImportNodeModal:  React.FC<any> = ({ show, off,cusNum }) => {

    const navigate = useNavigate()
    const [fileName, setFileName] = useState('');
    const [fileUrl, setFileUrl] = useState('');
    const [dloading, setDLoading] = useState(false);

    const [loading, setLoading] = useState(false);

    // useEffect(() => {
    //     navigate(fileUrl)
    // }, [fileUrl])

    const initialVal = {
        "file": null,
    }


    let validationSchem = yup.object({
        file: yup.mixed()
            .required('A file is required')

        // policyDocument: string().required('Kindly upload a file'),

        // fileDescription: string().required('Description cannot be empty'),

        // age: number().required().positive().integer(),
        // email: string().email(),
        // website: string().url().nullable(),
        // createdOn: date().default(() => new Date()),
    });

    const downloadExcelReport = async()=>{
        try {
            setDLoading(true)
            let userInfo = await getUserInfo();
            // const res = await api.get(``, );
            const res= await fetch(`${baseUrl}/node/upload/template/download?requesterName=${`${userInfo?.profile.given_name} ${userInfo?.profile.family_name}`}`)
            if(res.status==200){
                res.blob().then(blob=>{
                    let a=document.createElement('a');
                    a.href=window.URL.createObjectURL(blob);
                    a.download='Upload Template.' + 'xlsx';
                    a.click();
                   })
                   setDLoading(false)
               }
    
               if(res.status==404){
                toast.error('Fail to fetch report')
                   setDLoading(false)
               }
          
        } catch (error) {

        }
    }

      // Function to trigger the download
  const triggerFileDownload = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Template.csv'); // You can name the file anything you want
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
            setFieldValue('file', file);
        }
    };

    const createNewBMO = async (body: any) => {
        setLoading(true)
        console.log({ seeBody: body })
        let userInfo = await getUserInfo();



        if (userInfo) {
            let formData = new FormData()

            formData.append('file', body?.file)
            formData.append('RequesterName', `${userInfo?.profile.given_name} ${userInfo?.profile.family_name}`)
            formData.append('OwnerId', cusNum)
            // const apiBody = {
            //     "RequesterName": `${userInfo?.profile.given_name} ${userInfo?.profile.family_name}`,
            //     "file":formData
            // }

            const res = await api.post(`node/upload/otherLevel`, formData, `${userInfo?.access_token}`)
            if (res?.status==200) {
                toast.success('BO Uploaded succesfully');
                setLoading(false)
                off()
            } else {
                toast.error('Operation failed! record already exist!');
                setLoading(false)
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
                                        Proceed to download CSV file template by clicking <Button variant="outline p-0 m-0" disabled={dloading} style={{minWidth:'12em'}} onClick={downloadExcelReport} role="button" className="text-primary">{dloading?<Spinner size="sm"/>:'Download CSV Template'}</Button>
                                    </div>

                                    <label
                                        htmlFor="file"
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
                                        id="file"
                                        name="file" type="file"
                                        onChange={(event) => handleFileChange(event, setFieldValue)}
                                    />
                                    <ErrorMessage
                                                name="file"
                                                component="div"
                                                className="text-danger fw-medium" />
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
                                            <Button className="w-100 rounded rounded-1" type="submit" variant="primary mt-3">{loading?<Spinner size="sm"/>:'Submit for Approval '}</Button>
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
export default CreateBMOOwnerImportNodeModal;