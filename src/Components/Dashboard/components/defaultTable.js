import React from "react";
import { Alert, Card, ListGroup, Spinner, Row } from "react-bootstrap";
import Styles from '../md.module.css';
import { Naira } from "../../../config";
import { useNavigate } from "react-router-dom";
const DefaultTable = ({ data, loading, agents }) => {
    const navigate = useNavigate();

    function calculateEachAdmiGeneratedAmount(admin_id, agents) {
        let total = 0;
        agents?.map(item => {
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
        <div className="w-100 d-flex flex-column justify-content-center align-items-center">
            {data?.length <= 0 ? <p className="text-secondary" style={{ fontFamily: 'Montserrat-SemiBold' }}>No Agents </p>

                : (
                    <>
                    <Row>
                        <h4>Your Registed Admins</h4>
                    </Row>
                    <table className="table w-100 mt-3 table-striped">
                        <thead className="bg-primary text-light">
                            <tr style={{ fontFamily: 'Montserat-Regular', fontSize: '0.9em' }}>
                                <th scope="col">#</th>
                                <th scope="col">Name</th>
                                <th scope="col">Phone Number</th>
                                <th scope="col">Email</th>
                                <th scope="col">Total Agents</th>
                                <th scope="col" >
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data?.map((admin, index) => (
                                    <tr onClick={() => navigate(`/super-admin/admin/${admin._id}`)}
                                        key={index +21}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <th scope="row">{index + 1}</th>
                                        <td>{`${admin?.first_name} ${admin?.last_name}`}</td>
                                        <td>{`${admin?.mobile}`}</td>
                                        <td>{admin?.email}</td>
                                        <td>{admin?.agents.length}</td>
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
export default DefaultTable;