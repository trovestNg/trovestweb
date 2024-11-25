import React, { useEffect, useState } from "react";
import { Container, Modal, Card, Button } from "react-bootstrap";
import DashboardCard from "../../components/cards/dashboard-card";
import openBook from '../../assets/images/open-book.png'
import checked from '../../assets/images/check.png';
import timer from '../../assets/images/deadline.png';
import error from '../../assets/images/error.png';
import { Tabs, Tab } from "react-bootstrap";
import UserNotAttestedPoliciesTab from "../../components/tabs/userTabs/user-not-attested-policies-tab";
import UserAttestedPoliciesTab from "../../components/tabs/userTabs/attested-policies-tab";
import { getUserInfo, loginUser } from "../../controllers/auth";
import api from "../../config/api";
import { IPolicy } from "../../interfaces/policy";
import { IDept } from "../../interfaces/dept";
import { toast } from "react-toastify";
import { IUserPolicy } from "../../interfaces/user";


const UserUnAttestedPolicyPage = () => {
    const [policies, setPolicies] = useState<IPolicy[]>([]);
    const [depts, setDepts] = useState<IDept[]>([]);
    // const [regUsers, setRegUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshComponent,setRefreshComponent] = useState(false)

    const [totalPolicyCount,setTotalPolicyCount] =useState(0);
    const [totalAttested,setTotalAttested] =useState(0);
    const [totalNotAttested,setTotalNotAttested] =useState(0);

    const dashCardInfo = [
        {
            title: 'Total Policies',
            img: openBook,
            count: '',
            icon: '',

        },
        {
            title: 'Attested Policies',
            img: checked,
            count: '',
            icon: '',

        },
        {
            title: 'Not Attested Policies',
            img: timer,
            count: '',
            icon: '',

        }
       
    ]


    const getAllPolicies = async () => {
        setLoading(true)
        try {
            let userInfo = await getUserInfo();
            let userName = userInfo?.profile?.sub.split('\\')[1]
            const res = await api.get(`Policy/user-policy?userName=${userName}`, `${userInfo?.access_token}`);
            if (res?.data) {
                let unAttested = res?.data.filter((policy: IUserPolicy) => !policy.isAttested && (!policy.isDeleted || !policy.markedForDeletion));
                
                setTotalNotAttested(unAttested.length);
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
            <h5 className="font-weight-bold text-primary" style={{ fontFamily: 'title' }}>Not Attested Policies {`(${totalNotAttested})`} </h5>
            <p>Review policies you haven't attested to yet. Kindly read and attest</p>
            {/* <div className="d-flex gap-5">
                {
                    dashCardInfo.map((info, index) => (<DashboardCard key={index} imgSrc={info.img} title={info.title} />))
                }
            </div> */}

            <div className="w-100 mt-5">
                
                        <UserNotAttestedPoliciesTab/>
                   
                
            </div>
        </div>
    )

}

export default UserUnAttestedPolicyPage;