import wixUsers from 'wix-users';
import wixLocation from 'wix-location';
import { myGetRolesFunction, getDashboardURL } from 'backend/roles';

$w.onReady(async function () {
    // Ensure the user is logged in before proceeding.
    const user = wixUsers.currentUser;
    if (!user.loggedIn) {
        console.warn("User is not logged in. Redirecting to login page...");
        wixLocation.to("/login");  // Redirect to login page if not logged in
        return;
    }

    const userId = user.id;

    try {
        // Retrieve the user's role from the Members collection.
        const memberRole = await myGetRolesFunction();
        if (!memberRole) {
            console.error("User role not found for user:", userId);
            return;
        }

        // Get the corresponding dashboard URL.
        const dashboardURL = getDashboardURL(memberRole);
        if (!dashboardURL) {
            console.error("Dashboard URL not defined for role:", memberRole);
            return;
        }

        // Prevent redirect loop: Check if the user is already on the dashboard.
        if (wixLocation.url === dashboardURL) {
            console.log("User is already on the correct dashboard:", dashboardURL);
            return;
        }

        // Redirect to the user's dashboard.
        wixLocation.to(dashboardURL);
    } catch (error) {
        console.error("Error fetching user role or dashboard:", error);
    }
});
