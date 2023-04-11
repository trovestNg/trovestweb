import React, { useEffect, useState } from "react";
import {
    Col, Row,InputGroup, Button, Spinner,} from "react-bootstrap";
import RemmitanceTable from "../../components/remmitanceTable";
import { Formik } from "formik";
import * as yup from 'yup';
import api from "../../../../app/controllers/endpoints/api";
import { user_storage_token } from "../../../../config";

export default function AllRemittance() {
  const [totalItem, setTotalItem] = useState({ totalItems: 0, count: 0, itemsPerPage: 0, currentPage: 0, totalPages: 0 });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const [allRemittance, setAllRemittance] = useState([]);
    const [loading,setLoading] = useState(false);
    const [refreshData,setRefreshData] = useState(false);
    const token = localStorage.getItem(user_storage_token);

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

    const fetch = async ()=>{
      setLoading(true)
const res =await api.get('/super/all-collections?page=1&limit=30', token);
console.log(res);

if (res?.data?.success) {
    setAllRemittance(res?.data?.data?.deposit);
    setTotalItem({
      totalItems: res?.data?.data?.agents?.totalDocs,
      count: res?.data?.data?.agents?.pagingCounter,
      itemsPerPage: res?.data?.data?.agents?.limit,
      currentPage: res?.data?.data?.agents?.page,
      totalPages: res?.data?.data?.agents?.totalPages
    })
    setLoading(false)
    
  }
    }

    useEffect(()=>{
        fetch()
    },[]);

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

    

    return (
        <>

            <Row className="w-100">
                <Col style={{ fontFamily: 'Montserrat', fontSize: '1em' }}>
                    <h1 style={{ fontSize: '1.5em' }}>
                        All Remmitance Made
                    </h1>
                </Col>
                <Formik
                initialValues={initialValue}
                validationSchema={validationSchema}
                onSubmit={(val)=>handleDateSearch(val)}
                >
                    
                {
                ({handleChange, handleSubmit,errors})=>
                (
                <Col className="d-flex align-items-center gap-2 justify-content-end">
                    <InputGroup
                          className="d-flex align-items-center border rounded justify-content-center gap-2"
                          style={{ maxWidth: "13em", minHeight:'2em' }}
                        >
                          <label htmlFor="startDate">From :</label>
                          <input
                            onChange={handleChange}
                            name="startDate"
                            type="date"
                            className="h-100 border border-0 outline py-1 bg-transparent d-flex align-items-center"
                            style={{ outline: "none" }}
                          />
                        </InputGroup>

                        <InputGroup
                          className="d-flex align-items-center border rounded justify-content-center gap-2"
                          style={{ maxWidth: "13em" }}
                        >
                          <label htmlFor="endDate">To :</label>
                          <input
                            onChange={handleChange}
                            name="endDate"
                            type="date"
                            className="h-100 border border-0 outline py-1 bg-transparent d-flex align-items-center"
                            style={{ outline: "none" }}
                          />
                        </InputGroup>

                        <Button
                          type="submit"
                          onClick={handleSubmit}
                          disabled={Object.keys(errors).length > 0}
                          className="text-light d-flex flex-column justify-content-center align-items-center
                  bg-primary h-100 m-0 p-1 py-1 rounded-right rounded"
                          style={{ maxWidth: "3em" }}
                        >
                          {
                            // searchLoading? <Spinner/> :
                            <i className="bi bi-search"></i>
                          }
                        </Button>
                        </Col>
                )
                }
                </Formik>
            </Row>
            <Row className="w-100 d-flex justify-content-center mt-3">
              {
                loading? <Spinner/> :  <RemmitanceTable data={allRemittance} />
              }
            </Row>
            <Row className="w-100 mb-4">
        {
          allRemittance.length > 0 ? (
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
           
        </>
    )
}