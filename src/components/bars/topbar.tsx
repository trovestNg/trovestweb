import React, { useCallback, useEffect, useState } from "react";
import notificationIcon from "../../assets/icons/notification-icon.png";
import { Button, Card, ListGroup, ListGroupItem, Modal } from "react-bootstrap";
import {  logoutUser, } from "../../controllers/auth";




const TopBar: React.FC<any> = ({ payload }) => {
    const [userType, setUserType] = useState('');
    const [userName, setUserName] = useState('');
    const initialTime = 250;
    // Set initial countdown time here
    const [timer, setTimer] = useState(initialTime);
    const [showModal, setShowModal] = useState(false);

   



    useEffect(() => {
        const timer = setInterval(() => {
            setTimer((prevTime: any) => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    setShowModal(true); // Show modal when time is up
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer); // Cleanup timer on component unmount
    }, []);

    const handleStay = useCallback(() => {
        setShowModal(false);
        setTimer(initialTime); // Reset time
    }, [initialTime]);

    const handleLogout = useCallback(() => {
        setTimer(initialTime); // Reset time
        setShowModal(false); // Hide modal if it's shown
        logoutUser()
    }, [initialTime]);

    useEffect(() => {
        if (timer === 10) {
            setShowModal(true); // Show modal when 10 seconds are left
        }
    }, [timer]);

    useEffect(() => {
        if (timer === 0) {
            logoutUser()
        }
    }, [timer]);

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
                        <Button onClick={handleStay}>Stay logged in</Button>
                        <Button variant="outline border border-2">Logout</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}
export default TopBar;