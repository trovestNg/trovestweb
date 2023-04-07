import React, { useState, useEffect,useLayoutEffect } from 'react'
import style from './dashboard.module.css'
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
import Footer from '../Footer/Footer'



export default function Index() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { auth } = useSelector(state => state)
  const [openModal, setopenModal] = useState(false)
  const [admin, setadmin] = useState({})
  const [loading, setloading] = useState(false)
  const [skip, setskip] = useState(0)
  const [userType, setuserType] = useState('')
  const [limit, setlimit] = useState(10)
  const [agents, setagents] = useState([])
  const [menu, setmenu] = useState(false)
  const [totalClients, settotalClients] = useState(0)
  const [totalRevenue, settotalRevenue] = useState(0)


  useLayoutEffect(() => {
    const userType = localStorage.getItem(user_storage_type)
    setuserType(userType)
  }, [])
  useEffect(() => {
    checkToken()
  }, [])

  // useEffect(() => {
  //   getAgents()
  // }, [skip, limit])

  const getAgents = async () => {
    try {
      const token = localStorage.getItem(user_storage_token)
      const payload = {
        token: token,
        skip: skip,
        limit: limit
      }
      setloading(true)
      const response = await getAdminAgents(payload)
      const { data, message, success, type } = response.data
      if (success === true) {
        setagents(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
        dispatch(setAgentAction(data))
        let total = 0
        let totalRev = 0
        data.map(item => total += item.artisans.length)
        data.map(agent => {
          agent.collections.map(collection => {
            totalRev += collection.total
          })
        })
        settotalRevenue(totalRev)
        settotalClients(total)
        setloading(false)
      }
      else {
        if (type === "UNAUHTORIZED") {
          localStorage.removeItem(user_storage_token)
          localStorage.removeItem(user_storage_name)
          setloading(false)
          navigate('/')
        }
        else {
          setloading(false)
          alert(message)
        }

      }
    } catch (error) {
      if (error.message === "Request failed with status code 401") {
        localStorage.removeItem(user_storage_token)
        localStorage.removeItem(user_storage_name)
        setloading(false)
        navigate('/')
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
    if (adminToken === null || adminToken === '') {
      logOutAdmin()
      // return navigate('/')
    }
    else if (userType === 'super_admin' && (adminToken !== '' || adminToken === null)) {
      return navigate('/dashboard')
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

  const totalGenerated = () => {
    let total = 0;
    agents.map(item => {
      total += item.amount
    })
    return total
  }

  const searchAgent = (event) => {
    event.preventDefault()

  }

  const navigateToAgent = (id) => {
    navigate(`/dashboard/agent/${id}`)
  }
  const openMenu = () => {
    setmenu(!menu)
  }
  return (
    <>
      <>
        {loading && <Loader />}
        {menu && <Menu navigate={navigate} setmenu={setmenu} />}
        <div className={style.container}>
          {openModal === true && <AgentModal setopenModal={setopenModal} auth={auth} setloading={setloading} loading={loading} getAgents={getAgents} usertype={userType} />}
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
              <div className={style.dashboard}>
                <Card styles={style.styles}>
                  <h3>Total Revenue</h3>
                  <p>{`${convertToThousand(totalRevenue)}`}</p>
                </Card>
              </div>
            </div>
            <div className={style.dashboard1}>
              <Card styles={style.styles1}>
                <h3>Total Agents</h3>
                <p>{agents?.length}</p>
              </Card>
              <Card styles={style.styles1}>
                <h3>Total Clients</h3>
                <p>{totalClients}</p>
              </Card>
            </div>
            <div className={style.dashboard2}>
              <Card styles={style.styles1}>
                <Link to="/bcm">Send BCM</Link>
              </Card>
              <Card styles={`${style.styles1} ${style.more}`} onClick={() => setopenModal(true)} >
                <img src={plus} />
              </Card>
            </div>
            <div style={{
              width: '100%',
              paddingBottom: '1em'
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
                <h3>Amount</h3>
              </div>
              {agents?.map((item) =>
              (
                <Card styles={style.tabledata} key={item._id} onClick={() => navigateToAgent(item._id)}>
                  <div className={style.details}>
                    <img src={item.image} className={style.cycle} />
                    <div className={style.namedetails}>
                      <h3>{`${item.first_name} ${item.last_name}`}</h3>
                      <p>{item.assigned_id}</p>
                    </div>
                  </div>
                  <h3 className={style.date}>{dateFormat(item.createdAt)}</h3>
                  <div className={style.amount}>
                    <h3>{`${convertToThousand(calculateRevenueTotalObject(item.collections))}`}</h3>
                  </div>
                </Card>
              )
              )}
            </div>
          </div>
        </div>
        {/* <Footer /> */}
      </>
    </>
  )
}
