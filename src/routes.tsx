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
import UserUnAuthDashboardPage from "./pages/unauth-user/dashboardpage";
import UserUnAuthFirstLayerPage from "./pages/unauth-user/userUnAuthFirstLayerPage";
import UnAuthBmoViewPage from "./pages/unauth-user/unAuthBmoView";
import UnAuthBmoView2 from "./pages/unauth-user/unAuthBmoView2";
import UboAdminDashboardContainer from "./pages/user/ubo-dashboard-container";
import UboAdminInitDashboardpage from "./pages/user/ubo-admin-init-dashboardpage";
import AuthBmoViewPage from "./pages/user/auth-bmo-view";

// const UserDBC = React.lazy(() => import("./pages/user/dashboard"));



export default function () {
    return (

        <Routes>
            <Route path="/" element={<UnAuthUserDashboardContainer />}>
                <Route index element={<UserUnAuthDashboardPage />} />
                <Route path="accountdetails/:curstomerNumber" element={<UnAuthBmoViewPage />} />
                <Route path="custormer-details/:curstomerNumber" element={<UnAuthBmoView2 />} />
            </Route>
            <Route path="callback" element={<SigninCallBackPage />} />
            <Route path="logout" element={<LoggedOutPage />} />

            <Route path="ubo-portal" element={< UboAdminDashboardContainer />}>
                <Route index element={<UboAdminInitDashboardpage />} />
                <Route path="accountdetails/:curstomerNumber" element={<AuthBmoViewPage/>} />
                <Route path="all-policy" element={<UserAllPolicyPage />} />
                <Route path="attested-policy" element={<UserAttestedPolicyPage />} />
                <Route path="unattested-policy" element={<UserUnAttestedPolicyPage />} />
            </Route>

            <Route path="/admin" element={<AdminDashboardContainer />}>
                <Route index element={<AdminDashboardPage />} />
                <Route path="create-policy" element={<CreateNewPolicyPage />} />
                <Route path="edit-policy/:id" element={<EditPolicyPage />} />
                <Route path="attesters-list/:id" element={<AdminAttestersListPage />} />
                <Route path="defaulters-list/:id" element={<AdminDefaultersListPage />} />
                <Route path="uploaded-policies" element={<AdminUploadedPoliciesPage />} />
                <Route path="approved-policies" element={<AdminApprovedPoliciesPage />} />
                <Route path="pending-policies" element={<AdminPendingPoliciesPage />} />
                <Route path="rejected-policies" element={<AdminRejectedPoliciesPage />} />
                <Route path="deleted-policies" element={<AdminDeletedPoliciesPage />} />
                <Route path="policy/:id/:attestationStatus" element={<AdminPolicyviewpage />} />
                <Route path="view-deleted/:id" element={<AdminViewDelPolicyPage />} />
            </Route>
            <Route path="/admn" element={<ApproverDashboardContainer />}>
                <Route index element={<ApproverDashboardPage />} />
                <Route path="all-policies" element={< ApproverAllPoliciesPage />} />
                <Route path="approved-policies" element={<ApproverApprovedPoliciesPage />} />
                <Route path="pending-policies" element={<ApproverPendingPoliciesPage />} />
                <Route path="rejected-policies" element={<ApproverRejectedPoliciesPage />} />
                <Route path="deleted-policies" element={<ApproverDeletedPoliciesPage />} />
                <Route path="attesters-list/:id" element={<ApproverAttestersListPage />} />
                <Route path="policy/:id/:attestationStatus" element={<ApproverPolicyviewpage />} />
                <Route path="attesters-list/:id" element={<ApproverAttestersListPage />} />
                <Route path="defaulters-list/:id" element={<ApproverDefaultersListPage />} />
            </Route>
            <Route path="*" element={<ErrorPage />} />
        </Routes>


    )
}