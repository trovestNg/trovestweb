import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { getUserInfo, handleCallback, loginUser, logoutUser } from "../controllers/auth";
import { useNavigate } from "react-router-dom";

const SigninCallBackPage = () => {
    const [refresh, setRefresh] = useState();
    const navigate = useNavigate();

    const handleUserAuth = async () => {
      try {
        const res = await handleCallback();
        if (res?.access_token) {
            window.history.replaceState(null, '', window.location.href = '/policy-portal',);
            window.onpopstate = function (event) {
                window.history.pushState(null, '', window.location.href);
            };
        }
        
      } catch (error) {
        logoutUser()
      }
    }

    const checkUserStatus = async () => {
        let userInfo = await getUserInfo();
        console.log({ userCred: userInfo });
        if(!userInfo){
            navigate('/')
        }
    }

    useEffect(() => {
        handleUserAuth()
    }, [])

    // useEffect(() => {
    //     checkUserStatus()
    //     window.history.pushState(null, '', window.location.href);
    //     window.onpopstate = function (event) {
    //         window.history.go(1);
    //     };
    // },[])

    return (
        <div className="d-flex justify-content-center min-vh-100 align-items-center">
            <Spinner className="spinner-grow text-primary" />
        </div>
    )
}
export default SigninCallBackPage;