import React, { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { loginUser } from "../controllers/auth";
// import { UserManager } from 'oidc-client';
// import { Identity } from '../config/config';


const Landingpage = () => {
    const [refreshData, setRefreshData] = useState(false);

    useEffect(() => {
        loginUser();
    }, [refreshData])



    return (
        <div className="min-vh-100 w-100 d-flex flex-column justify-content-center align-items-center" style={{ fontFamily: 'primary' }}>
            <Spinner role="status" className="text-primary" />
            <h4>Loading...</h4>
        </div>
    )
}
export default Landingpage;