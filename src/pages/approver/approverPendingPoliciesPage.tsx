import React, { useEffect, useState } from "react";
import { IPolicy } from "../../interfaces/policy";
import { IDept } from "../../interfaces/dept";
import { getPolicies } from "../../controllers/policy";
import { getUserInfo, loginUser } from "../../controllers/auth";
import { toast } from "react-toastify";
import api from "../../config/api";
import { IUserDashboard } from "../../interfaces/user";
import AdminPoliciesPendingApprovalTab from "../../components/tabs/admintabs/adminPoliciesPendingApprovalTab";
import ApproverPendingPolicyTab from "../../components/tabs/approvertabs/approverPendingPolicyTab";


const ApproverPendingPoliciesPage = () => {
   
    const [userDBInfo,setUserDBInfo]  = useState<IUserDashboard>()
    
    const [policies, setPolicies] = useState<IPolicy[]>([]);
    const [depts, setDepts] = useState<IDept[]>([]);
    // const [regUsers, setRegUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshComponent,setRefreshComponent] = useState(false)

    const [totalPolicyCount,setTotalPolicyCount] =useState(0);
    const [totalAttested,setTotalAttested] =useState(0);
    const [totalNotAttested,setTotalNotAttested] =useState(0);
    
    
    const getInitiatorDashboard = async () => {
        setLoading(true)
        try {
            let userInfo = await getUserInfo();
            let userName = userInfo?.profile?.sub.split('\\')[1]
            if(userInfo){
                const res = await api.get(`Dashboard/authorizer?userName=${userName}`, `${userInfo?.access_token}`);
                setUserDBInfo(res?.data);
                // console.log({ gotten: userInfo })({here:res})
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
                // console.log({ gotten: userInfo })({ response: res })
            }
           
        } catch (error) {
    
        }
    }

   
    useEffect(()=>{
        getInitiatorDashboard(); 
    },[refreshComponent])

    return (
        <div className="w-100">
            <h5 className="font-weight-bold text-primary" style={{ fontFamily: 'title' }}>Pending Policies</h5>
            <p>Here, you'll find Pending policies. You can cancel, edit and delete before approval.</p>
            {/* <div className="d-flex gap-5">
                {
                    dashCardInfo.map((info, index) => (<DashboardCard key={index} imgSrc={info.img} title={info.title} />))
                }
            </div> */}

            <div className="w-100 mt-5">
                <ApproverPendingPolicyTab/>
            </div>
        </div>
    )

}

export default ApproverPendingPoliciesPage;