import React, { useEffect, useState } from "react";
import { Container, Modal, Card, Button } from "react-bootstrap";
import DashboardCard from "../../components/cards/dashboard-card";
import openBook from '../../assets/images/open-book.png'
import checked from '../../assets/images/check.png';
import timer from '../../assets/images/deadline.png';
import error from '../../assets/images/error.png';
import { Tabs, Tab } from "react-bootstrap";
import UploadedPoliciesTab from "../../components/tabs/admintabs/uploaded-policies-tab";
import AdminUploadedPoliciesTab from "../../components/tabs/admintabs/adminUploadedPoliciesTab";
import { getPolicies } from "../../controllers/policy";
import { IPolicy } from "../../interfaces/policy";
import { IDept } from "../../interfaces/dept";
import { toast } from "react-toastify";
import { loginUser } from "../../controllers/auth";
import CreatePolicyModal from "../../components/modals/createPolicyModal";
import { useNavigate } from "react-router-dom";
// import AdminApprovedPoliciesTab from "./adminApprovedPoliciesTab";
import AdminPoliciesPendingApprovalTab from "../../components/tabs/admintabs/adminPoliciesPendingApprovalTab";
import AdminRejectedApprovalsTab from "../../components/tabs/admintabs/adminRejectedApprovalsTab";
import api from "../../config/api";
import { IUserDashboard } from "../../interfaces/user";
import AdminApprovedPoliciesTab from "../../components/tabs/admintabs/adminApprovedPoliciesTab";


const ApproverDashboardPage = () => {
    const navigate = useNavigate()

    const userDat = localStorage.getItem('loggedInUser') || '';
    const data = JSON.parse(userDat);
    const userName = data?.profile?.sub.split('\\').pop();
    const [policies, setPolicies] = useState<IPolicy[]>([]);
    const [depts, setDepts] = useState<IDept[]>([]);
    // const [regUsers, setRegUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshComponent,setRefreshComponent] = useState(false)
    const [userDBInfo,setUserDBInfo]  = useState<IUserDashboard>()

    const [totalPolicyCount,setTotalPolicyCount] =useState(0);
    const [totalAttested,setTotalAttested] =useState(0);
    const [totalNotAttested,setTotalNotAttested] =useState(0);
    const [createPolicy,setCreatePolicy] =useState(false);

    const dashCardInfo = [
        {
            title: 'Uploaded Policies',
            img: openBook,
            color : 'primary',
            count: userDBInfo?.totalUploadedPolicyByInitiator,
            icon: '',

        },
        {
            title: 'Approved Policies',
            color : 'primary',
            img: checked,
            count: userDBInfo?.totalApprovedPolicy,
            icon: '',

        },
        {
            title: 'Pending Policies',
            color : 'primary',
            img: timer,
            count: userDBInfo?.totalPendingPolicy,
            icon: '',

        },
        {
            title: 'Rejected Policies',
            color : 'danger',
            img: error,
            count: userDBInfo?.totalRejectedPolicy,
            icon: '',

        },
    ]



    
    
    
    
    
    const getInitiatorDashboard = async () => {
        setLoading(true)
        try {
            const res = await api.get(`Dashboard/initiator?userName=${userName}`, `${data?.access_token}`);
            setUserDBInfo(res?.data);
            console.log({here:res})
            if (res?.data) {
                let allAttested:(IPolicy)[] = res?.data.filter((data:IPolicy)=>data.isAuthorized);
                let unAttested:(IPolicy)[] = res?.data.filter((data:IPolicy)=>!data.isAuthorized);
                
                setUserDBInfo(res?.data);
                // setTotalAttested(allAttested.length);
                // setTotalNotAttested(unAttested.length)
                setPolicies([]);
                setLoading(false);
            } else {
                setLoading(false);
                // loginUser()
                // toast.error('Session expired!, You have been logged out!!')
            }
            console.log({ response: res })
        } catch (error) {
    
        }
    }
    
    
    useEffect(()=>{
        getInitiatorDashboard(); 
    },[refreshComponent])
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

            <div className="w-100 mt-5" style={{display:'relative'}}>
                <Tabs
                    defaultActiveKey="uploaded"
                    id="uncontrolled-tab-example"
                    variant="underline"
                    className="mb-3"
                >
                    <Tab eventKey="uploaded" title="Uploaded Policies"
                    tabClassName="px-3"
                    >
                        <AdminUploadedPoliciesTab handleCreatePolicy={()=>navigate('/admin/create-policy')} />
                    </Tab>
                    <Tab eventKey="approved" title="Approved Policies">
                    <AdminApprovedPoliciesTab handleCreatePolicy={()=>navigate('/admin/create-policy')} />
                    </Tab>
                    <Tab eventKey="pending" title="Policies Pending Approval">
                    {/* <AdminPoliciesPendingApprovalTab handleCreatePolicy={()=>navigate('/admin/create-policy')} /> */}
                    </Tab>

                    <Tab eventKey="rejected" title="Rejected Policies">
                    {/* <AdminRejectedApprovalsTab handleCreatePolicy={()=>navigate('/admin/create-policy')} /> */}
                    </Tab>
                </Tabs>
                
            </div>
            <CreatePolicyModal show={createPolicy} off={()=>setCreatePolicy(false)}/>
        </div>
    )

}

export default ApproverDashboardPage;