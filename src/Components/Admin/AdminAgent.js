import React, { useEffect, useState } from 'react';
import styles from './agent.module.css';
import style from './admin.module.css';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
	convertToThousand,
	defaultImage,
	dateFormat,
	user_storage_token,
	calculateRevenueTotal,
} from '../../config';
import mail from '../../Assets/Svg/mail.svg';
import next from '../../Assets/Images/next.png';
import nextwhite from '../../Assets/Images/nextwhite.png';
import Card from '../Shared/Card/Card';
import Loader from '../Modal/Loader';
import DisplayMessage from '../Message';
import {
	getAdminAgentCollection,
	getSuperAdminAgentCollection,
} from '../../Sagas/Requests';
import { setAgenCollectiontAction } from '../../Reducers/agent.reducer';

export default function Agent() {
	const token = localStorage.getItem(user_storage_token);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const superAdmin = useSelector((state) => state);
	const agents = superAdmin.admins.agents;
	const [loading, setloading] = useState(false);
	const { agentid } = useParams();
	const [revenue, setrevenue] = useState(0);
	const [collections, setcollections] = useState([]);
	const [agent, setagent] = useState({});
	const [active, setactive] = useState('deposit');

	useEffect(() => {
		setloading(true);
		checkAgent();
		if (agents.length > 0) {
			const filteredAgent = agents?.find((item) => {
				return item._id === agentid;
			});
			let total = 0;
			setrevenue(total);
			setagent(filteredAgent);
			getCollection();
		}
	}, [agentid]);

	const checkAgent = () => {
		if (!token) {
			alert('Unauthorized');
			setloading(false);
			return navigate('/');
		}
	};

	const getCollection = async () => {
		try {
			if (token) {
				const response = await getSuperAdminAgentCollection({
					agent_id: agentid,
					token,
				});
				const { success, message, data } = response.data;
				if (success === true) {
					dispatch(setAgenCollectiontAction(data.collections));
					setcollections(data.collections);
					let total = 0;
					data?.collections.map((item) => {
						total += item.total;
					});
					setrevenue(total);
					setloading(false);
				} else {
					setloading(false);
					DisplayMessage(message, 'warning');
				}
			} else {
				setloading(false);
				DisplayMessage('Unauthorized', 'warning', 'Not authorized');
			}
		} catch (error) {
			setloading(false);
			DisplayMessage(error.message, 'warning', error.message);
		}
	};

	const navigateToCollection = (id) => {
		navigate(`/admin/agent/${agentid}/${id}`);
	};
	return (
		<>
			{loading && <Loader />}
			<div
				className={`${styles.container} container`}
				style={{
					flexDirection: 'column',
					marginBottom: '9em',
				}}
			>
				<div>
					<div className={styles.window}>
						<div className={styles.profile}>
							<img src={defaultImage} alt="profile-image" className="card" />
							<div className={styles.data}>
								<h3>{`${agent.first_name} ${agent.last_name}`}</h3>
								<h4>{`${agent.assigned_id}`}</h4>
								<h4>{`${agent.mobile}`}</h4>
								<h4>{`${agent.gender}`}</h4>
							</div>
						</div>
						<div
							className={style.dashboardintro}
							style={{
								width: '97%',
								marginTop: '3em',
							}}
						>
							{/* <div className={style.notification} style={{
                                marginRight: '1em',
                                marginTop: '.2em'
                            }}>
                                <img src={mail} alt="mail" />
                            </div> */}
							<div className={styles.agentData}>
								<div className={styles.profiledetails}>
									<h3>Revenue Generated</h3>
									<h5>{`${convertToThousand(revenue || 0)}`}</h5>
								</div>
								<div
									className={`${styles.profiledetails} ${styles.profiledetails2}`}
								>
									<div className={styles.profiledetails1}>
										<h3
											style={{
												marginTop: '1.3em',
											}}
										>
											Clients Onboarded
										</h3>
										<p>{agent?.artisans?.length || 0}</p>
									</div>
									<img src={nextwhite} alt="mail" />
								</div>
							</div>
						</div>
					</div>
					<div className={styles.transaction}>
						<h3>Transaction Recordsds</h3>
						{/* <img src={next} alt="mail" /> */}
					</div>
					<div
						className={styles.transaction}
						style={{
							justifyContent: 'center',
							marginTop: '.5em',
							width: '100%',
							backgroundColor: 'red',
						}}
					>
						<div
							className={styles.deposit}
							onClick={() => setactive('deposit')}
						>
							<h3>Deposits</h3>
						</div>
						<div
							className={styles.withdrawn}
							onClick={() => setactive('collection')}
						>
							<h3>Collection</h3>
							{/* <h3>Withdrawn</h3> */}
						</div>
					</div>
					<div className={styles.transaction1}>
						<h3>Reference No</h3>
						<h3>Amount</h3>
					</div>
					{collections?.map(
						(item) =>
							item.status === 1 && (
								<Card
									styles={style.tabledata}
									key={item._id}
									style={{
										width: '97%',
									}}
									onClick={() => navigateToCollection(item._id)}
								>
									<div className={style.details}>
										<div className={style.namedetails}>
											<h3>{item.payment_reference}</h3>
											<h3 className={style.date}>
												{dateFormat(item.datePaid)}
											</h3>
										</div>
									</div>
									<div className={style.amount}>
										<h3>{`${convertToThousand(item.total)}`}</h3>
									</div>
								</Card>
							)
					)}
				</div>
			</div>
		</>
	);
}
