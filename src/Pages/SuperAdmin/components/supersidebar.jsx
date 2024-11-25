import React from "react";
import { Col, Row, } from "react-bootstrap";
import Styles from "./superAdminInfo.module.css";
import { sideBarNav } from "../../../constants/constants";

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

export default function SuperSideNav({superAdminInfo}) {

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
          index == 0 && navigate('/super-admin/dashboard')
        }
        {
          index == 1 && navigate('/super-admin/agents');
        }
        {
          index == 2 && navigate('/super-admin/clients');
        }
        {
          index == 3 && navigate('/super-admin/transactions');
        }
        // setRefreshData(!refreshData);
      };

    return (
        <Col xs={2} className={`${Styles.col1} p-0 m-0 bg-primary`}>
            {/* user Bio */}
            <Row className="w-100 gap-1 d-dlex justify-content-center p-0  m-0">
                <Col className="d-flex justify-content-center">
                    <img
                        className={`${Styles.pic} p-0 m-0 mt-5 bg-light`}
                        src={superAdminInfo?.image}
                        alt="Profile Pic"
                    />
                </Col>

                <p
                    className="p-0 w-100 text-center text-light m-0 mt-3"
                    style={{ fontFamily: "Montserrat-Bold" }}
                >
                    {`${superAdminInfo?.first_name} ${superAdminInfo?.last_name}`}
                </p>

                <p
                    className="p-0 w-100 text-center text-light m-0 "
                    style={{ fontFamily: "Montserrat-Thin" }}
                >
                    {`${superAdminInfo?.user_type == "super_admin"
                        ? "Super Admin"
                        : superAdminInfo?.user_type == "admin"
                            ? "Admin"
                            : superAdminInfo?.user_type == "agent"
                                ? "Agent"
                                : " "
                        }`}
                </p>

                <p
                    className="p-0 w-100 text-center text-light m-0 "
                    style={{ fontFamily: "Montserrat-Thin" }}
                >
                    {superAdminInfo?.mobile}
                </p>
            </Row>
            {/* Nav ul */}
            <Row className="w-100 gap-1 h-25 mt-5 m-0 pr-0 m-0 bg-primary">
                <ul className={`${Styles.opList} p-o pr-3 w-100 m-0 mr-5 mt-3`}>
                    {sideBarNav.map((op, index) => (
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