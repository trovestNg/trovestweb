import React from "react";
import moment from "moment";
import { Spinner, Card,ListGroup,ListGroupItem } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { convertToThousand } from "../../../config";

const DepositTab = ({data,loading}) => {
    const navigate = useNavigate();
    return (
        <div className="w-100">
            <div>

            </div>
            <table className="table table-striped mt-2">
                <thead>
                    <tr className="bg-info text-light">
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Phone No</th>
                        <th scope="col">Date started</th>
                        <th scope="col">Amount saved</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.length <= 0 ?
                            <tr>
                                <td colSpan={6}>
                                    <p className="font-weight-bold w-100 text-center" style={{ fontFamily: 'title-font' }}>No data available</p>
                                </td>
                            </tr> :

                            loading ? <tr className="w-100 text-center">
                                <td className="" colSpan={6}>
                                    <Spinner size="sm" />
                                </td>

                            </tr> :
                                data.map((agent, index) => (
                                    <tr
                                        onClick={() => navigate(`/admin/artisan/${agent?._id}`)}
                                        key={index} style={{ cursor: 'pointer' }}>
                                        <th scope="row">{index + 1}</th>
                                        <td className="text-capitalize">{`${agent?.full_name}`}</td>
                                        <td>{`${agent?.mobile}`}</td>
                                        <td>{moment(agent?.createdAt).format('DD-MM-yyy')}</td>
                                        <td>{convertToThousand(agent?.total_savings)}</td>
                                        <td className="table-icon">
                                            <i className="bi bi-three-dots-vertical"></i>
                                            <div className="content card border shadow position-absolute">
                                                <Card className="rounded rounded-3 border-0 shadow-lg" style={{ minWidth: "10rem" }}>
                                                    {
                                                        <>
                                                            <ListGroup variant="flush">
                                                                {

                                                                    <ListGroup.Item

                                                                    >
                                                                        Edit info
                                                                    </ListGroup.Item>}
                                                            </ListGroup>
                                                            <ListGroup variant="flush">
                                                                {
                                                                    <ListGroup.Item
                                                                    // disabled={room?.availability?.noOccupied > 0}

                                                                    >
                                                                        Delete agent
                                                                    </ListGroup.Item>}
                                                            </ListGroup>
                                                        </>

                                                    }
                                                </Card>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default DepositTab;