import React, { useEffect, useState } from "react";
import TopBar from "../../components/bars/topbar";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import AdminDashboardPage from "../administrator/dashboardpage";
import InitiatorDashboardContainer from "../initiator/dashboard";
import AdminDashboardContainer from "../administrator/dashboard";
import UserSideBar from "../../components/bars/userSidebar";
import { getPolicies } from "../../controllers/policy";
import { IPolicy } from "../../interfaces/policy";
import { IUserDashboard } from "../../interfaces/user";
import { IDept } from "../../interfaces/dept";
import { toast } from "react-toastify";
import { getUserInfo, loginUser } from "../../controllers/auth";
import api from "../../config/api";


const UserDashboardContainer = () => {

    const userDat = localStorage.getItem('loggedInUser') || '';
    const data = JSON.parse(userDat);
    const userName = data?.profile?.sub.split('\\').pop();
    const [policies, setPolicies] = useState<IPolicy[]>([]);
    const [depts, setDepts] = useState<IDept[]>([]);
    // const [regUsers, setRegUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshComponent,setRefreshComponent] = useState(false)

    const [totalPolicyCount,setTotalPolicyCount] =useState(0);
    const [totalAttested,setTotalAttested] =useState(0);
    const [totalNotAttested,setTotalNotAttested] =useState(0);
    const [userDBInfo,setUserDBInfo]  = useState<IUserDashboard>()

   
    const getUserDashboard = async () => {
        setLoading(true)
        try {
            const res = await getPolicies(`Dashboard/user?userName=${userName}`, `${data?.access_token}`);
            setUserDBInfo(res?.data);
            console.log({here:res})
            if (res?.data) {
                let allAttested:(IPolicy)[] = res?.data.filter((data:IPolicy)=>data.isAuthorized);
                let unAttested:(IPolicy)[] = res?.data.filter((data:IPolicy)=>!data.isAuthorized);
                
                setUserDBInfo(res?.data);
                localStorage.setItem('userData',res?.data)
                // setTotalAttested(allAttested.length);
                // setTotalNotAttested(unAttested.length)
                setPolicies([]);
                setLoading(false);
            } else {
                setLoading(false);
                loginUser()
                toast.error('Session expired!, You have been logged out!!')
            }
            console.log({ response: res })
        } catch (error) {

        }
    }

    useEffect(()=>{
        getUserDashboard(); 
    },[refreshComponent])

    let userType = 'initiator';
    const navigate = useNavigate();
    // loginUser();
    // window.history.pushState(null, '', window.location.href);
    // window.onpopstate = function (event) {
    //     window.history.go(1);
    // };
    return (
        <div className="d-flex p-0 m-0 min-vh-100 p-0 w-100">
            <div><UserSideBar /></div>
            <div className="m-0" style={{ width: '100%' }}>
                <div className="w-100"><TopBar payload={userDBInfo} /></div>
                <div className="mt-2 m-0 p-3 rounded rounded-3 w-100 shadow-sm bg-light" style={{ overflowY: 'scroll', height: '85vh' }}>{<Outlet />}</div>
            </div>
        </div>
    )




}

export default UserDashboardContainer;