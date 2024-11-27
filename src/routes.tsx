import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import UnAuthUserDashboardContainer from "./pages/unauth-user/dashboard";
import PolicyViewPage from "./pages/user/policyviewpage";
import Landingpage from "./pages/landingpage";
import LoggedOutPage from "./pages/loggedoutpage";
import SigninCallBackPage from "./pages/signinCallBackPage";
import ErrorPage from "./pages/errorPage";
import UboAdminDashboardContainer from "./pages/user/ubo-dashboard-container";
import UboAdminInitDashboardpage from "./pages/user/ubo-admin-init-dashboardpage";
import UboUnAuthUserDashboardpage from "./pages/unauth-user/ubo-un-auth-user-dashboardpage";
import UnAuthUserViewBmoPage from "./pages/unauth-user/un-auth-user-view-bmo-page";
import UnAuthUserBmoLevelView from "./pages/unauth-user/un-auth-user-bmo-level-view";
import AuthApprovedBmoPage from "./pages/user/auth-approved-bmo-page";
import UnAuthBmoOwnerView from "./pages/unauth-user/un-auth-user-bmo-level-view";
import AuthCustomerViewPage from "./pages/user/auth-bmo-view";
import AuthOwnerViewPage from "./pages/user/auth-bmo-level-view";
import AuthPendingBmoPage from "./pages/user/auth-pending-bmo-page copy";
import AuthRejectedBmoPage from "./pages/user/auth-rejected-bmo-page";
import AuthReportBmoPage from "./pages/user/auth-report-bmo-page";
import AuthHistoryBmoPage from "./pages/user/auth-history-bmo-page";
import UserPage from "./pages/unauth-user/testPage";
import AuthDeletedBmoPage from "./pages/user/auth-deleted-bmo-page";
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
            <Route path="*" element={<ErrorPage />} />
        </Routes>


    )
}