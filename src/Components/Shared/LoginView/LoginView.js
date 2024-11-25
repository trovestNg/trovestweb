import React, { useState } from 'react'
import style from './loginview.module.css'
import FormInput from '../FormInput/FormInput'
import person from '../../../Assets/Images/person.png'
import lock from '../../../Assets/Images/lock.png'
import { Link, redirect } from "react-router-dom";
import eye from '../../../Assets/Svg/eye.svg'
import { loginAdminAction, setAdminAction } from '../../../Reducers/admin.reducer'
import { useDispatch, useSelector } from 'react-redux'
import { loginAdminRequest, loginSuperAdminRequest } from '../../../Sagas/Requests'
import { user_storage_name, user_storage_token, user_storage_type } from '../../../config'
import Loader from '../../Modal/Loader'

export default function LoginView(props) {
  const { navigate } = props
  const { auth, } = useSelector(state => state)
  const [secure, setsecure] = useState(true)
  const [loading, setloading] = useState(false)
  const [errorView, seterrorView] = useState({
    error: false,
    message: '',
    success: false
  })
  const [adminData, setadminData] = useState({
    email: '',
    password: '',
    usertype: '',
  })
  const dispatch = useDispatch()

  const loginAs = (event) => {
    event.preventDefault()
    seterrorView({ ...errorView, error: false, message: '' })
    if (event.target.value === 'Select User Type' || event.target.value === '') {
      setadminData({ ...adminData, usertype: '' })
      return seterrorView({ ...errorView, error: true, message: 'Please select user type' })
    }
    setadminData({ ...adminData, usertype: event.target.value })
  }
  const loginUser = async (event) => {
    event.preventDefault()
    seterrorView({ ...errorView, error: false, message: '' })
    try {
      if (adminData.usertype === '' || adminData.usertype === 'Select User Type') {
        return seterrorView({ ...errorView, error: true, message: 'Please select user type' })
      }
      if (adminData.email === '' || adminData.password === '') {
        setloading(false)
        seterrorView({ ...errorView, error: true, message: 'Some fields are empty' })
      }
      if (adminData.usertype === 'Admin') {
        return loginAdmin(event)
      }
      if (adminData.usertype === 'Super Admin') {
        return loginSuperAdmin(event)
      }
    } catch (error) {
      setloading(false)
      seterrorView({ ...errorView, error: true, message: error.message, success: false })
    }
  }

  const loginAdmin = async (event) => {
    event.preventDefault()
    seterrorView({ ...errorView, error: false, message: '' })
    try {
      const data = {
        email: adminData.email,
        password: adminData.password,
      }
      setloading(true)
      const response = await loginAdminRequest(data)
      const { success, token, message } = response.data
      if (success === false) {
        setloading(false)
        seterrorView({ ...errorView, error: true, message: message })
      }
      else {
        const adminData = {
          data: response.data.data,
          token: token,
          success: success,
          message: message,
          user_type: response.data.data.user_type
        }
        seterrorView({ ...errorView, error: true, message: message, success: true })
        if (token) {
          dispatch(setAdminAction(adminData))
          const jsonData = JSON.stringify(response.data.data)
          localStorage.setItem(user_storage_token, token)
          localStorage.setItem(user_storage_type, response.data.data.user_type)
          localStorage.setItem(user_storage_name, jsonData)
          setloading(false);
          return navigate('/dashboard')
        }
        else {
          seterrorView({ ...errorView, error: true, message: message, success: false })
          setloading(false)
        }
      }
    } catch (error) {
      setloading(false)
      seterrorView({ ...errorView, error: true, message: error.message, success: false })
    }
  }

  const loginSuperAdmin = async (event) => {
    event.preventDefault()
    seterrorView({ ...errorView, error: false, message: '' })
    try {
      const data = {
        email: adminData.email,
        password: adminData.password,
      }
      setloading(true)
      const response = await loginSuperAdminRequest(data)
      const { success, token, message } = response.data
      if (success === false) {
        setloading(false)
        seterrorView({ ...errorView, error: true, message: message })
      }
      else {
        const adminData = {
          data: response.data.data,
          token: token,
          success: success,
          message: message,
          user_type: response.data.data.user_type
        }
        seterrorView({ ...errorView, error: true, message: message, success: true })
        if (token) {
          dispatch(setAdminAction(adminData))
          const jsonData = JSON.stringify(response.data.data)
          localStorage.setItem(user_storage_token, token)
          localStorage.setItem(user_storage_type, response.data.data.user_type)
          localStorage.setItem(user_storage_name, jsonData)
          setloading(false);
          return navigate('/admin')
        }
        else {
          seterrorView({ ...errorView, error: true, message: message, success: false })
          setloading(false)
        }
      }
    } catch (error) {
      setloading(false)
      seterrorView({ ...errorView, error: true, message: error.message, success: false })
    }
  }

  // if (auth && auth?.token && auth?.data.user_type === "super_admin") {
  //   return navigate('/admin')
  // }
  // else if (auth && auth?.token && auth?.data.user_type === "admin") {
  //   return navigate('/dashboard')
  // }
  return (
    <>
      {loading && <Loader />}
      <div className={style['login-view1']}>
        <div className={style['login-view']}>
          <form>
            <h3 className={style.logintext}>Login</h3>
            <div className={style.dropdown}>
              <select className={style.dropdownlist} onChange={(event) => loginAs(event)}>
                <option>Select User Type</option>
                <option>Admin</option>
                <option>Super Admin</option>
              </select>
            </div>
            <div className={style.inputview} style={{
              marginBottom: '1em'
            }}>
              <img src={person} className={style.absolute} />
              <FormInput
                placeholder="Enter Your ID"
                type="text"
                className={style.input}
                value={adminData.email}
                onChange={(event) => {
                  setadminData({ ...adminData, email: event.target.value })
                }}
              />
            </div>
            <div className={style.inputview}>
              <img src={lock} className={style.absolute2} />
              <FormInput
                placeholder="Password"
                type={secure === true ? 'password' : 'text'}
                className={style.input}
                value={adminData.password}
                onChange={(event) => {
                  setadminData({ ...adminData, password: event.target.value })
                }}
              />
              <img src={eye} className={style.absolute1} onClick={() => {
                setsecure(!secure)
              }} />
            </div>
            {errorView.error && <div className={style.error}>
              <span className={style.errortext}>{errorView.message}</span>
            </div>}
            <div className={style.btnview}>
              <button onClick={(event) => loginUser(event)}>Login</button>
            </div>
            <div className={style.supportview}>
              <span className={style.contacttext}>Forgot Password ?</span>
              <span className={style.contacttext1}>Contact Support</span>
            </div>
            <div className={style.download}>
              <a href={process.env.REACT_APP_APK_LINK} target="_blank">Download App</a>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
