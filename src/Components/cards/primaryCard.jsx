import moment from "moment";
import React from "react";
import { Card } from "react-bootstrap";
import { convertToThousand } from "../../config";

const PrimaryCard = ({ icon, mWidth, width, height, info, value, tColor,title }) => {
    return (
        <Card className="shadow-sm rounded-1 p-3 border-0"
            style={{ width: width, maxWidth: mWidth, height: height, color: tColor }}>
            <div className="w-100 d-flex text-primary" style={{ fontFamily: 'title-font' }}>
                <p className="w-50" style={{ fontSize: '1em' }}>{title}</p>
                <i className={`w-50 ${icon} text-end`} style={{ fontSize: '1em' }}></i>
            </div>
            <p
                className="text-center m-0"
                style={{ fontFamily: 'title-font', fontSize: '1.2em' }}
            >{convertToThousand(value)}</p>
            <div className="w-100">
                <p className="text-primary w-100 mt-2 text-center">
                    {
                        `01/09/2022 - ${moment(new Date()).format('D/MM/y')}`
                    }
                </p>
            </div>

        </Card>
    )
}

export default PrimaryCard;