import { UserManager } from 'oidc-client';
import { Identity } from '../config/config';
import { toast } from 'react-toastify';

const userManager = new UserManager(Identity);



// Function to sign-in
export const loginUser = async () => {
  try {
    await userManager.signinRedirect();
  } catch (error) {
    console.error('Error signing in:', error);
  }
};

// Function to handle callback after sign-in
export const handleCallback = async () => {
  try {
    const user = await userManager.signinRedirectCallback();
    console.log('User signed in:', user);
    // Save access token to local storage
    localStorage.setItem('loggedInUser', JSON.stringify(user));
    return user;
    
  } catch (error) {
    console.error('Error handling callback:', error);
  }
};

// Function to retrieve user information
export const getUserInfo = async () => {
  try {
    const user = await userManager.getUser();
    if (user){
      return user
    }
    else{
      toast.error('Unable to get user!')
    }
    console.log('User information:', user);
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



// Function to sign out
export const logoutUser = async () => {
  try {
    await userManager.signoutRedirect();
    // Clear token from local storage
    localStorage.removeItem('access_token');
    localStorage.clear()
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
