import React, { useEffect, useState } from "react";
import styles from './sidebar.module.css';
import logo from '../../assets/icons/logo1.png';
import { useLocation } from "react-router-dom";
import { useNavigate} from "react-router-dom";
import PromptModal from "../modals/promptModal";
import { getUserInfo, logoutUser } from "../../controllers/auth";
import api from "../../config/api";
import { IPolicy } from "../../interfaces/policy";
import SureToLogoutModal from "../modals/sureToLogoutModal";
import ShowSwtichToUserModal from "../modals/showSwtichToUserModal";

const ApproverSideBar: React.FC<any> = ({ payload }) => {
    const navigate = useNavigate()
    const currentPath = useLocation().pathname;
    const [showPromt,setShowPromt] = useState(false);
    const [policies, setPolicies] = useState<IPolicy[]>([]);

    const [showSwitchToUserModal,setShowSwitchToUserModal] = useState(false);
    const [showlogout,setShowlogout] = useState(false);
    const [loading,setLoading] = useState(false)


    const handleSwitch = ()=>{
        setShowSwitchToUserModal(true)
    }

    const handleAdminSwitch = ()=>{
        window.history.replaceState(null,'',window.location.href)
       navigate('/policy-portal', {replace:true})
    }

    const handleAdminLogout = async () => {
        setShowlogout(true);
    }

    const logUserOut = async () => {
        setLoading(true)
         logoutUser()
    }


    const getInitiatorPolicies = async () => {
        try {
            let userInfo = await getUserInfo();
            
            if (userInfo) {
            let userName = userInfo?.profile?.sub.split('\\')[1]
                const res = await api.get(`Dashboard/authorizer-policy?userName=${userName}`, `${userInfo?.access_token}`);
                if (res?.data) {
                    let allPolicy = res?.data.filter((pol: IPolicy) => pol.markedForDeletion)
                    setPolicies(allPolicy.reverse());
                    // setLoading(false)
                } else if(userInfo?.expired) {
                    // logoutUser()
                }
            }

        } catch (error) {

        }
    }

    

    const navlinksApprover = [
        {
            title: 'Dashboard',
            icon: "bi bi-grid",
            path: '/admn',
            count : ''
        },
        {
            title: 'All Policies',
            icon: "bi bi-card-list",
            path: '/admn/all-policies',
            count : ''
        },
        {
            title: 'Approved Policies',
            icon: "bi bi-journal-check",
            path: '/admn/approved-policies',
            count : ''
        },
        {
            title: 'Pending Policies',
            icon: 'bi bi-hourglass-split',
            path: '/admn/pending-policies',
            count : ''
        },

        {
            title: 'Rejected Policies',
            icon: 'bi bi-journal-x',
            path: '/admn/rejected-policies',
            count : ''
        },
        {
            title: 'Deleted Policies',
            icon: 'bi bi-trash',
            path: '/admn/deleted-policies',
            count : policies.length
        }
    ]

    useEffect(()=>{
        getInitiatorPolicies()
    },[])

   
    return (
        <div className={`min-vh-100 bg-primary ${styles.sidebarContainer}`} style={{ minWidth: '18em' }}>
            <SureToLogoutModal loading={loading} action={logUserOut} show={showlogout} off={()=>setShowlogout(false)}/>
                <ShowSwtichToUserModal show={showSwitchToUserModal} action={handleAdminSwitch} off={()=>setShowSwitchToUserModal(false)}/>
            <div className="d-flex justify-content-center mb-3 py-3  align-items-center w-100">
                <img src={logo} height={'60.15px'} />
            </div>

            <ul
                className={`d-flex text-light px-2 justify-content-start flex-column gap-2 m-0 ${styles.nav}`}
            >
               {
                    navlinksApprover.map((nav, index) => (
                        <li 
                        onClick={()=>navigate(nav.path)}
                        key={index} className="d-flex  align-items-center gap-3 p-0 m-0"
                            style={{ cursor: 'pointer', backgroundColor:currentPath == nav.path?'#236aa9':'',minHeight: '3.5em' }}
                        >
                            {
                                currentPath === nav.path &&
                                <span className="bg-light px-0 h-100 py-2" style={{ minHeight: '3.5em' }}>|</span>}
                            <i className={`$ px-2 ${nav.icon}`}></i>
                            <p className="py-2 m-0">{`${nav.title}`}</p>
                        </li>
                    ))
                }
            </ul>

            <ul className="px-2 mt-3 w-100">
            <li
                    className="d-flex text-light  align-items-center gap-3 p-0 m-0"
                    style={{ cursor: 'pointer'}}
                    onClick={handleSwitch}
                >
                    <span className="bg-light px-0 h-100 py-2" style={{ minHeight: '3.5em' }}></span>
                    <i className="bi bi-arrow-repeat"></i>
                    <p className="py-2 m-0">Switch to User Portal</p>
                </li>

                <li
                    className="d-flex text-light  align-items-center gap-3 p-0 m-0"
                    style={{ cursor: 'pointer' }}
                    onClick={handleAdminLogout}
                >
                    <span className="bg-light px-0 h-100 py-2" style={{ minHeight: '3.5em' }}></span>
                    <i className="bi bi-box-arrow-left"></i>
                    <p className="py-2 m-0">Logout</p>
                </li>
            </ul>
        </div>
    )
}
export default ApproverSideBar;