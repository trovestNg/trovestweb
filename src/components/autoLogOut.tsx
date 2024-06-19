import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginUser } from '../controllers/auth';

const AutoLogout = ({ timeout = 10000 }) => {
  const [timer, setTimer] = useState<any>(null);
  const [ref,setRef] = useState(false)
  const navigate = useNavigate();
  

  const resetTimer = () => {
    if (timer) {
      clearTimeout(timer);
    }
    setTimer(setTimeout(logout, timeout));
  };

  const logout = () => {
    // Perform any logout logic here, like clearing tokens
    toast.success('Session expired!');
    localStorage.clear()
    loginUser()
  };

  useEffect(() => {
    resetTimer();

    // Events to reset the timer
    const events = ['click', 'mousemove', 'keypress'];

    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    return () => {
      // Cleanup the events and timer on component unmount
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [timer]);

  return null; // This component doesn't render anything
};

export default AutoLogout;
