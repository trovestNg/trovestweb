import React, { useEffect, useState } from 'react';
import style from './home.module.css';
import { useDispatch, useSelector } from 'react-redux';
import {
	user_storage_name,
	user_storage_token,
	user_storage_type,
} from '../../config';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import {
	Container,
	Col,
	Row,
	Form,
	FormGroup,
	Button,
	Spinner,
} from 'react-bootstrap';
import animatedLogo from '../../Assets/Gifs/troveMinds.gif';
import { Formik } from 'formik';
import DisplayMessage from '../Message';
import {
	loginAdminRequest,
	loginSuperAdminRequest,
} from '../../Sagas/Requests';
import { setAdminAction } from '../../Reducers/admin.reducer';

export default function Index() {
	localStorage.removeItem(user_storage_token);
	localStorage.removeItem(user_storage_type);
	const initialValues = { userType: '', userEmail: '', userPassword: '' };
	const [loading, setloading] = useState(false);
	const [secureText, setSecureText] = useState(true);
	const validationSchema = yup.object().shape({
		userType: yup.string().typeError('Must be a string').required('User type Is required'),
		userEmail: yup
			.string()
			// .email
			.typeError('Must be a string')
			.required('Email Is required'),
		userPassword: yup
			.string()
			.typeError('Must be a string')
			.required('Password Is required'),
	});

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { auth } = useSelector((state) => state);
	const [errorView, seterrorView] = useState({
		error: false,
		message: '',
		success: false,
	});
	const token = localStorage.getItem(user_storage_token);
	const adminType = localStorage.getItem(user_storage_type);
	
	useEffect(() => {
		if (token !== null && adminType === 'admin') {
			return navigate('/admin');
		} else if (token !== null && (adminType === 'super_admin' || adminType === 'fin_con')) {
			return navigate('/dashboard');
		} else {
			return;
		}
	}, []);

	const loginUser = async (value) => {
		try {
			if (value.userType === 'admin') {
				return loginAdmin(value);
			}
			if (value.userType === 'super_admin' || value.userType === 'fin_con') {
				return loginSuperAdmin(value);
			}
		} catch (error) {
			setloading(false);
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
				DisplayMessage(message, 'warning');
			} else if (success === true) {
				const adminData = {
					data: response.data.data,
					token: token,
					success: success,
					message: message,
					user_type: response.data.data.user_type,
				};
				DisplayMessage(message, 'success');
				if (token) {
					dispatch(setAdminAction(adminData));
					const jsonData = JSON.stringify(response.data.data);
					localStorage.setItem(user_storage_token, token);
					localStorage.setItem(user_storage_type, response.data.data.user_type);
					localStorage.setItem(user_storage_name, jsonData);
					setloading(false);
					return navigate('/admin');
				} else {
					DisplayMessage(message, 'warning');
					// seterrorView({ ...errorView, error: true, message: message, success: false })
					setloading(false);
				}
			}
		} catch (error) {
			setloading(false);
			DisplayMessage(error.message, 'error');
			// seterrorView({ ...errorView, error: true, message: error.message, success: false })
		}
	};

	const loginSuperAdmin = async (value) => {
		seterrorView({ ...errorView, error: false, message: '' });
		try {
			const data = {
				user_type: value.userType,
				email: value.userEmail,
				password: value.userPassword,
			};
			setloading(true);
			const response = await loginSuperAdminRequest(data);
			const { success, token, message } = response.data;
			if (success === false) {
				setloading(false);
				DisplayMessage(message, 'warning');
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
					localStorage.setItem(user_storage_token, token);
					localStorage.setItem(user_storage_type, response.data.data.user_type);
					localStorage.setItem(user_storage_name, jsonData);
					setloading(false);
					return navigate('/super-admin/dashboard');
				} else {
					// seterrorView({ ...errorView, error: true, message: message, success: false })
					DisplayMessage(message, 'warning');
					setloading(false);
				}
			}
		} catch (error) {
			DisplayMessage(error.message, 'error');
			setloading(false);
			// seterrorView({ ...errorView, error: true, message: error.message, success: false })
		}
	};

	return (
		<Container fluid className={`d-flex p-0 min-vh-100 ${style.container}`}>
			<Col
				className={`d-flex flex-column gap-2 justify-content-center align-items-center ${style.leftCol}`}
			>
				<Row className="d-flex justify-content-center mb-4 w-100">
					<div className="d-flex justify-content-center">
						<img src={animatedLogo} alt="Logo" height={400} width={420} />
					</div>
				</Row>
				<Row
					className="d-flex
                justify-content-center w-100"
					style={{ marginTop: '15%', fontFamily: 'Montserrat' }}
				>
					<p
						className="m-0 p-0 text-center"
						style={{
							fontSize: 18,
							fontFamily: 'Montserrat',
							color: '#01065B',
						}}
					>
						Saving Made Easy
					</p>
				</Row>

			</Col>
			<Col
				className={`d-flex 
                justify-content-center align-items-center ${style.rightCol}`}
			>
				<Row className="w-100 d-flex justify-content-center" style={{}}>
					<Col className="d-flex flex-column align-items-center justify-content-center px-4">
						<Row className="w-100 d-flex align-items-center justify-content-center px-4">
							<Formik
								initialValues={initialValues}
								validationSchema={validationSchema}
								onSubmit={(val) => loginUser(val)}
							>
								{({ values, handleChange, handleSubmit, errors }) => (
									<Form onSubmit={handleSubmit} className="w-75 mt-4 p-4 rounded"
										style={{ outline: 'none', fontFamily: 'Montserrat', minWidth: '490px', minHeight: '620px' }}>

										<div
											className={`rounded w-100 d-flex p-3 flex-column mt-4 align-items-center`}
										><Col className=''
											style={{
												outline: 'none', fontFamily: 'Montserrat',
												minHeight: '50px',
												minWidth: '255px'
											}}
										>
												<FormGroup
													className={`rounded w-100 mb-3`}
													style={{ fontFamily: 'Montserat' }}
												>
													<select
														name="userType"
														onChange={handleChange}
														className={`${style.select} py-2 px-3 rounded pr-2 w-100 bg-primary text-light`}

														style={{
															outline: 'none', fontFamily: 'Montserrat',
															minHeight: '50px'
														}}
													>
														<option>Select User Type</option>
														<option value={'super_admin'}>Super Admin</option>
														<option value={'admin'}>Admin</option>
														<option value={'fin_con'}>Fin Con</option>
													</select>
												</FormGroup>
											</Col>
											<Col className=''
												style={{
													outline: 'none', fontFamily: 'Montserrat',
													minHeight: '50px',
													minWidth: '300px'
												}}>
												<FormGroup
													className="border px-2  gap-1 d-flex rounded-1 align-items-center
											border-primary mt-4 justify-content-space-between rounded w-100"
													style={{ color: '#01065B' }}
												>

													<i className="bi bi-person-fill color-primary px-0" style={{ fontSize: '0.9em' }}></i>
													<input
														name="userEmail"
														onChange={handleChange}
														type="text"
														className="w-100 bg-transparent outline-0 border py-2 border-0 rounded"
														placeholder="Enter id"
														style={
															{
																outline: 'none',
																fontFamily: 'Montserrat-Regular',
																minHeight: '50px',
																fontSize: '0.875em'
															}}
													/>
													<i
														className="bi"
														onClick={() => setSecureText(!secureText)}
														style={{ fontSize: '14px' }}
													></i>
												</FormGroup>
											</Col>
											<Col className=''
												style={{
													outline: 'none', fontFamily: 'Montserrat',
													minHeight: '50px',
													minWidth: '300px'
												}}>
												<FormGroup
													className="border px-2  gap-1 d-flex rounded-1 align-items-center
											border-primary mt-4 justify-content-space-between rounded w-100"
													style={{ color: '#01065B' }}
												>
													<i className="bi bi-lock-fill " style={{ fontSize: '0.875em' }}></i>
													<input
														name="userPassword"
														onChange={handleChange}
														type={secureText?'password':''}
														className="w-100 outline-0 bg-transparent border py-2 border-0 rounded"
														placeholder="Password"
														style={
															{
																outline: 'none',
																fontFamily: 'Montserrat-Regular',
																minHeight: '50px',
																fontSize: '0.875em'
															}}
													/>
													{secureText ? (
														<i
															className="color-primary bi bi-eye-fill"
															onClick={() => setSecureText(!secureText)}
															style={{ fontSize: '14px' }}></i>
													) : (
														<i
															className="bi bi-eye-slash-fill"
															onClick={() => setSecureText(!secureText)}
															style={{ fontSize: '14px' }}
														></i>
													)}

												</FormGroup>
											</Col>
											<Col className=''
												style={{
													outline: 'none', fontFamily: 'Montserrat',
													minHeight: '50px',
													minWidth: '270px'
												}}
											>
												<FormGroup className="px-0 gap-2 d-flex  align-items-center mt-4 rounded w-100">
													<Button
														style={{ fontFamily: 'Montserrat-Semi-Bold', minHeight: '50px' }}
														type="submit"
														variant="primary"

														className=" px-3  d-flex py-2 align-items-center w-100"
														disabled={Object.keys(errors).length > 0}

													>
														{loading ? (
															<Spinner className="m-0  text-white" />
														) : (
															<div className='d-flex m-0 gap-2 py-0 p-0 justify-content-center align-items-center'>
																<i className="bi text-white size-lg bi-box-arrow-in-right"></i>
																<p className="text-center text-light d-flex align-items-center m-0">Login</p>
															</div>)}
													</Button>
												</FormGroup>
											</Col>

											<p
												style={{
													marginTop: '10%',
													fontSize: 14,
													fontFamily: 'Montserrat',
												}}
												className="p-0 "
											>
												Forgot Password ?
											</p>
											<p
												style={{
													fontSize: 14,
													fontFamily: 'Montserrat',
													color: '#7A0D0C',
												}}
												className="m-0 p-0 color-secondary"
											>
												Contact Support
											</p>
										</div>
									</Form>
								)}
							</Formik>
						</Row>
						<Row className="w-100 d-flex justify-content-center">
							<FormGroup
								className="d-flex py-2 bg-secondary text-light rounded
							align-items-center gap-2
							rounded-1 justify-content-center w-50"
							>
								<i className="bi bi-download" style={{}}></i>
								<a
									className=""
									style={{
										textDecoration: 'none',
										color: '#fff',
									}}
									href='https://expo.dev/artifacts/eas/okeeQbTzXf7LK4e12rdjoB.apk'
								>
									Download App

								</a>
							</FormGroup>
						</Row>
					</Col>
				</Row>
			</Col>
		</Container>
	);
}
