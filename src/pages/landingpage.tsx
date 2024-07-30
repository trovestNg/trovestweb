import React, { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { getUserInfo, handleCallback, loginUser, logoutUser } from "../controllers/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// import { UserManager } from 'oidc-client';
// import { Identity } from '../config/config';


const Landingpage = () => {
    const [refreshData, setRefreshData] = useState(false);
    const navigate = useNavigate()

    const handleUserAuth = async () => {
     loginUser()
    }

    // const handleUserLogin = async ()=>{

    // }

    useEffect(() => {
        handleUserAuth()
    }, [refreshData])



    return (
        <div className="min-vh-100 w-100 d-flex flex-column justify-content-center align-items-center" style={{ fontFamily: 'primary' }}>
            <Spinner role="status" className="text-primary" />
            <h4>Loading...</h4>
        </div>
    )
}
export default Landingpage;