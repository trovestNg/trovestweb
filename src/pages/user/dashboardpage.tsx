import React, { useEffect, useState } from "react";
import { Container, Modal, Card, Button } from "react-bootstrap";
import DashboardCard from "../../components/cards/dashboard-card";
import openBook from '../../assets/images/open-book.png'
import checked from '../../assets/images/check.png';
import timer from '../../assets/images/deadline.png';
import error from '../../assets/images/error.png';
import { Tabs, Tab } from "react-bootstrap";
import UploadedPoliciesTab from "../../components/tabs/admintabs/uploaded-policies-tab";
import UserAllPoliciesTab from "../../components/tabs/userTabs/user-all-policies-tab";
import UserNotAttestedPoliciesTab from "../../components/tabs/userTabs/user-not-attested-policies-tab";
import UserAttestedPoliciesTab from "../../components/tabs/userTabs/attested-policies-tab";
import { getPolicies } from "../../controllers/policy";
import { IPolicy } from "../../interfaces/policy";
import { IUserDashboard } from "../../interfaces/user";
import { IDept } from "../../interfaces/dept";
import { toast } from "react-toastify";
import { getUserInfo, loginUser } from "../../controllers/auth";
import api from "../../config/api";


const UserDashboardPage = () => {
    const userDat = localStorage.getItem('loggedInUser') || '';
    const data = JSON.parse(userDat);
    const userName = data?.profile?.sub.split('\\').pop();
    const [policies, setPolicies] = useState<IPolicy[]>([]);
    const [depts, setDepts] = useState<IDept[]>([]);
    // const [regUsers, setRegUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshComponent,setRefreshComponent] = useState(false)

    const [totalPolicyCount,setTotalPolicyCount] =useState(0);
    const [totalAttested,setTotalAttested] =useState(0);
    const [totalNotAttested,setTotalNotAttested] =useState(0);
    const [userDBInfo,setUserDBInfo]  = useState<IUserDashboard>()

    const dashCardInfo = [
        {
            title: 'Total Policies',
            img: openBook,
            count: userDBInfo?.totalPolicy,
            icon: '',

        },
        {
            title: 'Attested Policies',
            img: checked,
            count: userDBInfo?.totalAttested,
            icon: '',

        },
        {
            title: 'Not Attested Policies',
            img: timer,
            count: userDBInfo?.totalNotAttested,
            icon: '',

        }
       
    ]



    const getUserDashboard = async () => {
        setLoading(true)
        try {
            const res = await getPolicies(`Dashboard/user?userName=${userName}`, `${data?.access_token}`);
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
        getUserDashboard(); 
    },[refreshComponent])
    return (
        <div className="w-100">
            <h5 className="font-weight-bold text-primary" style={{ fontFamily: 'title' }}>Dashboard</h5>
            <div className="d-flex gap-5">
                {
                    dashCardInfo.map((info, index) => (
                    <DashboardCard key={index} count={info.count} 
                    imgSrc={info.img} 
                    title={info.title} />))
                }
            </div>

            <div className="w-100 mt-5">
                <Tabs
                    defaultActiveKey="all-policies"
                    id="uncontrolled-tab-example"
                    variant="underline"
                    className="mb-3 gap-5"
                >
                   
                    <Tab eventKey="all-policies" title="All Policies"
                    tabClassName=""
                    >
                        <UserAllPoliciesTab />
                    </Tab>
                    <Tab eventKey="not-attested" title="Not Attested Policy">
                    <UserNotAttestedPoliciesTab />
                    </Tab>
                    <Tab eventKey="pending" title="Attested Policy">
                        <UserAttestedPoliciesTab/>
                    </Tab>
                </Tabs>
                
            </div>
        </div>
    )

}

export default UserDashboardPage;