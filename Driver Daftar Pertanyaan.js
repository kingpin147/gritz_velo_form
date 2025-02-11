/* Sopir Pengiriman Input Form Code (/daftar-pertanyaan/sopir-pengiriman) */
import wixData from 'wix-data';
import wixLocation from 'wix-location';
import wixUsers from 'wix-users';

$w.onReady(async function () {
  const user = wixUsers.currentUser;
  if (!user.loggedIn) return;
  const userId = user.id;
  
  const memberType = await getMemberType(userId);
  if (memberType !== "SopirPengiriman") {
    console.error("This page is for SopirPengiriman members only.");
    return;
  }
  
  $w("#memberIdField1").value = userId;

  // Hide #checkbox1 initially.
  $w("#checkbox1").hide();
  
  // Show or hide #checkbox1 based on #selectionTags1.
  $w("#selectionTags1").onChange(() => {
    if ($w("#selectionTags1").value.includes("Iya")) {
      $w("#checkbox1").show();
    } else {
      $w("#checkbox1").hide();
    }
  });

  $w("#submitButton").onClick(async function () {
    if (!validateForm()) return;
    const data = collectFormData();
    await updateMemberData(memberType, userId, data);
    handleRedirection(memberType);
  });
});

async function getMemberType(userId) {
  try {
    const result = await wixData.query("Members")
      .eq("memberIdField1", userId)
      .find();
    return result.items.length > 0 ? result.items[0].memberType : null;
  } catch (e) {
    console.error("Error fetching member type:", e);
    return null;
  }
}

function collectFormData() {
  let data = {};
  data.installmentPlan = $w("#selectionTags1").value;
  // Store a string value for the checkbox (or use boolean as needed)
  data.installmentAgreement = $w("#checkbox1").checked ? "true" : "false";
  return data;
}

function validateForm() {
  // Only #selectionTags1 is required.
  const fields = ["#selectionTags1"];
  let valid = true;
  fields.forEach(f => {
    const el = $w(f);
    if (!el.hidden && (!el.value || el.value.length === 0)) {  // Fixed for arrays
      el.focus();
      valid = false;
    }
  });
  return valid;
}

async function updateMemberData(memberType, userId, formData) {
  const col = getCollectionName(memberType);
  if (!col) {
    console.error("Invalid collection name.");
    return;
  }
  try {
    const result = await wixData.query(col)
      .eq("memberIdField1", userId)
      .find();
    if (result.items.length > 0) {
      let item = result.items[0];
      Object.assign(item, formData);
      await wixData.update(col, item);
    } else {
      console.error("Member item not found in", col);
    }
  } catch (e) {
    console.error("Error updating member data:", e);
  }
}

function getCollectionName(memberType) {
  if (memberType === "SopirPengiriman") return "Drivers";
  return null;
}

function handleRedirection(memberType) {
  if (memberType === "SopirPengiriman") {
    const installmentPlan = $w("#selectionTags1").value;
    if (installmentPlan.includes("Iya")) {
      // Redirect to the product page.
      wixLocation.to("/daftar-pertanyaan/sopir-pengiriman");
    } else {
      // Redirect to the booking page.
      wixLocation.to("/booking-calendar/sopir-pengiriman?referral=book_button_widget");
    }
  }
}
