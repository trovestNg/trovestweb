import React, { useEffect, useState } from "react";
import { IPolicy } from "../../interfaces/policy";
import { IDept } from "../../interfaces/dept";
import api from "../../config/api";
import { IUserDashboard } from "../../interfaces/user";
import AdminUploadedPoliciesTab from "../../components/tabs/admintabs/adminUploadedPoliciesTab";
import { useNavigate } from "react-router-dom";
import ApproverAllPoliciesTab from "../../components/tabs/approvertabs/approverAllPoliciesTab";


const ApproverAllPoliciesPage = () => {
    const userDat = localStorage.getItem('loggedInUser') || '';
    const data = JSON.parse(userDat);
    const [policies, setPolicies] = useState<IPolicy[]>([]);
    const [depts, setDepts] = useState<IDept[]>([]);
    // const [regUsers, setRegUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshComponent,setRefreshComponent] = useState(false)
    const userName = data?.profile?.sub.split('\\').pop();
    const [userDBInfo,setUserDBInfo]  = useState<IUserDashboard>();
    const navigate = useNavigate();

    const [totalPolicyCount,setTotalPolicyCount] =useState(0);
    const [totalAttested,setTotalAttested] =useState(0);
    const [totalNotAttested,setTotalNotAttested] =useState(0);
    
    const getInitiatorDashboard = async () => {
        setLoading(true)
        try {
            const res = await api.get(`Dashboard/authorizer?userName=${userName}`, `${data?.access_token}`);
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
            <h5 className="font-weight-bold text-primary" style={{ fontFamily: 'title' }}>All Policies {userDBInfo?.totalUploadedPolicy} </h5>
            <p>Discover all policies and their respective statuses here.</p>
            {/* <div className="d-flex gap-5">
                {
                    dashCardInfo.map((info, index) => (<DashboardCard key={index} imgSrc={info.img} title={info.title} />))
                }
            </div> */}

            <div className="w-100 mt-5">
                <ApproverAllPoliciesTab handleCreatePolicy={ ()=>navigate('/admin/create-policy')}/>
            </div>
        </div>
    )

}

export default ApproverAllPoliciesPage;