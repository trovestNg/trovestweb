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
import { useNavigate } from "react-router-dom";
import api from "../../config/api";


const AdminDeletedPoliciesPage = () => {
    const [policies, setPolicies] = useState<IPolicy[]>([]);
    const [depts, setDepts] = useState<IDept[]>([]);
    // const [regUsers, setRegUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshComponent,setRefreshComponent] = useState(false);
    const navigate = useNavigate()

    const [pendingDel,setPendingDel] = useState<any>(0);
    const [delPol,setDelPol] = useState<any>(0);
    const [totalNotAttested,setTotalNotAttested] =useState(4);
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



    const getInitiatorPolicies = async () => {
        setLoading(true)
        try {
            let userInfo = await getUserInfo();

            if (userInfo) {
                let userName = userInfo?.profile?.sub.split('\\')[1]
                const res = await api.get(`Dashboard/initiator-policy?userName=${userName}`, `${userInfo.access_token}`);
                if (res?.data) {
                    let delPolicy = res?.data.filter((pol: IPolicy) => pol.isDeleted)
                    let pendingDelPolicy = res?.data.filter((pol: IPolicy) => pol.markedForDeletion)
                    setDelPol(delPolicy.length)
                    setPendingDel(pendingDelPolicy.length)
                    setLoading(false)
                } else {
                    // loginUser()
                    // toast.error('Session expired!, You have been logged out!!')
                }

            }

        } catch (error) {

        }
    }

   
    useEffect(()=>{
        getInitiatorPolicies(); 
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
                    <Tab eventKey="uploaded" title={`Policies Pending Deletion (${pendingDel})`}
                    tabClassName="px-3"
                    >
                        <AdminPendingDeleteTab handleCreatePolicy={ ()=>navigate('/admin/create-policy')} />
                    </Tab>
                    <Tab eventKey="approved" title={`Deleted Policies (${delPol})`}>
                    <AdminDeletedPoliciesTab handleCreatePolicy={ ()=>navigate('/admin/create-policy')} />
                    </Tab>
                    
                </Tabs>
                
            </div>
            <CreatePolicyModal show={createPolicy} off={()=>setCreatePolicy(false)}/>
        </div>
    )

}

export default AdminDeletedPoliciesPage;