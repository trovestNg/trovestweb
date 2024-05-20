import React, { useState } from "react";
import { Container, Modal, Card, Button } from "react-bootstrap";
import { User } from "../interfaces/user";
import PrimaryInput from "../components/inputFields/primaryInput";
import SideBar from "../components/bars/sidebar";
import AdminSideBar from "../components/bars/adminsidebar";
import TopBar from "../components/bars/topbar";
import { Outlet } from "react-router-dom";


const DashboardContainer = () => {
    const [regUsers, setRegUsers] = useState<User[]>([]);

    return (
        <div className="d-flex p-0 m-0 min-vh-100 p-0 w-100">
            <div><AdminSideBar/></div>
            <div className="m-0" style={{width:'100%'}}>
               <div className="w-100"><TopBar/></div>
               <div className="mt-3 m-0 p-4 rounded rounded-3 w-100 shadow-sm bg-light" style={{overflowY:'scroll',height:'85vh'}}>{<Outlet/>}</div>
            </div>
        </div>
    )

}

export default DashboardContainer;