import React, { useCallback, useEffect, useState } from "react";
import notificationIcon from "../../assets/icons/notification-icon.png";
import { Button, Card, ListGroup, ListGroupItem, Modal } from "react-bootstrap";
import {logoutUser } from "../../controllers/auth";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearNav } from "../../store/slices/userSlice";
import { emptyAuthUserNavArray, setUserClass } from "../../store/slices/authUserSlice";
import { toast } from "react-toastify";




const SuperAdminTopbar: React.FC<any> = ({ payload }) => {
    
    const [userType, setUserType] = useState('');
    let userName = localStorage.getItem('userInfo') || '';
    let user = JSON.parse(userName)
    const currentPath = useLocation().pathname;
    const dispatch = useDispatch()
    
    
    const initialTime = 15;
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
        // toast.error('refreshed!')
        setShowModal(false);
        setTimer(initialTime); // Reset time
       
    }, [initialTime]);

    useEffect(() => {
        if (timer === 10) {
            
            handleStay()
        }
    }, [timer]);

    useEffect(() => {
        if (timer === 0) {
            // logoutUser()
        }
    }, [timer]);

    useEffect(() => {
        // getUserType();
    }, [])

    // useEffect(() => {
    //     if (timer === 10) {
    //         setShowModal(true); // Show modal when 10 seconds are left
    //     }
    // }, [timer]);

    useEffect(() => {
        if (timer === 0) {
            handleStay();
        }
    }, [timer]);

    useEffect(() => {
        // getUserType();
    }, []);

    const handleClearNav = ()=>{
        if(currentPath.includes("details")){
            return
        } else {
            dispatch(emptyAuthUserNavArray());
        }
       
    }

    useEffect(()=>{
        handleClearNav()
    },[currentPath])
    return (
        <div
            className="d-flex align-items-center justify-content-between bg-light shadow-sm w-100 px-4 py-3" style={{ fontFamily: 'title' }}>
            <p className="p-0 m-0 text-primary">{user?.user_type=='super_admin'?'Super admin Portal':'Fin-con Portal'}</p>
{/* <p>{timer}</p> */}
            <div className="px-1">
                <div className="d-flex gap-2 px-2 align-items-center">
                <img className="shadow shadow-sm p-1"  src={user?.image} height={'40px'} width={'40px'}  style={{borderRadius:'40px'}}/>
                    
                    <p className="p-0 m-0 text-primary">{`${user?.first_name} ${user?.last_name}`}</p>

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
export default SuperAdminTopbar;