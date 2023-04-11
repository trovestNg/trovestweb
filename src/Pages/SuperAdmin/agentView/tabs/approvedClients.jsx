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
  const [refreshData, setRefreshData] = useState();
  const [totalItem, setTotalItem] = useState({ totalItems: 0, count: 0, itemsPerPage: 0, currentPage: 0, totalPages: 0 });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading,setLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchByName, setSearchByName] = useState(false);
    const [userSearch,setUserSearch] = useState('');
    const [allAgents, setAllClients] = useState([]);
    
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
        const res = await api.get(`/super/artisans?page=${page}&limit=${limit}`, token);
        console.log(res);
        if (res?.data?.success) {
          setAllClients(res?.data?.data?.docs);
          setTotalItem({
            totalItems: res?.data?.data?.totalDocs,
            count: res?.data?.data?.pagingCounter,
            itemsPerPage: res?.data?.data?.limit,
            currentPage: res?.data?.data?.page,
            totalPages: res?.data?.data?.totalPages
          })
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
      setSearchLoading(true)
        const res = await api.get(`/super/search-all-artisan?name=${userSearch}&page=1&limit=10`, token);
        if(res?.data?.success){
          setAllClients(res?.data?.data?.docs);
          setSearchLoading(false);
        }
        
    }

    const handlePagination = (value) => {
      setPage(value);
      setRefreshData(!refreshData);
    }
  
    const handleNext = () => {
      setPage(totalItem.currentPage + 1)
      setRefreshData(!refreshData)
  
    }
  
    const handlePrevious = () => {
      setPage(totalItem.currentPage - 1)
      setRefreshData(!refreshData)
    };

    // console.log({start: startDate, end:endDate});

    

    return (
      <div className="w-100 ">
           <Row className="w-100 mt-3">
           <Col className="d-flex justify-content-end" style={{ fontFamily: 'Montserrat', fontSize: '1em' }}>
                <InputGroup className="d-flex m-0 p-0 border w-75 border-primary rounded 
                justify-content-space-between" style={{maxWidth:'16em',}}>
                  <input
                  type="search"
                  onChange={(e)=>setUserSearch(e.target.value)}
                    className="rounded border w-75 border-0 bg-transparent px-2"
                    placeholder="Client name"
                    style={{
                      minHeight: "2.5em",
                      outline: "none",
                    }}
                  />
                  <button
                  style={{maxHeight:'2.5em'}}
                  disabled={userSearch == ''}
                onClick = {handleSearch}
                  className="text-light d-flex flex-column justify-content-center align-items-center
                  bg-primary h-100 w-25 m-0 p-1 py-2 rounded-right"
                  >
                  {
                    searchLoading? <Spinner size="sm"/> :
                  <i 
                  className="bi bi-search"></i>
                  }
                  </button>
                  
                </InputGroup>
                </Col>
                
            </Row>
            <Row className="w-100  d-flex justify-content-center align-items-center" style={{minHeight:'25em'}}>
            {
           loading? <Spinner/> : <CustomerTable data={allAgents} />}
            </Row>
            <Row className="w-100 mb-4">
        {
          allAgents.length > 0 ? (
            <nav aria-label="..." className="d-flex justify-content-center ">
              <ul className="pagination">
                <Button className="page-item" 
                disabled={totalItem.currentPage == 1}
                onClick={handlePrevious}
                >
                  Previous
                </Button>
                {
                  Array(totalItem.totalPages).fill("").map((value, index)=>(
                    <li
                    key={index}
                    onClick={() => handlePagination(index + 1)}
                      
                      className="page-item"
                    >
                      <a className="page-link"
                      style={{ backgroundColor: index + 1 == totalItem.currentPage ? 'gray' : '', cursor: 'pointer' }}
                       >{index + 1}</a>
                    </li>
                  ))
                }
                <Button className="page-item" 
                disabled={totalItem.currentPage == totalItem.totalPages}
                onClick={handleNext}
                >
                  Next
                </Button>
              </ul>
            </nav>
          ) : null
        }
      </Row>
           
       </div>
    )
}