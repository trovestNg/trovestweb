import React, { useEffect, useState } from "react";
import {
    Col, Row, InputGroup, Button, Spinner
} from "react-bootstrap";
import AgentMTable from "../agentMTable";
import AgentTable from "../../components/agentTable";
import AgentMaTable from "../agentMaTable";
import RemmitanceTable from "../../components/remmitanceTable";
import { Formik } from "formik";
import * as yup from 'yup';
import api from "../../../../app/controllers/endpoints/api";
import { user_storage_token } from "../../../../config";
import { superAdminSearchAgent } from "../../../../Sagas/Requests";

export default function ApprovedAgents() {
    const [loading, setLoading] = useState(false);
    const [refreshData, setRefreshData] = useState(false);
    const [totalItem, setTotalItem] = useState({ totalItems: 0, count: 0, itemsPerPage: 0, currentPage: 0, totalPages: 0 });
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(8);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchByName, setSearchByName] = useState(false);
    const [allAgents, setAllAgents] = useState([]);
    const [userInput, setUserInput] = useState('');

    const token = localStorage.getItem(user_storage_token);

    const fetch = async () => {
        if (searchByName) {
            searchAgent()
        }
        else {
            fetchService();
        }
    };

    useEffect(() => {
        fetch()
    }, [refreshData]);

    const fetchService = async () => {
        setLoading(true);
        const res = await api.get(`/super/dashboard?limit=30`, token);

        if (res?.data?.success) {
            setAllAgents(res?.data?.data?.superadmin?.agents);
            setTotalItem({
                totalItems: res?.data?.data?.client?.totalDocs,
                count: res?.data?.data?.client?.pagingCounter,
                itemsPerPage: res?.data?.data?.client?.limit,
                currentPage: res?.data?.data?.client?.page,
                totalPages: res?.data?.data?.client?.totalPages
            })
            setLoading(false);
        }
    };

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


    //   console.log({Now:allAgents})

    const initialValue = {
        startDate: '',
        endDate: ''
    }

    const validationSchema = yup.object().shape({
        startDate: yup.string().required('Select start date'),
        endDate: yup.string().required('Select end date')
    })

    const handleAgentSearch = () => {
        setSearchByName(true);
        setRefreshData(!refreshData);
    }

    const searchAgent = async () => {
        setSearchLoading(true);
        const payload = { token: token, page: page, limit: limit, name: userInput }
        const res = await api.get(`/super/search-all-agent?name=${userInput}&page=${page}&limit=${limit}`, token);
        console.log(res);
        if (res?.data?.success) {
            setAllAgents(res?.data?.data?.docs);
            setSearchLoading(false);
        }
    }




    return (
        <>

            <Row className="w-100 mt-3">
                <Col className="d-flex justify-content-end" style={{ fontFamily: 'Montserrat', fontSize: '1em' }}>
                    <InputGroup className="d-flex m-0 p-0 border w-75 border-primary rounded 
                justify-content-space-between" style={{ maxWidth: '16em', }}>
                        <input
                            type="search"
                            onChange={(e) => setUserInput(e.target.value)}
                            className="rounded border w-75 border-0 bg-transparent px-2"
                            placeholder="agent name"
                            style={{
                                minHeight: "2.5em",
                                outline: "none",
                            }}
                        />
                        <button
                            style={{ maxHeight: '2.5em' }}
                            onClick={() => handleAgentSearch()}
                            disabled={userInput == ''}
                            className="text-light d-flex flex-column justify-content-center align-items-center
                  bg-primary w-25 h-100 m-0 p-1 py-2 rounded-right"
                        >{

                                searchLoading ? <Spinner size="sm" /> :
                                    <i
                                        className="bi bi-search"></i>
                            }</button>

                    </InputGroup>
                </Col>
    
            </Row>
            <Row className="w-100  d-flex justify-content-center align-items-center">
                {
                    loading ? <Spinner /> : <AgentMaTable data={allAgents} />}
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

        </>
    )
}