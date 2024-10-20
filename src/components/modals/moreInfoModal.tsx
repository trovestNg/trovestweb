import React from "react";
import { Button, Modal } from "react-bootstrap";
import alertIcon from "../../assets/icons/switch-icon.png";
import { useNavigate,useLocation } from "react-router-dom";
import Chart from 'chart.js/auto';
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { IOwner } from "../../interfaces/bmo";
import moment from "moment";
import { useSelector } from "react-redux";

// Register necessary components for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const MoreInfoModal: React.FC<any> = ({ show, off, action, info, lev, handleApprv,handleReject, handleNudge }) => {
    const userClass = useSelector((state: any) => state.authUserSlice.authUserProfile.UserClass);
    const navigate = useNavigate();
    const currentLocation = useLocation().pathname;

    let userInfo: any = {
        "Account Type": info?.CategoryDescription,
        "Beneficial Owner Name": info?.BusinessName,
        "Nationality": info?.CountryName ? info?.CountryName : '-',
        "% Holdings": `${info?.PercentageHolding}%`,
        "No of Shares": info?.NumberOfShares,
        "PEP": info?.IsPEP ? 'Yes' : 'No',
        "BVN": info?.BVN ? info?.BVN : '-',
        "ID Type": info?.IdType ? info?.IdType : '-',
        "ID Number": info?.IdNumber ? info?.IdNumber : '-',
        "Ticker": info?.Ticker ? info?.Ticker : 'N/A',
        "Source of Wealth": info?.SourceOfWealth ? info?.SourceOfWealth : 'N/A',
    }
    // const returnTableData = (userData:any) => {
    //     Object.keys(userData).forEach(key => {
    //         return    
    //     <tr className="text-center">
    //         <td>{key}</td>
    //         <td>{userData[key]}</td>
    //     </tr>
    //       });

    // }
    const data = {
        labels: ['Teju', 'Bola', 'Kemi'],
        datasets: [
            {
                label: 'Percentage share',
                data: [12, 19, 3],
                backgroundColor: [
                    'rgba(161, 220, 103, 1)',
                    'rgba(243, 191, 57, 1)',
                    'rgba(255, 118, 64, 1)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                ],
                // borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
    };


    return (
        <div>
            <Modal show={show} centered size="lg">

                <Modal.Body>
                    <div className="w-100 d-flex justify-content-between align-items-center text-end px-2">
                        <p className="p-2 text-primary fw-bold m-0">{`Beneficial Owner Details`}</p>
                        <i className="bi bi-x-circle"
                            onClick={() => off()}
                            style={{ cursor: 'pointer' }}
                        ></i>

                    </div>

                    <div className="w-100 d-flex justify-content-between align-items-center text-end px-2"
                        style={{ backgroundColor: 'rgba(0, 73, 135, 0.03)' }}
                    >
                        <table className="table table-striped mt-3">
                            <tr className="text-start ">
                                <td>Corporate Account Name </td>
                                <td>Beneficial Owner</td>
                            </tr>
                            <tr className="text-primary p-0 text-start px-0">
                                <td className="fw-bold w-50 p-0 px-0">
                                    <div className="d-flex p-0 gap-2 bg-transparent px-0">
                                        <p className="p-0 m-0 bg-transparent px-0">
                                            {info?.BusinessName}
                                        </p>
                                        {/* Level
                                        <p className="p-0 m-0 fw-normal">
                                            <span className="fw-normal text-primary bg-warning rounded p-0"> {lev}</span></p> */}
                                    </div>

                                </td>
                                <td className="fw-bold">Beneficial Owner
                                    <span className="fw-normal text-primary bg-transparent p-0 m-0">{`Level ${lev}`}</span>
                                </td>

                            </tr>
                        </table>
                        {/* <p className="p-2 text-primary fw-bold m-0">{`Beneficial Owner Details`}</p>
                        <i className="bi bi-x-circle"
                            onClick={() => off()}
                            style={{ cursor: 'pointer' }}
                        ></i> */}

                    </div>


                    <div className="py-2 border px-2 gap-2 rounded mt-2 d-flex" style={{ fontSize: '0.9em' }}>
                        <div className="d-flex w-50 bg-secondary p-2 rounded rounded-1 ">
                            <table className="table table-striped">
                                <tbody className=" p-2  bg-secondary">

                                    {Object.keys(userInfo).map(key => (
                                        <tr key={key}>
                                            <td>{key}</td>
                                            <td>{userInfo[key]}</td></tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>


                        <div className="py-3 w-50 d-flex flex-column justify-content-between" >
                            <div>
                                <table className="table table-striped text-start text-dark">
                                    <tr >
                                        <td>Initiator Name</td>
                                        <td>Date Initiated</td>
                                    </tr>
                                    <tr >
                                        <td className="fw-bold">
                                            {info?.CreatedBy}

                                        </td>
                                        <td className="fw-bold">
                                            {
                                                moment(info?.CreatedDate).format('DD-M-Y')
                                            }
                                        </td>

                                    </tr>

                                    <tr>
                                        <td>Authorizers Name</td>
                                        <td>Date Authorized</td>
                                    </tr>


                                    <tr>
                                        <td className="fw-bold">
                                            {info?.AuthorizeBy
                                            }

                                        </td>
                                        <td className="fw-bold">
                                            {
                                                info?.AuthorizeDate ? moment(info?.AuthorizeDate).format('DD-M-Y') : '-'
                                            }
                                        </td>

                                    </tr>
{/* <p>{currentLocation}</p> */}
                                </table>
                                <div className="">
                                    <p className="p-0 m-0 fw-bold">Status</p>
                                    <p className={`text-${info?.IsAuthorized ? 'success' : !info?.IsAuthorized && !info?.IsRejected ? 'warning' : !info?.IsAuthorized && info?.IsRejected ? 'danger' : 'primary'}`}>
                                    {info?.IsAuthorized && 'Authorised'}{!info?.IsAuthorized && !info?.IsRejected && 'Pending'} {!info?.IsAuthorized && info?.IsRejected && 'Rejected'}
                                    </p>
                                </div>


                                {
                                    info?.Remark &&
                                    <div className="mt-3 gap-2">
                                        <p className="p-0 m-0 fw-bold text-primary">Remark</p>
                                        <p>{info?.Remark}</p>

                                    </div>
                                }

                            </div>



                            {/* {
                                userClass == 'Initiator' &&
                                <div className=" d-flex justify-content-center gap-2">
                                    <Button variant="outline p-2 px-3 border text-primary border-1 border-primary">Edit BO </Button>
                                    <Button variant="outline border text-danger border-1 border-danger">Delete BO</Button>

                                </div>
                            } */}

                            {
                                userClass == 'Approver' && !info?.IsAuthorized && currentLocation.includes('ubo-portal')&&
                                <div className=" d-flex justify-content-center gap-2">
                                    <Button onClick={handleReject} variant="outline border text-danger border-1 border-danger">Reject</Button>
                                    <Button onClick={handleApprv} variant="success p-2 px-3 text-light">Approve</Button>


                                </div>
                            }

                            {
                                userClass == 'Initiator' && !info?.IsAuthorized &&
                                <div className=" d-flex justify-content-end gap-2">
                                    <Button onClick={handleNudge} variant="outline border-success text-success p-2 px-3">Nudge Authorizer</Button>


                                </div>}

                        </div>

                    </div>


                </Modal.Body>
            </Modal>
        </div>
    )
}
export default MoreInfoModal