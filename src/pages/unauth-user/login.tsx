import React, { useEffect, useState } from "react";
import TopBar from "../../components/bars/topbar";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import UserSideBar from "../../components/bars/userSidebar";
import { getPolicies } from "../../controllers/policy";
import { IUserDashboard } from "../../interfaces/user";
import { toast } from "react-toastify";
import { Button, Image, Spinner } from "react-bootstrap";
import tovmindGif from '../../assets/Gifs/troveMinds.gif';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { object, string, number, date, InferType } from 'yup';
import style from './login.module.css'
import api from "../../config/api";
import apiUnAuth from "../../config/apiUnAuth";



const LoginPage = () => {
    const redUrl = process.env.REACT_APP_CALLBACK
    const [loading, setLoading] = useState(false);
    const [refreshComponent, setRefreshComponent] = useState(false)
    const [userDBInfo, setUserDBInfo] = useState<IUserDashboard>();
    const [userFullName, setUserFullName] = useState<string>('');
    const [userType, setUserType] = useState<string>('');
    const navigate = useNavigate();
    const [secureText, setSecureText] = useState(false)


    // const getUserDashboard = async () => {
    //     try {
    //         let userInfo = await getUserInfo();
    //         console.log({userCred:userInfo})
    //         if(userInfo?.expired) {
    //             toast.error('Session timed out!');
    //             await loginUser()
    //         } else if(userInfo?.profile){
    //             let userName = userInfo?.profile?.sub.split('\\')[1];
    //             let fullName = `${userInfo?.profile?.family_name} ${userInfo?.profile?.given_name}`

    //             const res = await getPolicies(`Dashboard/user?userName=${userName}`, `${userInfo?.access_token}`);
    //             if (res?.data) {
    //                 setUserDBInfo(res?.data);
    //                 setLoading(false);
    //             } else {
    //                 toast.error('Network error!');
    //                 setLoading(false);
    //             }

    //         } else {
    //         //    await loginUser()
    //         }
    //     } catch (error) {
    //        console.log(error) 
    //     }
    // }

    // useEffect(() => {
    //     getUserDashboard();
    // }, [refreshComponent])

    // useEffect(() => {
    //     // checkUserStatus()
    //     window.history.replaceState(null, '', window.location.href);
    //     window.onpopstate = function (event) {
    //         window.history.go(2);
    //     };
    // })

    // useEffect(() => {
    //     console.log({ RedirectingTo: redUrl })
    // })

    interface IUserType {
        title: string,
        value: string
    }
    const userTypes: IUserType[] = [
        {
            title: 'Super Admin',
            value: 'super_admin'
        },
        {
            title: 'Admin',
            value: 'admin'
        },
        {
            title: 'Fincon',
            value: 'fincon'
        },
    ]
    const initialVal: LoginCred = {
        email: '',
        password: '',
        user_type: ''
    }



    let validationSchem = object({
        email: string().email().required().label('Email'),
        password: string().required().label('Password'),
        user_type: string().required().label('User Type'),
    });

    interface LoginCred {
        email: string,
        password: string,
        user_type: string
    }
    const handleUserLogin = async (loginCred: LoginCred) => {

        if (loginCred.user_type == 'super_admin') {

            try {
                setLoading(true)
                const res = await apiUnAuth.post('super/login-super-admin', loginCred);
                // if(loginCred.user_type=='fincon'){
                //     localStorage.setItem('userType','fincon');
                // }
                if (res?.data?.success) {
                    setLoading(false)
                    toast.success(res?.data?.message);
                    localStorage.setItem('userInfo',JSON.stringify(res?.data?.data));
                    localStorage.setItem('token',JSON.stringify(res?.data?.token));
                    navigate('/superadmin')
                } else {
                    setLoading(false)
                    toast.error('Network error')
                }

            } catch (error:any) {
                // console.log(error)
                toast.error('Network error')
                setLoading(false)
            }

        };

        if (loginCred.user_type == 'admin') {

            try {
                setLoading(true)
                const res = await apiUnAuth.post('admin/login-admin', loginCred);
                console.log(res)
                if (res?.data?.success) {
                    setLoading(false)
                    toast.success(res?.data?.message);
                    localStorage.setItem('userInfo',JSON.stringify(res?.data?.data));
                    localStorage.setItem('token',JSON.stringify(res?.data?.token));
                    navigate('/admin')
                } else {
                    setLoading(false)
                    toast.error('Network error!')
                }

            } catch (error) {
                console.log(error)
                setLoading(false)
            }

        }

    }

    const handlePasswordField = () => {
        setSecureText(!secureText)
    }

    return (
        <div className="p-0 m-0 min-vh-100 w-100 d-flex">
            <div className=" w-50 d-flex justify-content-center align-items-center">
                <Image height={350} src={tovmindGif} />
            </div>
            <div className={`w-50 d-flex justify-content-center align-items-center ${style.right}`}>
                <Formik
                    initialValues={initialVal}
                    validationSchema={validationSchem}
                    validateOnBlur
                    onSubmit={(val: LoginCred) => handleUserLogin(val)
                    }
                >{
                        ({ handleChange, handleSubmit, handleReset, values }) => (
                            <Form onSubmit={handleSubmit} onReset={handleReset} className="d-flex flex-column border border-1 shadow rounded p-3 gap-3 w-50 slide-form">

                                <div className="">
                                    <label className="" htmlFor="userEmail">
                                        Select User Type
                                    </label>

                                    <Field
                                        as="select"
                                        style={{ outline: 'none' }}
                                        className="rounded rounded-1 p-2 outline form-control-outline w-100 border border-1 border-grey"
                                        id='user_type' name='user_type'>
                                        <option value={''}>Select</option>
                                        {
                                            userTypes.map((userType: IUserType, index: number) => (
                                                <option key={index} value={userType.value}>{userType.title}</option>
                                            ))
                                        }
                                    </Field>
                                    <ErrorMessage
                                        name="user_type"
                                        component="div"
                                        className="text-danger fw-medium" />
                                </div>

                                <div className="">
                                    <label className="" htmlFor="userEmail">
                                        Email
                                    </label>
                                    <Field
                                        value={values.email}
                                        style={{ outline: 'none' }}
                                        className="rounded rounded-1 p-2  w-100 border border-1 border-grey"
                                        id='email' name='email'
                                    />
                                    <ErrorMessage
                                        name="email"
                                        component="div"
                                        className="text-danger fw-medium" />
                                </div>

                                <div className="">
                                    <label className="" htmlFor="userEmail">
                                        Password
                                    </label>
                                    <div className="d-flex align-items-center">
                                        <Field
                                            value={values.password}
                                            type={secureText ? 'text' : 'password'}
                                            style={{ outline: 'none' }}
                                            className="rounded rounded-1 p-2  w-100 border border-1 border-grey"
                                            id='password' name='password'
                                        />
                                        <i onClick={handlePasswordField} role="button" className="bi bi-eye-slash" style={{ marginLeft: '-2em' }}></i>
                                    </div>

                                    <ErrorMessage
                                        name="password"
                                        component="div"
                                        className="text-danger fw-medium" />
                                </div>

                                <div className="d-flex  justify-content-between my-3  gap-3 w-100">
                                    <div className="w-50">
                                        <Button style={{ maxWidth: '8em' }} disabled={loading} className="w-100 rounded rounded-1" type="submit" variant="primary mt-3">{loading ? <Spinner size="sm" /> : 'Login'}</Button>
                                    </div>



                                </div>
                            </Form>)
                    }
                </Formik>
            </div>

            {/* <div className="w-100"><TopBarUnAuth payload={userDBInfo} /></div>
            <div className="mt-2 m-0 p-3 rounded  rounded-3 w-100">{<Outlet />}</div> */}

        </div>
    )




}

export default LoginPage;