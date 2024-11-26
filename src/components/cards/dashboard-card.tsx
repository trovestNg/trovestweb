import React from "react";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { convertToThousand } from "../../utils/helpers";

const DashboardCard: React.FC<any> = ({ title, icon, indexed, count, titleColor,url}) => {
    const navigate = useNavigate()
    return (
        <Card 
        onClick={()=>navigate(url)}
        key={indexed} className="shadow p-3 rounded rounded-2 shadow-sm border border-1" style={{minWidth:'250px'}}>
            <div className="d-flex justify-content-between gap-4 w-100">
                <p className={`text-${titleColor?titleColor:'primary'} p-0 m-0`}>{title}</p>

                <i 
               
               className={`d-flex text-primary ${icon} text-center align-items-center justify-content-center`}
                   style={{ fontSize: '24px', cursor:'pointer' }}
               ></i>

            </div>
            <div className="d-flex justify-content-between mt-4 w-100">
                <p className={`text-${titleColor} p-0 m-0`}
                    style={{ fontSize: '22px', fontWeight:'700' }}
                >{convertToThousand(count)}</p>

                

            </div>
        </Card>
    )
}
export default DashboardCard;