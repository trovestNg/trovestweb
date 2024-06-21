import React,{useState, useEffect} from "react";
import { Button, Spinner } from "react-bootstrap";
import { loginUser } from "../controllers/auth";
import { useNavigate } from "react-router-dom";
// import { UserManager } from 'oidc-client';
// import { Identity } from '../config/config';


const ErrorPage : React.FC<any> = () => {
    const navigate = useNavigate()
   
    
    // loginUser();

    return (
        <div className="min-vh-100 w-100 d-flex flex-column justify-content-center align-items-center" style={{fontFamily:'primary'}}>
           
            <h4>Page Not Found</h4>
            <Button onClick={()=>navigate(-1)}>Go Back</Button>
            {/* <a className="mt-3" href="/">Click here to go back </a> */}
        </div>
    )
}
export default ErrorPage;