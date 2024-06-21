import React, { useEffect, useState } from "react";
import notificationIcon from "../../assets/icons/notification-icon.png";
import { Card, ListGroup, ListGroupItem } from "react-bootstrap";
import { getUserInfo } from "../../controllers/auth";




const TopBar: React.FC<any> = ({ payload }) => {
    const [userType, setUserType] = useState('');
    const getUserType = async () => {
        try {
            let userInfo = await getUserInfo();
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
    },[])
    return (
        <div
            className="d-flex align-items-center justify-content-between bg-light shadow-sm w-100 px-4 py-3" style={{ fontFamily: 'title' }}>
            <p className="p-0 m-0 text-primary">Policy Portal</p>

            <div className="px-1">
                <div className="d-flex gap-2">
                <div className="table-icon m-0" >
                {/* <img src={notificationIcon} height={'40px'} /> */}
                <i className="bi bi-person-circle text-primary" style={{fontSize:'1.2em'}}></i>
                {/* <div className="content ml-5" style={{ position: 'relative' }}>

                    <Card className="p-2  shadow-sm rounded border-0"
                        style={{ minWidth: '15em', marginLeft: '-10em', position: 'absolute', fontFamily:'primary' }}>
                        <ListGroup>
                            <ListGroupItem className="multi-layer">
                                <span className="w-100 d-flex justify-content-between">
                                    <div className="d-flex gap-2">
                                        <i className="bi bi-plus"></i>
                                        New unattested
                                    </div>

                                    <i className="bi bi-chevron-right"></i>
                                </span>
                            </ListGroupItem>
                        </ListGroup>
                    </Card>
                </div> */}
                </div>
                <p className="p-0 m-0">{payload?.fullname}</p>
                </div>
                <div>
                <p className="p-0 m-0 px-5" style={{fontFamily:'primary'}}>{userType}</p>
                </div>
                
            </div>
            
        </div>
    )
}
export default TopBar;