import React, { useState } from "react";
import notificationIcon from "../../assets/icons/notification-icon.png";
import { Card, ListGroup, ListGroupItem } from "react-bootstrap";

const TopBar: React.FC<any> = ({ payload }) => {
    return (
        <div
            className="d-flex align-items-center justify-content-between bg-light shadow-sm w-100 px-4 py-3" style={{ fontFamily: 'title' }}>
            <p className="p-0 m-0 text-primary">Policy Portal</p>

            <div className="px-4 d-flex align-items-center gap-3">
                <div className="table-icon" >
                {/* <img src={notificationIcon} height={'40px'} /> */}
                <i className="bi bi-person-circle text-primary" style={{fontSize:'1.2em'}}></i>
                {/* <div className="content ml-5" style={{ position: 'relative' }}>

                    <Card className="p-2  shadow-sm rounded border-0"
                        style={{ minWidth: '15em', marginLeft: '-10em', position: 'absolute', fontFamily:'primary' }}>
                        <ListGroup>
                            <ListGroupItem className="multi-layer">
                                <span className="w-100 d-flex justify-content-between">
                                    <div className="d-flex gap-2">
                                        <i className="bi bi-plus"></i>
                                        New unattested
                                    </div>

                                    <i className="bi bi-chevron-right"></i>
                                </span>
                            </ListGroupItem>
                        </ListGroup>
                    </Card>
                </div> */}
                </div>
                <p className="p-0 m-0">{payload?.fullname}</p>
                
            </div>
        </div>
    )
}
export default TopBar;