import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import style from './sidebar.module.css';
import DisplayMessage from "../Message";
import { user_storage_name, user_storage_token, user_storage_type } from "../../config";
import { setAdminAction } from "../../Reducers/admin.reducer";


const superAdminSideNavList = [
    {
        title: 'Dashboard',
        path: '/superadmin',
        icon: 'bi bi-speedometer2'
    },
    {
        title: 'Admin Management',
        path: '/superadmin/admins',
        icon: 'bi bi-person-workspace'
    },
    {
        title: 'Agent Management',
        path: '/superadmin/agents',
        icon: 'bi bi-person-workspace'
    },
    {
        title: 'Artisan Management',
        path: '/superadmin/clients',
        icon: 'bi bi-person-vcard'
    },
    {
        title: 'Transaction Services',
        path: '/superadmin/transactions',
        icon: 'bi bi-currency-exchange'
    },
    {
        title: 'User Profile',
        path: '/superadmin/profile',
        icon: 'bi bi-person-circle'
    }
]

const adminSideNavList = [
    {
        title: 'Dashboard',
        path: '/admin',
        icon: 'bi bi-speedometer2'
    },

    {
        title: 'Agent Management',
        path: '/admin/agents',
        icon: 'bi bi-person-workspace'
    },

    {
        title: 'Artisan Management',
        path: '/admin/clients',
        icon: 'bi bi-person-vcard'
    },

    {
        title: 'Transaction Services',
        path: '/admin/transactions',
        icon: 'bi bi-currency-exchange'
    },

    {
        title: 'User Profile',
        path: '/admin/profile',
        icon: 'bi bi-person-circle'
    }
]

const PrimarySidebar = ({ userType, userInfo, bgColor }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [refreshData, setRefreshData] = useState(false);

    const location = useLocation().pathname;
    // console.log(location);

    const logUserOut = () => {
        DisplayMessage("logged Out", "success");
        localStorage.removeItem(user_storage_name);
        localStorage.removeItem(user_storage_type);
        localStorage.removeItem(user_storage_token);
        localStorage.removeItem('current_user');
        localStorage.removeItem('userToken');

        const data = {
            agents: [],
            data: {},
            token: "",
        };
        dispatch(setAdminAction(data));
        return navigate("/");
    };

    useEffect(() => {


    }, [refreshData])

    return (
        <div className="d-flex text-light flex-column align-items-center min-vh-100"
            style={{ width: '15em', backgroundColor: userType == 'admin' ? '#3F1038' : '#01065B' }}>
            <div className="d-flex flex-column align-items-center text-center">

                <img
                    className={`${style.pic} m-0 mt-1 bg-light shadow-sm`}
                    src={userInfo?.image}
                    alt="Profile Pic"
                />
                <p className="fontweight-bold m-0 mt-3">{`${userInfo?.first_name} ${userInfo?.last_name}`}</p>
                <p className=" m-0 fontweight-bold">{userType == 'admin' ? 'Trovest Administrator' :
                    userType == 'super_admin' ? 'Super Admin' : userType == 'fin_con' ? 'Trovest Fincon' : 'Fin Con'
                }</p>

                <p className="fontweight-bold m-0">{`TRV/AD-${userInfo?._id.slice(19)}`}</p>
            </div>

            <ul className="w-100 d-flex flex-column text-light p-0 mt-3 gap-2" style={{ listStyle: 'none' }}>
                {
                    userType == 'admin' ? adminSideNavList.map((nav, index) =>
                        <li 
                        onClick={()=>navigate(`${nav.path}`)}
                        key={index}
                            style={{
                                listStyle: 'none',
                                minHeight: '4em',
                                cursor: 'pointer',
                                backgroundColor: location == nav.path ? "#622459" : null
                            }}
                            className={`${style.navLink} d-flex align-items-center px-3 gap-2`}>
                            {location == nav.path ? <span className="h-100 bg-light py-2">1</span> : ''}
                            <i className={nav.icon}></i>
                            {nav.title}
                        </li>)
                        :
                        superAdminSideNavList.map((nav, index) =>
                        <li 
                        onClick={()=>navigate(`${nav.path}`)}
                        key={index}
                            style={{
                                listStyle: 'none',
                                minHeight: '4em',
                                cursor: 'pointer',
                                backgroundColor: location == nav.path ? "#2B2E6B" : null
                            }}
                            className={`${style.navLink} d-flex align-items-center px-3 gap-2`}>
                            {location == nav.path ? <span className="h-100 bg-light py-2">1</span> : ''}
                            <i className={nav.icon}></i>
                            {nav.title}
                        </li>)
                }
            </ul>

            <div className="w-100">
                <li
                    style={{
                        listStyle: 'none',
                        cursor: 'pointer',
                    }}
                    className={`${style.navLink} d-flex py-3 px-3 gap-2`}
                    onClick={logUserOut}
                >
                    <i className="bi bi-box-arrow-left"></i>
                    {'Logout'}

                </li>
            </div>

            <p 
            className="w-100 text-center mt-3"
            style={{fontSize:'0.8em'}}
            >ToveMinds v 2.0<br /> Support : +2348166064166</p>

        </div>
    )

}

export default PrimarySidebar;