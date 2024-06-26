import React from "react";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const DashboardCard: React.FC<any> = ({ title, imgSrc, indexed, count, titleColor,url}) => {
    const navigate = useNavigate()
    return (
        <Card 
        onClick={()=>navigate(url)}
        key={indexed} className="shadow p-3 rounded rounded-2 shadow-sm border border-1" style={{minWidth:'250px'}}>
            <div className="d-flex gap-5 w-100">
                <p className={`text-${titleColor?titleColor:'primary'} p-0 m-0`}>{title}</p>

                <img height={'36px'} src={imgSrc} />

            </div>
            <div className="d-flex justify-content-between mt-4 w-100">
                <p className="text-primary p-0 m-0"
                    style={{ fontSize: '32px' }}
                >{count}</p>

                <i 
               
                className="d-flex text-primary bi bi-arrow-up-right-circle text-center align-items-center justify-content-center"
                    style={{ fontSize: '24px', cursor:'pointer' }}
                ></i>

            </div>
        </Card>
    )
}
export default DashboardCard;