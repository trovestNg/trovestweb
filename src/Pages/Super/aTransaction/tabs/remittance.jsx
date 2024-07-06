import React, { useState } from "react";
import {
    Col, Row,InputGroup, Button,} from "react-bootstrap";
import ARemmitanceTable from "../../../SuperAdmin/components/aRemmitanceTable";
import { Formik } from "formik";
import * as yup from 'yup';

export default function Remittance() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading,setLoading] = useState(false);
    const [refreshData,setRefreshData] = useState(false);

    const initialValue = {
        startDate : '',
        endDate : ''
    }

    const validationSchema = yup.object().shape({
        startDate : yup.string().required('Select start date'),
        endDate : yup.string().required('Select end date')
    })

    const handleDateSearch = (val)=>{
        setStartDate(val?.startDate);
        setEndDate(val?.endDate);
        setRefreshData(!refreshData);
    }

    const fetch = ()=>{

    }

    console.log({start: startDate, end:endDate});

    

    return (
        <>

            <Row className="w-100 mt-3">
                <Col style={{ fontFamily: 'Montserrat', fontSize: '1em' }}>
                    <h1 style={{ fontSize: '1.5em' }}>
                        All Deposits Made
                    </h1>
                </Col>
                <Formik
                initialValues={initialValue}
                validationSchema={validationSchema}
                onSubmit={(val)=>handleDateSearch(val)}
                >
                    
                {({handleChange, handleSubmit,errors})=>
                (<Col className="d-flex align-items-center gap-2 justify-content-end">
                    <InputGroup className="d-flex align-items-center border rounded justify-content-center gap-2" style={{ maxWidth: '13em' }}>
                        <label htmlFor="startDate">From :</label>
                        <input onChange={handleChange} name="startDate" type="date" className="h-100 border border-0 outline py-1 bg-transparent" style={{ outline: 'none' }} />
                    </InputGroup>

                    <InputGroup className="d-flex align-items-center border rounded justify-content-center gap-2" style={{ maxWidth: '13em' }}>
                        <label htmlFor="endDate">To :</label>
                        <input onChange={handleChange} name="endDate" type="date" className="h-100 border border-0 outline py-1 bg-transparent" style={{ outline: 'none' }} />

                    </InputGroup>

                    <Button
                    type="submit"
                          onClick={handleSubmit}
                          disabled={Object.keys(errors).length > 0}
                        className="text-light d-flex flex-column justify-content-center align-items-center
                  bg-primary h-100 m-0 p-1 py-1 rounded-right rounded"
                        style={{ maxWidth: '3em', maxHeight:'2em' }}
                    >{

                            // searchLoading? <Spinner/> :
                            <i
                                className="bi bi-search"></i>
                        }</Button>


                </Col>)
                }
                </Formik>
            </Row>
            <ARemmitanceTable data={['a', 'b', 'c', 'd']} />
        </>
    )
}