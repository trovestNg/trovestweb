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
import { getAdminAgents, getSuperAdmins } from '../../Sagas/Requests'
import { setAgentAction } from '../../Reducers/agent.reducer'
import { setSuperAdminAction, setSuperAdminAgentsAction } from '../../Reducers/super.admin.reducer'


export default function Index() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { auth } = useSelector(state => state)
  const superAdmin = useSelector(state => state)

  const [openModal, setopenModal] = useState(false)
  const [userType, setuserType] = useState('')
  const [admin, setadmin] = useState({})
  const [loading, setloading] = useState(false)
  const [skip, setskip] = useState(0)
  const [limit, setlimit] = useState(10)
  const [agents, setagents] = useState([])
  const [admins, setadmins] = useState([])
  const [menu, setmenu] = useState(false)
  const [totalClients, settotalClients] = useState(0)
  const [totalRevenue, settotalRevenue] = useState(0)

  useEffect(() => {
    checkToken()
  }, [])


  // const getAgents = async () => {
  //   try {
  //     const token = localStorage.getItem(user_storage_token)
  //     const payload = {
  //       token: token,
  //       skip: skip,
  //       limit: limit
  //     }
  //     setloading(true)
  //     const response = await getAdminAgents(payload)
  //     const { data, message, success, type } = response.data
  //     if (success === true) {
  //       setagents(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
  //       dispatch(setAgentAction(data))
  //       let total = 0
  //       let totalRev = 0
  //       data.map(item => total += item.artisans.length)
  //       data.map(agent => {
  //         agent.collections.map(collection => {
  //           totalRev += collection.total
  //         })
  //       })
  //       settotalRevenue(totalRev)
  //       settotalClients(total)
  //       setloading(false)
  //     }
  //     else {
  //       if (type === "UNAUHTORIZED") {
  //         localStorage.removeItem(user_storage_token)
  //         localStorage.removeItem(user_storage_name)
  //         setloading(false)
  //         navigate('/')
  //       }
  //       else {
  //         setloading(false)
  //         alert(message)
  //       }

  //     }
  //   } catch (error) {
  //     if (error.message === "Request failed with status code 401") {
  //       localStorage.removeItem(user_storage_token)
  //       localStorage.removeItem(user_storage_name)
  //       setloading(false)
  //       navigate('/')
  //     }
  //     else {
  //       setloading(false)
  //       alert(error.message)
  //     }
  //   }
  // }

  const getAdmins = async (token) => {
    try {
      const payload = {
        token: token,
        skip: skip,
        limit: limit
      }
      setloading(true)
      const response = await getSuperAdmins(token)
      const { data, message, success, type } = response.data
      if (success === true) {
        setadmins(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
        dispatch(setSuperAdminAction(data))
        let total = 0
        let totalRev = 0
        data.map(item => total += item?.agents?.length)
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

  const checkToken = () => {
    const superAdminToken = localStorage.getItem(user_storage_token)
    const userType = localStorage.getItem(user_storage_type)
    const adminData = localStorage.getItem(user_storage_name)
    setuserType(userType)
    adminData !== null ? setadmin(JSON.parse(adminData)) : setadmin({})
    if (superAdminToken === null && userType === '') {
      return navigate('/')
    }
    else if (userType === 'super_admin') {
      return getAdmins(superAdminToken)
    }
    else {
      return
    }
  }


  const navigateToAgent = (id, index) => {
    dispatch(setSuperAdminAgentsAction(admins[index].agents))
    navigate(`/admin/${id}`)
  }
  const openMenu = () => {
    setmenu(!menu)
  }
  return (
    <>
      {loading && <Loader />}
      {menu && <Menu navigate={navigate} setmenu={setmenu} />}
      <div className={style.container}>
        {openModal === true && <AgentModal setopenModal={setopenModal} auth={auth} setloading={setloading} loading={loading} usertype={userType} folder={'admin'} getAgents={getAdmins} />}
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
                  placeholder="Search Admin"
                  type="text"
                  className={style.input}
                />
                <img src={search} className={style.absolute1} />
              </div>
            </div>

          </div>
          <div className={style.dashboard1}>
            <Card styles={style.styles1}>
              <h3 className={style.total}>Total Admin Personel</h3>
              <p>{admins?.length}</p>
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
              <h2 className={style.registered}>Registered Admin</h2>
              <h2 className={style.seeall}>See all</h2>
            </div>
            <div className={style.tablehead}>
              <h3>Name</h3>
              <h3>Email</h3>
              <h3>Date Created</h3>
            </div>
            {userType === 'super_admin' && admins?.map((item, index) =>
            (
              <Card styles={style.tabledata} key={item._id} onClick={() => navigateToAgent(item._id, index)}>
                <div className={style.details}>
                  <img src={item.image} className={style.cycle} />
                  <div className={style.namedetails}>
                    <h3>{`${item.first_name} ${item.last_name}`}</h3>
                  </div>
                </div>
                <div className={style.details}>
                  <h3>{`${item.email}`}</h3>
                </div>
                <div className={style.details}>
                  <h3 className={style.date}>{dateFormat(item.createdAt)}</h3>
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
