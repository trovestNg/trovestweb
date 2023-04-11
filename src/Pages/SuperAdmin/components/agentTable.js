import React from "react";
import { Alert, Card, ListGroup, Spinner, Row } from "react-bootstrap";
import Styles from './md.module.css';
import { Naira } from "../../../config";
import { useNavigate } from "react-router-dom";

const AgentTable = ({ data, agents }) => {
    const navigate = useNavigate();

const calculateAllThrifts=(array)=>{
    let total = 0;
for(let x=0; x<array.length; x++)
{
    total = total + Number(array[x]?.total);
}
return total
}
   
    return (
        
        <div className="w-100 d-flex flex-column justify-content-center align-items-center">
            {data?.length <= 0 ? <p className="text-secondary" style={{ fontFamily: 'Montserrat-SemiBold' }}>This Admin Has Not Registered Any Agent </p>

                : (
                    <>
                   
                    <table className="table w-100 mt-3 table-striped">
                        <thead className="bg-primary text-light">
                            <tr style={{ fontFamily: 'Montserat-Regular', fontSize: '0.9em' }}>
                                <th scope="col">#</th>
                                <th scope="col">Name</th>
                                <th scope="col">Id</th>
                                <th scope="col">Phone Number</th>
                                <th scope="col">No of Customers</th>
                                <th scope="col" >
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data?.map((agent, index) => (
                                    <tr onClick={() => navigate(`/super-admin/agent/${agent._id}`)}
                                        key={index +21}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <th scope="row">{index + 1}</th>
                                        <td>{`${agent?.first_name} ${agent?.last_name}`}</td>
                                        <td>{`${agent?.assigned_id}`}</td>
                                        <td>{agent?.mobile}</td>
                                        <td>{agent?.artisans.length}</td>
                                        
                                        {/* <td>{`${Naira} ${100000 * Math.random(10).toExponential(2)}`}</td> */}
                                        <td className={`${Styles.tableicon}`}>
                                            <i className="bi bi-three-dots-vertical"></i>
                                        </td>
                                    </tr>
                                ))
                            }

                        </tbody>
                    </table>
                    </>
                    )}
        </div>
       
    )
}
export default AgentTable;