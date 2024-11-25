import React from "react";
import { useNavigate } from "react-router-dom";
import {
    Container, Col, Row, Card, FormGroup, Button, Spinner,
} from "react-bootstrap";
import { navActions } from "../../../constants/constants";
import { useLocation } from "react-router-dom";

export default function TopBar() {
    const location = useLocation()

    const navigate = useNavigate();
    return (
        <Row
            className="w-100 m-0 px-2 bg-white shadow-sm mb-3"
            style={{ height: "5em" }}
        >
            {/* search bar column */}
            <Col xs={9} className='d-flex align-items-center ' >
                <div className="w-50 ml-5 px-4">
                    <Button disabled={location.pathname.indexOf('super-admin/dashboard') == 1}
                    className='d-flex align-items-center bg-transparent border 
          text-dark
          border-primary' onClick={() => navigate(-1)}>Go Back</Button>
                </div>
            </Col>
            {/* notification column */}
            <Col xs={3} className="">
                <ul
                    className="d-flex flex-row gap-3 align-items-center 
                        justify-content-center h-100"
                    style={{ listStyle: "none" }}
                >
                    {navActions.map((action, index) => (
                        <div key={index}
                            onClick={() => console.log(index)}
                            className="shadow-sm d-flex align-items-center justify-content-center"
                            style={{
                                width: "2em",
                                height: "2em",
                                borderRadius: "1em",
                                backgroundColor: "#fff",
                                cursor: "pointer",
                            }}
                        >
                            <i className={action.icon} style={{ color: "#7D1312" }} />
                        </div>
                    ))}
                </ul>
            </Col>
        </Row>
    )
}