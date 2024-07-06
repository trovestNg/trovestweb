import moment from "moment";
import React from "react";
import { Card } from "react-bootstrap";
import { convertToThousand } from "../../config";

const InfoCard = ({ icon, mWidth, width, height, info, value, tColor,title, currency }) => {
    return (
        <Card className={`shadow-sm rounded-1 p-3 border-0 text-${tColor}`}
            style={{ width: width, maxWidth: mWidth, height: height, color: tColor }}>
            <div className={`w-100 d-flex`} style={{ fontFamily: 'title-font' }}>
                <p className="w-50" style={{ fontSize: '1em' }}>{title}</p>
                <i className={`w-50 ${icon} text-end`} style={{ fontSize: '1em' }}></i>
            </div>
            <p
                className={`text-center m-0`}
                style={{ fontFamily: 'title-font', fontSize: '1.2em' }}
            >{currency?convertToThousand(value): value}</p>

        </Card>
    )
}

export default InfoCard;