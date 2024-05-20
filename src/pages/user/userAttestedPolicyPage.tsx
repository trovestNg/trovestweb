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
import UserAttestedPoliciesTab from "../../components/tabs/userTabs/attested-policies-tab";
import { IPolicy } from "../../interfaces/policy";
import { IDept } from "../../interfaces/dept";
import { getPolicies } from "../../controllers/policy";
import { getUserInfo, loginUser } from "../../controllers/auth";
import { toast } from "react-toastify";
import api from "../../config/api";


const UserAttestedPolicyPage = () => {
    const userDat = localStorage.getItem('loggedInUser') || '';
    const data = JSON.parse(userDat);
    const [policies, setPolicies] = useState<IPolicy[]>([]);
    const [depts, setDepts] = useState<IDept[]>([]);
    // const [regUsers, setRegUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshComponent,setRefreshComponent] = useState(false)

    const [totalPolicyCount,setTotalPolicyCount] =useState(0);
    const [totalAttested,setTotalAttested] =useState(0);
    const [totalNotAttested,setTotalNotAttested] =useState(0);
    
    // const getAttestedPolicies = async () => {
    //     setLoading(true)
    //     try {

    //         const user = getUserInfo();
    //         const res = await api.get(`Attest/unattested?subsidiaryName=FSDH Merchant Bank`, `${data?.access_token}`);
    //         if (res?.data) {
    //             setPolicies(res?.data)
    //             let allAttested:(IPolicy)[] = res?.data.filter((data:IPolicy)=>data.isAuthorized);
    //             let unAttested:(IPolicy)[] = res?.data.filter((data:IPolicy)=>!data.isAuthorized);
                
    //             setTotalPolicyCount(res?.data.length);
    //             setTotalAttested(allAttested.length);
    //             setTotalNotAttested(unAttested.length)
    //             setPolicies([]);
    //             setLoading(false);
    //         } else {
    //             setLoading(false);
    //             loginUser()
    //             toast.error('Session expired!, You have been logged out!!')
    //         }
    //         console.log({ response: res })
    //     } catch (error) {

    //     }
    // }


    const getAttestedPolicies = async () => {
        setLoading(true)
        try {
            let userInfo = await getUserInfo();
            console.log({gotten: userInfo})
            if(userInfo){
                const res = await api.get(`attest?userName=majadi`, `${userInfo.access_token}`);
                if (res?.data) {
                    // setPolicies(res?.data)
                    let allAttested:(IPolicy)[] = res?.data.filter((data:IPolicy)=>data.isAuthorized);
                    let unAttested:(IPolicy)[] = res?.data.filter((data:IPolicy)=>!data.isAuthorized);
                    
                    setTotalPolicyCount(res?.data.length);
                    setTotalAttested(res?.data.length);
                    setTotalNotAttested(unAttested.length)
                } else {
                    loginUser()
                    // toast.error('Session expired!, You have been logged out!!')
                }
                console.log({ response: res })
            }
           
        } catch (error) {

        }
    }

   
    useEffect(()=>{
        getAttestedPolicies (); 
    },[refreshComponent])

    return (
        <div className="w-100">
            <h5 className="font-weight-bold text-primary" style={{ fontFamily: 'title' }}>Attested Policies {totalAttested} </h5>
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