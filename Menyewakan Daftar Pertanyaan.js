/* Menyewakan Input Form Code (/daftar-pertanyaan/menyewakan) */
import wixData from 'wix-data';
import wixLocation from 'wix-location';
import wixUsers from 'wix-users';

$w.onReady(async function () {
  const user = wixUsers.currentUser;
  if (!user.loggedIn) return;
  const userId = user.id;
  
  const memberType = await getMemberType(userId);
  if (memberType !== "Menyewakan") {
    console.error("This page is for Menyewakan members only.");
    return;
  }
  
  $w("#memberIdField1").value = userId;

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
  data.propertySize = $w("#input1").value;
  data.kitchenOnLocation = $w("#input2").value;
  data.permissionToRenovate = $w("#input4").value;
  data.rentalPeriod = $w("#input5").value;
  data.rentalCost = $w("#input6").value;
  data.kitchenEquipment = concatenateValues(["#input3", "#checkboxGroup3"]);
  data.electricSupply = $w("#dropdown2").value;
  data.permits = concatenateValues(["#checkboxGroup1"]);
  data.zone = $w("#dropdown1").value;
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
  const fields = ["#input1", "#input2", "#input4", "#input5", "#input6"];
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
  if (memberType === "Menyewakan") return "RentalInformation";
  return null;
}

function handleRedirection(memberType) {
  if (memberType === "Menyewakan")
    wixLocation.to("/booking-calendar/sewa-restaron-pemilik-properti");
}
