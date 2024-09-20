import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import UnAuthUserDashboardContainer from "./pages/unauth-user/dashboard";
import PolicyViewPage from "./pages/user/policyviewpage";
import Landingpage from "./pages/landingpage";
import LoggedOutPage from "./pages/loggedoutpage";
import SigninCallBackPage from "./pages/signinCallBackPage";
import UserAllPolicyPage from "./pages/user/userAllPolicyPage";
import UserAttestedPoliciesTab from "./components/tabs/userTabs/attested-policies-tab";
import UserAttestedPolicyPage from "./pages/user/userAttestedPolicyPage";
import UserUnAttestedPolicyPage from "./pages/user/userUnAttestedPolicyPage";

import AdminDashboardContainer from "./pages/admin/dashboard";
import AdminDashboardPage from "./pages/admin/dashboardpage";
import CreateNewPolicyPage from "./pages/admin/createNewPolicyPage";
import AdminUploadedPoliciesPage from "./pages/admin/adminUploadedPolicyPage";
import AdminApprovedPoliciesPage from "./pages/admin/adminApprovedPoliciesPage";
import AdminPendingPoliciesPage from "./pages/admin/adminPendingPoliciesPage";
import AdminRejectedPoliciesPage from "./pages/admin/adminRejectedPoliciesPage";
import AdminDeletedPoliciesPage from "./pages/admin/adminDeletedPoliciesPage";
import EditPolicyPage from "./pages/admin/editPolicyPage";
import AdminPolicyviewpage from "./pages/admin/adminPolicyviewpage";
import AdminAttestersListPage from "./pages/admin/adminAttestersListPage";
import AdminDefaultersListPage from "./pages/admin/adminDefaultersListPage";

import ApproverDashboardContainer from "./pages/approver/dashboard";
import ApproverDashboardPage from "./pages/approver/dashboardpage";
import ApproverAllPoliciesPage from "./pages/approver/approverAllPoliciesPage";
import ApproverPendingPoliciesPage from "./pages/approver/approverPendingPoliciesPage";
import ApproverApprovedPoliciesPage from "./pages/approver/approverApprovedPoliciesPage";
import ApproverRejectedPoliciesPage from "./pages/approver/approverRejectedPoliciesPage";
import ErrorPage from "./pages/errorPage";
import ApproverPolicyviewpage from "./pages/approver/approverPolicyviewpage";
import ApproverAttestersListPage from "./pages/approver/approverAttestersListPage";
import ApproverDefaultersListPage from "./pages/approver/approverDefaultersListPage";
import ApproverDeletedPoliciesPage from "./pages/approver/approverDeletedPoliciesPage";
import AdminViewDelPolicyPage from "./pages/admin/adminViewDelPolicyPage";
import UnAuthBmoView2 from "./pages/unauth-user/unAuthBmoView2";
import UboAdminDashboardContainer from "./pages/user/ubo-dashboard-container";
import UboAdminInitDashboardpage from "./pages/user/ubo-admin-init-dashboardpage";
import AuthBmoViewPage from "./pages/user/auth-bmo-view";
import AuthBmoLevelView from "./pages/user/auth-bmo-level-view";
import UboUnAuthUserDashboardpage from "./pages/unauth-user/ubo-un-auth-user-dashboardpage";
import UnAuthUserViewBmoPage from "./pages/unauth-user/un-auth-user-view-bmo-page";
import UnAuthUserBmoLevelView from "./pages/unauth-user/un-auth-user-bmo-level-view";
import AuthApprovedBmoPage from "./pages/user/auth-approved-bmo-page";
import UboAdminRiskDashboardContainer from "./pages/user/ubo-risk/ubo-risk-dashboard-container";
import UboRiskAdminInitDashboardpage from "./pages/user/ubo-risk/ubo-risk-admin-init-dashboardpage";
import UnAuthBmoOwnerView from "./pages/unauth-user/un-auth-user-bmo-level-view";
import AuthCustomerViewPage from "./pages/user/auth-bmo-view";
import AuthOwnerViewPage from "./pages/user/auth-bmo-level-view";
import AuthPendingBmoPage from "./pages/user/auth-pending-bmo-page copy";
import AuthRejectedBmoPage from "./pages/user/auth-rejected-bmo-page";
import AuthReportBmoPage from "./pages/user/auth-report-bmo-page";
import AuthHistoryBmoPage from "./pages/user/auth-history-bmo-page";

// const UserDBC = React.lazy(() => import("./pages/user/dashboard"));



export default function () {
    return (

        <Routes>
            <Route path="/" element={<UnAuthUserDashboardContainer />}>
                <Route index element={<UboUnAuthUserDashboardpage />} />
                <Route path="custormer-details/:level/:curstomerNumber" element={<UnAuthUserViewBmoPage />} />
                <Route path="owner-details/:level/:ownerId" element={<UnAuthBmoOwnerView />} />
            </Route>

            <Route path="callback" element={<SigninCallBackPage />} />
            <Route path="logout" element={<LoggedOutPage />} />

            <Route path="ubo-portal" element={< UboAdminDashboardContainer />}>
                <Route index element={<UboAdminInitDashboardpage />} />
                <Route path="custormer-details/:level/:curstomerNumber" element={<AuthCustomerViewPage />} />
                <Route path="owner-details/:level/:ownerId" element={<AuthOwnerViewPage />} />
                <Route path="bo-risk-assessment" element={<AuthApprovedBmoPage />} />
                <Route path="approved-bo" element={<AuthApprovedBmoPage />} />
                <Route path="pending-bo" element={<AuthPendingBmoPage />} />
                <Route path="rejected-bo" element={<AuthRejectedBmoPage/>} />
                <Route path="history" element={<AuthHistoryBmoPage/>} />
                <Route path="reports" element={<AuthReportBmoPage/>} />
            </Route>

            <Route path="bo-risk-portal" element={< UboAdminRiskDashboardContainer />}>
                <Route index element={<UboRiskAdminInitDashboardpage />} />
                <Route path="accountdetails/:curstomerNumber" element={<AuthBmoViewPage />} />
                <Route path="custormer-details/:level/:curstomerNumber" element={<AuthBmoLevelView />} />
                <Route path="bo-risk-assessment" element={<AuthApprovedBmoPage />} />
                <Route path="approved-bo" element={<AuthApprovedBmoPage />} />
            </Route>
            <Route path="*" element={<ErrorPage />} />
        </Routes>


    )
}