import React, { useState, useEffect } from 'react'
import style from './admin.module.css'
import Bell from '../../Assets/Svg/bell.svg'
import mail from '../../Assets/Svg/mail.svg'
import ellipse from '../../Assets/Svg/ellipse.svg'
import search from '../../Assets/Svg/search.svg'
import plus from '../../Assets/Svg/plus.svg'
import FormInput from '../Shared/FormInput/FormInput'
import Card from '../Shared/Card/Card'
import { Link, useNavigate } from "react-router-dom";
import AgentModal from '../Modal/Agent.modal'
import { useSelector, useDispatch } from 'react-redux'
import { user_storage_token, user_storage_name, dateFormat, convertToThousand, Naira, calculateRevenueTotalObject, user_storage_type } from '../../config'
import Loader from '../Modal/Loader'
import Menu from '../Modal/Menu.modal'
import { getAdminAgents } from '../../Sagas/Requests'
import { setAgentAction } from '../../Reducers/agent.reducer'
import { setAdminAction } from '../../Reducers/admin.reducer'


const userType = localStorage.getItem(user_storage_type)
export default function Index() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { auth } = useSelector(state => state)
    const superAdmin = useSelector(state => state)
    const [openModal, setopenModal] = useState(false)
    const [admin, setadmin] = useState({})
    const [loading, setloading] = useState(false)
    const [skip, setskip] = useState(0)
    const [limit, setlimit] = useState(10)
    const [agents, setagents] = useState([])
    const [menu, setmenu] = useState(false)
    const [totalClients, settotalClients] = useState(0)
    const [totalRevenue, settotalRevenue] = useState(0)

    useEffect(() => {
        checkToken()
    }, [])

    const getAgents = async () => {
        try {
            setagents(superAdmin.admins.agents)
        } catch (error) {
            if (error.message === "Request failed with status code 401") {
                localStorage.removeItem(user_storage_token)
                localStorage.removeItem(user_storage_name)
                setloading(false)
                return navigate('/')
            }
            else {
                setloading(false)
                alert(error.message)
            }
        }
    }

    const adminToken = localStorage.getItem(user_storage_token)

    const checkToken = () => {
        const adminData = localStorage.getItem(user_storage_name)
        adminData !== null ? setadmin(JSON.parse(adminData)) : setadmin({})
        if ((adminToken === null && (userType === null || userType === 'admin')) || userType === 'admin') {
            alert('Unauthorized Access')
            logOutAdmin()
        }
        else {
            return getAgents()
        }
    }

    const logOutAdmin = () => {
        localStorage.removeItem(user_storage_name)
        localStorage.removeItem(user_storage_token)
        localStorage.removeItem(user_storage_type)
        const data = {
            agents: [],
            data: {},
            token: ''
        }
        dispatch(setAgentAction(data))
        dispatch(setAdminAction(data))
        return navigate('/')
    }

    const navigateToAgent = (id) => {
        navigate(`/admin/agent/${id}`)
    }
    const openMenu = () => {
        setmenu(!menu)
    }
    return (
        <>
            {loading && <Loader />}
            {menu && <Menu navigate={navigate} setmenu={setmenu} />}
            <div className={style.container}>
                {openModal === true && <AgentModal setopenModal={setopenModal} auth={auth} setloading={setloading} loading={loading} getAgents={getAgents} />}
                <div className={style.dashboard}>
                    <div className={style.window}>
                        <div className={style.dashboardintro}>
                            <div className={style.notification}>
                                <img src={mail} />
                                <img src={Bell} />
                                <div className={style.ellipse} onClick={() => openMenu()}>
                                    <img src={ellipse} />
                                    <img src={ellipse} />
                                    <img src={ellipse} />
                                </div>
                            </div>
                            <div className={style.notification1}>
                                <h3>Hi {admin.first_name}</h3>
                                <p>How are you doing today?</p>
                            </div>
                            <div className={style.notification2}>
                                <FormInput
                                    placeholder="Search Agent"
                                    type="text"
                                    className={style.input}
                                />
                                <img src={search} className={style.absolute1} />
                            </div>
                        </div>
                    </div>
                    <div style={{
                        width: '100%',
                        paddingBottom: '1em',
                        marginTop: '5em'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <h2 className={style.registered}>Registered Agents</h2>
                            <h2 className={style.seeall}>See all</h2>
                        </div>
                        <div className={style.tablehead}>
                            <h3>Name</h3>
                            <h3>Date Created</h3>
                            <h3>Client Registered</h3>
                        </div>
                        {agents?.map((item) =>
                        (
                            <Card styles={style.tabledata} key={item._id} onClick={() => navigateToAgent(item._id)}>
                                <div className={style.details}>
                                    <div className={style.cycle} />
                                    <div className={style.namedetails}>
                                        <h3>{`${item.first_name} ${item.last_name}`}</h3>
                                        <p>{item.assigned_id}</p>
                                    </div>
                                </div>
                                <h3 className={style.date}>{dateFormat(item.createdAt)}</h3>
                                <div className={style.amount}>
                                    <h3>{`${item?.artisans?.length}`}</h3>
                                </div>
                            </Card>
                        )
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
