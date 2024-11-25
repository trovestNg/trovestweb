import React, { useEffect } from 'react'
import Header from '../Shared/Header/Header';
import LoginView from '../Shared/LoginView/LoginView';
import Login from '../Login/Index'
import style from './home.module.css'
import Intro from '../../Assets/Images/Intro.png'
import woman from '../../Assets/Images/woman.png'
import nature from '../../Assets/Images/nature.png'
import balance from '../../Assets/Images/balance.png'
import supervisor from '../../Assets/Images/supervisor.png'
import Footer from '../Footer/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { user_storage_token } from '../../config';
import { Link, redirect, useNavigate } from "react-router-dom";


export default function Index() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { auth } = useSelector(state => state)
    const adminToken = localStorage.getItem(user_storage_token)
    useEffect(() => {
        if (adminToken !== null) {
            navigate('/dashboard')
        }
    }, [])

    return (
        <>
            <div className={style.large}>
                <div className={style.mobile}>
                    <Header />
                    <div className={style.container}>
                        <div className={`${style['home-view']}`}>
                            <div className={style.introView}>
                                <img src={Intro} alt="tro-vest" className={style.intro} />
                                <p className={style.saving}>SAVING MADE EASY</p>
                            </div>
                        </div>
                    </div>
                    {/* <div className={style.container1}>
                    <img src={woman} alt="tro-vest-woman" className={style.woman} />
                    <div className={style.information}>
                        <div className={style.informationtext}>
                            <h3>Enjoy Saving Just the Way you know it.</h3>
                            <h6>We are committed to always bring you wonderful deals on Various savings and investment scheme</h6>
                        </div>
                        <div className={style.trustgrid}>
                            <div className={style.card}>
                                <img src={nature} alt="tro-vest" className={style.trust} />
                                <p className='saving'>Trusted</p>
                            </div>
                            <div className={style.card}>
                                <img src={balance} alt="tro-vest" className={style.trust1} />
                                <p className='saving'>Safe</p>
                            </div>
                            <div className={style.card}>
                                <img src={supervisor} alt="tro-vest" className={style.trust2} />
                                <p className='saving'>Reliable</p>
                            </div>
                        </div>
                    </div>
                </div> */}
                </div>
                <div className={style['login-view']}>
                    <LoginView navigate={navigate} />
                </div>
            </div>
            {/* <Footer /> */}
        </>
    )
}
