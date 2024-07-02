import React, { useEffect, useState } from "react";
import { Container, Modal, Card, Button, Spinner } from "react-bootstrap";
import DashboardCard from "../../components/cards/dashboard-card";
import openBook from '../../assets/images/open-book.png'
import checked from '../../assets/images/check.png';
import timer from '../../assets/images/deadline.png';
import error from '../../assets/images/error.png';
import { Tabs, Tab } from "react-bootstrap";
import UserAllPoliciesTab from "../../components/tabs/userTabs/user-all-policies-tab";
import UserNotAttestedPoliciesTab from "../../components/tabs/userTabs/user-not-attested-policies-tab";
import UserAttestedPoliciesTab from "../../components/tabs/userTabs/attested-policies-tab";
import { getPolicies } from "../../controllers/policy";
import { IPolicy } from "../../interfaces/policy";
import { IUserDashboard } from "../../interfaces/user";
import { IDept } from "../../interfaces/dept";
import { toast } from "react-toastify";
import { getUserInfo, loginUser, logoutUser } from "../../controllers/auth";
import api from "../../config/api";


const UserDashboardPage = () => {
    const [policies, setPolicies] = useState<IPolicy[]>([]);
    const [depts, setDepts] = useState<IDept[]>([]);
    // const [regUsers, setRegUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshComponent, setRefreshComponent] = useState(false)

    const [totalPolicyCount, setTotalPolicyCount] = useState(0);
    const [totalAttested, setTotalAttested] = useState(0);
    const [totalNotAttested, setTotalNotAttested] = useState(0);
    const [userDBInfo, setUserDBInfo] = useState<IUserDashboard>()

    const dashCardInfo = [
        {
            title: 'Total Policies',
            img: openBook,
            count: userDBInfo?.totalPolicy,
            path: '/policy-portal/all-policy',
            icon: '',

        },
        {
            title: 'Attested Policies',
            img: checked,
            count: userDBInfo?.totalAttested,
            path: '/policy-portal/attested-policy',
            icon: '',

        },
        {
            title: 'Not Attested Policies',
            img: timer,
            count: userDBInfo?.totalNotAttested,
            path: '/policy-portal/unattested-policy',
            icon: '',

        }

    ]



    const getUserDashboard = async () => {
        setLoading(true)
        try {
            let userInfo = await getUserInfo();
            let userName = userInfo?.profile?.sub.split('\\')[1]
            const res = await getPolicies(`Dashboard/user?userName=${userName}`, `${userInfo?.access_token}`);
            // console.log({ gotten: userInfo })({ hereIsMe: res });
            if (res?.data) {
                setUserDBInfo(res?.data);
                setLoading(false);
            } else {
                setLoading(false);
            }


        } catch (error) {
            // console.log({ gotten: userInfo })(error)
        }
    }


    useEffect(() => {
        getUserDashboard();
    }, [refreshComponent])
    return (
        <div className="w-100">
            <h5 className="font-weight-bold text-primary" style={{ fontFamily: 'title' }}>Dashboard</h5>
            {
                loading ?
                    <div className="d-flex justify-content-center flex-column align-items-center">
                        <Spinner className="spinner-grow text-primary" />
                        <p>Loading</p>
                    </div>
                    :
                    <div className="d-flex gap-5">
                        {
                            dashCardInfo.map((info, index) => (
                                <DashboardCard key={index} count={info.count}
                                    imgSrc={info.img}
                                    title={info.title}
                                    url={info.path}
                                />))
                        }
                    </div>

            }


            <div className="mt-5">
                <Tabs
                    defaultActiveKey="all-policies"
                    id="uncontrolled-tab-example"
                    variant="underline"
                    className="mb-3 gap-5"
                >
                    <Tab eventKey="all-policies" title="All Policies"
                        tabClassName=""
                    >
                        <UserAllPoliciesTab />
                    </Tab>

                    <Tab eventKey="pending" title="Attested Policy">
                        <UserAttestedPoliciesTab />
                    </Tab>

                    <Tab eventKey="not-attested" title="Not Attested Policy">
                        <UserNotAttestedPoliciesTab />
                    </Tab>
                    

                </Tabs>

            </div>
        </div>
    )

}

export default UserDashboardPage;