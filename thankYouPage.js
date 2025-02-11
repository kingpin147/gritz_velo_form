import wixLocation from 'wix-location';
import { getDashboardURL } from 'backend/bookingUtils';
import { currentMember } from "wix-members-frontend";

async function myGetRolesFunction() {
    try {
        const roles = await currentMember.getRoles();
        return roles.length > 0 ? roles[0].title : null;
    } catch (err) {
        console.error("Error fetching roles:", err);
        return null;
    }
}

// Function to get the member type from the collection name
function getMemberType(collectionName) {
    const mapping = {
        "Drivers": "SopirPengiriman",
        "RoomService": "RoomService(TidakDapur)",
        "Consultation": "Konsultasi",
        "RentAndOperate": "MenyewaDanMengoperasikan(Dapur)",
        "Wholesale": "Grosir",
        "RentalInformation": "Menyewakan",
        "Franchise": "Waralaba"
    };
    return mapping[collectionName] || null;
}

$w.onReady(async function () {
    try {
        const collectionName = await myGetRolesFunction();
        if (!collectionName) {
            console.error("Failed to retrieve roles.");
            return;
        }

        const memberType = getMemberType(collectionName);
        if (!memberType) {
            console.error("Member type not found for collection:", collectionName);
            return;
        }

        const dashboardURL = getDashboardURL(memberType);
        if (!dashboardURL) {
            console.error("Dashboard URL not found for member type:", memberType);
            return;
        }

        // Wait for 3 seconds before redirecting
        setTimeout(() => {
            wixLocation.to(dashboardURL);
        }, 3000);

    } catch (error) {
        console.error("Error handling booking confirmation:", error);
    }
});
