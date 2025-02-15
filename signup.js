import wixData from 'wix-data';
import wixLocation from 'wix-location';
import wixUsers from 'wix-users';
import { currentMember } from "wix-members-frontend";
import { myAssignRoleFunction, myAssignMembersFunction } from "backend/roles.web";

$w.onReady(function () {
    let memberType = null;
    let formData = null;
    let memberId = "";

    // Submit button click: validate form, determine member type, and gather form data.
    $w('#submitButton').onClick(async () => {
        // 1. Validate the form.
        if (!validateForm()) {
            console.error("Validation failed. Please fill in all required fields.");
            return;
        }

        // 2. Determine the member type.
        memberType = getMemberType();
        if (!memberType) {
            console.error("No valid member type selected.");
            return;
        }

        // 3. Gather form data based on the member type.
        formData = gatherFormData(memberType);
        if (!formData) {
            console.error("Form data is incomplete.");
            return;
        }
        
        // Optional: If your Wix Form does not auto-submit, uncomment the next line.
        // $w("#registrationForm1").submit();
    });

    // Wix Form submitted event: perform member retrieval, assign roles/badges, insert data, and redirect.
    $w('#registrationForm1').onWixFormSubmitted(async (event) => {
        // 4. Retrieve the current member ID.
        try {
            const options = { "fieldsets": ["FULL"] };
            const member = await currentMember.getMember(options);
            memberId = member._id;
            console.log("Current member ID:", memberId);
        } catch (error) {
            console.error("Error retrieving current member:", error);
            return;
        }

        // 5. Get the collection name based on member type.
        const collectionName = getCollectionName(memberType);
        if (!collectionName) {
            console.error("Invalid member type selected.");
            return;
        }

        // 6. Get the role ID and badge ID (synchronously).
        const roleId = getRoleId(memberType);
        if (!roleId) {
            console.error("Role ID not found.");
            return;
        }
        const badgeId = getMemberBadgeId(memberType);
        if (!badgeId) {
            console.error("Badge ID not found.");
            return;
        }

        // 7. Assign the role.
        try {
            await myAssignRoleFunction(roleId, memberId);
            console.log("Role assigned successfully:", roleId);
            formData.memberRole = roleId;
        } catch (err) {
            console.error("Error assigning role:", err);
            return;
        }

        // 8. Assign the badge.
        try {
            await myAssignMembersFunction(badgeId, memberId);
            console.log("Badge assigned successfully:", badgeId);
            formData.memberBadge = badgeId;
        } catch (err) {
            console.error("Error assigning badge:", err);
            return;
        }

        // 9. Insert the form data into the appropriate collection.
        try {
            const insertResult = await wixData.insert(collectionName, formData);
            console.log(`Data successfully saved to ${collectionName}:`, insertResult);
        } catch (err) {
            console.error("Error saving data:", err);
            return;
        }

        // 10. Redirect the user based on member type.
        redirectToNextStep(memberType);
    });
});

// Validate required fields.
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

// Get the selected member type from dropdowns.
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

// Gather form data based on the member type.
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
                hotelPhoneNumber: $w("#input13").value,
                restaurant: $w("#dropdown6").value
            };
            break;
        case "Konsultasi":
            formData = {
                ...formData,
                memberType: "Konsultasi",
                name: $w("#input14").value, // For Konsultasi, name comes from #input14.
                name1: $w("#input11").value,
                email: $w("#input2").value,
                password: $w("#input1").value,
                phone: $w("#input8").value,
                location: $w("#dropdown7").value,
            };
            break;
        case "MenyewaDanMengoperasikan(Dapur)":
            formData = {
                ...formData,
                memberType: "MenyewaDanMengoperasikan(Dapur)",
                hotelName: $w("#input14").value,
                email: $w("#input2").value,
                password: $w("#input1").value,
                name: $w("#input5").value,
                managersPhoneNumber: $w("#input8").value,
                hotelPhoneNumber: $w("#input13").value,
                restaurant: $w("#dropdown6").value
            };
            break;
        case "Grosir":
            formData = {
                ...formData,
                memberType: "Grosir",
                name: $w("#input5").value,
                email: $w("#input2").value,
                password: $w("#input1").value,
                phone: $w("#input8").value,
                ktp: $w("#input4").value,
                npwp: $w("#input15").value
            };
            break;
        case "Menyewakan":
            formData = {
                ...formData,
                memberType: "Menyewakan",
                restaurantName: $w("#input11").value,
                name: $w("#input5").value,
                email: $w("#input2").value,
                password: $w("#input1").value,
                phone: $w("#input8").value,
            };
            break;
        case "Waralaba":
            formData = {
                ...formData,
                memberType: "Waralaba",
                namaWaralaba: $w("#input16").value,
                waralabaType: $w("#dropdown3").value,
                name: $w("#input5").value,
                email: $w("#input2").value,
                password: $w("#input1").value,
                phone: $w("#input8").value,
                lastName: $w("#input17").value
            };
            break;
        default:
            console.error("Member type not recognized:", memberType);
            return null;
    }

    return formData;
}

// Get the collection name based on member type.
function getCollectionName(memberType) {
    switch (memberType) {
        case "SopirPengiriman":
            return "Drivers";
        case "RoomService(TidakDapur)":
            return "HotelMembers";
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

// Get the role ID based on member type.
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

// Get the badge ID based on member type.
export function getMemberBadgeId(memberType) {
    const badgeIds = {
        "SopirPengiriman": "68c0dcdd-41ac-448c-86f4-a2a6677d5b7c",
        "RoomService(TidakDapur)": "781885b2-cbd2-4dcb-a98d-060bd3f08d0c",
        "MenyewaDanMengoperasikan(Dapur)": "121ad208-60fe-466b-b95c-be2b73b30098",
        "Grosir": "9a8b372c-ce22-4781-99e6-8ff020aa4bc4",
        "Konsultasi": "72cb2f29-536e-4d17-a41a-579d3a912231",
        "Waralaba": "6e698e1d-8849-4766-ba93-41440b87814c",
        "Menyewakan": "3a8e1a4b-d304-4c5a-ad37-ba7575619cad"
    };

    return badgeIds[memberType] || null;
}

// Redirect the user based on their member type.
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
