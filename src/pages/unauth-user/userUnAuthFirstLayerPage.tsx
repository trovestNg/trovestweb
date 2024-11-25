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
// import UnAuthorizedFirstLayerBMOListTab from "../../components/tabs/users-unauth-tabs/unAuthorizedFirstLayerBMOListTab";


const UserUnAuthFirstLayerPage = () => {
    const [policies, setPolicies] = useState<IPolicy[]>([]);
    const [depts, setDepts] = useState<IDept[]>([]);
    // const [regUsers, setRegUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshComponent, setRefreshComponent] = useState(false)

    const [allPol, setAllPol] = useState(0);
    const [attPol, setAttPol] = useState(0);
    const [notAttPol, setNotAttPol] = useState(0);

    const [userDBInfo, setUserDBInfo] = useState<IUserDashboard>()

    const dashCardInfo = [
        {
            title: 'Total Policies',
            img: openBook,
            count: allPol,
            path: '/policy-portal/all-policy',
            icon: '',

        },
        {
            title: 'Attested Policies',
            img: checked,
            count: attPol,
            path: '/policy-portal/attested-policy',
            icon: '',

        },
        {
            title: 'Not Attested Policies',
            img: timer,
            count: notAttPol,
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

    const getAllPolicies = async () => {
        setLoading(true)
        try {
            let userInfo = await getUserInfo();
            let userName = userInfo?.profile?.sub.split('\\')[1]
            const res = await api.get(`Policy/user-policy?userName=${userName}`, `${userInfo?.access_token}`);
            if (res?.data) {
                let allPolicies = res?.data.filter((pol: IPolicy) => !pol.isDeleted)
                let attested = res?.data.filter((pol: IPolicy) =>pol.isAttested && !pol.isDeleted)
                let notAttested = res?.data.filter((pol: IPolicy) => !pol.isAttested && !pol.isDeleted)
                
                console.log({seeHere :notAttested})

                setAllPol(allPolicies.length)
                setAttPol(attested.length)
                setNotAttPol(notAttested.length)
                
                setLoading(false)
            }

        } catch (error) {
            // console.log({ gotten: userInfo })(error)
        }


    }


    useEffect(() => {
        getAllPolicies()
    }, [refreshComponent])
    return (
        <div className="w-100 p-0">
           
            {/* <UnAuthorizedFirstLayerBMOListTab/> */}
           
        </div>
    )

}

export default UserUnAuthFirstLayerPage;