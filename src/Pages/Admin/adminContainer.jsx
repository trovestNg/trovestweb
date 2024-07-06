import React, { useEffect, useState } from "react";
import { Outlet,useNavigate } from "react-router-dom";
import style from './adminCont.module.css';
import PrimarySidebar from "../../Components/sidebar/sidebar";
import DisplayMessage from "../../Components/Message";
import { 
    user_storage_name,user_storage_type,user_storage_token
 } from "../../config";
 import { useDispatch } from "react-redux";
 import { setAdminAction } from "../../Reducers/admin.reducer";
import { Button } from "react-bootstrap";

const AdminContainer = (currentUser) => {
    const userToken = localStorage.getItem('userToken') || '';
    const userInfo =localStorage.getItem(user_storage_name);
    const userData = JSON.parse(userInfo);
    
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const logUserOut = () => {
        DisplayMessage("logged Out", "success");
        localStorage.removeItem(user_storage_name);
        localStorage.removeItem(user_storage_type);
        localStorage.removeItem(user_storage_token);
        localStorage.removeItem('jsonData');
        localStorage.removeItem('current_user')
    
        const data = {
          agents: [],
          data: {},
          token: "",
        };
        dispatch(setAdminAction(data));
        return navigate("/");
      };

    useEffect(() => {
        if (
            (userToken === null && (currentUser === null || currentUser.user_type !== "admin")) 
          ) {
            alert("Unauthorized Access");
            logUserOut();
          } else {
            return ;
          }
    }, [userToken])

    return (
        <div className={`adcontainer ${style.superAdcontainer}`} id="adcontainer" style={{ fontFamily: 'primary-font' }}>
            <div className="sideBar">
                <PrimarySidebar userType={'admin'} userInfo={userData} />
            </div>
            <div className="w-100">
                <div className="shadow-sm d-flex align-items-center px-4" style={{ height: '5em',backgroundColor:'#fff' }}>
                    <Button 
                    onClick={()=>navigate(-1)}
                    variant="grey border py-2" style={{maxWidth:'6em'}}>Go Back</Button>
                </div>
                <div className="p-2" style={{ height: '90vh', overflow: 'scroll' }}>
                    {
                        <Outlet />
                    }
                </div>
            </div>
        </div>
    )

}
export default AdminContainer;