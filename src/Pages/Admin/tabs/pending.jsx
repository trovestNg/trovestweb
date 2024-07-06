import React, { useEffect, useState } from "react";
import moment from "moment";
import { Spinner, Card, ListGroup, ListGroupItem } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { convertToThousand } from "../../../config";
import { getAdminAgents } from "../../../Sagas/Requests";
import { toast } from "react-toastify";

const PendingAgents = ({ data, reloadComp }) => {
    const token = localStorage.getItem('userToken') || '';
    const [agents, setAgents] = useState([]);
    const [loading, setloading] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(100);

    const navigate = useNavigate();

    const getApprovedAgents = async () => {
        try {
            setloading(true)
            const payload = { page: page, limit: limit, token: token };
            const res = await getAdminAgents(payload);
            // console.log({res})
            if (res?.data?.success) {
                setAgents(res?.data?.data?.agents?.docs);
                setloading(false)
            } else {
                setloading(false);
                toast.error('Network error!')
            }

        } catch (error) {

        }
    }

    useEffect(() => {
        getApprovedAgents();
    }, [reloadComp])

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
                        <th scope="col">No of artisan</th>
                        <th scope="col">Email</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    {
                       loading ? <tr className="w-100 text-center">
                                <td className="" colSpan={6}>
                                    <Spinner size="sm" />
                                </td>

                            </tr> :
                             [].length <= 0 ?
                             <tr>
                                 <td colSpan={6}>
                                     <p className="font-weight-bold w-100 text-center" style={{ fontFamily: 'title-font' }}>No Data Available At This Time</p>
                                 </td>
                             </tr> :
                                [].map((agent, index) => (
                                    <tr
                                        onClick={() => navigate(`/admin/agent/${agent._id}`)}
                                        key={index} style={{ cursor: 'pointer' }}>
                                        <th scope="row">{index + 1}</th>
                                        <td className="text-capitalize">{`${agent?.first_name} ${agent?.last_name}`}</td>
                                        <td>{`${agent?.mobile}`}</td>
                                        <td>{agent?.artisans && agent?.artisans.length}</td>
                                        <td>{agent?.email}</td>
                                        <td className="table-icon">
                                            <i className="bi bi-three-dots-vertical"></i>
                                            {/* <div className="content card border shadow position-absolute mr-3 mt-0 mb-3">
                                                    <Card className="rounded rounded-3 border-0 shadow-lg" style={{ minWidth: "10rem" }}>
                                                        {
                                                            <>
                                                                <ListGroup variant="flush">
                                                                    {

                                                                        <ListGroup.Item

                                                                        >
                                                                            Edit agent
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
                                                </div> */}
                                        </td>
                                    </tr>
                                ))
                    }
                </tbody>
            </table>
            <nav aria-label="...">
                <ul className="pagination">
                    <li className="page-item disabled">
                        <span className="page-link">Previous</span>
                    </li>
                    <li className="page-item active" aria-current="page"><a className="page-link" href="#">1</a></li>
                    <li className="page-item" >
                        <span className="page-link">2</span>
                    </li>
                    <li className="page-item"><a className="page-link" href="#">3</a></li>
                    <li className="page-item">
                        <a className="page-link" href="#">Next</a>
                    </li>
                </ul>
            </nav>
        </div>
    )
}

export default  PendingAgents;