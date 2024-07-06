import moment from "moment";
import React from "react";
import { Card } from "react-bootstrap";
import { convertToThousand } from "../../config";

const ArtisanCard = ({ icon, mWidth, width, height, info, value, tColor,title }) => {
    return (
        <Card className="shadow-sm rounded-1 p-3 border-0"
            style={{ width: width, maxWidth: mWidth, height: height, color: tColor }}>
            <div className={`w-100 d-flex text-${tColor}`} style={{ fontFamily: 'title-font' }}>
                <p className="w-50" style={{ fontSize: '1em' }}>{title}</p>
                <i className={`w-50 ${icon} text-end`} style={{ fontSize: '2em' }}></i>
            </div>
            <p
                className="text-center m-0"
                style={{ fontFamily: 'title-font',fontSize: '1.2em' }}
            >{convertToThousand(value)}</p>
        </Card>
    )
}

export default ArtisanCard;