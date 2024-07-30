import React, { useEffect, useState } from "react";
import { Container, Modal, Card, Button } from "react-bootstrap";
import DashboardCard from "../../components/cards/dashboard-card";
import openBook from '../../assets/images/open-book.png'
import checked from '../../assets/images/check.png';
import timer from '../../assets/images/deadline.png';
import error from '../../assets/images/error.png';
import { Tabs, Tab } from "react-bootstrap";
import ApproverAllPoliciesTab from "../../components/tabs/approvertabs/approverAllPoliciesTab";
import { getPolicies } from "../../controllers/policy";
import { IPolicy } from "../../interfaces/policy";
import { IDept } from "../../interfaces/dept";
import { toast } from "react-toastify";
import { getUserInfo, loginUser } from "../../controllers/auth";
import CreatePolicyModal from "../../components/modals/createPolicyModal";
import { useNavigate } from "react-router-dom";
// import AdminApprovedPoliciesTab from "./admnApprovedPoliciesTab";
import ApproverPendingPolicyTab from "../../components/tabs/approvertabs/approverPendingPolicyTab";
import ApproverRejectedPoliciesTab from "../../components/tabs/approvertabs/approverRejectedPoliciesTab";
import api from "../../config/api";
import { IUserDashboard } from "../../interfaces/user";
import ApproverApprovedPoliciesTab from "../../components/tabs/approvertabs/approverApprovedPoliciesTab";


const ApproverDashboardPage = () => {
    const navigate = useNavigate()

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
            title: 'All Policies',
            img: openBook,
            color : 'primary',
            count: userDBInfo?.totalPolicyForAuthorizer,
            path : '/admn/all-policies',
            icon: '',

        },
        {
            title: 'Approved Policies',
            color : 'primary',
            img: checked,
            count: userDBInfo?.totalApprovedPolicy,
            path : '/admn/approved-policies',
            icon: '',

        },
        {
            title: 'Pending Policies',
            color : 'primary',
            img: timer,
            count: userDBInfo?.totalPendingPolicy,
            path : '/admn/pending-policies',
            icon: '',

        },
        {
            title: 'Rejected Policies',
            color : 'danger',
            img: error,
            count: userDBInfo?.totalRejectedPolicy,
            path : '/admn/rejected-policies',
            icon: '',

        },
    ]



    
    
    
    
    
    const getInitiatorDashboard = async () => {
        setLoading(true)
        try {
            let userInfo = await getUserInfo();
            let userName = userInfo?.profile?.sub.split('\\')[1]
            const res = await api.get(`Dashboard/authorizer?userName=${userName}`, `${userInfo?.access_token}`);
            setUserDBInfo(res?.data);
            // console.log({ gotten: userInfo })({here:res})
            if (res?.data) {
                setUserDBInfo(res?.data);
                setPolicies([]);
                setLoading(false);
            } else {
                setLoading(false);
                // loginUser()
                // toast.error('Session expired!, You have been logged out!!')
            }
            // console.log({ gotten: userInfo })({ response: res })
        } catch (error) {
    
        }
    }
    
    
    useEffect(()=>{
        getInitiatorDashboard(); 
    },[refreshComponent])
    return (
        <div className="w-100">
            <h5 className="font-weight-bold text-primary" style={{ fontFamily: 'title' }}>Dashboard</h5>
            <div className="d-flex gap-3 w-100">
                {
                    dashCardInfo.map((info, index) => (
                    <DashboardCard key={index} titleColor={info.color} count={info.count} 
                    imgSrc={info.img} 
                    title={info.title} url ={info.path}/>))
                }
            </div>

            <div className="w-100 mt-5" style={{display:'relative'}}>
                <Tabs
                    defaultActiveKey="uploaded"
                    id="uncontrolled-tab-example"
                    variant="underline"
                    className="mb-3 gap-5"
                >

                    
                    <Tab eventKey="uploaded" title="All Policies"
                    tabClassName=""
                    >
                        <ApproverAllPoliciesTab handleCreatePolicy={()=>navigate('/admn/create-policy')} />
                    </Tab>

                    <Tab eventKey="approved" title="Approved Policies">
                    < ApproverApprovedPoliciesTab handleCreatePolicy={()=>navigate('/admn/create-policy')} />
                    </Tab>

                    <Tab eventKey="pending" title="Policies Pending Approval">
                    <ApproverPendingPolicyTab handleCreatePolicy={()=>navigate('/admn/create-policy')} />
                    </Tab>
                    
                   
                    

                    <Tab eventKey="rejected" title="Rejected Policies">
                    <ApproverRejectedPoliciesTab handleCreatePolicy={()=>navigate('/admn/create-policy')} />
                    </Tab>
                </Tabs>
                
            </div>
            <CreatePolicyModal show={createPolicy} off={()=>setCreatePolicy(false)}/>
        </div>
    )

}

export default ApproverDashboardPage;