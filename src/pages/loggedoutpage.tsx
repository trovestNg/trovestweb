import React,{useState, useEffect} from "react";
import { Spinner } from "react-bootstrap";
import { loginUser } from "../controllers/auth";
// import { UserManager } from 'oidc-client';
// import { Identity } from '../config/config';


const LoggedOutPage = () => {
    useEffect(()=>{
        window.history.pushState(null, '', window.location.href);
        window.onpopstate = function(event) {
          window.history.go(1);
        };
    })
    
    // loginUser();

    return (
        <div className="min-vh-100 w-100 d-flex flex-column justify-content-center align-items-center" style={{fontFamily:'primary'}}>
           
            <h4>Logged Out</h4>
        </div>
    )
}
export default LoggedOutPage;