import React, { useState, useLayoutEffect } from 'react'
import style from './broadcast.module.css'
import DisplayMessage from '../Message';
import { useSelector } from 'react-redux';
import Loader from '../Modal/Loader';
import { NavigationType } from 'react-router-dom';
import { useParams, useNavigate } from 'react-router-dom';
import { ACCESS_DENIED, UNAUHTORIZED, user_storage_token, user_storage_type } from '../../config';
import { getAdminBroadcast, getSuperAdminBroadcast, sendBroadCast } from '../../Sagas/Requests';

export default function Index() {
    const token = localStorage.getItem(user_storage_token)
    const navigate = useNavigate()
    const [loading, setloading] = useState(false)
    const [messages, setmessages] = useState([])
    const [userType, setuserType] = useState('')
    const [messageData, setmessageData] = useState({
        title: '',
        message: ''
    })

    useLayoutEffect(() => {
        if (!token) {
            const user_type = localStorage.getItem(user_storage_type)
            setloading(false)
            return navigate('/')
        }
        else {
            const user_type = localStorage.getItem(user_storage_type)
            setuserType(user_type)
            // getMyMessages()
        }
    }, [])

    const sendMessage = async (event) => {
        try {
            event.preventDefault()
            if (userType === 'admin') {
                return DisplayMessage('You are not authorized to make this request', 'warning')
            }
            if (messageData.title === '' || messageData.message === '') {
                DisplayMessage('Empty fields', 'warning', 'Empty')
            }
            else {
                const data = {
                    title: messageData.title,
                    message: messageData.message, token
                }
                setloading(true)
                const response = await sendBroadCast(data)
                const { success, message } = response.data
                if (success === false && (message === UNAUHTORIZED || message === ACCESS_DENIED)) {
                    setloading(false)
                    DisplayMessage(message, 'warning', 'UNAUHTORIZED')
                    return navigate('/')
                }
                else if (success === false && (message !== UNAUHTORIZED || message !== ACCESS_DENIED)) {
                    setloading(false)
                    DisplayMessage(message, 'warning', 'Something went wrong')
                }
                else {
                    setmessageData({
                        title: '',
                        message: ''
                    })
                    await getMyMessages()
                    DisplayMessage(message, 'success', 'Delivered')
                }
            }
        } catch (error) {
            DisplayMessage(error.message, 'warning', 'Error Occured')
        }
    }

    async function getMyMessages(event) {
        try {
            setloading(true)
            const response = userType === 'admin' ? getAdminBroadcast(token) : await getSuperAdminBroadcast(token)
            const { success, message, data } = response.data
            if (success === false && (message === UNAUHTORIZED || message === ACCESS_DENIED)) {
                setloading(false)
                DisplayMessage(message, 'warning', 'UNAUHTORIZED')
                return navigate('/')
            }
            else if (success === false && (message !== UNAUHTORIZED || message !== ACCESS_DENIED)) {
                setloading(false)
                DisplayMessage(message, 'warning', 'Something went wrong')
            }
            else {
                setloading(false)
                setmessages(data)
            }
        } catch (error) {
            setloading(false)
            DisplayMessage(error.message, 'warning', 'Error Occured')
        }
    }
    return (
        <>
            {loading && <Loader />}
            <div className={style.container}>
                <div className={style.messagebox}>
                    <form>
                        <input placeholder='Message Title' type='text' className={style.messageinput} onChange={(evt) => setmessageData({ ...messageData, title: evt.target.value })} value={messageData.title} />
                        <textarea cols="2" rows="500" placeholder='Message Body' onChange={(evt) => setmessageData({ ...messageData, message: evt.target.value })} value={messageData.message}></textarea>
                        <button onClick={(event) => sendMessage(event)}>Send</button>
                    </form>
                </div>
                <div className={style.messagedetails}>
                    <h3>Inbox</h3>
                    <h3>Sent Items ({messages && ` ${messages.length} `})</h3>
                </div>
            </div>
        </>
    )
}
