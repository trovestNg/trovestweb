import React, { useCallback, useEffect, useState } from "react";
import notificationIcon from "../../assets/icons/notification-icon.png";
import { Button, Card, ListGroup, ListGroupItem, Modal } from "react-bootstrap";
import { getUserInfo, loginUser, logoutUser } from "../../controllers/auth";




const TopBar: React.FC<any> = ({ payload }) => {
    const [userType, setUserType] = useState('');
    const [userName, setUserName] = useState('');
    const initialTime = 20; // Set initial countdown time here
    const [timer,setTimer] = useState(initialTime);
    const [showModal, setShowModal] = useState(false);

    const getUserType = async () => {
        try {
            let userInfo = await getUserInfo();
            // console.log({him:userInfo})
            if (userInfo?.expired) {
                loginUser();
            }

            if (userInfo?.profile.given_name == null) {
                loginUser();
            }
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
            loginUser();
        }

    }

   

    // useEffect(() => {
    //     const timer = setInterval(() => {
    //       setTimer((prevTime:any) => {
    //         if (prevTime <= 1) {
    //           clearInterval(timer);
    //           setShowModal(true); // Show modal when time is up
    //           return 0;
    //         }
    //         return prevTime - 1;
    //       });
    //     }, 1000);
    
    //     return () => clearInterval(timer); // Cleanup timer on component unmount
    //   }, []);
    
    //   const handleStay = useCallback(() => {
    //     setTimer(initialTime); // Reset time
    //     setShowModal(false); // Hide modal if it's shown
    //   }, [initialTime]);
    
    //   useEffect(() => {
    //     if (timer === 10) {
    //       setShowModal(true); // Show modal when 10 seconds are left
    //     }
    //   }, [timer]);

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
<Modal show={showModal} >
<Modal.Body className="p-4 gap-3">
   
    {` You will be logged out in : `}
    <p className="fs-1 text-danger">{timer}s</p>
    <div className="d-flex gap-3 mt-5 w-100 text-end justify-content-end">
        <Button >Stay logged in</Button>
        <Button variant="outline border border-2">Logout</Button>
    </div>
</Modal.Body>
</Modal>
        </div>
    )
}
export default TopBar;