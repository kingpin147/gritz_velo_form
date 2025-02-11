// 7. Dynamic Homepage Redirection Based on Role - Part 1 (Backend)
// Location: Wix Velo Backend Code (backend/roles.js)
// Functionality: Retrieves the user's role from the Members database.

import wixData from 'wix-data';

export async function getUserRole(userId) {
    let result = await wixData.query("Members")
        .eq("memberIdField1", userId)
        .find();
    
    if (result.items.length > 0) {
        return result.items[0].role; // Return the assigned role
    }
    return null;
}
