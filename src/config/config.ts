import Oidc, { UserManager, WebStorageStateStore } from 'oidc-client';


export const Identity = {
	authority: process.env.REACT_APP_AUTHORITY,
	client_id: process.env.REACT_APP_CLIENT,
	ClientSecrets: process.env.REACT_APP_SECRET,
	redirect_uri: process.env.REACT_APP_CALLBACK,
	response_type: 'code',
	scope: 'openid profile roles work_info policy-viewer-api-scope',
	post_logout_redirect_uri: process.env.REACT_APP_HOME + 'logout',
	userStore: new Oidc.WebStorageStateStore({ store: window.localStorage }),
	automaticSilentRenew: true,
	loadUserInfo: true,
	revokeAccessTokenOnSignout: true,
};

export const baseUrl = process.env.REACT_APP_POLICY_API

// export const Identity = {
// 	authority: 'https://idp-test.fsdhgroup.com/',
// 	client_id: 'ifeanyi',
// 	ClientSecrets: 'secret',
// 	redirect_uri:  'http://localhost:9090/callback' ,
// 	response_type: 'code',
// 	scope: 'openid profile roles work_info policy-viewer-api-scope',
// 	post_logout_redirect_uri:'http://localhost:9090/logout'
// };