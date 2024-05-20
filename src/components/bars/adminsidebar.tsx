import React, { useState } from "react";
import styles from './sidebar.module.css';
import logo from '../../assets/icons/logo1.png';
import { useLocation } from "react-router-dom";
import { useNavigate} from "react-router-dom";
import PromptModal from "../modals/promptModal";

const AdminSideBar: React.FC<any> = ({ payload }) => {
    const navigate = useNavigate()
    const currentPath = useLocation().pathname;
    const [showPromt,setShowPromt] = useState(false);

    
    const handleSwitch = ()=>{
        window.history.replaceState(null,'',window.location.href)
       navigate('/', {replace:true})
    }

    console.log(currentPath)

    const navlinksAdmin = [
        {
            title: 'Dashboard',
            icon: "bi bi-grid",
            path: '/admin',
        },
        {
            title: 'Create New Policy',
            icon: 'bi bi-plus-circle',
            path: '/admin/create-policy',
        },
        {
            title: 'Uploaded Policies',
            icon: "bi bi-cloud-upload",
            path: '/admin/uploaded-policies',
        },
        {
            title: 'Approved Policies',
            icon: "bi bi-journal-check",
            path: '/admin/approved-policies',
        },
        {
            title: 'Pending Policies',
            icon: 'bi bi-hourglass-split',
            path: '/admin/pending-policies',
        },

        {
            title: 'Rejected Policies',
            icon: 'bi bi-journal-x',
            path: '/admin/rejected-policies',
        },
        {
            title: 'Deleted Policies',
            icon: 'bi bi-trash',
            path: '/admin/deleted-policies',
        }
    ]

    const navlinks = [
        {
            title: 'Dashboard',
            icon: "bi bi-grid",
            path: '',
        },
        {
            title: 'All Policies',
            icon: 'bi bi-card-list',
            path: '',
        },
        {
            title: 'Approved Policies',
            icon: "bi bi-journal-check",
            path: '',
        },
        {
            title: 'Pending Policies',
            icon: 'bi bi-journal-x',
            path: '',
        },
        {
            title: 'Rejected Policies',
            icon: 'bi bi-journal-x',
            path: '',
        },
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
                    navlinksAdmin.map((nav, index) => (
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