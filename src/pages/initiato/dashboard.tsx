import React, { useState } from "react";
import { Container, Modal, Card, Button } from "react-bootstrap";
import SideBar from "../../components/bars/sidebar";
import TopBar from "../../components/bars/topbar";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import AdminDashboardPage from "../administrator/dashboardpage";
import InitiatorDashboardContainer from "../initiator/dashboard";
import AdminDashboardContainer from "../administrator/dashboard";
import UserSideBar from "../../components/bars/userSidebar";
import { loginUser } from "../../controllers/auth";


const UserDashboardContainer = () => {
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
                <div className="w-100"><TopBar /></div>
                <div className="mt-2 m-0 p-3 rounded rounded-3 w-100 shadow-sm bg-light" style={{ overflowY: 'scroll', height: '85vh' }}>{<Outlet />}</div>
            </div>
        </div>
    )




}

export default UserDashboardContainer;