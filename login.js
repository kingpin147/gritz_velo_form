// 5. Auto-Redirect Members to Their Dashboard on Login - Frontend
// Location: Wix Velo Site Code (Public Page or Master Page Code)
// Functionality: Detects user login, retrieves user role, and redirects them to the correct dashboard automatically.

import wixLocation from 'wix-location';
import wixUsers from 'wix-users';
import wixData from 'wix-data';
import { getDashboardURL } from 'backend/bookingUtils.js';

$w.onReady(async function () {
    let user = wixUsers.currentUser;
    if (!user.loggedIn) return;
    let userId = user.id;
    
    // Fetch member type and redirect to their dashboard
    let memberType = await getMemberType(userId);
    if (memberType) {
        let dashboardURL = getDashboardURL(memberType);
        if (dashboardURL) {
            wixLocation.to(dashboardURL);
        } else {
            console.error("No valid dashboard URL found for member type: ", memberType);
        }
    }
});

// Function to get the user's member type from the database
async function getMemberType(userId) {
    let result = await wixData.query("Members")
        .eq("memberIdField1", userId)
        .find();
    
    return result.items.length > 0 ? result.items[0].memberType : null;
}
