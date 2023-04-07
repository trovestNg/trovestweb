import React, { useState, useEffect } from "react";
import Home from '../Components/Home/Index'
// import Dashboard from '../Components/Dashboard/Index'
import Admin from '../Components/Admin/Index'
import Agent from '../Components/Dashboard/Agent'
import AdminAgent from '../Components/Admin/AdminAgent'
import Agents from '../Components/Admin/Agents'
import AdminCollection from '../Components/Admin/AdminCollection'
import Collection from '../Components/Dashboard/Collection'
import BroadCast from '../Components/BroadCast/Index'
import Profile from '../Components/Profile/Index'
import ErrorPage from '../Components/ErrorPage'
import SuperAdminDashboard from "../Pages/SuperAdmin/dashboard/SuperAdminDashBoard";
import { createBrowserRouter, Route, Routes, RouterProvider, useParams } from "react-router-dom";
import { user_storage_token } from "../config";
// import Dashboard from "../Pages/Dashboard";
import Dashboard from "../Components/Dashboard/mainDashBoard";
import AdminView from "../Pages/SuperAdmin/adminView/AdminView";
import AdminManagement from "../Pages/SuperAdmin/adminView/adminManagementView";
import AgentManagement from "../Pages/SuperAdmin/agentView/agentManagementView";
import FinConManagement from "../Pages/SuperAdmin/finconView/finConManagement";
import PaymentManagement from "../Pages/SuperAdmin/paymentView/paymentManagement";
import ProfileManagement from "../Pages/SuperAdmin/profileView/profileManagement";
import ErrorBoundary from "../Pages/ErrorBoundary/ErrorBoundary";
import AdminDashboard from "../Pages/Admin/dashboard/adminDashBoard";
import AgentView from "../Pages/SuperAdmin/agentView/AgentView";
import CustomerView from "../Pages/SuperAdmin/customerView/customerView";
import TransactionView from "../Pages/SuperAdmin/transactionView/transactionView";
import CustomerManagement from "../Pages/SuperAdmin/customerView/customerManagement";
import AdminAgentManagement from "../Pages/Admin/dashboard/adminAgentManagement";
import AdminTransactionManagement from "../Pages/Admin/dashboard/adminTransactionManagement";

export default function App() {
    const [token, settoken] = useState(null)
    useEffect(() => {
        checkToken()
    }, [])
    const checkToken = () => {
        const adminToken = localStorage.getItem(user_storage_token)
        if (adminToken !== null) {
            settoken(adminToken)
        }
        else {
            settoken('')
        }
    }

    const router = createBrowserRouter([
        {
            path: '*',
            element: <ErrorPage />
        },
        {
            path: '/',
            element: <Home />,
            errorElement: <ErrorBoundary />
        },
        //admin routes
        {
            path: '/admin',
            element: <AdminDashboard/>
        },
        {
            path: '/admin/agent/:agent_id',
            element: <AdminAgentManagement/>
        },
        {
            path: '/admin/client/:client_id',
            element: <AdminAgentManagement/>
        },
        {
            path: '/admin/agent',
            element: <AdminAgentManagement/>
        },
        {
            path: '/admin/transaction',
            element: <AdminTransactionManagement/>
        },
        {
            path: 'admin/:agent_id',
            element: <Agents />
        },
        {
            path: `/super-admin/admin/:adminId`,
            element: <AdminView />
        },
        {
            path: `/super-admin/agent/:agentId`,
            element: <AgentView/>
        },
        {
            path: `/super-admin/client/:clientId`,
            element: <CustomerView/>
        },
        {
            path: `/super-admin/agent/transaction/:agentId`,
            element: <TransactionView/>
        },
        
        {
            path: `/admin/agent/:agentid/:collectionid`,
            element: <AdminCollection />
        },
        {
            path: '/dashboard',
            element: <SuperAdminDashboard />
        },
        {
            path: `/dashboard/agent/:agentid`,
            element: <Agent />
        },
        {
            path: '/bcm',
            element: <BroadCast />
        },
        {
            path: '/profile',
            element: <Profile />
        },
        {
            path: `/dashboard/agent/:agentid/:collectionid`,
            element: <Collection />
        },



        // new routes
        {
            path: `/super-admin/dashboard`,
            element: <SuperAdminDashboard />
        },
        {
            path: `super-admin/admin`,
            element: <AdminManagement />
        },
        {
            path: `super-admin/agents`,
            element: <AgentManagement />
        },
        {
            path: `super-admin/clients`,
            element: <CustomerManagement />
        },
        {
            path: `super-admin/:adminid/:agentid`,
            element: <CustomerView/>
        },
        {
            path: `super-admin/fincon`,
            element: <FinConManagement />
        },
        {
            path: `super-admin/transactions`,
            element: <PaymentManagement />
        },
        {
            path: `super-admin/profile`,
            element: <ProfileManagement />
        },

    ])

    return (
        <RouterProvider router={router} />
    );
}