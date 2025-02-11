// Section 8: Dynamic Homepage Redirection Based on Role - Frontend Code
// This code runs on your Home Page (or Master Page) to redirect a logged-in user to their dashboard.

import wixUsers from 'wix-users';
import wixLocation from 'wix-location';
import { getUserRole, getDashboardURL } from 'backend/roles';

$w.onReady(async function () {
    // Check if the user is logged in.
    const user = wixUsers.currentUser;
    if (!user.loggedIn) return;  // No redirection for not logged in users.
    
    const userId = user.id;
    // Retrieve the user's role from the Members collection.
    const memberRole = await getUserRole(userId);
    if (!memberRole) {
        console.error("User role not found for user:", userId);
        return;
    }
    
    // Map the member role to the correct dashboard URL.
    const dashboardURL = getDashboardURL(memberRole);
    if (!dashboardURL) {
        console.error("Dashboard URL not defined for role:", memberRole);
        return;
    }
    
    // Optionally, prevent redirect loop by checking if the current URL is already the dashboard.
    // For simplicity, we redirect directly:
    wixLocation.to(dashboardURL);
});
