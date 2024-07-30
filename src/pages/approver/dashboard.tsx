import React, { useEffect, useState } from "react";
import { Container, Modal, Card, Button, Spinner } from "react-bootstrap";
import SideBar from "../../components/bars/sidebar";
import TopBar from "../../components/bars/topbar";
import { Outlet } from "react-router-dom";
import UserSideBar from "../../components/bars/userSidebar";
import { getUserInfo, loginUser, logoutUser } from "../../controllers/auth";
import AdminSideBar from "../../components/bars/adminsidebar";
import ApproverSideBar from "../../components/bars/approversidebar";
import AdminDashboardPage from "./dashboardpage";
import { IUserDashboard } from "../../interfaces/user";
import { IPolicy } from "../../interfaces/policy";
import { IDept } from "../../interfaces/dept";
import { getPolicies } from "../../controllers/policy";
import api from "../../config/api";
import { toast } from "react-toastify";



const ApproverDashboardContainer = () => {

    const [validUser, setValidUser] = useState(false);
    const [refreshComponent, setRefreshComponent] = useState(false)

    const LoadingPage = () => {

        const handleUserAuth = async () => {
            try {
                let userInfo = await getUserInfo();
                console.log({ loggedInUserIs: userInfo })
                if (userInfo?.access_token) {
                    setValidUser(true);
                } else {
                    loginUser()
                }

            } catch (error) {
                toast.error('Network Error')
            }
        }

        useEffect(() => {
            handleUserAuth();
        }, [refreshComponent])



        return (
            <div className="min-vh-100 w-100 d-flex flex-column justify-content-center align-items-center" style={{ fontFamily: 'primary' }}>
                <Spinner role="status" className="text-primary" />
                <h4>Loading...</h4>
            </div>
        )
    }

    const ApproverDB = () => {
        const [ref, setRef] = useState(false);
        const [userDBInfo, setUserDBInfo] = useState<IUserDashboard>();
        const [totalPolicyCount, setTotalPolicyCount] = useState(0);
        const [totalAttested, setTotalAttested] = useState(0);
        const [totalNotAttested, setTotalNotAttested] = useState(0);


        const [policies, setPolicies] = useState<IPolicy[]>([]);
        const [depts, setDepts] = useState<IDept[]>([]);
        // const [regUsers, setRegUsers] = useState<User[]>([]);
        const [loading, setLoading] = useState(false);
        const [refreshComponent, setRefreshComponent] = useState(false)

        const getAuthorizerDashboard = async () => {
            try {
                let userInfo = await getUserInfo();
                // console.log({userCred:userInfo?.scopes})
                if (userInfo?.expired) {
                    toast.error('Session timed out!');
                    await loginUser()
                } else if (userInfo?.profile) {
                    let userName = userInfo?.profile?.sub.split('\\')[1]
                    const res = await api.get(`Dashboard/authorizer?userName=${userName}`, `${userInfo?.access_token}`);
                    if (res?.data) {
                        setUserDBInfo(res?.data);
                        setLoading(false);
                    } else {
                        toast.error('Network error!');
                        await loginUser()
                    }

                } else {
                    //    await loginUser()
                }
            } catch (error) {
                console.log(error)
            }
        }

        useEffect(() => {
            getAuthorizerDashboard();
        }, [ref])



        return (
            <div className="d-flex p-0 m-0 min-vh-100 p-0 w-100">
                <div><ApproverSideBar /></div>
                <div className="m-0" style={{ width: '100%' }}>
                    <div className="w-100"><TopBar/></div>
                    <div className="mt-2 m-0 p-3 rounded rounded-3 w-100 shadow-sm bg-light" style={{ overflowY: 'scroll', height: '85vh' }}>{<Outlet />}</div>
                </div>
            </div>
        )
    }


    return (
        <div>
            {
                validUser ? <ApproverDB /> : <LoadingPage />
            }
        </div>

    )

}

export default ApproverDashboardContainer;