import React from "react";
import { Button, Modal } from "react-bootstrap";
import alertIcon from "../../assets/icons/switch-icon.png";
import { useNavigate } from "react-router-dom";
import Chart from 'chart.js/auto';
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { IOwner } from "../../interfaces/bmo";

// Register necessary components for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const ChartModal: React.FC<any> = ({ show, off, action, profile,bmoList }) => {
    const navigate = useNavigate();
    const fishOutNames = (bmos: IOwner[]) => {
        
        let names = bmos.map((bmo:IOwner)=>bmo.BusinessName)
        console.log(names)
        return names

    }

    const fishOutValues = (bmos: IOwner[]) => {
        
        let names = bmos.map((bmo:IOwner)=>bmo.PercentageHolding)
        console.log(names)
        return names

    }

    const data = {
        labels: fishOutNames(bmoList),
        datasets: [
            {
                label: 'Percentage share',
                data: fishOutValues(bmoList),
                backgroundColor: [
                    'rgba(161, 220, 103, 1)',
                    'rgba(243, 191, 57, 1)',
                    'rgba(255, 118, 64, 1)',
                ],
                borderWidth: 0,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
    };


    return (
        <div>
            <Modal show={show} centered>
                <Modal.Header className="">
                    <i className="bi bi-x-circle text-end w-100"
                        onClick={() => off()}
                        style={{ cursor: 'pointer' }}
                    ></i>
                </Modal.Header>
                <Modal.Body>
                    <div className="py-2 d-flex justify-content-center align-items-center flex-column">
                        <div style={{ width: '300px', height: '300px' }}>
                            <Doughnut className="m-2 d-flex gap-2" data={data} options={options} />
                        </div>
                        <p className="text-primary p-0 m-0" style={{ fontFamily: 'title' }}>
                            {`${profile?.BusinessName ? profile?.BusinessName : ''}`}
                        </p>
                        <p className="text-primary m-0 p-0" style={{ fontFamily: 'title' }}>Beneficial Owners Chart</p>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}
export default ChartModal