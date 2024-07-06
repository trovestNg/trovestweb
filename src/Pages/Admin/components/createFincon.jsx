import React from "react";

import { Button, FormControl, InputGroup, Modal, ModalBody, Col, Row, Form } from "react-bootstrap";
import { Formik } from "formik";

const CreateFincon = ({ on, off, check, success, offSuccess }) => {
    return (
        <Modal show={on} centered size='lg'>
            <Modal.Header className="bg-secondary text-light">
                <Col>Create FinCon</Col>
                <Col onClick={off} className='d-flex px-3 justify-content-end'
                    style={{ cursor: 'pointer' }}
                >X</Col>
            </Modal.Header>
            <ModalBody className="d-flex justify-content-center">
                <Form className="w-75 d-flex justify-content-center">
                    <Row className="d-flex flex-row w-100 w-100">
                        <Col>
                            <InputGroup>
                                <FormControl type="input" placeholder="Name of agent" style={{ width: '200px' }} />
                            </InputGroup>
                        </Col>
                        <Col>
                            <InputGroup>
                                <FormControl type="input" placeholder="Email" style={{ width: '200px' }} />
                            </InputGroup>
                        </Col>
                    </Row>

                    <Row className="d-flex flex-row w-100 mt-3  w-100">
                        <Col>
                            <InputGroup>
                                <FormControl type="input" placeholder="Phone" style={{ width: '200px' }} />
                            </InputGroup>
                        </Col>
                        <Col>
                            <InputGroup>
                                <FormControl type="input" placeholder="Name of agent" style={{ width: '200px' }} />
                            </InputGroup>
                        </Col>
                    </Row>

                    <Row className="d-flex flex-row mt-3 w-100">
                        <Col>
                            <InputGroup className="bg-secobdary">
                                <Button className="bg-secondary">Create</Button>
                            </InputGroup>
                        </Col>
                        <Col>
                            <InputGroup>
                                <Button variant="outline" className="border border-secondary" onClick={off}>Cancel</Button>
                            </InputGroup>
                        </Col>
                    </Row>


                    <Row>
                        <Col></Col>
                        <Col></Col>
                        <Col></Col>
                    </Row>
                </Form>
            </ModalBody>
        </Modal>
        
    )
}
export default CreateFincon;