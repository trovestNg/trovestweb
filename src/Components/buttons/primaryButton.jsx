import React from "react";
import { Button } from "react-bootstrap";

const PrimaryButton = ({action,title,icon,type,mWidth,minWidth,disabled, bgColor, border, variant,textColor,height}) => {
    return (
        <Button 
        type={type}
        disabled={disabled}
        variant={`${variant} ${border} text-${textColor}`}
        onClick={()=>action()}
        className={`bg-${bgColor} rounded-1 d-flex align-items-center`} style={{maxWidth:mWidth, minWidth:minWidth,height:height}}>
            {icon?<i className={icon}></i>:title}
            {/* {title} */}
        </Button>
    )

}
export default PrimaryButton;