import React, { useEffect, useState } from "react";
import {
    Col, Row,InputGroup, Button,} from "react-bootstrap";
import CollectionTable from "../../components/collectionTable";
import { Formik } from "formik";
import * as yup from 'yup';
import api from "../../../../app/controllers/endpoints/api";
import { user_storage_token } from "../../../../config";
import { useParams } from "react-router-dom";

export default function AgentCollections() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading,setLoading] = useState(false);
    const [collections, setCollections] = useState([])
    const [refreshData,setRefreshData] = useState(false);
    const token = localStorage.getItem(user_storage_token);
    const {agentId} = useParams()

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

    const getAgentCollections = async () => {
        const res = await api.get(`/super/get-agent-collections/${agentId}&page=1&limit=${100}`,token);
        setCollections(res?.data?.data?.revenue?.docs)
        console.log(res)
      };

    useEffect(()=>{
        getAgentCollections();
    },[])

    return (
        <>

            <Row className="w-100 mt-3">
                <Col style={{ fontFamily: 'Montserrat', fontSize: '1em' }}>
                    <h1 style={{ fontSize: '1.5em' }}>
                        All AgentCollections Made
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
                        style={{ maxWidth: '3em' }}
                    >{

                            // searchLoading? <Spinner/> :
                            <i
                                className="bi bi-search"></i>
                        }</Button>


                </Col>)
                }
                </Formik>
            </Row>
            <CollectionTable data={collections} />
        </>
    )
}