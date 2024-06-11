import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import UserDashboardContainer from "./pages/user/dashboard";
import UserDashboardPage from "./pages/user/dashboardpage";
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

import ApproverDashboardContainer from "./pages/approver/dashboard";
import ApproverDashboardPage from "./pages/approver/dashboardpage";
import ApproverAllPoliciesPage from "./pages/approver/approverAllPoliciesPage";
import AdminPolicyviewpage from "./pages/admin/adminPolicyviewpage";
import AdminAttestersListPage from "./pages/admin/adminAttestersListPage";

// const UserDBC = React.lazy(() => import("./pages/user/dashboard"));



export default function () {
    return (

        <Routes>
            <Route path="/" element={<Landingpage />} />
           <Route path="callback" element={<SigninCallBackPage />} />
            <Route path="/logout" element={<LoggedOutPage />} />

            <Route path="policy-portal" element={< UserDashboardContainer/>}>
                <Route index element={<UserDashboardPage/>}/>
                <Route path="policy/:attestationStatus/:id" element={<PolicyViewPage />}/>
                <Route path="all-policy" element={<UserAllPolicyPage />} />
                <Route path="attested-policy" element={<UserAttestedPolicyPage />} />
                <Route path="unattested-policy" element={<UserUnAttestedPolicyPage />} />
            </Route>

            <Route path="/admin" element={<AdminDashboardContainer />}>
                <Route index element={<AdminDashboardPage />} />
                <Route path="create-policy" element={<CreateNewPolicyPage />}/>
                <Route path="edit-policy/:id" element={<EditPolicyPage/>}/>
                <Route path="attesters-list/:id" element={<AdminAttestersListPage/>}/>
                <Route path="uploaded-policies" element={<AdminUploadedPoliciesPage/>}/>
                <Route path="approved-policies" element={<AdminApprovedPoliciesPage/>}/>
                <Route path="pending-policies" element={<AdminPendingPoliciesPage/>}/>
                <Route path="rejected-policies" element={<AdminRejectedPoliciesPage/>}/>
                <Route path="deleted-policies" element={<AdminDeletedPoliciesPage/>}/>
                <Route path="policy/:id/:attestationStatus" element={<AdminPolicyviewpage/>} />
            </Route>
            <Route path="/admn" element={<ApproverDashboardContainer/>}>
                <Route index element={<ApproverDashboardPage/>} />
                <Route path="all-policies" element={< ApproverAllPoliciesPage/>}/>
                <Route path="approved-policies" element={<AdminApprovedPoliciesPage/>}/>
                <Route path="pending-policies" element={<AdminPendingPoliciesPage/>}/>
                <Route path="rejected-policies" element={<AdminRejectedPoliciesPage/>}/>
                <Route path="deleted-policies" element={<AdminDeletedPoliciesPage/>}/>
                <Route path="policy/:id/:attestationStatus" element={<AdminPolicyviewpage/>} />
            </Route>

        </Routes>


    )
}