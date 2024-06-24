import React, { useEffect, useState } from "react";
import { Container, Modal, Card, Button } from "react-bootstrap";
import DashboardCard from "../../components/cards/dashboard-card";
import openBook from '../../assets/images/open-book.png'
import checked from '../../assets/images/check.png';
import timer from '../../assets/images/deadline.png';
import error from '../../assets/images/error.png';
import { Tabs, Tab } from "react-bootstrap";
import AdminUploadedPoliciesTab from "../../components/tabs/admintabs/adminUploadedPoliciesTab";
import { getPolicies } from "../../controllers/policy";
import { IPolicy } from "../../interfaces/policy";
import { IDept } from "../../interfaces/dept";
import { toast } from "react-toastify";
import { getUserInfo, loginUser } from "../../controllers/auth";
import CreatePolicyModal from "../../components/modals/createPolicyModal";
import { useNavigate } from "react-router-dom";
// import AdminApprovedPoliciesTab from "./adminApprovedPoliciesTab";
import AdminPoliciesPendingApprovalTab from "../../components/tabs/admintabs/adminPoliciesPendingApprovalTab";
import AdminRejectedApprovalsTab from "../../components/tabs/admintabs/adminRejectedApprovalsTab";
import api from "../../config/api";
import { IUserDashboard } from "../../interfaces/user";
import AdminApprovedPoliciesTab from "../../components/tabs/admintabs/adminApprovedPoliciesTab";


const AdminDashboardPage = () => {
    const navigate = useNavigate()
    const [policies, setPolicies] = useState<IPolicy[]>([]);
    const [depts, setDepts] = useState<IDept[]>([]);
    // const [regUsers, setRegUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshComponent, setRefreshComponent] = useState(false)
    const [userDBInfo, setUserDBInfo] = useState<IUserDashboard>()
    const [createPolicy, setCreatePolicy] = useState(false);

    const dashCardInfo = [
        {
            title: 'Uploaded Policies',
            img: openBook,
            color: 'primary',
            count: userDBInfo?.totalUploadedPolicyByInitiator,
            icon: '',

        },
        {
            title: 'Approved Policies',
            color: 'primary',
            img: checked,
            count: userDBInfo?.totalApprovedPolicy,
            icon: '',

        },
        {
            title: 'Pending Policies',
            color: 'primary',
            img: timer,
            count: userDBInfo?.totalPendingPolicy,
            icon: '',

        },
        {
            title: 'Rejected Policies',
            color: 'danger',
            img: error,
            count: userDBInfo?.totalRejectedPolicy,
            icon: '',

        },
    ]

    const getInitiatorDashboard = async () => {
        setLoading(true)
        try {
            let userInfo = await getUserInfo();
            let userName = userInfo?.profile?.sub.split('\\')[1]
            const res = await getPolicies(`Dashboard/initiator?userName=${userName}`, `${userInfo?.access_token}`);

            if (res?.data) {
                setUserDBInfo(res?.data);
                setLoading(false);
            } else {
                // setLoading(false);
                ;
            }


        } catch (error) {
            // console.log({ gotten: userInfo })(error)
        }
    }

    useEffect(() => {
        getInitiatorDashboard();
    }, [refreshComponent])

    return (
        <div className="w-100">
            <h5 className="font-weight-bold text-primary" style={{ fontFamily: 'title' }}>Dashboard</h5>
            <div className="d-flex gap-5">
                {
                    dashCardInfo.map((info, index) => (
                        <DashboardCard key={index} titleColor={info.color} count={info.count}
                            imgSrc={info.img}
                            title={info.title} />))
                }
            </div>

            <div className="mt-5" style={{ display: 'relative' }}>
                <Tabs
                    defaultActiveKey="pending"
                    id="uncontrolled-tab-example"
                    variant="underline"
                    className="mb-3 gap-5"
                >

                    <Tab eventKey="pending" title="Policies Pending Approval">
                        <AdminPoliciesPendingApprovalTab handleCreatePolicy={() => navigate('/admin/create-policy')} />
                    </Tab>

                    <Tab eventKey="approved" title="Approved Policies">
                        <AdminApprovedPoliciesTab handleCreatePolicy={() => navigate('/admin/create-policy')} />
                    </Tab>

                    <Tab eventKey="rejected" title="Rejected Policies">
                        <AdminRejectedApprovalsTab handleCreatePolicy={() => navigate('/admin/create-policy')} />
                    </Tab>

                    <Tab eventKey="uploaded" title="Uploaded Policies"
                        tabClassName=""
                    >
                        <AdminUploadedPoliciesTab handleCreatePolicy={() => navigate('/admin/create-policy')} />
                    </Tab>
                </Tabs>

            </div>
            <CreatePolicyModal show={createPolicy} off={() => setCreatePolicy(false)} />
        </div>
    )

}

export default AdminDashboardPage;