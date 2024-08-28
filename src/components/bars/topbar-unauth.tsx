import React, { useCallback, useEffect, useState } from "react";
import logoIcon from "../../assets/images/fsdh-logo-blue.png";
import { Button, Card, ListGroup, ListGroupItem, Modal, Spinner } from "react-bootstrap";
import { getUserInfo, loginUser, logoutUser, refreshToken } from "../../controllers/auth";




const TopBarUnAuth: React.FC<any> = ({ payload }) => {
    const [loading,setLoading] = useState(false)
    // const [userType, setUserType] = useState('');
    // const [userName, setUserName] = useState('');
    // const initialTime = 250;
    // // Set initial countdown time here
    // const [timer, setTimer] = useState(initialTime);
    // const [showModal, setShowModal] = useState(false);

    // const getUserType = async () => {
    //     try {
    //         let userInfo = await getUserInfo();
    //         // console.log({him:userInfo})
    //         if (userInfo?.expired) {
    //             logoutUser();
    //         }

    //         if (userInfo?.profile.given_name == null) {
    //             logoutUser();
    //         }
    //         if (userInfo) {
    //             setUserName(`${userInfo?.profile?.given_name} ${userInfo?.profile?.family_name}`)
    //         }
    //         if (userInfo?.profile.role?.includes("DOMAIN1\\GROUP_POLICY_INIT")) {
    //             setUserType('Initiator')
    //         }
    //         else if (userInfo?.profile.role?.includes("DOMAIN1\\GROUP_POLICY_AUTH")) {
    //             setUserType('Authorizer')
    //         } else {
    //             setUserType('User')
    //         }

    //     } catch (error) {
    //         logoutUser()
    //     }

    // }



    // useEffect(() => {
    //     const timer = setInterval(() => {
    //         setTimer((prevTime: any) => {
    //             if (prevTime <= 1) {
    //                 clearInterval(timer);
    //                 setShowModal(true); // Show modal when time is up
    //                 return 0;
    //             }
    //             return prevTime - 1;
    //         });
    //     }, 1000);

    //     return () => clearInterval(timer); // Cleanup timer on component unmount
    // }, []);

    // const handleStay = useCallback(() => {
    //     setShowModal(false);
    //     setTimer(initialTime); // Reset time
    //     refreshToken();
    // }, [initialTime]);

    // const handleLogout = useCallback(() => {
    //     setTimer(initialTime); // Reset time
    //     setShowModal(false); // Hide modal if it's shown
    //     logoutUser()
    // }, [initialTime]);

    const handleLogin = ()=>{
        setLoading(true)
        loginUser()
    };

    // useEffect(() => {
    //     if (timer === 10) {
    //         setShowModal(true); // Show modal when 10 seconds are left
    //     }
    // }, [timer]);

    // useEffect(() => {
    //     if (timer === 0) {
    //         logoutUser()
    //     }
    // }, [timer]);

    // useEffect(() => {
    //     getUserType();
    // }, [])
    return (
        <div
            className="d-flex align-items-center justify-content-between bg-light shadow-sm w-100 px-4 py-3" style={{ fontFamily: 'title' }}>
            <div className="d-flex align-items-center gap-4 w-25">
                <img src={logoIcon} height={'40px'} className="d-flex align-items-center" />
                <p className="p-0 m-0 text-primary">Beneficial Owner Portal</p>
            </div>


            <div className="px-1">
                <div className="d-flex gap-2 px-2">
                    <Button style={{minWidth:'8em'}} onClick={handleLogin} className="py-2 px-4 rounded rounded-2">{loading?<Spinner size="sm"/>:'Login'}</Button>
                    {/* <div className="table-icon m-0 p-0 d-flex align-items-center" >
                        
                        <i className="bi bi-person-circle text-primary" style={{ fontSize: '1.5em' }}></i>
                    </div>
                    <div>
                        <p className="p-0 m-0">{'hello'}</p>
                        <p className="p-0 m-0" style={{ fontFamily: 'primary' }}>{'hi there'}</p>
                    </div> */}

                </div>
                <div>

                </div>

            </div>

            {/* <Modal show={showModal} >
                <Modal.Body className="p-4 gap-3">

                    {` You will be logged out in : `}
                    <p className="fs-1 text-danger">{timer}s</p>
                    <div className="d-flex gap-3 mt-5 w-100 text-end justify-content-end">
                        <Button onClick={handleStay}>Stay logged in</Button>
                        <Button variant="outline border border-2">Logout</Button>
                    </div>
                </Modal.Body>
            </Modal> */}
        </div>
    )
}
export default TopBarUnAuth;