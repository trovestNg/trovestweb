import React, { useState, useEffect } from "react";
import Home from "../Components/Home/Index";

import SAdminContainer from "../Pages/Super/sAdminContainer";
import SAdminDashboardViewPage from "../Pages/Super/pages/sAdminDashboardViewPage";
import SuperAdminViewAdminPage from "../Pages/Super/pages/sAdminViewAdminPage";

import AdminContainer from "../Pages/Admin/adminContainer";
import AdminDashboardViewPage from "../Pages/Admin/pages/adminDashboardViewPage";
import AdminAgentsViewPage from "../Pages/Admin/pages/adminAgentsViewPage";
import AdminClientsViewPage from "../Pages/Admin/pages/adminClientsViewPage";
import AdminProfileViewPage from "../Pages/Admin/pages/adminProfileViewPage";
import AdminSettingsViewPage from "../Pages/Admin/pages/adminSettingsViewPage";
import AdminAgentViewPage from "../Pages/Admin/pages/adminAgentViewPage";
import AdminArtisanViewPage from "../Pages/Admin/pages/adminArtisanViewPage";
import AdminViewAgentTransactionRecordPage from "../Pages/Admin/pages/adminViewAgentTransactionRecordPage";
import AdminTransactionsViewPage from "../Pages/Admin/pages/adminTransactionsViewPage";

// import Dashboard from '../Components/Dashboard/Index'
import Admin from "../Components/Admin/Index";
import Agent from "../Components/Dashboard/Agent";
import AdminAgent from "../Components/Admin/AdminAgent";
import Agents from "../Components/Admin/Agents";
import AdminCollection from "../Components/Admin/AdminCollection";
import Collection from "../Components/Dashboard/Collection";
import BroadCast from "../Components/BroadCast/Index";
import Profile from "../Components/Profile/Index";
import ErrorPage from "../Components/ErrorPage";
import SuperAdminDashboard from "../Pages/SuperAdmin/dashboard/SuperAdminDashBoard";
import {
  BrowserRouter as Router,
  createBrowserRouter,
  Route,
  Routes,
  RouterProvider,
  useParams,
} from "react-router-dom";
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
import AgentView from "../Pages/SuperAdmin/agentView/AgentView";
import CustomerView from "../Pages/SuperAdmin/customerView/customerView";
import TransactionView from "../Pages/SuperAdmin/transactionView/transactionView";
import ATransactionView from "../Pages/Admin/aTransaction/aTransactionView";

import CustomerManagement from "../Pages/SuperAdmin/customerView/customerManagement";
import ACustomerManagement from "../Pages/Admin/aCustomerView/aCustomerManagement";
import AdminDashboard from "../Pages/Admin/dashboard/adminDashBoard";
import AdminClientsManagement from "../Pages/Admin/dashboard/adminAgentManagement";
import AdminTransactionsManagement from "../Pages/Admin/dashboard/adminTransactionsManagement";
import AdminRequestsManagement from "../Pages/Admin/dashboard/adminRequestsManagement";

import AdminAgentView from "../Pages/Admin/dashboard/adminAgentView";
import ACustomerView from "../Pages/Admin/aCustomerView/aCustomerView";
import AdminAgentManagement from "../Pages/Admin/dashboard/adminAgentManagement";
import AAllTransactionManagement from "../Pages/Admin/aAllTransactionManagement/aAllpaymentManagement";

import AdminTransactionManagement from "../Pages/Admin/dashboard/adminTransactionsManagement";
import SuperAdminContainer from "../Pages/SuperAdmin/superAdminContainer";
import FinConContainer from "../Pages/FinCon/finContainer";
import SuperAdminViewAdminTransactionRecordPage from "../Pages/Super/pages/sadminViewAdminTransactionRecordPage";

export default function App() {
  const [token, settoken] = useState(null);
  useEffect(() => {
    checkToken();
  }, []);
  const checkToken = () => {
    const adminToken = localStorage.getItem(user_storage_token);
    if (adminToken !== null) {
      settoken(adminToken);
    } else {
      settoken("");
    }
  };

  const router = createBrowserRouter([
    {
      path: "*",
      element: <ErrorPage />,
    },
    {
      path: "/admin/dash",
      element: <AdminContainer />,
    },
    {
      path: "/",
      element: <Home />,
      errorElement: <ErrorBoundary />,
    },
    // super admin routes
    {
      path: `/super-admin/dashboard`,
      element: <SuperAdminDashboard />,
    },
    {
      path: `super-admin/fincon`,
      element: <FinConManagement />,
    },
    {
      path: `super-admin/admin`,
      element: <AdminManagement />,
    },
    {
      path: `super-admin/agents`,
      element: <AgentManagement />,
    },
    {
      path: `super-admin/clients`,
      element: <CustomerManagement />,
    },
    {
      path: `super-admin/transactions`,
      element: <PaymentManagement />,
    },
    {
      path: `super-admin/profile`,
      element: <ProfileManagement />,
    },
    {
      path: `/super-admin/admin/:adminId`,
      element: <AdminView />,
    },
    {
      path: `/super-admin/agent/:agentId`,
      element: <AgentView />,
    },
    {
      path: `/super-admin/agent/transaction/:agentId`,
      element: <TransactionView />,
    },
    {
      path: `/super-admin/client/:clientId`,
      element: <CustomerView />,
    },

    //admin routes
    {
      path: "/admin",
      element: <AdminDashboard />,
    },
    {
      path: "/admin/clients",
      element: <ACustomerManagement />,
    },
    {
      path: "/admin/transactions",
      element: <AAllTransactionManagement />,
    },
    {
      path: "/admin/requests",
      element: <AdminRequestsManagement />,
    },
    {
      path: "/admin/agent/:agentId",
      element: <AdminAgentView />,
    },
    {
      path: "/admin/client/:client_id",
      element: <ACustomerView />,
    },
    {
      path: "/admin/transaction/:agentId",
      element: <ATransactionView />,
    },
    {
      path: "/dashboard",
      element: <SuperAdminDashboard />,
    },
    {
      path: `/dashboard/agent/:agentid`,
      element: <Agent />,
    },
    {
      path: "/bcm",
      element: <BroadCast />,
    },
    {
      path: "/profile",
      element: <Profile />,
    },
    {
      path: `/dashboard/agent/:agentid/:collectionid`,
      element: <Collection />,
    },
  ]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="superadmin" element={<SAdminContainer />}>
          <Route index element={<SAdminDashboardViewPage />} />
          <Route path="admin/transactions/:id" element={<SuperAdminViewAdminTransactionRecordPage/>} />
          <Route path="admin/:id" element={<SuperAdminViewAdminPage/>} />
        </Route>

        <Route path="admin" element={<AdminContainer />}>
          <Route index element={<AdminDashboardViewPage />} />
          <Route path="agents" element={<AdminAgentsViewPage />} />
          <Route path="agent/:id" element={<AdminAgentViewPage/>} />
          <Route path="agent/transactions/:id" element={<AdminViewAgentTransactionRecordPage/>} />
          <Route path="artisan/:id" element={<AdminArtisanViewPage/>} />
          <Route path="clients" element={<AdminClientsViewPage />} />
          <Route path="transactions" element={<AdminTransactionsViewPage />}/>
          <Route path="profile" element={<AdminProfileViewPage />} />
          <Route path="settings" element={<AdminSettingsViewPage/>} />
        </Route>

        

        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}
