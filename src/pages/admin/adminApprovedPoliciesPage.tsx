import React, { useEffect, useState } from "react";
import { IPolicy } from "../../interfaces/policy";
import { IDept } from "../../interfaces/dept";
import { getPolicies } from "../../controllers/policy";
import { getUserInfo, loginUser } from "../../controllers/auth";
import { toast } from "react-toastify";
import api from "../../config/api";
import { IUserDashboard } from "../../interfaces/user";
import AdminApprovedPoliciesTab from "../../components/tabs/admintabs/adminApprovedPoliciesTab";
import { useNavigate } from "react-router-dom";


const AdminApprovedPoliciesPage = () => {
    const [policies, setPolicies] = useState<IPolicy[]>([]);
    const [depts, setDepts] = useState<IDept[]>([]);
    // const userName = data?.profile?.sub.split('\\').pop();
    // const [regUsers, setRegUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshComponent,setRefreshComponent] = useState(false);
    const navigate = useNavigate()

    const [apPolicy,setApPol] =useState(0);
    const [totalAttested,setTotalAttested] =useState(0);
    const [totalNotAttested,setTotalNotAttested] =useState(0);
    const [userDBInfo,setUserDBInfo]  = useState<IUserDashboard>()
    
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


                
                setApPol(apPol.length);
                
                    } else {
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
            <h5 className="font-weight-bold text-primary" style={{ fontFamily: 'title' }}>Approved Policies 
            {` (${apPolicy})`}
            </h5>
            <p>Here, you'll find approved policies. Download lists of attesters and defaulters..</p>
            {/* <div className="d-flex gap-5">
                {
                    dashCardInfo.map((info, index) => (<DashboardCard key={index} imgSrc={info.img} title={info.title} />))
                }
            </div> */}

            <div className="w-100 mt-5">
                <AdminApprovedPoliciesTab handleCreatePolicy={ ()=>navigate('/admin/create-policy')} />
            </div>
        </div>
    )

}

export default AdminApprovedPoliciesPage;