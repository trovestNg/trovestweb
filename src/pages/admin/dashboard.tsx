import React, { useEffect, useState } from "react";
import { Container, Modal, Card, Button } from "react-bootstrap";
import SideBar from "../../components/bars/sidebar";
import TopBar from "../../components/bars/topbar";
import { Outlet } from "react-router-dom";
import UserSideBar from "../../components/bars/userSidebar";
import { getUserInfo, loginUser, logoutUser } from "../../controllers/auth";
import AdminSideBar from "../../components/bars/adminsidebar";
import AdminDashboardPage from "./dashboardpage";
import { IUserDashboard } from "../../interfaces/user";
import { IPolicy } from "../../interfaces/policy";
import { IDept } from "../../interfaces/dept";
import { getPolicies } from "../../controllers/policy";
import api from "../../config/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";



const AdminDashboardContainer = () => {
    // const [regUsers, setRegUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshComponent, setRefreshComponent] = useState(false)
    const [userDBInfo, setUserDBInfo] = useState<IUserDashboard>();
    const navigate = useNavigate();


    const getInitiatorDashboard = async () => {
        try {
            let userInfo = await getUserInfo();
            // console.log({userCred:userInfo?.scopes})
            if(userInfo?.expired) {
                toast.error('Session timed out!');
                await logoutUser()
            } else if(userInfo?.profile){
                let userName = userInfo?.profile?.sub.split('\\')[1]
                const res = await getPolicies(`Dashboard/initiator?userName=${userName}`, `${userInfo?.access_token}`);
                if (res?.data) {
                    setUserDBInfo(res?.data);
                    setLoading(false);
                } else {
                    toast.error('Network error!');
                }

            } else {
            //    await loginUser()
            }
        } catch (error) {
           console.log(error) 
        }
    }


    useEffect(() => {
        getInitiatorDashboard();
    }, [refreshComponent])

    return (
        <div className="d-flex p-0 m-0 min-vh-100 p-0 w-100">
            <div><AdminSideBar /></div>
            <div className="m-0" style={{ width: '100%' }}>
                <div className="w-100"><TopBar payload={userDBInfo} /></div>
                <div className="mt-2 m-0 p-3 rounded rounded-3 w-100 shadow-sm bg-light" style={{ overflowY: 'scroll', height: '85vh' }}>{<Outlet />}</div>
            </div>
        </div>
    )
}

export default AdminDashboardContainer;