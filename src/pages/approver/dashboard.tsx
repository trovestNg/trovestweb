import React, { useEffect, useState } from "react";
import { Container, Modal, Card, Button } from "react-bootstrap";
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
const [policies, setPolicies] = useState<IPolicy[]>([]);
const [depts, setDepts] = useState<IDept[]>([]);
// const [regUsers, setRegUsers] = useState<User[]>([]);
const [loading, setLoading] = useState(false);
const [refreshComponent,setRefreshComponent] = useState(false)

const [totalPolicyCount,setTotalPolicyCount] =useState(0);
const [totalAttested,setTotalAttested] =useState(0);
const [totalNotAttested,setTotalNotAttested] =useState(0);
const [userDBInfo,setUserDBInfo]  = useState<IUserDashboard>()




const getInitiatorDashboard = async () => {
    setLoading(true)
    try {
        let userInfo = await getUserInfo();
        if(userInfo?.expired){
            await logoutUser()
        } else {
        let userName = userInfo?.profile?.sub.split('\\')[1]
        const res = await api.get(`Dashboard/authorizer?userName=${userName}`, `${userInfo?.access_token}`);
        setUserDBInfo(res?.data);
        // console.log({ gotten: userInfo })({here:res})
        if (res?.data) {
            setUserDBInfo(res?.data);
            // setTotalAttested(allAttested.length);
            // setTotalNotAttested(unAttested.length)
            setPolicies([]);
            setLoading(false);
        } else {
            setLoading(false);
            toast.error('Unauthorised user!')
        }
        }
        
        // console.log({ gotten: userInfo })({ response: res })
    } catch (error) {

    }
}


useEffect(()=>{
    getInitiatorDashboard(); 
},[refreshComponent])

    return (
        <div className="d-flex p-0 m-0 min-vh-100 p-0 w-100">
            <div><ApproverSideBar/></div>
            <div className="m-0" style={{ width: '100%' }}>
                <div className="w-100"><TopBar payload={userDBInfo} /></div>
                <div className="mt-2 m-0 p-3 rounded rounded-3 w-100 shadow-sm bg-light" style={{ overflowY: 'scroll', height: '85vh' }}>{<Outlet />}</div>
            </div>
        </div>
    )




}

export default ApproverDashboardContainer;