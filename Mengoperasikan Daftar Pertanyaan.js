/* Menyewa Dan Mengoperasikan Input Form Code (/daftar-pertanyaan/mengoperasikan) */
import wixData from 'wix-data';
import wixLocation from 'wix-location';
import wixUsers from 'wix-users';

$w.onReady(async function () {
  const user = wixUsers.currentUser;
  if (!user.loggedIn) return;
  const userId = user.id;
  
  // Retrieve the member type.
  const memberType = await getMemberType(userId);
  if (memberType !== "MenyewaDanMengoperasikan(Dapur)") {
    console.error("This page is for MenyewaDanMengoperasikan members only.");
    return;
  }
  
  $w("#memberIdField").value = userId;

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
  data.numberOfRooms = $w("#input1").value;
  data.atmosphere = $w("#input3").value;
  data.diningArea = $w("#input4").value;
  data.dinnerSet = $w("#input2").value;
  data.demonstration = concatenateValues(["#input2", "#checkboxGroup1", "#checkboxGroup2"]);
  data.kitchenSize = $w("#input7").value;
  data.stillOperational = $w("#input8").value;
  data.remainingStaff = $w("#input9").value;
  data.kitchenEquipment = concatenateValues(["#checkboxGroup3"]);
  data.electricSupply = $w("#dropdown1").value;
  data.zone = $w("#dropdown2").value;
  data.permit = concatenateValues(["#checkboxGroup4"]);
  return data;
}

function concatenateValues(selectors) {
  let vals = [];
  selectors.forEach(s => {
    const el = $w(s);
    if (el.type === "checkboxGroup") {
      const arr = el.value;
      if (arr) vals = vals.concat(arr);
    } else if (el.value) {
      vals.push(el.value);
    }
  });
  return vals.join(", ");
}

function validateForm() {
  const fields = ["#input1", "#input3", "#input4", "#input5", "#inout7", "#input8", "#input9"];
  let valid = true;
  fields.forEach(f => {
    const el = $w(f);
    if (!el.hidden && (!el.value || el.value === "")) {
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
  if (memberType === "MenyewaDanMengoperasikan(Dapur)") return "RentAndOperate";
  return null;
}

function handleRedirection(memberType) {
  if (memberType === "MenyewaDanMengoperasikan(Dapur)")
    wixLocation.to("/booking-calendar/membuta-janji-gritz-menyewa-dan-mengoperasikan");
}
