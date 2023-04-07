import { useEffect, useState } from "react"
import { Container, Col, Row, Card, Button, FormGroup, Spinner } from "react-bootstrap";
import DefaultTable from "./components/defaultTable";
import moment from 'moment'
import { user_storage_token } from "../../config";
import { Naira } from "../../config";
import api from "../../app/controllers/endpoints/api";
import { toast } from "react-toastify";
import { convertToThousand } from "../../config";


const DashboardPage = (props) => {
    const { tableData } = props
    const [refreshData, setRefreshData] = useState(false);
    const [loading, isLoading] = useState(false);
    const [data, setData] = useState({});
    const token = localStorage.getItem(user_storage_token);


    const fetchService = async () => {
        isLoading(true)
        const res = await api.get(`/super/dashboard`, token);
        if (res?.data?.success) {
            setData(res?.data?.data)
            isLoading(false);
        }
        console.log({ here: res })
    }

    console.log({ dataNow: data })

    useEffect(() => {
        fetchService();
    }, [refreshData])

    const paidOut = convertToThousand(data?.total_payout)
    const generated = convertToThousand(data?.total_revenue);
    const tableInfo = data?.superadmin?.admin
    const sideBar = [{}, {}, {}]
    const adminInfo = [{}, {}, {}, {}, {}]



    return (
        <Container fluid className="mt-2">
            <Row>

            </Row>
            {/* main page */}
            <Col xs={10} className={' d-flex flex-column m-0 p-0 justify-content-center align-items-center p-3 '}>

                <Row className="w-100 p-3 m-0">
                    
                    <Col className='d-flex justify-content-center align-items-center'>
                        <Card className="shadow-sm border border-0 p-2 d-flex justify-content-center align-items-center flex-row rounded round-1"
                            style={{ width: '250px', height: '150px' }}>
                            {loading ? <Spinner className='text-primary' /> : (
                                <>
                                    <Col xs={2} className='d-flex text-success justify-content-center'>
                                        <i className="bi bi-arrow-down" style={{ fontSize: '1.5em' }}></i>
                                    </Col>
                                    <Col xs={10} className='d-flex flex-column justify-content-center h-100' style={{ fontSize: '1em' }}>
                                        <Row className="w-100 d-flex  text-primary justify-content-center m-0 "
                                            style={{ fontSize: '0.9em', fontFamily: 'Montserrat-Regular' }}>
                                            Overall Total Revenue
                                        </Row>
                                        <Row className="d-flex text-success justify-content-center m-0 "
                                            style={{ fontSize: '1.5em', fontFamily: 'Ubuntu' }}>
                                            <div className="p-0 d-flex m-0 w-100 flex-column align-items-center"> {`${generated}`}</div>
                                        </Row>
                                        <Row className="w-100 text-primary d-flex justify-content-center m-0 "
                                            style={{ fontSize: '0.8em', fontFamily: 'Montserrat-Regular' }}>
                                            {`${moment(new Date().setDate(10)).format('DD/MM/YYYY')} - ${moment(new Date()).format('DD/MM/YYYY')}`}
                                        </Row>
                                    </Col>
                                </>)}
                        </Card>
                    </Col>

                    <Col className='d-flex justify-content-center align-items-center'>
                        <Card className="shadow-sm border border-0 p-2 d-flex justify-content-center align-items-center flex-row rounded round-1"
                            style={{ width: '250px', height: '150px' }}>
                            {loading ? <Spinner className="text-primary" /> : (
                                <>
                                    <Col xs={2} className='d-flex text-secondary justify-content-center'>

                                        <i class="bi bi-arrow-up" style={{ fontSize: '1.5em' }}></i>
                                    </Col>
                                    <Col xs={10} className='d-flex flex-column justify-content-center h-100' style={{ fontSize: '1em' }}>
                                        <Row className="w-100 d-flex  text-primary justify-content-center m-0 "
                                            style={{ fontSize: '0.9em', fontFamily: 'Montserrat-Regular' }}>
                                            Total Payouts
                                        </Row>

                                        <Row className="d-flex text-secondary justify-content-center m-0 "
                                            style={{ fontSize: '1.5em', fontFamily: 'Ubuntu' }}>
                                            {`${paidOut}`}
                                        </Row>
                                        <Row className="w-100 text-primary d-flex justify-content-center m-0 "
                                            style={{ fontSize: '0.8em', fontFamily: 'Montserrat-Regular' }}>
                                            {`${moment(() => new Date() - 1).format('DD/MM/YYYY')} - ${moment(new Date()).format('DD/MM/YYYY')}`}
                                        </Row>
                                    </Col>
                                </>)}
                        </Card>
                    </Col>
                </Row>
                <Row className="w-100 mt-3">

                    <Card className="w-100 shadow-sm border  border-0 p-3 px-0 py-4 rounded round-2">
                        <Row className="w-100 m-0 px-3 mb-3">
                            <Col className="d-flex align-items-center">
                                <h3 style={{ fontFamily: 'Montserrat', fontSize: '1em' }}>All Admins</h3>
                            </Col>

                            {/* handle seach by name sction */}
                            <Col className="d-flex justify-content-end px-0">
                                <FormGroup className="w-75  gap-3 d-flex justify-content-start align-items-center py-0 border border-dark border-1 rounded rounded-5">
                                    <i className="bi bi-search" style={{
                                        fontSize: '1.3em',
                                        marginLeft: '0.8em'

                                    }}></i>
                                    <input placeholder="Name of admin" className="bg-transparent w-75 text-dark py-1 rounded rounded-5 border border-0 w-75"
                                        style={{ outline: 'none', fontFamily: 'Montserrat-Thin' }}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row className="m-0">
                            <DefaultTable data={tableInfo} loading={loading} />
                        </Row>
                    </Card>
                </Row>
            </Col>
            {/* side bar */}
            <Col xs={2} ></Col>

        </Container >
    )
}
export default DashboardPage