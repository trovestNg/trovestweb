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
    const [depts, setDepts] = useState<IDept[]>([]);
    // const [regUsers, setRegUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshComponent, setRefreshComponent] = useState(false)
    const [userDBInfo, setUserDBInfo] = useState<IUserDashboard>()
    const [createPolicy, setCreatePolicy] = useState(false);

    const [allPol, setAllPol] = useState(0);
    const [apPol, setApPol] = useState(0);
    const [pendPol, setPendPol] = useState(0);
    const [rejPol, setRejPol] = useState(0);

    const dashCardInfo = [
        {
            title: 'Uploaded Policies',
            img: openBook,
            color: 'primary',
            count: allPol,
            path: '/admin/uploaded-policies',
            icon: '',

        },
        {
            title: 'Approved Policies',
            color: 'primary',
            img: checked,
            count: apPol,
            path: '/admin/approved-policies',
            icon: '',

        },
        {
            title: 'Pending Policies',
            color: 'primary',
            img: timer,
            count: pendPol,
            path: '/admin/pending-policies',
            icon: '',

        },
        {
            title: 'Rejected Policies',
            color: 'danger',
            img: error,
            count:rejPol,
            path: '/admin/rejected-policies',
            icon: '',

        },
    ]

   

    const getInitiatorDashboard = async () => {
        setLoading(true)

       
            try {
                let userInfo = await getUserInfo();
                if (userInfo) {
            let userName = userInfo?.profile?.sub.split('\\')[1]
            const res = await api.get(`Dashboard/initiator-policy?userName=${userName}`, `${userInfo.access_token}`);
                    if (res?.data) {
                        setLoading(false);

                let allPolicies = res?.data.filter((pol: IPolicy) => !pol.isDeleted && !pol.markedForDeletion)
                let apPol = res?.data.filter((pol: IPolicy) => pol.isAuthorized && !pol.isDeleted && !pol.markedForDeletion)
                let pendPol = res?.data.filter((pol: IPolicy) => !pol.isAuthorized && !pol.isDeleted && !pol.isRejected && !pol.markedForDeletion)
                let rejPol = res?.data.filter((pol: IPolicy) => pol.isRejected && !pol.isDeleted && !pol.markedForDeletion)


                // console.log({seeHere :notAttested})


                setAllPol(allPolicies.length);
                setApPol(apPol.length);
                setPendPol(pendPol.length);
                setRejPol(rejPol.length);
                    } else {
                        // loginUser()
                        // toast.error('Session expired!, You have been logged out!!')
                    }
                    // console.log({ gotten: userInfo })({ response: res })
                }
    
            } catch (error) {
    
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
                            url={info.path}
                            title={info.title} />))
                }
            </div>

            <div className="mt-5" style={{ display: 'relative' }}>
                <Tabs
                    defaultActiveKey="uploaded"
                    id="uncontrolled-tab-example"
                    variant="underline"
                    className="mb-3 gap-5"
                >
                    <Tab eventKey="uploaded" title="Uploaded Policies"
                        tabClassName=""
                    >
                        <AdminUploadedPoliciesTab 
                        refComp={()=>setRefreshComponent(!refreshComponent)} handleCreatePolicy={() => navigate('/admin/create-policy')} />
                    </Tab>

                    <Tab eventKey="approved" title="Approved Policies">
                        <AdminApprovedPoliciesTab 
                        refComp={()=>setRefreshComponent(!refreshComponent)} handleCreatePolicy={() => navigate('/admin/create-policy')}
                        />
                    </Tab>

                    <Tab eventKey="pending" title="Policies Pending Approval">
                        <AdminPoliciesPendingApprovalTab 
                        refComp={()=>setRefreshComponent(!refreshComponent)} handleCreatePolicy={() => navigate('/admin/create-policy')}
                         />
                    </Tab>

                    <Tab eventKey="rejected" title="Rejected Policies">
                        <AdminRejectedApprovalsTab 
                        refComp={()=>setRefreshComponent(!refreshComponent)} handleCreatePolicy={() => navigate('/admin/create-policy')}
                         />
                    </Tab>


                </Tabs>

            </div>
            <CreatePolicyModal show={createPolicy} off={() => setCreatePolicy(false)} />
        </div>
    )

}

export default AdminDashboardPage;