import React from "react";
import { Col, Row, } from "react-bootstrap";
import Styles from "./admin.module.css";
import { adminSideBarNav } from "../../../constants/constants";
import { adminNavActions } from "../../../constants/constants";


import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import {
    user_storage_token,
    user_storage_name,
    dateFormat,
    convertToThousand,
    Naira,
    calculateRevenueTotalObject,
    user_storage_type,
  } from "../../../config";
import { useNavigate } from "react-router-dom";
import { setAgentAction } from "../../../Reducers/agent.reducer";
import { setAdminAction } from "../../../Reducers/admin.reducer";

export default function AdminSideNav({adminInfo}) {


    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logUserOut = () => {
        toast.success('Logged Out')
        localStorage.removeItem(user_storage_name);
        localStorage.removeItem(user_storage_token);
        const data = {
          agents: [],
          data: {},
          token: "",
        };
        dispatch(setAgentAction(data));
        dispatch(setAdminAction(data));
        return navigate("/");
      };

      const sideBarAction = (op, index) => {
        {
          index == 0 && navigate('/admin')
        }
        {
          index == 1 && navigate('/admin/clients');
        }
        {
          index == 2 && navigate('/admin/transactions');
        }
        {
            index == 3 && navigate('/admin/requests');
        }
      };

    return (
        <Col xs={2} className={`${Styles.col1} p-0 m-0 bg-info`}>
            {/* user Bio */}
            <Row className="w-100 gap-1 d-dlex justify-content-center p-0  m-0">
                <Col className="d-flex justify-content-center">
                    <img
                        className={`${Styles.pic} p-0 m-0 mt-5 bg-light`}
                        src={adminInfo?.image}
                        alt="Profile Pic"
                    />
                </Col>

                <p
                    className="p-0 w-100 text-center text-light m-0 mt-3"
                    style={{ fontFamily: "Montserrat-Bold" }}
                >
                    {`${adminInfo?.first_name} ${adminInfo?.last_name}`}
                </p>

                <p
                    className="p-0 w-100 text-center text-light m-0 "
                    style={{ fontFamily: "Montserrat-Thin" }}
                >
                    {`${adminInfo?.user_type == "super_admin"
                        ? "Super Admin"
                        : adminInfo?.user_type == "admin"
                            ? "Admin"
                            : adminInfo?.user_type == "agent"
                                ? "Agent"
                                : " "
                        }`}
                </p>

                <p
                    className="p-0 w-100 text-center text-light m-0 "
                    style={{ fontFamily: "Montserrat-Thin" }}
                >
                    {adminInfo?.mobile}
                </p>
            </Row>
            {/* Nav ul */}
            <Row className="w-100 gap-1 h-25 mt-5 m-0 pr-0 m-0 bg-info">
                <ul className={`${Styles.opList} p-o pr-3 w-100 m-0 mr-5 mt-3`}>
                    {adminSideBarNav.map((op, index) => (
                        <li key={index}
                            onClick={() => sideBarAction(op, index)}
                            className={`${Styles.opLists} py-2 w-100 px-2 rounded
                            rounded-1 my-1 ml-4 text-light`}
                        >
                            {
                                <>
                                    <i
                                        className={`${op.icon} mr-3 ml-2`}
                                        style={{ marginRight: "1em" }}
                                    ></i>
                                    {op.name}
                                </>
                            }
                        </li>
                    ))}
                </ul>
            </Row>
            {/* nav buttom*/}
            <Row className="w-100 gap-1 h-25 m-0">
                <ul
                    className={`${Styles.opList} d-flex align-items-end  p-o pr-3 w-100 m-0 mr-5 mt-5`}
                >
                    <li
                        onClick={() => logUserOut()}
                        className={`${Styles.opLists} py-2 w-100 px-2 rounded
                            rounded-1 my-1 ml-4 text-light`}
                        style={{ marginTop: "4em" }}
                    >
                        {
                            <>
                                <i
                                    className={`bi bi-house-door-fill mr-3 ml-2`}
                                    style={{ marginRight: "1em" }}
                                ></i>
                                {"Logout"}
                            </>
                        }
                    </li>
                </ul>
            </Row>
        </Col>
    )
}