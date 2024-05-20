import React, { useState } from "react";
import styles from './sidebar.module.css';
import logo from '../../assets/icons/logo1.png';
import { useLocation, useNavigate, useNavigation } from "react-router-dom";
import { logoutUser } from "../../controllers/auth";
import PromptModal from "../modals/promptModal";

const UserSideBar: React.FC<any> = ({ payload }) => {
    const currentPath = useLocation().pathname;
    const user = localStorage.getItem('loggedInUser') || '';
    const userInfo = JSON.parse(user);
    const navigate = useNavigate();
    const [showPromt,setShowPromt] = useState(false);

    console.log(currentPath)

   
    const handleSwitch = ()=>{
        window.history.replaceState(null,'',window.location.href)
       navigate('/admin', {replace:true})
    }

    const handleUserLogout = async ()=>{
        // navigate('/logout', {replace:true});
        // console.log(JSON.stringify(localStorage))
        // localStorage.clear()
        const res = await logoutUser();

        // window.history.pushState(null, '', window.location.href);
        // window.onpopstate = function(event) {
        //   window.history.go(1);
          
        // };

        // window.history.replaceState(null,'',window.location.href)
        
        
       
        
        // // console.log(res);
        
    }
    const navlinksUser = [
        {
            title: 'Dashboard',
            icon: "bi bi-grid",
            path: '/policy-portal',
        },
        {
            title: 'All Policies',
            icon: 'bi bi-card-list',
            path: '/policy-portal/all-policy',
        },
        {
            title: 'Attested Policies',
            icon: "bi bi-journal-check",
            path: '/policy-portal/attested-policy',
        },
        {
            title: 'Not Attested Policies',
            icon: 'bi bi-journal-x',
            path: '/policy-portal/unattested-policy',
        }
    ]
    return (
        <div className={`min-vh-100 bg-primary ${styles.sidebarContainer}`} style={{ minWidth: '18em' }}>
            <PromptModal show={showPromt} off={()=>setShowPromt(false)} action={handleSwitch}/>
            <div className="d-flex justify-content-center mb-3 py-3  align-items-center w-100">
                <img src={logo} height={'60.15px'} />
            </div>

            <ul
                className={`d-flex text-light px-2 justify-content-start flex-column gap-2 m-0 ${styles.nav}`}
            >
                {
                    navlinksUser.map((nav, index) => (
                        <li 
                        onClick={()=>navigate(nav.path)}
                        key={index} className="d-flex  align-items-center gap-3 p-0 m-0"
                            style={{ cursor: 'pointer', backgroundColor:currentPath == nav.path?'#236aa9':'',minHeight: '3.5em' }}
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

            <ul className="px-2 mt-3 w-100">
                {
                    userInfo?.profile?.department !=='Info Tech'?'':                 
                    <li
                    className="d-flex text-light  align-items-center gap-3 p-0 m-0"
                    style={{ cursor: 'pointer'}}
                    onClick={()=>setShowPromt(true)}
                >
                    <span className="bg-light px-0 h-100 py-2" style={{ minHeight: '3.5em' }}></span>
                    <i className="bi bi-arrow-repeat"></i>
                    <p className="py-2 m-0"
                    >Switch to Admin Portal</p>
                </li>}

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
export default UserSideBar;