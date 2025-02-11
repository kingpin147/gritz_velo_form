import { Permissions, webMethod } from "wix-web-module";
import { authorization, currentMember } from "wix-members-backend";

// Ensure the method is available and exposed
export const myAssignRoleFunction = webMethod(Permissions.Anyone, (roleId, memberId) => {
  const options = { suppressAuth: false };

  return authorization.assignRole(roleId, memberId, options)
    .then(() => {
      console.log("Role assigned successfully to member", memberId);
    })
    .catch((error) => {
      console.error("Error assigning role:", error);
    });
});


export const myGetRolesFunction = webMethod(Permissions.Anyone, () => {
  return currentMember
    .getRoles()
    .then((roles) => {
      return roles;
    })
    .catch((error) => {
      console.error(error);
    });
});

import { members } from "wix-members-backend";

// Sample id value:
// '60a91ab6-5e30-4af2-9d5e-a205c351ffd7'
//
// Sample options value:
// {
//   fieldsets: [ 'FULL' ]
// }

export const myGetMemberFunction = webMethod(
  Permissions.Anyone,
  (id, options) => {
    return members
      .getMember(id, options)
      .then((member) => {
        // const slug = member.profile.slug;
        // const name = `${member.contactDetails.firstName} ${member.contactDetails.lastName}`;
        // const contactId = member.contactId;
        return member;
      })
      .catch((error) => {
        console.error(error);
      });
  },
);

/* Promise resolves to:
 * {
 *   "_id": "f32cbc51-a331-442b-86c2-2c664613e8b9",
 *   "_createdDate": "2021-08-02T23:14:42.000Z",
 *   "_updatedDate": "2021-08-02T23:14:58.345Z",
 *   "lastLoginDate": "2021-08-02T23:17:29.000Z",
 *   "loginEmail": "claude.morales@example.com",
 *   "status": "APPROVED",
 *   "contactId": "f32cbc51-a331-442b-86c2-2c664613e8b9",
 *   "privacyStatus": "PUBLIC",
 *   "activityStatus": "ACTIVE",
 *   "contactDetails": {
 *     "firstName": "Claude",
 *     "lastName": "Morales",
 *     "phones": [
 *       "0747-769-460"
 *     ],
 *     "emails": [
 *       "claude.morales@example.com"
 *     ],
 *     "addresses": [
 *       {
 * "_id": "e151960c-04a7-43ef-aa17-a134916ded07",
 * "addressLine": "9373 Park Avenue",
 * "addressLine2": "Berkshire",
 * "city": "Ely",
 * "subdivision": "GB-ENG",
 * "country": "GB",
 * "postalCode": "PD50 8EU"
 *       }
 *     ],
 *     "customFields": {}
 *   },
 *   "profile": {
 *     "nickname": "claude.morales",
 *     "slug": "claudemorales"
 *   }
 * }
 */
