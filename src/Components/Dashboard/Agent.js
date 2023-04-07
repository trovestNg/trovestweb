import React, { useEffect, useState } from 'react'
import styles from './agent.module.css'
import style from './dashboard.module.css'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom';
import { convertToThousand, defaultImage, dateFormat, user_storage_token, calculateRevenueTotal } from '../../config';
import mail from '../../Assets/Svg/mail.svg'
import next from '../../Assets/Images/next.png'
import nextwhite from '../../Assets/Images/nextwhite.png'
import Card from '../Shared/Card/Card'
import Loader from '../Modal/Loader';
import DisplayMessage from '../Message';
import { getAdminAgentCollection } from '../../Sagas/Requests';
import { setAgenCollectiontAction } from '../../Reducers/agent.reducer'
import Footer from '../Footer/Footer'


export default function Agent() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { agents } = useSelector(state => state.agents)
    const [loading, setloading] = useState(false)
    const { agentid } = useParams();
    const [revenue, setrevenue] = useState(0)
    const [collections, setcollections] = useState([])
    const [agent, setagent] = useState({})
    const [active, setactive] = useState('deposit')

    const getData = async () => {
        if (agents.length > 0) {
            const filteredAgent = agents?.find(item => {
                return item._id === agentid
            })
            let total = 0
            filteredAgent?.collections.map(item => {
                total += item.total
            })
            setrevenue(total)
            setagent(filteredAgent)
            getCollection()
        }
    }

    useEffect(() => {
        setloading(true)
        checkAgent()
    }, [agentid])
    const checkAgent = () => {
        if (agent && agents.length <= 0) {
            return navigate('/dashboard')
        }
        getData()
    }

    const searchForReference = (value) => {
        try {
            value = value.toLowerCase()
            if (value !== '') {
                const matcher = new RegExp(`^${value}`, 'g');
                const filteredData = collections.filter(item => item?.payment_reference.toLowerCase().match(matcher))
                setcollections(filteredData);
            }
            else {
                setcollections([])
                getCollection()
            }
        } catch (error) {
            setloading(false);
            DisplayMessage(error.message, 'warning', error.message)
        }
    }

    const searchForDate = (value) => {
        try {
            if (value !== '') {
                const filteredData = collections.filter(item => new Date(item.datePaid).getTime() === new Date(value).getTime())
                setcollections(filteredData);
            }
            else {
                setcollections([])
                getCollection()
            }
        } catch (error) {
            setloading(false);
            DisplayMessage(error.message, 'warning', error.message)
        }
    }

    async function getCollection() {
        try {
            const token = localStorage.getItem(user_storage_token)
            if (token) {
                const response = await getAdminAgentCollection({ agent_id: agentid, token })
                const { success, message, data } = response.data
                if (success === true) {
                    dispatch(setAgenCollectiontAction(data))
                    setcollections(data)
                    setloading(false)
                }
                else {
                    setloading(false)
                    DisplayMessage(message, 'warning')
                }
            }
            else {
                setloading(false)
                DisplayMessage('Unauthorized', 'warning', 'Not authorized')
            }
        } catch (error) {
            setloading(false)
            DisplayMessage(error.message, 'warning', error.message)
        }
    }

    const navigateToCollection = (id) => {
        navigate(`/dashboard/agent/${agentid}/${id}`)
    }

    return (
        <>
            {loading && <Loader />}
            <div className={`${styles.container} container`} style={{
                flexDirection: 'column',
                marginBottom: '9em',
            }}>
                <div>
                    <div className={styles.window}>
                        <div className={styles.profile}>
                            <img src={agent?.image || defaultImage} alt="profile-image" className='card' />
                            <div className={styles.data}>
                                <h3>{`${agent.first_name} ${agent.last_name}`}</h3>
                                <h4>{`${agent.assigned_id}`}</h4>
                                <h4>{`${agent.mobile}`}</h4>
                                {/* <h4>{`${agent.gender}`}</h4> */}
                            </div>
                        </div>
                        <div className={style.dashboardintro} style={{
                            width: '97%',
                            marginTop: '3em',
                        }}>
                            <div className={style.notification} style={{
                                marginRight: '1em',
                                marginTop: '.2em'
                            }}>
                                <img src={mail} alt="mail" />
                            </div>
                            <div className={styles.agentData}>
                                <div className={styles.profiledetails}>
                                    <h3>Revenue Generated</h3>
                                    <h5>{`${convertToThousand(revenue || 0)}`}</h5>
                                </div>
                                <div className={`${styles.profiledetails} ${styles.profiledetails2}`}>
                                    <div className={styles.profiledetails1}>
                                        <h3 style={{
                                            marginTop: '1.3em'
                                        }}>Clients Onboarded</h3>
                                        <p>{agent?.artisans?.length || 0}</p>
                                    </div>
                                    {/* <img src={nextwhite} alt="mail" /> */}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.transaction}>
                        <h3>Transaction Records</h3>
                    </div>
                    <div className={styles.transaction} style={{
                        justifyContent: 'space-between',
                        marginTop: '.5em',
                        width: '100%',
                    }}>
                        <div className={styles.deposit} onClick={() => setactive('deposit')}>
                            <h3>Deposits</h3>
                        </div>
                        <div className={styles.withdrawn} onClick={() => setactive('collection')}>
                            <h3>Collection</h3>
                        </div>
                    </div>
                    <div className={style.inputView}>
                        <input placeholder="Search reference" onKeyUp={(event) => searchForReference(event.target.value)} />
                    </div>
                    <div className={styles.transaction1}>
                        <h3>Ref No</h3>
                        <h3>Amount</h3>
                    </div>
                    {active === 'collection' && collections?.map(item => (
                        item.status === 0 && <Card styles={style.tabledata} key={item._id} style={{
                            width: '97%'
                        }} onClick={() => navigateToCollection(item._id)}>
                            <div className={style.details}>
                                <div className={style.namedetails}>
                                    <h3>{item.payment_reference}</h3>
                                    <h3 className={style.date}>{dateFormat(item.datePaid)}</h3>
                                </div>
                            </div>
                            <div className={style.amount}>
                                <h3>{`${convertToThousand(item.total)}`}</h3>
                            </div>
                        </Card>
                    ))}
                    {active === 'deposit' && collections?.map(item => (
                        item.status === 1 && <Card styles={style.tabledata} key={item._id} style={{
                            width: '97%'
                        }} onClick={() => navigateToCollection(item._id)}>
                            <div className={style.details}>
                                <div className={style.namedetails}>
                                    <h3>{item.payment_reference}</h3>
                                    <h3 className={style.date}>{dateFormat(item.datePaid)}</h3>
                                </div>
                            </div>
                            <div className={style.amount}>
                                <h3>{`${convertToThousand(item.total)}`}</h3>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
            {/* <Footer/> */}
        </>
    )
}
