import React, { useEffect, useState } from "react";

import UserAllPoliciesTab from "../../components/tabs/userTabs/user-all-policies-tab";
import { IPolicy } from "../../interfaces/policy";
import { IDept } from "../../interfaces/dept";
import { getPolicies } from "../../controllers/policy";
import { getUserInfo, loginUser } from "../../controllers/auth";
import { toast } from "react-toastify";
import api from "../../config/api";


const UserAllPolicyPage = () => {
    
    const [policies, setPolicies] = useState<IPolicy[]>([]);
    const [depts, setDepts] = useState<IDept[]>([]);
    // const [regUsers, setRegUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshComponent,setRefreshComponent] = useState(false)

    const [totalPolicyCount,setTotalPolicyCount] =useState(0);
    const [totalAttested,setTotalAttested] =useState(0);
    const [totalNotAttested,setTotalNotAttested] =useState(0);

    const getUserDashboard = async () => {
        try {
            let userInfo = await getUserInfo();
            // console.log({userCred:userInfo?.scopes})
            if(userInfo?.expired) {
                toast.error('Session timed out!');
                await loginUser()
            } else if(userInfo?.profile){
                let userName = userInfo?.profile?.sub.split('\\')[1]
                const res = await getPolicies(`Dashboard/user?userName=${userName}`, `${userInfo?.access_token}`);
                if (res?.data) {
                    setTotalPolicyCount(res?.data.totalPolicy);
                    setLoading(false);
                } else {
                    toast.error('Network error!');
                    setLoading(false);
                }

            } else {
            //    await loginUser()
            }
        } catch (error) {
           console.log(error) 
        }
    }

   
    useEffect(()=>{
        getUserDashboard(); 
    },[refreshComponent])

    return (
        <div className="w-100">
            <h5 className="font-weight-bold text-primary" style={{ fontFamily: 'title' }}>All Policies {totalPolicyCount} </h5>
            <p>Discover all policies and their respective statuses here.</p>
            {/* <div className="d-flex gap-5">
                {
                    dashCardInfo.map((info, index) => (<DashboardCard key={index} imgSrc={info.img} title={info.title} />))
                }
            </div> */}

            <div className="w-100 mt-5">
                <UserAllPoliciesTab />
            </div>
        </div>
    )

}

export default UserAllPolicyPage;