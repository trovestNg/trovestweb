import React, { useEffect, useState } from "react";
import { Container, Modal, Card, Button } from "react-bootstrap";
import DashboardCard from "../../components/cards/dashboard-card";
import openBook from '../../assets/images/open-book.png'
import checked from '../../assets/images/check.png';
import timer from '../../assets/images/deadline.png';
import error from '../../assets/images/error.png';
import { Tabs, Tab } from "react-bootstrap";
import { getPolicies } from "../../controllers/policy";
import { IPolicy } from "../../interfaces/policy";
import { IDept } from "../../interfaces/dept";
import { toast } from "react-toastify";
import { getUserInfo, loginUser } from "../../controllers/auth";
import CreatePolicyModal from "../../components/modals/createPolicyModal";
import AdminPendingDeleteTab from "../../components/tabs/admintabs/adminPendingDeleteTab";
import AdminDeletedPoliciesTab from "../../components/tabs/admintabs/adminDeletedPoliciesTab";
import ApproverPendingDeleteTab from "../../components/tabs/approvertabs/approverPendingDeleteTab";
import { useNavigate } from "react-router-dom";
import ApproverDeletedPoliciesTab from "../../components/tabs/approvertabs/approverDeletedPoliciesTab";


const ApproverDeletedPoliciesPage = () => {

    
    const [policies, setPolicies] = useState<IPolicy[]>([]);
    const [depts, setDepts] = useState<IDept[]>([]);
    // const [regUsers, setRegUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshComponent,setRefreshComponent] = useState(false);
    const navigate = useNavigate()

    const [totalPolicyCount,setTotalPolicyCount] =useState(0);
    const [totalAttested,setTotalAttested] =useState(0);
    const [totalNotAttested,setTotalNotAttested] =useState(0);
    const [createPolicy,setCreatePolicy] =useState(false);

    const dashCardInfo = [
        {
            title: 'Uploaded Policies',
            img: openBook,
            color : 'primary',
            count: '',
            icon: '',

        },
        {
            title: 'Approved Policies',
            color : 'primary',
            img: checked,
            count: '',
            icon: '',

        },
        {
            title: 'Pending Policies',
            color : 'primary',
            img: timer,
            count: '',
            icon: '',

        },
        {
            title: 'Rejected Policies',
            color : 'danger',
            img: error,
            count: '',
            icon: '',

        },
    ]



    const getAllPolicies = async () => {
        setLoading(true)
        try {
            let userInfo = await getUserInfo();
            let userName = userInfo?.profile?.sub.split('\\')[1]
            const res = await getPolicies(`policy?subsidiaryName=FSDH Merchant Bank`, `${userInfo?.access_token}`);
            if (res?.data) {
                let allAttested:(IPolicy)[] = res?.data.filter((data:IPolicy)=>data.isAuthorized);
                let unAttested:(IPolicy)[] = res?.data.filter((data:IPolicy)=>!data.isAuthorized);
                
                setTotalPolicyCount(res?.data.length);
                setTotalAttested(allAttested.length);
                setTotalNotAttested(unAttested.length)
                setPolicies([]);
                setLoading(false);
            } else {
                setLoading(false);
                // loginUser()
                toast.error('Session expired!, You have been logged out!!')
            }
            // console.log({ gotten: userInfo })({ response: res })
        } catch (error) {

        }
    }

   
    useEffect(()=>{
        getAllPolicies(); 
    },[refreshComponent])
    return (
        <div className="w-100">
            <h5 className="font-weight-bold text-primary" style={{ fontFamily: 'title' }}>Deleted Policies</h5>
            <p>Here, you'll find policies pending deletion and deleted policies.</p>
            {/* <div className="d-flex gap-5">
                {
                    dashCardInfo.map((info, index) => (
                    <DashboardCard key={index} titleColor={info.color} count={info.count} 
                    imgSrc={info.img} 
                    title={info.title} />))
                }
            </div> */}

            <div className="w-100 mt-5">
                <Tabs
                    defaultActiveKey="uploaded"
                    id="uncontrolled-tab-example"
                    variant="underline"
                    className="mb-3"
                >
                    <Tab eventKey="uploaded" title="Policies Pending Deletion"
                    tabClassName="px-3"
                    >
                        <ApproverPendingDeleteTab />
                    </Tab>
                    <Tab eventKey="approved" title="Deleted Policies">
                    <ApproverDeletedPoliciesTab  />
                    </Tab>
                    
                </Tabs>
                
            </div>
            {/* <CreatePolicyModal show={createPolicy} off={()=>setCreatePolicy(false)}/> */}
        </div>
    )

}

export default ApproverDeletedPoliciesPage;