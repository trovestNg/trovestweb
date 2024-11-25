import React, { useEffect, useState } from 'react'
import styles from './agent.module.css'
import style from './dashboard.module.css'
import { useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom';
import { convertToThousand, defaultImage, dateFormat, user_storage_token, calculateRevenueTotal } from '../../config';
import mail from '../../Assets/Svg/mail.svg'
import next from '../../Assets/Images/next.png'
import nextwhite from '../../Assets/Images/nextwhite.png'
import Card from '../Shared/Card/Card'
import Loader from '../Modal/Loader';
import DisplayMessage from '../Message';


export default function Collection() {

    const navigate = useNavigate()
    const { agents, collections } = useSelector(state => state.agents)
    const { agentid, collectionid } = useParams();
    const [loading, setloading] = useState(false)
    const [agent, setagent] = useState({})
    const [collection, setcollection] = useState({})
    const [revenue, setrevenue] = useState(0)

    useEffect(() => {
        setloading(true)
        checkAgent()
        if (agents.length > 0) {
            const filteredAgent = agents?.find(item => {
                return item._id === agentid
            })
            let total = 0
            setrevenue(total)
            setagent(filteredAgent)
        }
        if (collections.length > 0) {
            const filteredCollection = collections?.find(item => {
                return item._id === collectionid
            })
            let total = 0
            setrevenue(total)
            setcollection(filteredCollection)
            setTimeout(() => {
                setloading(false)
            }, 2000);
        }
    }, [agentid,collectionid])

    const checkAgent = () => {
        if (agents.length <= 0) {
            navigate('/dashboard')
        }
    }

    return (
        <>
            {loading && <Loader />}
            <div className={`${styles.container} container`} style={{
                flexDirection: 'column',
                marginBottom: '12em',
            }}>
                <div>
                    <div className={styles.transaction}>
                        <h3>Collection Record</h3>
                    </div>
                    <div className={styles.transaction1}>
                        <h3>Artisan</h3>
                        <h3>Amount</h3>
                    </div>
                    {collection?.artisans?.map((item, index) => (
                        <Card styles={style.tabledata} key={index} style={{
                            width: '97%'
                        }} >
                            <div className={style.details}>
                                <div className={style.namedetails}>
                                    <h3>{`${item.full_name}`}</h3>
                                    <h3 className={style.date}>{dateFormat(item.updatedAt)}</h3>
                                </div>
                            </div>
                            <div className={style.amount}>
                                <h3>{`${convertToThousand(collection?.thrifts[index].amount?.$numberDecimal || 0)}`}</h3>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </>
    )
}
