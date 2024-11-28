import React, { useEffect, useState } from "react";
import TopBar from "../../components/bars/topbar";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import UserSideBar from "../../components/bars/userSidebar";
import { getPolicies } from "../../controllers/policy";
import { IUserDashboard } from "../../interfaces/user";
import { logoutUser } from "../../controllers/auth";
import { toast } from "react-toastify";
import AdminSideBar from "../../components/bars/admin-sidebar";
import AdminTopbar from "../../components/bars/admin-topbar";
import SuperAdminSideBar from "../../components/bars/superadmin-sidebar";
import SuperAdminTopbar from "../../components/bars/superadmin-topbar";


const SuperAdminDashboardContainer = () => {

    const [loading, setLoading] = useState(false);
    const [refreshComponent, setRefreshComponent] = useState(false)
    const [userDBInfo, setUserDBInfo] = useState<IUserDashboard>();
    const [userFullName, setUserFullName] = useState<string>('');
    const [userType, setUserType] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        // checkUserStatus()
        window.history.replaceState(null, '', window.location.href);
        window.onpopstate = function (event) {
            window.history.go(2);
        };
    })
    return (
        <div className="d-flex p-0 m-0 min-vh-100 p-0 w-100">
            <div><SuperAdminSideBar /></div>
            <div className="m-0" style={{ width: '100%' }}>
                <div className="w-100"><SuperAdminTopbar payload={userDBInfo} /></div>
                <div className="mt-2 m-0 p-3 rounded rounded-3 w-100 shadow-sm bg-light" style={{ overflowY: 'scroll', height: '85vh', scrollbarWidth:'none' }}>{<Outlet />}</div>
            </div>
        </div>
    )




}

export default SuperAdminDashboardContainer;