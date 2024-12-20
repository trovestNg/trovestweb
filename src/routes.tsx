import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ErrorPage from "./pages/errorPage";
import LoginPage from "./pages/unauth-user/login";
import AdminDashboardContainer from "./pages/user/admin-dashboard-container";
import AdminDashboardpage from "./pages/user/admin-dashboardpage";
import AdminViewAgentInfoPage from "./pages/user/admin-view-agent-info-page";
import AdminViewArtisanInfoPage from "./pages/user/admin-view-artisan-info-page";
import AdminViewAgentTransactionPage from "./pages/user/admin-view-agent-transaction-page";
import AdminViewAgentManagementPage from "./pages/user/admin-view-agent-management-page";
import AdminViewArtisanManagementPage from "./pages/user/admin-view-artisan-management-page";
import AdminViewTransactionManagementPage from "./pages/user/admin-view-transaction-management-page";
import AdminGenerateReportPage from "./pages/user/admin-generate-report-page";
import AdminSettingsPage from "./pages/user/admin-settings-page";
import SuperAdminDashboardContainer from "./pages/super-admin/superadmin-dashboard-container";
import SuperAdminDashboardpage from "./pages/super-admin/superadmin-dashboardpage";
import SuperAdminViewAdminInfoPage from "./pages/super-admin/superadmin-view-admin-info-page";
import SuperAdminViewAgentInfoPage from "./pages/super-admin/superadmin-view-agent-info-page";
import SuperAdminViewArtisanInfoPage from "./pages/super-admin/superadmin-view-artisan-info-page";
import SuperAdminViewAgentManagementPage from "./pages/super-admin/superadmin-view-agent-management-page";
import SuperAdminViewAdminManagementPage from "./pages/super-admin/superadmin-view-admin-management-page copy";
import SuperAdminViewArtisanManagementPage from "./pages/user/admin-view-artisan-management-page";
import SuperAdminViewTransactionManagementPage from "./pages/super-admin/superadmin-view-transaction-management-page";

// const UserDBC = React.lazy(() => import("./pages/user/dashboard"));



export default function () {
    return (

        <Routes>
            <Route path="/" element={<LoginPage />}></Route>

            <Route path="/admin" element={< AdminDashboardContainer />}>
                <Route index element={<AdminDashboardpage />} />
                <Route path="agent-management" element={<AdminViewAgentManagementPage />} />
                <Route path="customer-management" element={<AdminViewArtisanManagementPage />} />
                <Route path="transaction-management" element={<AdminViewTransactionManagementPage />} />
                <Route path="report" element={<AdminGenerateReportPage />} />
                <Route path="settings" element={<AdminSettingsPage />} />

                <Route path="agent/:id" element={<AdminViewAgentInfoPage />} />
                <Route path="agent-transactions/:id" element={<AdminViewAgentTransactionPage />} />
                <Route path="artisan/:id" element={<AdminViewArtisanInfoPage />} />
            </Route>

            <Route path="/superadmin" element={< SuperAdminDashboardContainer />}>
                <Route index element={<SuperAdminDashboardpage />} />

                <Route path="admin/:id" element={<SuperAdminViewAdminInfoPage />} />
                <Route path="agent/:id" element={<SuperAdminViewAgentInfoPage />} />
                {/* <Route path="agent-transactions/:id" element={<AdminViewAgentTransactionPage />} /> */}
                <Route path="artisan/:id" element={<SuperAdminViewArtisanInfoPage />} />

                <Route path="admin-management" element={<SuperAdminViewAdminManagementPage/>} />
                <Route path="agent-management" element={<SuperAdminViewAgentManagementPage />} />
                <Route path="customer-management" element={<SuperAdminViewArtisanManagementPage />} />
                <Route path="transaction-management" element={<SuperAdminViewTransactionManagementPage/>} />
                <Route path="report" element={<AdminGenerateReportPage />} />
                <Route path="settings" element={<AdminSettingsPage />} />




            </Route>
            <Route path="*" element={<ErrorPage />} />
        </Routes>


    )
}