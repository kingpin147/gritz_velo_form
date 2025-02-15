// roles.web.js
import { Permissions, webMethod } from "wix-web-module";
import { authorization, currentMember, badges } from "wix-members-backend";

// Assign the role to the member. If the assignment fails, throw an error.
export const myAssignRoleFunction = webMethod(Permissions.Anyone, async (roleId, memberId) => {
    // Validate input parameters.
    if (!roleId || !memberId) {
        throw new Error("Role ID and Member ID are required.");
    }

    const options = { suppressAuth: true };

    try {
        const result = await authorization.assignRole(roleId, memberId, options);
        console.log("Role assigned successfully to member", memberId);
        return result;
    } catch (error) {
        console.error("Error assigning role:", error);
        throw error; // rethrow error so that the client can handle it
    }
});

export const myAssignMembersFunction = webMethod(Permissions.Anyone, async (badgeId, memberId) => {
    try {
        const memberIds = [memberId,];

        const assignedMembers = await badges.assignMembers(badgeId, memberIds);

        console.log("Role assigned successfully to member:", memberIds);

        return assignedMembers;
    } catch (error) {
        console.error("Error assigning badge:", error);
        return { success: false, message: "Failed to assign badge", error };
    }
});





//below testing functios no use in actual site functionality 

// Optionally, you can update the other backend functions similarly.
export const myGetRolesFunction = webMethod(Permissions.Anyone, async () => {
    try {
        const roles = await currentMember.getRoles();
        return roles;
    } catch (error) {
        console.error(error);
        throw error;
    }
});

import { members } from "wix-members-backend";

export const myGetMemberFunction = webMethod(
    Permissions.Anyone,
    async (id, options) => {
        try {
            return members
                .getMember(id, options)
                .then((member) => {
                    const slug = member.profile.slug;
                    console.log(slug);
                    const name = `${member.contactDetails.firstName} ${member.contactDetails.lastName}`;
                    console.log(name);
                    const contactId = member.contactId;
                    console.log(contactId);
                    return member;
                })
                .catch((error) => {
                    console.error(error);
                });
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
);

export const myListMembersFunction = webMethod(Permissions.Anyone, () => {
    const badgeId = "6b77bc33-c9ef-4945-b492-56de48ab56ba";

    return badges
        .listMembers(badgeId)
        .then((memberIds) => {
            const firstMember = memberIds[0];
            return memberIds;
        })
        .catch((error) => {
            console.error(error);
        });
});

/*
 * Promise resolves to:
 * [
 *   "28d35f86-6694-4455-9dff-aff5d450b482",
 *   "72751428-2743-4bda-acf5-4218a4279cd3",
 *   "8831eed6-928e-4f85-b80a-e1e48fb7c4fd"
 * ]
 */

// Sample id value:
// '60a91ab6-5e30-4af2-9d5e-a205c351ffd7'
//
// Sample options value:
// {
//   fieldsets: [ 'FULL' ]
// }