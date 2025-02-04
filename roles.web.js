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
