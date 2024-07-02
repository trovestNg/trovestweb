import React, { useEffect, useState } from "react";
import notificationIcon from "../../assets/icons/notification-icon.png";
import { Card, ListGroup, ListGroupItem } from "react-bootstrap";
import { getUserInfo } from "../../controllers/auth";




const TopBar: React.FC<any> = ({ payload }) => {
    const [userType, setUserType] = useState('');
    const [userName, setUserName] = useState('');
    const getUserType = async () => {
        try {
            let userInfo = await getUserInfo();
            if (userInfo) {
                setUserName(`${userInfo?.profile?.given_name} ${userInfo?.profile?.family_name}`)
            }
            if (userInfo?.profile.role?.includes("DOMAIN1\\GROUP_POLICY_INIT")) {
                setUserType('Initiator')
            }
            else if (userInfo?.profile.role?.includes("DOMAIN1\\GROUP_POLICY_AUTH")) {
                setUserType('Authorizer')
            } else {
                setUserType('User')
            }

        } catch (error) {

        }

    }

    useEffect(() => {
        getUserType();
    }, [])
    return (
        <div
            className="d-flex align-items-center justify-content-between bg-light shadow-sm w-100 px-4 py-3" style={{ fontFamily: 'title' }}>
            <p className="p-0 m-0 text-primary">Policy Portal</p>

            <div className="px-1">
                <div className="d-flex gap-2 px-2">
                    <div className="table-icon m-0 p-0 d-flex align-items-center" >
                        {/* <img src={notificationIcon} height={'40px'} /> */}
                        <i className="bi bi-person-circle text-primary" style={{ fontSize: '1.5em' }}></i>
                    </div>
                    <div>
                    <p className="p-0 m-0">{userName}</p>
                    <p className="p-0 m-0" style={{ fontFamily: 'primary' }}>{userType}</p>
                    </div>
                    
                </div>
                <div>
                   
                </div>

            </div>

        </div>
    )
}
export default TopBar;