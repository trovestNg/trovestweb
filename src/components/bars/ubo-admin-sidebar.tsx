import React, { useEffect, useState } from "react";
import styles from './sidebar.module.css';
import logo from '../../assets/icons/logo1.png';
import { useLocation, useNavigate, useNavigation } from "react-router-dom";
import { getUserInfo, loginUser, logoutUser } from "../../controllers/auth";
import PromptModal from "../modals/promptModal";
import SureToLogoutModal from "../modals/sureToLogoutModal";

const UboAdminSideBar: React.FC<any> = ({ payload }) => {
    const currentPath = useLocation().pathname;
    const navigate = useNavigate();
    const [showPromt, setShowPromt] = useState(false);
    const [showApproverPrompt, setApproverPrompt] = useState(false);
    const [userType, setUserType] = useState('');
    const [showlogout,setShowlogout] = useState(false);
    const [loading,setLoading] = useState(false)



    const handleSwitch = () => {
        window.history.replaceState(null, '', window.location.href)
        navigate('/admin', { replace: true })
    }

    const handleAdminSwitch = () => {
        window.history.replaceState(null, '', window.location.href)
        navigate('/admn', { replace: true })
    }

    const handleUserLogout = async () => {
        setShowlogout(true);
    }

    const logUserOut = async () => {
        setLoading(true)
         logoutUser()
    }

    const navlinksUser = [
        {
            title: 'Beneficial owner',
            icon: "bi bi-grid",
            path: '/ubo-portal',
        },
        {
            title: 'BO Risk Assessment',
            icon: 'bi bi-person-gear',
            path: '/bo-risk-assessment',
        },
        {
            title: 'Approved BO (30)',
            icon: "bi bi-journal-check",
            path: '/approved-bo',
        },
        {
            title: 'Pending BO (15)',
            icon: 'bi bi-hourglass',
            path: '/pending-bo',
        },
        {
            title: 'Rejected BO (9)',
            icon: 'bi bi-journal-x',
            path: '/rejected-bo',
        },
        {
            title: 'History',
            icon: 'bi bi-journal-x',
            path: '/history',
        },
        {
            title: 'Reports',
            icon: 'bi bi-journal-x',
            path: '/reports',
        }
    ]

    const getUserType = async () => {
        try {
            let userInfo = await getUserInfo();
            if (userInfo?.profile.role?.includes("DOMAIN1\\GROUP_POLICY_INIT")) {
                setUserType('initiator')
            }
            else if (userInfo?.profile.role?.includes("DOMAIN1\\GROUP_POLICY_AUTH")) {
                setUserType('authorizer')
            } else {
                setUserType('user')
            }

        } catch (error) {

        }

    }

    useEffect(() => {
        getUserType();
    },[])
    return (
        <div className={`min-vh-100 bg-primary ${styles.sidebarContainer}`} style={{ minWidth: '18em' }}>
            <SureToLogoutModal loading={loading} action={logUserOut} show={showlogout} off={()=>setShowlogout(false)}/>
            <PromptModal show={showPromt} off={() => setShowPromt(false)} action={handleSwitch} />
            <PromptModal show={showApproverPrompt} off={() => setApproverPrompt(false)} action={handleAdminSwitch} />

            <div className="d-flex justify-content-center mb-3 py-3  align-items-center w-100">
                <img src={logo} height={'60.15px'} />
            </div>

            <ul
                className={`d-flex text-light px-2 justify-content-start flex-column gap-2 m-0 ${styles.nav}`}
            >
                {
                    navlinksUser.map((nav, index) => (
                        <li
                            onClick={() => navigate(nav.path)}
                            key={index} className="d-flex  align-items-center gap-3 p-0 m-0"
                            style={{ cursor: 'pointer', backgroundColor: currentPath == nav.path ? '#236aa9' : '', minHeight: '3.5em' }}
                        >
                            {
                                currentPath === nav.path &&
                                <span className="bg-light px-0 h-100 py-2" style={{ minHeight: '3.5em' }}>|</span>}
                            <i className={`$ px-2 ${nav.icon}`}></i>
                            <p className="py-2 m-0">{nav.title}</p>
                        </li>
                    ))
                }
            </ul>
            <ul className="px-2 mt-5 w-100">
                {
                    userType == 'authorizer' &&
                    <li
                        className="d-flex text-light  align-items-center gap-3 p-0 m-0"
                        style={{ cursor: 'pointer' }}
                        onClick={() => setApproverPrompt(true)}
                    >
                        <span className="bg-light px-0 h-100 py-2" style={{ minHeight: '3.5em' }}></span>
                        <i className="bi bi-arrow-repeat"></i>
                        <p className="py-2 m-0"
                        >Switch to Admin Portal</p>
                    </li>
                }

                {
                    userType == 'initiator' &&
                    <li
                        className="d-flex text-light  align-items-center gap-3 p-0 m-0"
                        style={{ cursor: 'pointer' }}
                        onClick={() => setShowPromt(true)}
                    >
                        <span className="bg-light px-0 h-100 py-2" style={{ minHeight: '3.5em' }}></span>
                        <i className="bi bi-arrow-repeat"></i>
                        <p className="py-2 m-0"
                        >Switch to Admin Portal</p>
                    </li>
                }

                {
                    userType == 'user' &&
                    ''
                }

                <li
                    className="d-flex text-light  align-items-center gap-3 p-0 m-0"
                    style={{ cursor: 'pointer' }}
                    onClick={handleUserLogout}
                >
                    <span className="bg-light px-0 h-100 py-2" style={{ minHeight: '3.5em' }}></span>
                    <i className="bi bi-box-arrow-left"></i>
                    <p className="py-2 m-0">Logout</p>
                </li>
            </ul>
        </div>
    )
}
export default UboAdminSideBar;