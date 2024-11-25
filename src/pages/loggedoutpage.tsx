import React, { useState, useEffect } from "react";
import { Button, Spinner } from "react-bootstrap";
import { getUserInfo, loginUser } from "../controllers/auth";
// import { UserManager } from 'oidc-client';
// import { Identity } from '../config/config';


const LoggedOutPage = () => {
    const checkUserStatus = async () => {
        let userInfo = await getUserInfo();
        console.log({ userCred: userInfo })
    }

    useEffect(() => {
        checkUserStatus()
        window.history.pushState(null, '', window.location.href);
        window.onpopstate = function (event) {
            window.history.go(1);
        };
    })

    // loginUser();

    return (
        <div className="min-vh-100 w-100 d-flex flex-column justify-content-center align-items-center" style={{ fontFamily: 'primary' }}>

            <h4>Logged Out</h4>
            <a className="mt-3" href="/">Click here to log back in</a>
        </div>
    )
}
export default LoggedOutPage;