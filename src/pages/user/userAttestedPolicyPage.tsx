import React, { useEffect, useState } from "react";
import { Container, Modal, Card, Button } from "react-bootstrap";
import UserAllPoliciesTab from "../../components/tabs/userTabs/user-all-policies-tab";
import UserAttestedPoliciesTab from "../../components/tabs/userTabs/attested-policies-tab";
import { IPolicy } from "../../interfaces/policy";
import { IDept } from "../../interfaces/dept";
import { getPolicies } from "../../controllers/policy";
import { getUserInfo, loginUser } from "../../controllers/auth";
import { toast } from "react-toastify";
import api from "../../config/api";
import { IUserPolicy } from "../../interfaces/user";


const UserAttestedPolicyPage = () => {
    const [policies, setPolicies] = useState<IPolicy[]>([]);
    const [depts, setDepts] = useState<IDept[]>([]);
    // const [regUsers, setRegUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshComponent,setRefreshComponent] = useState(false)

    const [totalPolicyCount,setTotalPolicyCount] =useState(0);
    const [totalAttested,setTotalAttested] =useState(0);
    const [totalNotAttested,setTotalNotAttested] =useState(0);
    
    const getAllPolicies = async () => {
        setLoading(true)
        try {
            let userInfo = await getUserInfo();
            let userName = userInfo?.profile?.sub.split('\\')[1]
            const res = await api.get(`Policy/user-policy?userName=${userName}`, `${userInfo?.access_token}`);
            if (res?.data) {
                let attested = res?.data.filter((policy: IUserPolicy) => policy.isAttested && (!policy.isDeleted || !policy.markedForDeletion)
                );
                setTotalAttested(attested.length);
                setLoading(false)
            }

        } catch (error) {
            // console.log({ gotten: userInfo })(error)
        }


    }

   
    useEffect(()=>{
        getAllPolicies(); 
    },[refreshComponent])

    return (
        <div className="w-100">
            <h5 className="font-weight-bold text-primary" style={{ fontFamily: 'title' }}>Attested Policies {`(${totalAttested})`}</h5>
            <p>Here you’ll see all the policies you have attested to.</p>
            {/* <div className="d-flex gap-5">
                {
                    dashCardInfo.map((info, index) => (<DashboardCard key={index} imgSrc={info.img} title={info.title} />))
                }
            </div> */}

            <div className="w-100 mt-5">
                <UserAttestedPoliciesTab />
            </div>
        </div>
    )

}

export default UserAttestedPolicyPage;