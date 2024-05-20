import React, { useState } from "react";
import { Container, Modal, Card, Button } from "react-bootstrap";
import SideBar from "../../components/bars/sidebar";
import TopBar from "../../components/bars/topbar";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import AdminDashboardContainer from "../administrator/dashboard";


const InitiatorDashboardContainer = () => {
    let userType = 'initiator';
    const navigate = useNavigate();

    if (userType === 'initiator') {
        <AdminDashboardContainer/>
    }
    else{
        return (
            <div className="d-flex p-0 m-0 min-vh-100 p-0 w-100">
                <div><SideBar /></div>
                <div className="m-0" style={{ width: '100%' }}>
                    <div className="w-100"><TopBar /></div>
                    <div className="mt-3 m-0 p-4 rounded rounded-3 w-100 shadow-sm bg-light" style={{ overflowY: 'scroll', height: '85vh' }}>{<Outlet />}</div>
                </div>
            </div>
        )
    }

       

}

export default InitiatorDashboardContainer;