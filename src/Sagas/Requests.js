import axios from 'axios';
import { host } from '../config';
import { host2 } from '../config';
// const baseUrl = `${host}/api/v1`;
const baseUrl =`${host2}/api/v1`;


const headers = {
	Accept: 'application/json',
	'Access-Control-Allow-Origin': '*',
};



// Create Admin
export const createSuperAdminAdmin = (data, token) => {
	headers.authorization = `Bearer ${token}`;
	headers['Content-Type'] = 'multipart/form-data';
	const requestOptions = {
		method: 'post',
		url: `${baseUrl}/super/create-admin`,
		headers: headers,
		data: data,
	};
	return axios(requestOptions);
};



// Create finconn
export const createFinconAccount = (data, token) => {
	headers.authorization = `Bearer ${token}`;
	headers['Content-Type'] = 'multipart/form-data';
	const requestOptions = {
		method: 'post',
		url: `${baseUrl}/super/create-fincon`,
		headers: headers,
		data: data,
	};
	return axios(requestOptions);
};

// this function has been replaced with the dashboard endpoint
export const getSuperAdmins = (token) => {
	headers.authorization = `Bearer ${token}`;
	const requestOptions = {
		method: 'get',
		url: `${baseUrl}/super/get/registered/admin`,
		// url: `${baseUrl}/super/get-created-agents`,
		headers: headers,
	};
	return axios(requestOptions);
};


// This function return an admin and its agent
export const superAdminGetAdminAgents = (payload) => {
	const { page, limit, token, admin_id } = payload;
	headers.authorization = `Bearer ${token}`;
	const requestOptions = {
		method: 'get',
		url: `${baseUrl}/super/get-admin-agents/${admin_id}?page=${page}&limit=${limit}`,
		headers: headers,
	};
	return axios(requestOptions);
};

export const superGetAllClients = (payload) => {
	const { page, limit, token, admin_id } = payload;
	headers.authorization = `Bearer ${token}`;
	const requestOptions = {
		method: 'get',
		url: `${baseUrl}/super/get-admin-agents/${admin_id}?page=${page}&limit=${limit}`,
		headers: headers,
	};
	return axios(requestOptions);
};

// This function return an Agent and its artisans
export const superAdminGetAgentArtisans = (payload) => {
	const { page, limit, token, agent_id } = payload;
	headers.authorization = `Bearer ${token}`;
	const requestOptions = {
		method: 'get',
		url: `${baseUrl}/super/agent-artisans/${agent_id}?page=${page}&limit=${limit}`,
		headers: headers,
	};
	return axios(requestOptions);
};

// This function return an artisan
export const superAdminGetArtisan = (payload) => {
	const { token, artisan_id } = payload;
	headers.authorization = `Bearer ${token}`;
	const requestOptions = {
		method: 'get',
		url: `${baseUrl}/super/artisan/${artisan_id}`,
		headers: headers,
	};
	return axios(requestOptions);
};

// This function searchs for admin
//working fine but update to filter search result to admin Id and let it come with same data as original
export const superAdminSearchAdmin = (payload) => {
	const { token, page, limit, name } = payload;
	headers.authorization = `Bearer ${token}`;
	const requestOptions = {
		method: 'get',
		url: `${baseUrl}/super/search-admin?name=${name}&page=${page}&limit=${limit}`,
		headers: headers,
	};
	return axios(requestOptions);
};

// This function searchs for agent
export const superAdminSearchAgent = (payload) => {
	const { token, page, limit, name, admin_id } = payload;
	headers.authorization = `Bearer ${token}`;
	const requestOptions = {
		method: 'get',
		
		url: `${baseUrl}/super/search-agent?name=${name}&page=${page}&limit=${limit}&admin_id=${admin_id}`,
		headers: headers,
	};
	return axios(requestOptions);
};

// This function searchs for artisans

//working fine too but does not filter the searched word exclusive to the admin Id
export const superAdminSearchArtisans = (payload) => {
	const { token, page, limit, name, agent_id } = payload;
	headers.authorization = `Bearer ${token}`;
	const requestOptions = {
		method: 'get',
		url: `${baseUrl}/super/search-artisan?name=${name}&page=${page}&limit=${limit}&agent_id=${agent_id}`,
		headers: headers,
	};
	return axios(requestOptions);
};

export const loginSuperAdminRequest = (data) => {
	const requestOptions = {
		method: 'post',
		url: `${baseUrl}/super/login-super-admin`,
		headers: headers,
		data: data,
	};
	return axios(requestOptions);
};

export const loginAdminRequest = (data) => {
	const requestOptions = {
		method: 'post',
		url: `${baseUrl}/admin/login-admin`,
		headers: headers,
		data: data,
	};
	return axios(requestOptions);
};

// This function gets a particular collection with those that paid and amount of each person
export const superAdminGetCollection = (data) => {
	const { collection_id, token } = data;
	headers.authorization = `Bearer ${token}`;
	const requestOptions = {
		method: 'get',
		url: `${baseUrl}/super/collection/${collection_id}`,
		headers: headers,
	};
	return axios(requestOptions);
};
export const getAdminAgentCollection = (data) => {
	const { agent_id, token } = data;
	headers.authorization = `Bearer ${token}`;
	const requestOptions = {
		method: 'get',
		url: `${baseUrl}/admin/thrifts/${agent_id}`,
		headers: headers,
	};
	return axios(requestOptions);
};

// This endpoint get the collections of a particular agent
export const getSuperAdminAgentCollection = (data) => {
	const { agent_id, token } = data;
	headers.authorization = `Bearer ${token}`;
	const requestOptions = {
		method: 'get',
		url: `${baseUrl}/super/get-agent-collections/${agent_id}`,
		headers: headers,
	};
	return axios(requestOptions);
};

export const getCollectionHistory = (data) => {
	const { collection_id, token } = data;
	headers.authorization = `Bearer ${token}`;
	const requestOptions = {
		method: 'get',
		url: `${baseUrl}/super/collection-history/${collection_id}`,
		headers: headers,
	};
	return axios(requestOptions);
};

export const sendBroadCast = (data) => {
	headers.authorization = `Bearer ${data.token}`;
	const requestOptions = {
		method: 'post',
		url: `${baseUrl}/super/send-broadcast`,
		headers: headers,
		data: data,
	};
	return axios(requestOptions);
};

export const getSuperAdminBroadcast = (token) => {
	headers.authorization = `Bearer ${token}`;
	const requestOptions = {
		method: 'get',
		url: `${baseUrl}/super/broadcasts`,
		headers: headers,
	};
	return axios(requestOptions);
};

export const getAdminBroadcast = (token) => {
	headers.authorization = `Bearer ${token}`;
	const requestOptions = {
		method: 'get',
		url: `${baseUrl}/admin/broadcasts`,
		headers: headers,
	};
	return axios(requestOptions);
};






// Admin functions

// This function is meant for admin to get their agents by passing in the token
export const getAdminAgents = (payload) => {
	const { page, limit, token } = payload;
	headers.authorization = `Bearer ${token}`;
	const requestOptions = {
		method: 'get',
		url: `${baseUrl}/admin/get-admin-agents?page=${page}&limit=${100}`,
		headers: headers,
	};
	return axios(requestOptions);
};

// Admin create agent
export const adminCreateAgent = (data, token) => {
	headers.authorization = `Bearer ${token}`;
	headers['Content-Type'] = 'multipart/form-data';
	const requestOptions = {
		method: 'post',
		url: `${baseUrl}/admin/create-agent`,
		headers: headers,
		data: data,
	};
	return axios(requestOptions);
};

// This function returns admin data only using token
export const getAdmin = (token) => {
	headers.authorization = `Bearer ${token}`;
	const requestOptions = {
		method: 'get',
		url: `${baseUrl}/admin/get-admin`,
		headers: headers,
	};
	return axios(requestOptions);
};

export const debitClient = (payload) => {
	const {data, token, userId}= payload
	headers.authorization = `Bearer ${token}`;
	headers['Content-Type'] = 'application/json';
	const requestOptions = {
		method: 'post',
		url: `${baseUrl}/admin/payout/${userId}`,
		data: {amount :data},
		headers: headers,
		
	};
	return axios(requestOptions);
};

export const resetAgentPassword = (payload) => {
	const {pass, token, userId}= payload
	headers.authorization = `Bearer ${token}`;
	headers['Content-Type'] = 'application/json';
	const requestOptions = {
		method: 'patch',
		url: `${baseUrl}/admin/agent/password/${userId}`,
		data: {"password" :pass},
		headers: headers,
		
	};
	return axios(requestOptions);
};

export const updateClientInfo = (payload) => {
	const {body, token, artisanId}= payload
	headers.authorization = `Bearer ${token}`;
	headers['Content-Type'] = 'application/json';
	const requestOptions = {
		method: 'patch',
		url: `${baseUrl}/admin/update-artisan/${artisanId}`,
		data: {"mobile" :body},
		headers: headers,
		
	};
	return axios(requestOptions);
};

export const adminUpdateAgentBio = (payload) => {
	const {info, token, agentId}= payload
	headers.authorization = `Bearer ${token}`;
	headers['Content-Type'] = 'application/json';
	const requestOptions = {
		method: 'patch',
		url: `${baseUrl}/admin/update-agent/${agentId}`,
		data: { 
			"first_name": info?.firstName,
			"last_name": info?.lastName,
			"mobile": info?.phoneNumber,
			"email": info?.newMail,
		},
		headers: headers,
		
	};
	return axios(requestOptions);
};

export const adminUpdateArtisanBio = (payload) => {
	console.log("updated to :",payload);
	const {artisanId, body, token}= payload
	headers.authorization = `Bearer ${token}`;
	headers['Content-Type'] = 'application/json';
	const requestOptions = {
		method: 'patch',
		url: `${baseUrl}/admin/update-artisan/${artisanId}`,
		data: body,
		headers: headers,
		
	};
	return axios(requestOptions);
};



