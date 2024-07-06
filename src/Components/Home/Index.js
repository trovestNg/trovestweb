import React, { useEffect, useState } from "react";
import style from "./home.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  user_storage_name,
  user_storage_token,
  user_storage_type,
} from "../../config";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import animatedLogo from "../../Assets/Gifs/troveMinds.gif";
import { Formik } from "formik";
import DisplayMessage from "../Message";
import {
  loginAdminRequest,
  loginSuperAdminRequest,
} from "../../Sagas/Requests";
import { setAdminAction } from "../../Reducers/admin.reducer";

import PrimaryInput from "../inputs/PrimaryInput";
import { Button, Spinner } from "react-bootstrap";

export default function Index() {
  localStorage.removeItem(user_storage_token);
  localStorage.removeItem(user_storage_type);

  const initialValues = {
    userType: "",
    userEmail: "",
    userPassword: "",
  };

  const validationSchema = yup.object().shape({
    userType: yup
      .string()
      .typeError("Must be a string")
      .required("User type Is required"),
    userEmail: yup
      .string()
      .email("Must be a valid email")
      .typeError("Must be an email")
      .required("Email Is required"),
    userPassword: yup
      .string()
      .typeError("Must be a string")
      .required("Password Is required"),
  });

  const [loading, setloading] = useState(false);
  const [secureText, setSecureText] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { auth } = useSelector((state) => state);
  const [errorView, seterrorView] = useState({
    error: false,
    message: "",
    success: false,
  });
  const token = localStorage.getItem(user_storage_token);
  const adminType = localStorage.getItem(user_storage_type);

  useEffect(() => {
    if (token !== null && adminType === "admin") {
      return navigate("/admin");
    } else if (
      token !== null &&
      (adminType === "super_admin" || adminType === "fin_con")
    ) {
      return navigate("/dashboard");
    } else {
      return;
    }
  }, []);

  const loginSuperAdmin = async (value) => {
    seterrorView({ ...errorView, error: false, message: "" });
    try {
      const data = {
        user_type: value.userType,
        email: value.userEmail,
        password: value.userPassword,
      };
      const response = await loginSuperAdminRequest(data);
      const { success, token, message } = response.data;
      if (success === false) {
        setloading(false);
        DisplayMessage(message, "warning");
      } else if (success === true) {
        const adminData = {
          data: response.data.data,
          token: token,
          success: success,
          message: message,
          user_type: response.data.data.user_type,
        };
        if (token) {
          dispatch(setAdminAction(adminData));
          const jsonData = JSON.stringify(response.data.data);
          localStorage.setItem('userToken', token);
          localStorage.setItem(user_storage_type, response.data.data.user_type);
          localStorage.setItem(user_storage_name, jsonData);
          setloading(false);
          return navigate("/superadmin");
        } else {
          // seterrorView({ ...errorView, error: true, message: message, success: false })
          DisplayMessage(message, "warning");
          setloading(false);
        }
      }
    } catch (error) {
      DisplayMessage(error.message, "error");
      setloading(false);
      // seterrorView({ ...errorView, error: true, message: error.message, success: false })
    }
  };

  const loginAdmin = async (value) => {
    try {
      const data = {
        user_type: value.userType,
        email: value.userEmail,
        password: value.userPassword,
      };
      setloading(true);
      const response = await loginAdminRequest(data);
      const { success, token, message } = response.data;
      if (success === false) {
        setloading(false);
        DisplayMessage(message, "warning");
      } else if (success === true) {
        const adminData = {
          data: response.data.data,
          token: token,
          success: success,
          message: message,
          user_type: response.data.data.user_type,
        };
        DisplayMessage(message, "success");
        if (token) {
          dispatch(setAdminAction(adminData));
          const jsonData = JSON.stringify(response.data.data);
          localStorage.setItem('userToken', token);
          localStorage.setItem(user_storage_type, response.data.data.user_type);
          localStorage.setItem(user_storage_name, jsonData);
          setloading(false);
          return navigate("/admin");
        } else {
          DisplayMessage(message, "warning");
          // seterrorView({ ...errorView, error: true, message: message, success: false })
          setloading(false);
        }
      }
    } catch (error) {
      setloading(false);
      DisplayMessage(error.message, "error");
      // seterrorView({ ...errorView, error: true, message: error.message, success: false })
    }
  };

  const loginUser = async (value) => {
    setloading(true);
    try {
      if (value.userType === "admin") {
        return loginAdmin(value);
      }
      if (value.userType === "super_admin" || value.userType === "fin_con") {
        return loginSuperAdmin(value);
      }
    } catch (error) {
      setloading(false);
    }
  };

  return (
    <div
      className={`d-flex p-0 min-vh-100 ${style.container}`}
      style={{ fontFamily: "primary-font" }}
    >
      <div
        className={`d-flex w-50 flex-column gap-2 justify-content-center align-items-center ${style.leftCol}`}
      >
        <div className="d-flex mb-5 justify-content-center">
          <img src={animatedLogo} alt="Logo" height={400} width={420} />
        </div>
        <p
          className="m-0 mt-5  p-0 text-center"
          style={{
            fontSize: 18,
            fontFamily: "Montserrat",
            color: "#01065B",
          }}
        >
          Saving Made Easy
        </p>
      </div>

      <div
        className={`d-flex flex-column justify-content-center w-50 bg-info align-items-center ${style.rightCol}`}
      >
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          validateOnBlur
          onSubmit={(val) => loginUser(val)}
        >
          {({
            values,
            handleChange,
            handleSubmit,
            errors,
            handleBlur,
            touched,
          }) => (
            <form
              onSubmit={handleSubmit}
              className="p-3 py-5 rounded rounded-2"
              style={{ minWidth: "25em" }}
            >
              <select
                name="userType"
                onChange={handleChange}
                className={`${style.select} py-2 px-3 rounded pr-2 w-100 bg-primary text-light`}
                style={{
                  width: "20em",
                  maxWidth: "15em",
                  outline: "none",
                  borderRadius: "50px",
                  fontFamily: "Montserrat",
                  minHeight: "50px",
                }}
              >
                <option>Select User Type</option>
                <option value={"super_admin"}>Super Admin</option>
                <option value={"admin"}>Admin</option>
                <option value={"fin_con"}>Fin Con</option>
              </select>
              <p
                className="text-danger"
                style={{
                  width: "20em",
                  minWidth: "15em",
                  fontSize: "0.7em",
                  textAlign: "start",
                }}
              >
                {touched["userType"] && errors.userType}
              </p>
              <div className="mt-4 ">
                <PrimaryInput
                  blure={handleBlur}
                  touched={touched["userEmail"]}
                  name={"userEmail"}
                  change={handleChange}
                  error={errors.userEmail}
                  icon={"bi-person-fill"}
                  placeHolder={"Email Id"}
                  icon2={"ss"}
                />
                <PrimaryInput
                  touched={touched["userPassword"]}
                  blure={handleBlur}
                  name={"userPassword"}
                  change={handleChange}
                  error={errors.userPassword}
                  icon={"bi bi-lock-fill"}
                  placeHolder={"Password"}
                  icon2={"bi bi-eye-slash-fill"}
                />
                

                <div className="mt-5 w-100  d-flex flex-column justify-content-center">
                  <Button
                    disabled={loading}
                    type="submit"
                    className="rounded-1"
                    style={{ minWidth: "13em" }}
                  >
                    {loading ? (
                      <Spinner size="sm" className="text-light" />
                    ) : (
                      "Login"
                    )}
                  </Button>

                  <p
                  className=" w-100 text-info text-center m-0 p-0 mt-5"
                  style={{
                    width: "20em",
                    fontSize: "0.7em",
                    textAlign: "start",
                  }}
                >
                  {"Forgot password?"}
           
                  
                </p>

                <p
                  className="text-info w-100 text-center m-0 p-0"
                  style={{
                    width: "20em",
                    fontSize: "0.7em",
                    textAlign: "start",
                  }}
                >
                  {"Contact Super Admin "}
                
                  
                </p>

                
                </div>
              </div>
            </form>
          )}
        </Formik>
        <div className="w-100 text-center mt-3">
        <Button>Download App</Button>
        </div>
      </div>
      
    </div>
  );
}
