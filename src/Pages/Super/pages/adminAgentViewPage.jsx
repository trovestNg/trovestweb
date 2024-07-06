import React, { useEffect, useState } from "react";
import { Button, FormControl, Card, ListGroup, Spinner, Modal, ModalBody } from "react-bootstrap";
import PrimaryButton from "../../../Components/buttons/primaryButton";
import PrimaryCard from "../../../Components/cards/primaryCard";
import InfoCard from "../../../Components/cards/infoCard";
import PrimaryInput from "../../../Components/inputs/PrimaryInput";
import ProfileCard from "../../../Components/cards/profileCard";
import { getAdminAgents } from "../../../Sagas/Requests";
import { convertToThousand } from "../../../config";
import EditAgent from "../../../Components/Modal/editAgent";
import ResetAgentPassword from "../../../Components/Modal/resetAgentPassword";
import { useNavigate } from "react-router-dom";

import api from "../../../app/controllers/endpoints/api";
import { adminGetAgent, adminGetAgentArtisans } from "../../../Sagas/Requests";

import {
    user_storage_token,
    user_storage_type,
    user_storage_name,
} from "../../../config";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import moment from "moment";
import { Formik } from "formik";

const AdminAgentViewPage = () => {
    const { id } = useParams();
    const token = localStorage.getItem('userToken') || '';
    const navigate = useNavigate();
    const userInfo = localStorage.getItem(user_storage_name);

    const [agentData, setAgentData] = useState({});

    const [collection, setCollection] = useState('0');
    const [deposit, setDeposit] = useState('0');
    const [payout, setPayout] = useState('0');

    const [userInput, setUserInput] = useState('');
    const [searchLoading, setSearchLoading] = useState(false);


    const [searchAgent, setSearchAgent] = useState(false);

    console.log(user_storage_token)

    const [limit, setLimit] = useState(100);
    const [page, setPage] = useState(1);
    const [artisans, setArtisans] = useState([{}]);

    const [totalCollections, setTotalCollections] = useState(0);
    const [totalDeposits, setTotalDeposits] = useState(0);
    const [totalPayouts, setTotalPayouts] = useState(0);

    const [adminEditAgentModal, setAdminEditAgentModal] = useState(false);
    const [resetAgentPasswordModal, setResetAgentPasswordModal] = useState(false);
    const [adminCreateAgentSuccessModal, setAdminCreateAgentSuccessModal] = useState(false);




    const [loading, setloading] = useState(false);
    const [sloading, setSloading] = useState(false);
    const [ploading, setPloading] = useState(false);
    const [refreshData, setRefreshData] = useState(false);

    const handleAdminGetAgent = async () => {
        try {
            setloading(true);
            const res = await adminGetAgent(token, id);
            const resp = await adminGetAgentArtisans(token, id, 1, 10)
            console.log(res)
            console.log(resp)
            if (res?.data?.success) {
                setAgentData(res?.data?.data?.agent);
                setCollection(res?.data?.data?.total_collections);
                setPayout(res?.data?.data?.total_payout)
                setDeposit(res?.data?.data?.total_remmitance);
                setloading(false);
            }

        } catch (error) {
            console.log(error)
        }

    }

    const handleAdminGetAgentArtisans = async () => {
        try {
            const res = await adminGetAgentArtisans(token, id, 1, 10)
            console.log(res)
            if (res?.data?.success) {
                setArtisans(res?.data?.data?.artisan);
            }

        } catch (error) {
            console.log(error)
        }

    }

    const handleAgentSearch = (e) => {
        setSloading(true);
        e.preventDefault()
        setSearchAgent(true);
        setRefreshData(!refreshData);

    }

    const searchAgentArtisanByName = async () => {
        try {
            const res = await api.get(`/admin/admin-search-agent?name=${userInput}&page=${page}&limit=50`, token);
            console.log(res);

            if (res?.data?.success) {
                setloading(false)
                setArtisans(res?.data?.data?.docs);
                setSloading(false)
            } else {
                toast.error('Network error');
                setSloading(false)
            }

        } catch (error) {
            console.log(error)
        }
    }

    const fetchData = () => {
        if (searchAgent) {
            searchAgentArtisanByName();
        } else {
            handleAdminGetAgentArtisans();
        }

    }

    const offSuccessModal = () => {
        setAdminCreateAgentSuccessModal(false)
        setRefreshData(!refreshData)
    }

    useEffect(() => {
        fetchData();
        handleAdminGetAgent()
    }, [refreshData])

    const resetEditForm = () => {
        setAdminEditAgentModal(false);
    }

    return (
        <div className="w-100 py-1 px-0">
            <div className="d-flex w-100 justify-content-between px-5">
                <div className="">
                    {
                        loading ? <Spinner size="sm" /> :
                            <ProfileCard 
                            onClickEdit={() => setAdminEditAgentModal(true)} 
                            onClickReset={()=>setResetAgentPasswordModal(true)}
                            title={'Total Revenue'} value={totalCollections} info={agentData} tColor={'#01065B'} icon={"bi bi-bank2"} width={'40em'} height={'17em'} />
                    }


                </div>

                <div className="px-2" style={{ fontSize: '0.7em' }}>
                    {
                        loading ? <Spinner size="sm" /> :

                            <table>
                                <tr className="d-flex gap-2">
                                    <td><InfoCard currency={true} value={collection} width={'21em'} height={'8.5em'} title={'Total Collections'} /></td>
                                    <td><InfoCard currency={true} tColor={'success'} value={deposit} width={'21em'} height={'8.5em'} title={'Total Deposits'} /></td>
                                </tr>
                                <tr className="d-flex gap-2 mt-3">
                                    <td><InfoCard tColor={'danger'} currency={true} value={payout} width={'21em'} title={'Total Payouts'} height={'8.5em'} /></td>
                                    <td><InfoCard width={'21em'} value={artisans.length} title={'Total Artisans'} height={'8.5em'} /></td>
                                </tr>
                                <tr className="d-flex mt-4" style={{ fontSize: '1.2em' }}
                                    onClick={() => navigate(`/admin/agent/transactions/${id}`)}
                                >
                                    <td className="text-end text-info py-2 d-flex gap-1" style={{ cursor: 'pointer' }}>
                                        <i className="bi bi-receipt"></i>
                                        View Transaction History
                                    </td>
                                </tr>
                            </table>
                    }




                </div>
            </div>

            {/* <div className="d-flex gap-3 mt-4 justify-content-center">
                {
                    loading ? <Spinner /> :
                        <>
                            <PrimaryCard title={'Total Revenue'} value={totalCollections} tColor={'#01065B'} icon={"bi bi-bank2"} width={'18em'} height={'7.7em'} />
                            <PrimaryCard title={'Your Deposits'} value={totalDeposits} tColor={'#5BB971'} icon={"bi bi-arrow-down-left"} width={'18em'} height={'7.7em'} />
                            <PrimaryCard title={'Your Payouts'} value={totalPayouts} tColor={'#F30D0D'} icon={"bi bi-arrow-up-right"} width={'18em'} height={'7.7em'} />
                        </>
                }

            </div> */}
            <div className="w-100 mt-5">
                <div className="d-flex align-items-center w-100">

                    <h4 className="px-2 w-75 text-info" style={{ fontFamily: 'title-font' }}>Agent's Custormers</h4>

                    <div className="w-50 text-end justify-content-end">
                        <form onSubmit={(e) => handleAgentSearch(e)} className="d-flex justify-content-end w-100 flex-row m-0 p-0" >
                            <FormControl onChange={(e) => setUserInput(e.currentTarget.value)} placeholder="Search customer" className="rounded-1" style={{ maxWidth: '15em' }} />

                            <Button
                                disabled
                                type="submit" variant="grey border rounded-1" style={{ maxWidth: '3em' }}>
                                {
                                    sloading ? <Spinner size="sm" /> : <i className="bi bi-search"></i>
                                }
                            </Button>
                            {/* <PrimaryInput placeHolder={'Search agent'} icon2={"bi bi-search"} maxWidth={'15em'} /> */}
                        </form>
                    </div>

                </div>
                <table className="table table-striped mt-2">
                    <thead>
                        <tr className="bg-info text-light">
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col">Phone No</th>
                            <th scope="col">Date started</th>
                            <th scope="col">Amount saved</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            artisans.length <= 0 ?
                                <tr>
                                    <td colSpan={6}>
                                        <p className="font-weight-bold w-100 text-center" style={{ fontFamily: 'title-font' }}>No data available</p>
                                    </td>
                                </tr> :

                                loading ? <tr className="w-100 text-center">
                                    <td className="" colSpan={6}>
                                        <Spinner size="sm" />
                                    </td>

                                </tr> :
                                    artisans.map((agent, index) => (
                                        <tr
                                            onClick={() => navigate(`/admin/artisan/${agent?._id}`)}
                                            key={index} style={{ cursor: 'pointer' }}>
                                            <th scope="row">{index + 1}</th>
                                            <td className="text-capitalize">{`${agent?.full_name}`}</td>
                                            <td>{`${agent?.mobile}`}</td>
                                            <td>{moment(agent?.createdAt).format('DD-MM-yyy')}</td>
                                            <td>{convertToThousand(agent?.total_savings)}</td>
                                            <td className="table-icon">
                                                <i className="bi bi-three-dots-vertical"></i>
                                                {/* <div className="content card border shadow position-absolute">
                                                    <Card className="rounded rounded-3 border-0 shadow-lg" style={{ minWidth: "10rem" }}>
                                                        {
                                                            <>
                                                                <ListGroup variant="flush">
                                                                    {

                                                                        <ListGroup.Item

                                                                        >
                                                                            Edit info
                                                                        </ListGroup.Item>}
                                                                </ListGroup>
                                                                <ListGroup variant="flush">
                                                                    {
                                                                        <ListGroup.Item
                                                                        // disabled={room?.availability?.noOccupied > 0}

                                                                        >
                                                                            Delete agent
                                                                        </ListGroup.Item>}
                                                                </ListGroup>
                                                            </>

                                                        }
                                                    </Card>
                                                </div> */}
                                            </td>
                                        </tr>
                                    ))
                        }
                    </tbody>
                </table>

                <nav aria-label="...">
                    <ul className="pagination">
                        <li className="page-item disabled">
                            <span className="page-link">Previous</span>
                        </li>
                        <li className="page-item active" aria-current="page"><a className="page-link" href="#">1</a></li>
                        <li className="page-item" >
                            <span className="page-link">2</span>
                        </li>
                        <li className="page-item"><a className="page-link" href="#">3</a></li>
                        <li className="page-item">
                            <a className="page-link" href="#">Next</a>
                        </li>
                    </ul>
                </nav>
            </div>


            <Formik
                initialValues={agentData}
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
                        <Modal show={adminEditAgentModal} centered size='lg' style={{ fontFamily: 'primary-font' }}>
                            <Modal.Header className="bg-info text-light">
                                <div>
                                    Edit agent info
                                </div>
                                <PrimaryButton
                                    mWidth={'3em'}
                                    textColor={'light'} variant={'grey'} icon={"bi bi-x-circle"}
                                    action={
                                        handleReset
                                    } />

                            </Modal.Header>
                            <ModalBody className="d-flex justify-content-center">

                                < EditAgent
                                    info={agentData}
                                    on={adminEditAgentModal}
                                    success={adminCreateAgentSuccessModal}
                                    offSuccess={offSuccessModal}
                                    onSuccess={() => setAdminCreateAgentSuccessModal(true)}
                                    reload={() => setRefreshData(!refreshData)}
                                    off={
                                        handleReset
                                        
                                    } />
                            </ModalBody>

                        </Modal>
                    </>
                )}
            </Formik>


            {< ResetAgentPassword
                    info={agentData}
                    on={resetAgentPasswordModal}
                    success={adminCreateAgentSuccessModal}
                    offSuccess={offSuccessModal}
                    onSuccess={() => setAdminCreateAgentSuccessModal(true)}
                    reload={()=>setRefreshData(!refreshData)}
                    off={() => {
                        setResetAgentPasswordModal(false);
                    }} /> 
            }
        </div>
    )
}

export default AdminAgentViewPage;