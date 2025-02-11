import wixData from 'wix-data';
import wixLocation from 'wix-location';
import wixUsers from 'wix-users';
import { currentMember } from "wix-members-frontend";
import { myAssignRoleFunction } from "backend/roles.web";

// Set up the onReady function
$w.onReady(function () {
  // Attach event listener to the submit button.
  $w('#submitButton').onClick(async () => {
    const user = wixUsers.currentUser;

    // Ensure the user is logged in.
    if (!user.loggedIn) {
      console.error("User not logged in.");
      return;
    }

    const memberId = user.id;

    // Validate the form before proceeding
    if (!validateForm()) {
      console.error("Validation failed. Please fill in all required fields.");
      return;
    }

    // Determine the member type based on dropdown selections
    let memberType = getMemberType();
    if (!memberType) {
      console.error("No valid member type selected.");
      return;
    }

    // Collect form data based on the member type
    let formData = gatherFormData(memberType);

    if (!formData) {
      console.error("Form data is incomplete.");
      return;
    }

    // Determine the correct collection name for the member type
    const collectionName = getCollectionName(memberType);
    if (!collectionName) {
      console.error("Invalid member type selected.");
      return;
    }

    // Insert the form data into the correct database collection
    try {
      await wixData.insert(collectionName, formData);
      console.log(`Data successfully saved to ${collectionName}`);
    } catch (err) {
      console.error("Error saving data:", err);
      return;
    }

    // Assign the appropriate role to the member
    const roleId = getRoleId(memberType);
    if (!roleId) {
      console.error("Role ID not found.");
      return;
    }

    try {
      const result = await myAssignRoleFunction(roleId, memberId);
      console.log("Role assigned successfully:", roleId, result);
    } catch (err) {
      console.error("Error assigning role:", err);
    }

    // Update the member's record with the assigned role
    try {
      let queryResult = await wixData.query(collectionName).eq("memberIdField1", memberId).find();
      if (queryResult.items.length > 0) {
        let memberItem = queryResult.items[0];
        memberItem.memberRole = roleId; // Update the "memberRole" field
        await wixData.update(collectionName, memberItem);
        console.log("Member role updated in collection.");
      } else {
        console.error("Member item not found in", collectionName);
      }
    } catch (err) {
      console.error("Error updating member role:", err);
    }

    // Redirect based on the selected member type
    redirectToNextStep(memberType);
  });
});

// Function to validate the form fields
function validateForm() {
  const requiredFields = ["#inputFirstName", "#inputLastName", "#inputEmail", "#inputPhone"];
  let valid = true;

  requiredFields.forEach(fieldId => {
    const field = $w(fieldId);
    if (!field.hidden && (!field.value || field.value === "")) {
      field.focus();
      valid = false;
    }
  });

  return valid;
}

// Function to get the selected member type from dropdowns
function getMemberType() {
  if ($w("#dropdown1").value === "SopirPengiriman" || $w("#dropdown1").value === "Grosir") {
    return $w("#dropdown1").value;
  } else if ($w("#dropdown4").value) {
    return $w("#dropdown4").value;
  } else if ($w("#dropdown2").value) {
    return $w("#dropdown2").value;
  }
  return null;
}

// Function to gather form data based on member type
function gatherFormData(memberType) {
  let formData = { memberId: wixUsers.currentUser.id };
  switch (memberType) {
    case "SopirPengiriman":
      formData = {
        ...formData,
        memberType: "SopirPengiriman",
        name: $w("#input5").value,
        password: $w("#input1").value,
        email: $w("#input2").value,
        phoneNumber: $w("#input8").value,
        ktp: $w("#input4").value,
        simNumber: $w("#input10").value,
        addedBy: $w("#dropdown5").value
      };
      break;
    case "RoomService(TidakDapur)":
      formData = {
        ...formData,
        memberType: "RoomService(TidakDapur)",
        hotelName: $w("#input14").value,
        email: $w("#input2").value,
        password: $w("#input1").value,
        name: $w("#input5").value,
        managersPhone: $w("#input8").value,
        hotelAddress: $w("#addressInput1").value,
        hotelPhoneNumber: $w("#input13").value,
        restaurant: $w("#dropdown6").value
      };
      break;
    // Add other member types following a similar pattern...
    default:
      return null;
  }
  return formData;
}

// Function to get the collection name based on member type
function getCollectionName(memberType) {
  switch (memberType) {
    case "SopirPengiriman":
      return "Drivers";
    case "RoomService(TidakDapur)":
      return "RoomService";
    case "Konsultasi":
      return "Consultation";
    case "MenyewaDanMengoperasikan(Dapur)":
      return "RentAndOperate";
    case "Grosir":
      return "Wholesale";
    case "Menyewakan":
      return "RentalInformation";
    case "Waralaba":
      return "Franchise";
    default:
      return null;
  }
}

// Function to get the role ID based on member type
function getRoleId(memberType) {
  const roles = {
    "SopirPengiriman": "b93ce41d-bb23-4463-8bf9-be82adf8ab04",
    "RoomService(TidakDapur)": "d034ccff-11df-4556-91bf-2aabe2edaf97",
    "MenyewaDanMengoperasikan(Dapur)": "6b77bc33-c9ef-4945-b492-56de48ab56ba",
    "Grosir": "017520b5-a945-4515-a14d-ef3bd9e43524",
    "Konsultasi": "30044550-09b4-4c68-b85e-8178428a5ee1",
    "Waralaba": "b11c1560-4d1b-4f8a-a821-563d2af040a8",
    "Menyewakan": "4b464763-5bec-45f2-a655-cfb0731b0706"
  };
  return roles[memberType];
}

// Function to redirect the user based on their member type
function redirectToNextStep(memberType) {
  switch (memberType) {
    case "SopirPengiriman":
      wixLocation.to("/daftar-pertanyaan/sopir-pengiriman");
      break;
    case "RoomService(TidakDapur)":
      wixLocation.to("/daftar-pertanyaan/roomservice3");
      break;
    case "MenyewaDanMengoperasikan(Dapur)":
      wixLocation.to("/daftar-pertanyaan/mengoperasikan");
      break;
    case "Menyewakan":
      wixLocation.to("/daftar-pertanyaan/menyewakan");
      break;
    case "Konsultasi":
      wixLocation.to("/daftar-pertanyaan/konsultasi1");
      break;
    case "Waralaba":
      wixLocation.to("/daftar-pertanyaan/pemilik-waralaba");
      break;
    case "Grosir":
      wixLocation.to("/akun-grosir");
      break;
    default:
      wixLocation.to("/default-second-form");
  }
}
