import React from "react";
import { Alert, Card, ListGroup, Spinner, Row } from "react-bootstrap";
import Styles from './md.module.css';
import { Naira } from "../../../config";
import { useNavigate } from "react-router-dom";

const PayoutTable = ({ data, agents }) => {
    const navigate = useNavigate();

    function calculateEachAdmiGeneratedAmount(admin_id, data) {
        let total = 0;
        data?.map(item => {
            if (item?.admin_id === admin_id) {
                item?.collections?.map(collection => {
                    total = total + parseFloat(collection?.total?.$numberDecimal)
                    return total
                })
                console.log('parseFloat',total)
            }
        })
        return total?.toLocaleString()
    }
    return (
        <div className="w-100 d-flex flex-column justify-content-center align-items-center mt-5">
            {data?.length <= 0 ? <p className="text-secondary" style={{ fontFamily: 'Montserrat-SemiBold' }}>No payouts at this time </p>

                : (
                    <>
                   
                    <table className="table w-100 mt-3 table-striped">
                        <thead className="bg-primary text-light">
                            <tr style={{ fontFamily: 'Montserat-Regular', fontSize: '0.9em' }}>
                                <th scope="col">#</th>
                                <th scope="col">Date</th>
                                <th scope="col">Client name</th>
                                <th scope="col">Amount</th>
                                <th scope="col">Ref Id</th>
                                
                                <th scope="col" >
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data?.map((agent, index) => (
                                    <tr 
                                        key={index +21}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <th scope="row">{index + 1}</th>
                                        <td>{`${agent?.first_name} ${agent?.last_name}`}</td>
                                        <td>{`${agent?.mobile}`}</td>
                                        <td>{`${Naira} ${calculateEachAdmiGeneratedAmount(agent?._id, agents)}`}</td>
                                        <td>{`${agent?.mobile}`}</td>
                                        
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
export default PayoutTable;