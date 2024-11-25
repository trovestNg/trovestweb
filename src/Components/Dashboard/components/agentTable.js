import React, { useState } from "react";
import {
  Alert,
  Card,
  ListGroup,
  ModalHeader,
  Col,
  Row,
  ModalBody,
  Spinner,
  Modal,
  InputGroup,
} from "react-bootstrap";
import Styles from "../md.module.css";
import { Naira } from "../../../config";
import { useNavigate, Link } from "react-router-dom";
import moment from "moment";

const AgentTable = ({ data, loading, agents, adminId }) => {
  const [agentInfoModal, setAgentInfoModal] = useState(false);
  const [specificAgent, setSpecificAgent] = useState();
  const [agentId, setAgentId] = useState();
  
  const navigate = useNavigate();

  const handleAgentDisplay = (id) => {
    const selectedAgent = data.filter((data) => data._id == id);
    setSpecificAgent(selectedAgent[0]);
    setAgentId(id)
    setAgentInfoModal(true);
  };

  console.log({ this: specificAgent });

  function calculateEachAdmiGeneratedAmount(agent_id, agents) {
    let total = 0;
    agents?.map((item) => {
      if (item?.agent_id === agent_id) {
        item?.collections?.map((collection) => {
          total = total + parseFloat(collection?.total?.$numberDecimal);
          return total;
        });
        console.log("parseFloat", total);
      }
    });
    return total?.toLocaleString();
  }
  return (
    <div className="w-100 d-flex justify-content-center align-items-center">
      {data?.length <= 0 ? (
        <p
          className="text-secondary"
          style={{ fontFamily: "Montserrat-SemiBold" }}
        >
          No Agents
        </p>
      ) : (
        <table className="table w-100 table-striped">
          <thead className="bg-primary text-light">
            <tr style={{ fontFamily: "Montserat-Regular", fontSize: "0.9em" }}>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Phone Number</th>
              <th scope="col">Email</th>
              <th scope="col">Amount Generated</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {data?.map((agent, index) => (
              <tr
                onClick={() => navigate(`/super-admin/agent/${agent?._id}`)}
                key={index}
                style={{ cursor: "pointer" }}
              >
                <th scope="row">{index + 1}</th>
                <td>{`${agent?.first_name} ${agent?.last_name}`}</td>
                <td>{`${agent?.mobile}`}</td>
                <td>{agent?.email}</td>
                <td>{`${Naira} ${calculateEachAdmiGeneratedAmount(
                  agent?._id,
                  agents
                )}`}</td>
                {/* <td>{`${Naira} ${100000 * Math.random(10).toExponential(2)}`}</td> */}
                <td className={`${Styles.tableicon}`}>
                  <i className="bi bi-three-dots-vertical"></i>
                </td>
              </tr>
            ))}
          </tbody>
          <Modal show={agentInfoModal} size="xl" centered>
            <ModalHeader
              className="bg-primary text-light py-0"
              style={{ fontFamily: "Montserrat-Bold" }}
            >
              <Col xs={10}>Agent Biodata</Col>
              <Col
                xs={2}
                className="d-flex px-3 justify-content-end py-3 h-100"
                style={{ cursor: "pointer" }}
                onClick={() => setAgentInfoModal(false)}
              >
                X
              </Col>
            </ModalHeader>
            <ModalBody className="d-flex flex-column justify-content-center align-items-center">
                <Row className="w-100 d-flex m-0 mb-2 justify-content-end">
                <Col className="d-flex flex-column align-items-start justify-content-start" style={{fontFamily:'Montserrat'}}>
                    <p className="p-0 m-0" style={{fontFamily:'Montserrat-SemiBold'}}>{`Total Custormers :  ${specificAgent?.artisans.length}`} </p>
                    <p className="p-0 m-0 text-danger" style={{cursor:'pointer'}} onClick={()=> navigate(`${agentId}`)}>View customers</p>
                </Col>
                <Col xs={4} className="d-flex justify-content-end align-items-end">
                <InputGroup className="d-flex m-0 p-0 border border-primary rounded justify-content-start px-2 py-1" >
                <input className="rounded border border-0 bg-transparent" placeholder="Search transaction ref" style={{minWidth :'10em', maxHeight:'2.3em', outline:'none'}}/>
                </InputGroup>
                </Col>
                   
                    
                </Row>
              <Row className="m-0 w-100">
                <Col
                  xs={3}
                  className=" d-flex flex-column align-items-center m-0"
                  style={{ fontFamily: "Montserrat" }}
                >
                  <img
                    className="border border-primary"
                    src={specificAgent?.image}
                    style={{ maxHeight: "10em", maxWidth: "10em" }}
                  />
                  <p
                    className="m-0 mt-2 "
                    style={{ fontFamily: "Montserrat-SemiBold" }}
                  >{`${specificAgent?.first_name} ${specificAgent?.last_name}`}</p>
                  <p
                    className="m-0 p-0"
                    style={{}}
                  >{`${specificAgent?.assigned_id}`}</p>
                  <p
                    className="m-0 p-0"
                    style={{}}
                  >{`${specificAgent?.mobile}`}</p>
                </Col>
                <Col xs={9} className="" style={{fontFamily:'Montserrat'}}>
                  <h5 className="mt-2 w-100 bg-secondary py-2 text-light d-flex justify-content-center">
                    Agent Perfomance & Activity Record
                  </h5>
                  <Row className="m-0 d-flex gap-2 w-100">
                    <Col xs={5} className=" p-0">
                      <p
                        style={{ fontFamily: "Montserrat-Bold" }}
                        className="px-1 m-0 mt-2 text-success "
                      >
                        {`Revenue Made : ${Naira} ${specificAgent?.amount}`}
                      </p>
                      <p
                        style={{ fontFamily: "Montserrat-Bold" }}
                        className="px-1 m-0  text-danger "
                      >
                        {`Paid Out : ${Naira} ${specificAgent?.amount}`}
                      </p>
                      <p
                        style={{ fontFamily: "Montserrat-Regular" }}
                        className="px-1 m-0 mt-3  text-primary "
                      >
                        {`Date Joined :  ${moment(
                          specificAgent?.createdAt
                        ).format("DD-MM-YYYY")}`}
                      </p>
                      <p
                        style={{ fontFamily: "Montserrat-Regular" }}
                        className="px-1 m-0  text-primary "
                      >
                        {`Nin :  ${specificAgent?.nin}`}
                      </p>
                      <p
                        style={{ fontFamily: "Montserrat-Regular" }}
                        className="px-1m-0  text-primary "
                      >
                        {`Email :  ${specificAgent?.email}`}
                      </p>
                      <p
                        style={{ fontFamily: "Montserrat-Regular" }}
                        className="px-1 m-0 mt-3  text-primary "
                      >
                        {`Address :  ${specificAgent?.address}`}
                      </p>
                    </Col>
                    <Col
                      className="d-flex p-0 flex-column align-items-center border border-1 py-2"
                      style={{
                        fontFamily: "Montserrat-Regular",
                        fontSize: "0.6em",
                      }}
                    >
                      <p
                        className="m-0"
                        style={{ fontSize: "1em", fontWeight: "600" }}
                      >
                        Remittance ID History
                      </p>
                      <Row className="w-100  m-0 d-flex justify-content-center">
                        {[1, 2, 3] <= 0 ? (
                          <p
                            className="p-0 m-0 text-center mt-4"
                            style={{ fontSize: "1.5em" }}
                          >
                            No Transaction Yet
                          </p>
                        ) : (
                          <table className="table mt-2">
                            <thead class="bg-primary text-light">
                              <tr>
                                <th scope="col">#</th>
                                <th scope="col">Date</th>
                                <th scope="col">Ref ID</th>
                                <th scope="col">Amount</th>
                              </tr>
                            </thead>
                            <tbody className="p-3">
                              {
                                [1,2,3].map((transaction, index)=>(
                                    <tr>
                                <th scope="row">{index + 1}</th>
                                <td>2-02-2023</td>
                                <td>ft/xyhhzyufg67gtkjgh</td>
                                <td>N600.00</td>
                              </tr>
                                ))
                              }
                            </tbody>
                          </table>
                        )}
                      </Row>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </ModalBody>
          </Modal>
        </table>
      )}
    </div>
  );
};
export default AgentTable;
