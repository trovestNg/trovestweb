import React, { useEffect, useState } from "react";
import {
    Col, Row,InputGroup, Button,Spinner} from "react-bootstrap";
import { Formik } from "formik";
import * as yup from 'yup';
import api from "../../../../app/controllers/endpoints/api";
import { user_storage_token } from "../../../../config";
import ACustomerTable from "../../../SuperAdmin/components/aCustomerTable";

export default function AdminClients() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading,setLoading] = useState(false);
    const [refreshData,setRefreshData] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchByName, setSearchByName] = useState(false);
    const [allAgents, setAllClients] = useState();
    
    const token = localStorage.getItem(user_storage_token);

    const fetch = async () => {
        if(searchByName){
         
        }
        else {
         fetchService();
        }
       };

    useEffect(()=>{
        fetch ()
    },[]);

    const fetchService = async () => {
        setLoading(true);
        const res = await api.get(`/super/artisans?page=1&limit=100`, token);
        console.log({Now:res});
       
        if (res?.data?.success) {
          setAllClients(res?.data?.data?.docs);
          setLoading(false);
        }
      };

      

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

    // console.log({start: startDate, end:endDate});

    

    return (
        <>

            <Row className="w-100 mt-3">
                <Col className="d-flex justify-content-end" style={{ fontFamily: 'Montserrat', fontSize: '1em' }}>
                <InputGroup className="d-flex m-0 p-0 border w-75 border-primary rounded 
                justify-content-space-between" style={{maxWidth:'16em',}}>
                  <input
                  type="search"
                  
                    className="rounded border w-75 border-0 bg-transparent px-2"
                    placeholder="Search name"
                    style={{
                      maxHeight: "2.4em",
                      outline: "none",
                    }}
                  />
                  <button
                
                  className="text-light d-flex flex-column justify-content-center align-items-center
                  bg-primary w-25 h-100 m-0 p-1 py-2 rounded-right"
                  >{
                  
                    searchLoading? <Spinner/> :
                  <i 
                  className="bi bi-search"></i>
                  }</button>
                  
                </InputGroup>
                </Col>
                {/* <Formik
                initialValues={initialValue}
                validationSchema={validationSchema}
                onSubmit={(val)=>handleDateSearch(val)}
                >
                    
                {({handleChange, handleSubmit,errors})=>
                (<Col className="d-flex align-items-center gap-1 justify-content-end">
                    <InputGroup className="d-flex align-items-center border  rounded justify-content-center gap-2" style={{ maxWidth: '13em' }}>
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
                  bg-primary  m-0 p-1 rounded-right rounded"
                        style={{ maxWidth: '3em' }}
                    >{

                            // searchLoading? <Spinner/> :
                            <i
                                className="bi bi-search"></i>
                        }</Button>


                </Col>)
                }
                </Formik> */}
            </Row>
            <ACustomerTable data={['a','b','c']} />
        </>
    )
}