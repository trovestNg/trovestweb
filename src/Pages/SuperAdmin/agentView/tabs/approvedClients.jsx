import React, { useEffect, useState } from "react";
import {
    Col, Row,InputGroup, Button,Spinner} from "react-bootstrap";
import AgentMTable from "../agentMTable";
import AgentTable from "../../components/agentTable";
import RemmitanceTable from "../../components/remmitanceTable";
import { Formik } from "formik";
import * as yup from 'yup';
import api from "../../../../app/controllers/endpoints/api";
import { user_storage_token } from "../../../../config";
import CustomerTable from "../../components/customerTable";

export default function ApprovedClients() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading,setLoading] = useState(false);
    const [refreshData,setRefreshData] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchByName, setSearchByName] = useState(false);
    const [userSearch,setUserSearch] = useState('');
    const [allAgents, setAllClients] = useState();
    
    const token = localStorage.getItem(user_storage_token);

    const fetch = async () => {
        if(searchByName){
            NameSearch();
        }
        else {
         fetchService();
        }
       };

    useEffect(()=>{
        fetch ()
    },[refreshData]);

    const fetchService = async () => {
        setLoading(true);
        const res = await api.get(`/super/artisans?page=1&limit=100`, token);
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

    const handleSearch = ()=>{
setSearchByName(true);
setRefreshData(!refreshData);
    }

    const NameSearch = async ()=>{
        const res = await api.get(`/super/artisans?page=1&limit=100`, token);
        console.log(res);
    }

    // console.log({start: startDate, end:endDate});

    

    return (
      <div className="w-100 ">
           <Row className="w-100 mt-3">
                <Col style={{ fontFamily: 'Montserrat', fontSize: '1em' }}>
                <InputGroup className="d-flex m-0 p-0 border w-75 border-primary rounded 
                justify-content-space-between" style={{maxWidth:'16em',}}>
                  <input
                  type="search"
                  onChange={(e)=>setUserSearch(e.target.value)}
                    className="rounded border w-75 border-0 bg-transparent px-2"
                    placeholder="Search agent name"
                    style={{
                      maxHeight: "2.4em",
                      outline: "none",
                    }}
                  />
                  <button
                  disabled={userSearch == ''}
                onClick = {handleSearch}
                  className="text-light d-flex flex-column justify-content-center align-items-center
                  bg-primary w-25 h-100 m-0 p-1 py-2 rounded-right"
                  >{
                  
                    searchLoading? <Spinner/> :
                  <i 
                  className="bi bi-search"></i>
                  }</button>
                  
                </InputGroup>
                </Col>
                
            </Row>
            <Row className="w-100  min-vh-100 d-flex justify-content-center align-items-center">
            {
           loading? <Spinner/> : <CustomerTable data={allAgents} />}
            </Row>
           
       </div>
    )
}