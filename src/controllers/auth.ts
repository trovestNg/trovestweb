import { UserManager } from 'oidc-client';
import { toast } from 'react-toastify';
import { persistor } from '../store/store';




// Function to sign out
export const logoutUser = async () => {
 
  try {
    persistor.purge()
    window.history.pushState(null, '', window.location.href='/');
    localStorage.clear()
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