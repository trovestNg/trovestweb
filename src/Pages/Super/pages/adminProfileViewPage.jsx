import React, { useEffect, useState } from "react";
import {Modal} from "react-bootstrap";
import PrimaryButton from "../../../Components/buttons/primaryButton";
import PrimaryCard from "../../../Components/cards/primaryCard";
import PrimaryInput from "../../../Components/inputs/PrimaryInput";
import { getAdmin } from "../../../Sagas/Requests";
import { convertToThousand } from "../../../config";
// import CreateAgent from "../../SuperAdmin/components/createAgent";
import CreateAgent from "../../../Components/Modal/createAgent";
import api from "../../../app/controllers/endpoints/api";
import EditAdmin from "../../../Components/Modal/editAdmin";
import { Formik } from "formik";

import {
    user_storage_token,
    user_storage_type,
    user_storage_name,
} from "../../../config";
import { toast } from "react-toastify";
import { useNavigate, useHis } from "react-router-dom";
import InfoCard from "../../../Components/cards/infoCard";
import ResetAdminPassword from "../../../Components/Modal/resetAdminPassword";

const AdminProfileViewPage = () => {
    const token = localStorage.getItem('userToken') || '';
    const userInfo = localStorage.getItem(user_storage_name);
    const userData = JSON.parse(userInfo);
    const navigate = useNavigate();

    const [adminData, setAdminData] = useState({});
    const [editInfo,setEditInfo] = useState(false);

    const [userInput, setUserInput] = useState('');
    const [searchLoading, setSearchLoading] = useState(false);


    const [searchAgent, setSearchAgent] = useState(false);

    console.log(user_storage_token)

    const [limit, setLimit] = useState(100);
    const [page, setPage] = useState(1);
    const [profile, setProfile] = useState({});

    const [totalCollections, setTotalCollections] = useState(0);
    const [totalDeposits, setTotalDeposits] = useState(0);
    const [totalPayouts, setTotalPayouts] = useState(0);

    const [artisans, setArtisans] = useState([])

    const [adminCreateAgentModal, setAdminCreateAgentModal] = useState(false);
    const [adminCreateAgentSuccessModal, setAdminCreateAgentSuccessModal] = useState(false);




    const [loading, setloading] = useState(false);
    const [sloading, setSloading] = useState(false);
    const [refreshData, setRefreshData] = useState(false);
    const [resetPass,setResetPass] = useState(false);
    const [updateAdminProfile,setUpdateAdminProfile] = useState(false);

    const getProfile = async () => {
        try {
            setloading(true)
            const payload = { page: page, limit: limit, token: token };
            const res = await getAdmin(token);
            // console.log({res})
            if (res?.data?.success) {
                setProfile(res?.data?.data);
            }
            else {
                setloading(false);
            }

        } catch (error) {
            console.log(error);
            toast.error('Network error!')
        }
    }

   const resetEditForm = ()=>{
    setEditInfo(false)
   }

    const offSuccessModal = () => {
        setAdminCreateAgentSuccessModal(false)
        setRefreshData(!refreshData)
    }

    useEffect(() => {
        getProfile()
    }, [refreshData])

    return (
        <div className="w-100 py-1 px-0">
            <h1 className="text-secondary p-0 m-0 px-3" style={{ fontFamily: 'header-font' }}>
                {
                    `Profile Page`
                }
            </h1>
            <div className="d-flex w-100 px-5" style={{ fontFamily: 'title-font' }}>
                <table>
                    <tbody>
                        <tr >
                            <td className="py-4">First Name:</td>
                            <td className="text-capitalize">{profile?.first_name}</td>
                            <td>Address:</td>
                            <td>{profile?.address}</td>
                        </tr>
                        <tr>
                            <td className="py-4">Last Name:</td>
                            <td>{profile?.last_name}</td>
                            <td>Email :</td>
                            <td>akint@tro.com</td>
                        </tr>
                        <tr>
                            <td className="py-4">Username:</td>
                            <td>{profile?.username}</td>
                            <td>Phone Number :</td>
                            <td>{profile?.mobile}</td>
                        </tr>
                        <tr>
                            <td className="py-4">Staff Id:</td>
                            <td>{profile?._id && `TR-AD-${profile?._id.slice(19)}`}</td>
                        </tr>
                        <tr>
                            <td>
                                <InfoCard title={'Agents Created'} width={'15em'} value={profile?.agents && profile?.agents.length}/>
                            </td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="d-flex w-100 gap-3 mt-4 px-3 justify-content-end">
               <PrimaryButton bgColor={'info'} action={()=>toast.error('Contact Your Super Admin!')} textColor={'light'} mWidth={'10em'} title={'Update profile'}/>
               <PrimaryButton bgColor={'primary'} action={()=>setResetPass(true)} textColor={'light'} mWidth={'10em'} title={'Reset password'}/>

            </div>
            
            <Formik
                initialValues={profile}
                // validationSchema={validationSchema}
                // validateOnBlur
                onReset={() => resetEditForm()}
                onSubmit={(val, actions) => console.log({iamHere:val})
                    // createAdminAccount(val, actions)
                }
            >
                {({
                   
                    handleReset
                    }) => (
                    <>
                        <Modal show={editInfo} centered size='lg' style={{ fontFamily: 'primary-font' }}>
                            <Modal.Header className="bg-info text-light">
                                <div>
                                    Edit your info
                                </div>
                                <PrimaryButton
                                    mWidth={'3em'}
                                    textColor={'light'} variant={'grey'} icon={"bi bi-x-circle"}
                                    action={
                                        handleReset
                                    } />

                            </Modal.Header>
                            <Modal.Body className="d-flex justify-content-center">

                                < EditAdmin
                                    info={profile}
                                    reload={() => setRefreshData(!refreshData)}
                                    off={
                                        handleReset
                                        
                                    } />
                            </Modal.Body>

                        </Modal>
                    </>
                )}
            </Formik>

            < CreateAgent
                on={adminCreateAgentModal}
                success={adminCreateAgentSuccessModal}
                offSuccess={offSuccessModal}
                onSuccess={() => setAdminCreateAgentSuccessModal(true)}
                fetchService={() => console.log('ok')}
                off={() => {
                    setAdminCreateAgentModal(false);
                }} />
                <ResetAdminPassword
                off={()=>setResetPass(false)}
                on={resetPass}
                />
        </div>
    )
}

export default AdminProfileViewPage;