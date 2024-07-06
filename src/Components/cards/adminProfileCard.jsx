import moment from "moment";
import React from "react";
import { Badge, Card } from "react-bootstrap";
import { convertToThousand } from "../../config";
import style from './profileCard.module.css'
import PrimaryButton from "../buttons/primaryButton";

const AdminProfileCard = ({ icon, mWidth, width, height, info, value, tColor, title, onClickEdit, onClickReset, page }) => {
    return (
        <Card className="d-flex flex-row shadow-sm rounded-3 p-2 border-0"
            style={{ width: width, maxWidth: mWidth, height: height, color: tColor }}>
            <div className="d-flex p-2  text-primary" style={{ fontFamily: 'primary-font' }}>
                <img
                    className={`${style.pic} m-0 mt-5 bg-light shadow-sm`}
                    src={info?.image}
                    alt="Profile Pic"
                />
            </div>
            <div className="p-2 w-75">
                <div className="d-flex gap-5 w-100 justify-content-between ">
                    <p style={{ fontFamily: 'header-font', fontSize: '1.6em' }} className="text-capitalize">{`Admin ${info?.first_name} ${info?.last_name}`}</p>
                    <Badge className="d-flex bg-success text-center justify-content-center  align-items-center" style={{ minWidth: '10em', maxHeight: '3em' }}>Active</Badge>
                </div>
                <table className="table">
                    <tr>
                        <td>Admin ID :</td>
                        <td >{`TR-AD-${info?._id&&info?._id.slice(20)}`}</td>
                    </tr>

                    <tr>
                        <td>Email :</td>
                        <td >{info?.email}</td>
                    </tr>

                    <tr>
                        <td>Phone :</td>
                        <td >{info?.mobile}</td>
                    </tr>

                    <tr>
                        <td>Date Joined</td>
                        <td >{moment(info?.createdAt).format('ddd-MM-yyyy')}</td>
                    </tr>

                    {/* <tr>
                        <td>Administrator</td>
                        <td >Josephine Jane</td>
                    </tr> */}

                    <tr>
                        <td>Address</td>
                        <td >{info?.address}</td>
                    </tr>
                </table>
                {
                    page =='transaction'? '':
                    <div className="d-flex w-100 gap-3">
                    <PrimaryButton action={onClickEdit} bgColor={'info'} textColor={'light'} mWidth={'8em'} height={'2em'} title={'Edit profile'} />
                    <PrimaryButton action={onClickReset} bgColor={'primary'} textColor={'light'} mWidth={'10em'} height={'2em'} title={'Reset password'} />
                </div>}
            </div>

        </Card>
    )
}

export default AdminProfileCard;