import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { handleCallback, loginUser } from "../controllers/auth";
import { useNavigate } from "react-router-dom";

const SigninCallBackPage = () => {
    const [refresh,setRefresh] = useState();
    const navigate = useNavigate();

    const handleUserAuth = async () => {
        const res = await handleCallback();
        if (res?.access_token) {
            navigate('/policy-portal', { replace: true });
        } else {
        //    loginUser()
        }
    }

    useEffect(() => {
        handleUserAuth()
    },[refresh])

    return (
        <div className="d-flex justify-content-center min-vh-100 align-items-center">
            <Spinner className="spinner-grow text-primary" />
        </div>
    )
}
export default SigninCallBackPage;