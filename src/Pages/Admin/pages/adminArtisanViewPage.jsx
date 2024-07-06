import React, { useEffect, useState } from "react";
import { Button, FormControl, Card, ListGroup, Spinner, Modal, Col } from "react-bootstrap";
import { convertToThousand } from "../../../config";
import ArtisanCard from "../../../Components/cards/artisanCard";
import { debitClient } from "../../../Sagas/Requests";
import PrimaryButton from "../../../Components/buttons/primaryButton";
import { Formik } from "formik";

import api from "../../../app/controllers/endpoints/api";
import { adminGetArtisan, adminGetAgentArtisans } from "../../../Sagas/Requests";

import {
    user_storage_token,
    user_storage_type,
    user_storage_name,
} from "../../../config";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import moment from "moment";
import ArtisanProfileCard from "../../../Components/cards/artisanProfileCard";

import EditAgent from "../../../Components/Modal/editAgent";
import EditArtisan from "../../../Components/Modal/editArtisan";

const AdminArtisanViewPage = () => {
    const { id } = useParams();
    const token = localStorage.getItem('userToken') || '';

    const [debitModal, setDebitModal] = useState(false);
    const [amountToDebit, setAmountToDebit] = useState(0);
    const [debitLoading, setDebitLoading] = useState(false);
    const [debitConfModal, setDebitConfModal] = useState(false);
    
    const [editArtisanModal, setEditArtisanModal] = useState(false);

    const [agentData, setAgentData] = useState({});

    const [collection, setCollection] = useState('0');
    const [deposit, setDeposit] = useState('0');
    const [payout, setPayout] = useState('0');


    const [searchAgent, setSearchAgent] = useState(false);
    const [sortByDate, setSortByDate] = useState(false);

    console.log(user_storage_token)

    const [limit, setLimit] = useState(100);
    const [page, setPage] = useState(1);
    const [savingHistory, setSavingHistory] = useState([{}]);

    const [totalCollections, setTotalCollections] = useState(0);
    const [totalDeposits, setTotalDeposits] = useState(0);
    const [totalPayouts, setTotalPayouts] = useState(0);

    const [adminCreateAgentModal, setAdminCreateAgentModal] = useState(false);
    const [adminCreateAgentSuccessModal, setAdminCreateAgentSuccessModal] = useState(false);




    const [loading, setloading] = useState(false);
    const [sloading, setSloading] = useState(false);
    const [ploading, setPloading] = useState(false);
    const [refreshData, setRefreshData] = useState(false);

    const handleAdminGetArtisan = async () => {
        try {
            setloading(true);
            const res = await adminGetArtisan(token, id);
            // const resp = await adminGetAgentArtisans(token, id, 1, 10)
            console.log(res)
            if (res?.data?.success) {
                setAgentData(res?.data?.data?.artisan);
                setCollection(res?.data?.data?.artisan?.total_savings);
                setPayout(res?.data?.data?.artisan?.total_payouts)
                setDeposit(res?.data?.data?.artisan?.total_balance);
                // setSavingHistory(res?.data?.thrifts)
                setloading(false);
            }

        } catch (error) {
            console.log(error)
            toast.error('Network error!')
        }

    }

    const handleAdminGetArtisanThrifts = async () => {
        if (sortByDate) {
            return
        } else {
            try {
                setloading(true);
                const res = await adminGetArtisan(token, id);
                // const resp = await adminGetAgentArtisans(token, id, 1, 10)
                console.log(res)
                if (res?.data?.success) {
                    setSavingHistory(res?.data?.data?.thrifts)
                    setloading(false);
                }

            } catch (error) {
                console.log(error);
                toast.error('Network error!')
            }
        }

    }

    const confirmDebit =()=>{
        setDebitConfModal(true);
    }

    const handleClientDebit = async ()=>{
       try {
        setDebitLoading(true)
        const payload = {data : amountToDebit, token :token, userId : id }
        
        const res = await debitClient(payload)
        // console.log(res);
        if(res?.data?.success){
        //   setDebitConfModal(false);
        //   setDebitSucModal(true);
          setDebitLoading(false);
          setRefreshData(!refreshData)
        }
    
        else{
            toast.error('Network error!')
        }
       } catch (error) {
        toast.error('Network error!')
       }
    
      }
    const handleDebit = ()=>{

        // console.log(clientData?.total_balance);
        const bal = parseInt(agentData?.total_balance);
        if(amountToDebit > bal ){
        toast.error('You Cannot debit more than available balance!');
        } else {
            handleClientDebit()
        }
        
      }

   


    const handleAgentSearch = (e) => {
        setSloading(true);
        e.preventDefault()
        setSearchAgent(true);
        setRefreshData(!refreshData);

    }

    const resetEditForm = () => {
       setEditArtisanModal(false);
       
    }

    useEffect(() => {
        // fetchData();
        handleAdminGetArtisan();
        handleAdminGetArtisanThrifts();
    }, [refreshData])

    return (
        <div className="w-100 py-1 px-0">
            <div className="d-flex w-100 justify-content-between px-5">

                <div className="px-2" style={{ fontSize: '0.8em' }}>
                    {
                        loading ? <Spinner size="sm" /> :

                            <table>
                                <tbody>
                                    <tr className="d-flex gap-2">
                                        <td><ArtisanCard icon={"bi bi-bank"} tColor={'primary'} value={collection} width={'21em'} height={'8.5em'} title={'Total Money Saved'} /></td>
                                        <td><ArtisanCard value={payout} tColor={'danger'} width={'21em'} height={'8.5em'} title={'Amount Withdrawn'} /></td>
                                    </tr>
                                    <tr className="d-flex gap-2 mt-3">
                                        <td><ArtisanCard value={deposit} tColor={'success'} width={'21em'} title={'Available Balance'} height={'8.5em'} /></td>
                                        {/* <td><ArtisanCard width={'21em'} title={'Total Artisans'} height={'8.5em'} /></td> */}
                                    </tr>
                                    {/* <tr className="d-flex mt-4" style={{ fontSize: '1.2em' }}>
                                        <td className="text-end text-info py-2 d-flex gap-1" style={{ cursor: 'pointer' }}>
                                        <i className="bi bi-receipt"></i>
                                            View Transaction History
                                        </td>
                                    </tr> */}
                                </tbody>
                            </table>
                    }




                </div>

                <div className="">
                    {
                        loading ? <Spinner size="sm" /> :
                            <ArtisanProfileCard updateInfoClicked={()=>setEditArtisanModal(true)} debitArtisanClicked={()=>setDebitModal(true)} title={'Total Revenue'} value={totalCollections} info={agentData} tColor={'#01065B'} icon={"bi bi-bank2"}/>
                    }


                </div>


            </div>

            <div className="w-100  mt-5">
                <div className="d-flex  justify-content-space-between w-100">

                    <h5 className="px-2 text-info w-100" style={{ fontFamily: 'title-font' }}>Artisan's Saving Record</h5>

                    
                        <form onSubmit={(e) => handleAgentSearch(e)} className="d-flex justify-content-end w-100 flex-row m-0 p-0" >
                            <div className="d-flex gap-2">
                                From :
                                <FormControl type="date"  placeholder="Search customer" className="rounded-1" style={{ maxWidth: '10em' }} />
                                To :
                                <FormControl type="date"  placeholder="Search customer" className="rounded-1" style={{ maxWidth: '10em' }} />
                            </div>


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
                <table className="table table-striped mt-2">
                    <thead>
                        <tr className="bg-info text-light">
                            <th scope="col">#</th>
                            <th scope="col">Date </th>
                            <th scope="col">Amount</th>
                            <th scope="col">Ref id</th>
                            {/* <th scope="col"></th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            savingHistory && savingHistory.length <= 0 ?
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
                                    savingHistory.map((agent, index) => (
                                        <tr key={index} style={{ cursor: 'pointer' }}>
                                            <th scope="row">{index + 1}</th>
                                            <td>{moment(agent?.createdAt).format('DD-MM-yyy')}</td>
                                            <td>{convertToThousand(agent?.amount)}</td>
                                            <td className="text-capitalize">{`${agent?._id}`}</td>


                                            {/* <td className="table-icon">
                                                <i className="bi bi-three-dots-vertical"></i>
                                                <div className="content card border shadow position-absolute">
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
                                                </div>
                                            </td> */}
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
                        <Modal show={editArtisanModal} centered size='lg' style={{ fontFamily: 'primary-font' }}>
                            <Modal.Header className="bg-info text-light">
                                <div>
                                    Edit artisan info
                                </div>
                                <PrimaryButton
                                    mWidth={'3em'}
                                    textColor={'light'} variant={'grey'} icon={"bi bi-x-circle"}
                                    action={
                                        handleReset
                                    } />

                            </Modal.Header>
                            <Modal.Body className="d-flex justify-content-center">

                                < EditArtisan
                                    info={agentData}
                                    on={true}
                                    // success={adminCreateAgentSuccessModal}
                                    // offSuccess={offSuccessModal}
                                    // onSuccess={() => setAdminCreateAgentSuccessModal(true)}
                                    reload={() => setRefreshData(!refreshData)}
                                    off={
                                        handleReset
                                        
                                    } />
                            </Modal.Body>

                        </Modal>
                    </>
                )}
            </Formik>

            <Modal show={debitModal} centered style={{fontFamily:'primary-font'}}>
                <Modal.Header className="bg-info text-light">
                    <Col>Debit customer savings</Col>
                    <Col
                        className="d-flex justify-content-end"
                        onClick={() => setDebitModal(false)}
                        style={{ cursor: "pointer" }}
                    >
                       <i className="bi bi-x-circle"></i>
                    </Col>
                </Modal.Header>
                <Modal.Body>
                    <p>Enter amount</p>
                    <form>
                        <FormControl type="number"
                        onChange={(e)=>setAmountToDebit(e.target.value)}
                        />
                        <div className="d-flex w-100 gap-3 mt-3">
                            <Button
                            disabled={ loading || amountToDebit==''}
                                onClick={
                                    ()=>{
                                        
                                        setDebitModal(false)
                                        setDebitConfModal(true)
                                    }
                                   
                                }

                                className="ml-3 bg-info"
                                style={{ maxWidth: "7em" }}
                            >
                                Debit
                            </Button>
                            <Button
                            
                              onClick={() => {
                                setAmountToDebit('')
                                setDebitModal(false)}
                            }
                                className="ml-3"
                                style={{ maxWidth: "7em" }}
                                variant="light border border-1"
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>

            {/* debit confirmation modal ={confDebitnModal} */}
            <Modal show={debitConfModal} centered style={{fontFamily:'primary-font'}}>
                <Modal.Header className="bg-info text-light">
                    <Col>Confirm debit</Col>
                    <Col
                        className="d-flex justify-content-end"
                        onClick={()=>{
                            setAmountToDebit('');
                            setDebitConfModal(false)
                        }}
                        style={{ cursor: "pointer" }}
                    >
                        <i className="bi bi-x-circle"></i>
                    </Col>
                </Modal.Header>
                <Modal.Body>
                    <p className="p-3">{`You are debiting this customer ${convertToThousand(amountToDebit)}, do you want to proceed ?`}</p>
                    <div className="d-flex w-100 gap-3 mt-3">
                        <Button
                             onClick={() =>  handleDebit()}
                            className="ml-3"
                            variant="info"
                            style={{ maxWidth: "7em" }}
                        >
                            {debitLoading? <Spinner color="primary"/> : 'Proceed'}
                        </Button>
                        <Button
                            className="ml-3"
                            style={{ maxWidth: "7em" }}
                            variant="light border border-1"
                            onClick={()=>{
                                setAmountToDebit('');
                                setDebitConfModal(false)
                            }}
                        >
                            Cancel
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>

            <Modal show={false} centered>
                <Modal.Header className="bg-primary text-light">
                    <Col>Low balance</Col>
                    <Col
                        className="d-flex justify-content-end"
                        // onClick={() => setLessSavingModal(false)}
                        style={{ cursor: "pointer" }}
                    >
                        X
                    </Col>
                </Modal.Header>
                <Modal.Body>
                    <p className="p-3">{`Amount you are trying to debit is higher than the available balance. `}</p>

                </Modal.Body>
            </Modal>

            <Modal show={false} centered>
                <Modal.Header className="bg-primary text-light">
                    <Col>Debit Success</Col>
                    <Col
                        className="d-flex justify-content-end"
                        // onClick={() => {
                        //   setDebitSucModal(false)
                        //   setRefreshData(!refreshData);
                        // }}
                        style={{ cursor: "pointer" }}
                    >
                        X
                    </Col>
                </Modal.Header>
                <Modal.Body>
                    <p className="p-3">{`Amount successfully debited and sms notification sent to client`}</p>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default AdminArtisanViewPage;