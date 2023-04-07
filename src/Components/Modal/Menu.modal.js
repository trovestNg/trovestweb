import React from 'react'
import { useDispatch } from 'react-redux'
import { user_storage_name, user_storage_token } from '../../config'
import { setAdminAction } from '../../Reducers/admin.reducer'
import { setAgentAction } from '../../Reducers/agent.reducer'
import loaderstyles from './menu.module.css'


export default function Menu(props) {
    const { setmenu, navigate } = props
    const dispatch = useDispatch()
    const logOutAdmin = (event) => {
        event.preventDefault()
        localStorage.removeItem(user_storage_name)
        localStorage.removeItem(user_storage_token)
        const data = {
            agents: [],
            data: {},
            token: ''
        }
        dispatch(setAgentAction(data))
        dispatch(setAdminAction(data))
        navigate('/')
    }
    return (
        <div className={loaderstyles.modal}>
            <div className={loaderstyles['modal-content']}>
                <span className={loaderstyles.close} onClick={() => setmenu(false)}>&times;</span>
                <div onClick={(event) =>  navigate('/profile')}>My Profile</div>
                <div>Settings</div>
                <div onClick={(event) => logOutAdmin(event)}>Sign Out</div>
            </div>
        </div>
    )
}
