import React, { useEffect, useState } from "react";
import TopBar from "../../components/bars/topbar";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import UserSideBar from "../../components/bars/userSidebar";
import { getPolicies } from "../../controllers/policy";
import { IUserDashboard } from "../../interfaces/user";
import { getUserInfo, loginUser, logoutUser } from "../../controllers/auth";
import { toast } from "react-toastify";
import UboAdminSideBar from "../../components/bars/ubo-admin-sidebar";
import UboAdminTopbar from "../../components/bars/ubo-admin-topbar";


const UboAdminRiskDashboardContainer = () => {

    const [loading, setLoading] = useState(false);
    const [refreshComponent, setRefreshComponent] = useState(false)
    const [userDBInfo, setUserDBInfo] = useState<IUserDashboard>();
    const [userFullName, setUserFullName] = useState<string>('');
    const [userType, setUserType] = useState<string>('');
    const navigate = useNavigate();


    const getUserDashboard = async () => {
        try {
            let userInfo = await getUserInfo();
            console.log({userCred:userInfo})
            if(userInfo?.expired) {
                toast.error('Session timed out!');
                await loginUser()
            } else if(userInfo?.profile){
                let userName = userInfo?.profile?.sub.split('\\')[1];
                let fullName = `${userInfo?.profile?.family_name} ${userInfo?.profile?.given_name}`

                const res = await getPolicies(`Dashboard/user?userName=${userName}`, `${userInfo?.access_token}`);
                if (res?.data) {
                    setUserDBInfo(res?.data);
                    setLoading(false);
                } else {
                    toast.error('Network error!');
                    setLoading(false);
                }

            } else {
            //    await loginUser()
            }
        } catch (error) {
           console.log(error) 
        }
    }

    useEffect(() => {
        // getUserDashboard();
    }, [refreshComponent])

    useEffect(() => {
        // checkUserStatus()
        window.history.replaceState(null, '', window.location.href);
        window.onpopstate = function (event) {
            window.history.go(2);
        };
    })
    return (
        <div className="d-flex p-0 m-0 min-vh-100 p-0 w-100">
            <div><UboAdminSideBar /></div>
            <div className="m-0" style={{ width: '100%' }}>
                <div className="w-100"><UboAdminTopbar payload={userDBInfo} /></div>
                <div className="mt-2 m-0 p-3 rounded rounded-3 w-100 shadow-sm bg-light" style={{ overflowY: 'scroll', height: '85vh' }}>{<Outlet />}</div>
            </div>
        </div>
    )




}

export default UboAdminRiskDashboardContainer;