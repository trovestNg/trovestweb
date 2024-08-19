import { UserManager } from 'oidc-client';
import { Identity } from '../config/config';
import { toast } from 'react-toastify';

const userManager = new UserManager(Identity);



// Function to sign-in
export const loginUser = async () => {
  window.history.pushState(null, '', window.location.href);
  try {
    await userManager.signinRedirect({
      extraQueryParams: { prompt: 'login' }
  });
  } catch (error) {
    console.error('Error signing in:', error);
  }
};

// Function to handle callback after sign-in
export const handleCallback = async () => {
  try {
    const user = await userManager.signinRedirectCallback();
    // console.log({ gotten: userInfo })('User signed in:', user);
    // Save access token to local storage
    // localStorage.setItem('loggedInUser', JSON.stringify(user));
    return user;
    
  } catch (error) {
    console.error('Error handling callback:', error);
  }
};

// Function to retrieve user information
export const getUserInfo = async () => {
  try {
    const user = await userManager.getUser();
    return user
    if (user){
      return user
    }
    else{
      toast.error('Unable to get user!')
      return user
    }
    // console.log({ gotten: userInfo })('User information:', user);
    let role = 'Infosec';

    // PROD
    // if (user?.profile?.role?.includes("DOMAIN1\\RevPayInitiators")) {
    //   return INITIATOR;
    // }
    // if (user?.profile?.role?.includes("DOMAIN1\\RevPayAuthorizers")) {
    //   return APPROVER;
    // }
    // if (user?.profile?.role?.includes("DOMAIN1\\PaycloudViewers")) {
    //   return PAYCLOUDVIEWERS;
    // }
    // if (user?.profile?.role?.includes("DOMAIN1\\PAPSS_APPROVER")) {
    //   return PAPSS_APPROVER;
    // }
    // if (user?.profile?.role?.includes("DOMAIN1\\PAPSS_INITIATOR")) {
    //   return PAPSS_INITIATOR;
    // }

    // TEST
    // if (user?.profile?.role?.includes("DOMAIN1\\RevpayInitiatorsTest")) {
    //   role = 'INITIATOR';
    // }
    // if (user?.profile?.role?.includes("DOMAIN1\\RevpayApproversTest")) {
    //   role = "APPROVER";
    // }
    // if (user?.profile?.role?.includes("DOMAIN1\\PaycloudTestViewers")) {
    //   role = "PAYCLOUDVIEWERS";
    // }
    // // if (user?.profile?.role?.includes("DOMAIN1\\PAPSS_APPROVER")) {
    // //   role = PAPSS_APPROVER;
    // // }
    // // if (user?.profile?.role?.includes("DOMAIN1\\PAPSS_INITIATOR")) {
    // //   role = PAPSS_INITIATOR ;
    // // }
    // return role;
  } catch (error) {
    console.error('Error retrieving user info:', error);
    return null;
  }
};

export const refreshToken = async () => {
  try {
   const check = await userManager.startSilentRenew();
   console.log({renewed:check})
    
  } catch (error) {
    console.error('Unable to renew:', error);
  }
};


// Function to sign out
export const logoutUser = async () => {
  try {
    window.history.pushState(null, '', window.location.href='/');
    await userManager.signoutRedirect();
    //      window.onpopstate = function(event) {
    //         window.history.go(1);
  
    //       };
    //       localStorage.removeItem('access_token');  
    //       localStorage.clear()
    
    
  } catch (error) {
    console.error('Error signing out:', error);
  }
};

// Example usage
// loginUser(); // Initiates sign-in process

// // Handle callback after sign-in (e.g., in your callback route)
// handleCallback();

// // Retrieve user information
// getUserInfo();