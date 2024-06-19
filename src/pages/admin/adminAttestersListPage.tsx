import React, { useEffect, useState } from "react";
import { IPolicy } from "../../interfaces/policy";
import { IDept } from "../../interfaces/dept";
import { getPolicies } from "../../controllers/policy";
import { getUserInfo, loginUser } from "../../controllers/auth";
import { toast } from "react-toastify";
import api from "../../config/api";
import { IUserDashboard } from "../../interfaces/user";
import AdminApprovedPoliciesTab from "../../components/tabs/admintabs/adminApprovedPoliciesTab";
import AdminAttestersListTab from "../../components/tabs/admintabs/adminAttestersListTab";
import { useNavigate,useParams } from "react-router-dom";
import { Button } from "react-bootstrap";


const AdminAttestersListPage = () => {
    const [policies, setPolicies] = useState<IPolicy[]>([]);
    const [depts, setDepts] = useState<IDept[]>([]);
   
    
    // const [regUsers, setRegUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshComponent,setRefreshComponent] = useState(false);
    const navigate = useNavigate()

    const [userDBInfo,setUserDBInfo]  = useState<IUserDashboard>()
    
    const getInitiatorDashboard = async () => {
        setLoading(true)
        try {
            let userInfo = await getUserInfo();
            let userName = userInfo?.profile?.sub.split('\\')[1]
            const res = await api.get(`Dashboard/initiator?userName=${userName}`, `${userInfo?.access_token}`);
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
            <div><Button variant="outline border border-2" onClick={() => navigate(-1)}>Go Back</Button></div>
            <h5 className="font-weight-bold text-primary mt-3" style={{ fontFamily: 'title' }}>{`Data Protection Policy & Procedure Attesters List-${userDBInfo?.totalApprovedPolicy}`} </h5>
           
            {/* <div className="d-flex gap-5">
                {
                    dashCardInfo.map((info, index) => (<DashboardCard key={index} imgSrc={info.img} title={info.title} />))
                }
            </div> */}

            <div className="w-100 mt-5">
                <AdminAttestersListTab handleCreatePolicy={ ()=>navigate('/admin/create-policy')} />
            </div>
        </div>
    )

}

export default AdminAttestersListPage;