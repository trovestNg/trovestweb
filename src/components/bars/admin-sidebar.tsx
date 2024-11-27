import React, { useEffect, useState } from "react";
import styles from './sidebar.module.css';
import logo from '../../assets/images/tro-light-logo.png';
import { useLocation, useNavigate, useNavigation } from "react-router-dom";
import { getUserInfo, loginUser, logoutUser } from "../../controllers/auth";
import PromptModal from "../modals/promptModal";
import SureToLogoutModal from "../modals/sureToLogoutModal";
import { useDispatch } from "react-redux";
import { setUserClass } from "../../store/slices/authUserSlice";

const AdminSideBar: React.FC<any> = ({ payload }) => {
    const currentPath = useLocation().pathname;
    const navigate = useNavigate();
    const [showPromt, setShowPromt] = useState(false);
    const [showApproverPrompt, setApproverPrompt] = useState(false);
    const [userType, setUserType] = useState('');
    const [showlogout,setShowlogout] = useState(false);
    const [loading,setLoading] = useState(false);
    const dispatch = useDispatch()



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
            title: 'Dashboard',
            icon: "bi bi-grid",
            path: '/admin',
        },
        {
            title: 'Agent Management',
            icon: 'bi bi-person-gear',
            path: '/admin/agent-management',
        },
        {
            title: 'Atisan Management',
            icon: "bi bi-journal-check",
            path: '/admin/customer-management',
        },
        {
            title: 'Transactions',
            icon: 'bi bi-journal-x',
            path: '/admin/transaction-management',
        },
        {
            title: 'Reports',
            icon: 'bi bi-journal-x',
            path: '/admin/report',
        },
        {
            title: 'Settings',
            icon: 'bi bi-gear',
            path: '/admin/settings',
        }
        
    ]

    
    return (
        <div className={`min-vh-100 bg-secondary ${styles.sidebarContainer}`} style={{ minWidth: '18em' }}>
            <SureToLogoutModal loading={loading} action={logUserOut} show={showlogout} off={()=>setShowlogout(false)}/>
            <PromptModal show={showPromt} off={() => setShowPromt(false)} action={handleSwitch} />
            <PromptModal show={showApproverPrompt} off={() => setApproverPrompt(false)} action={handleAdminSwitch} />

            <div className="d-flex justify-content-center mb-3 py-3  align-items-center w-100">
                <img src={logo} height={'80px'} />
            </div>

            <ul
                className={`d-flex text-light px-2 justify-content-start flex-column gap-2 m-0 ${styles.nav}`}
            >
                {
                    navlinksUser.map((nav, index) => (
                        <li
                            onClick={() => navigate(nav.path)}
                            key={index} className="d-flex  align-items-center gap-3 p-0 m-0"
                            style={{ cursor: 'pointer', backgroundColor: currentPath == nav.path ? '#5F2156' : '', minHeight: '3.5em' }}
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
                {/* {
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
                } */}

                {/* {
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
                } */}

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
export default AdminSideBar;