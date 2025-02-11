/* Room Service Input Form Code (/daftar-pertanyaan/roomservice3) */
import wixData from 'wix-data';
import wixLocation from 'wix-location';
import wixUsers from 'wix-users';

$w.onReady(async function () {
  const user = wixUsers.currentUser;
  if (!user.loggedIn) return;
  const userId = user.id;
  
  // Retrieve the member type from the Members collection.
  const memberType = await getMemberType(userId);
  if (memberType !== "RoomService(TidakDapur)") {
    console.error("This page is for Room Service members only.");
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
    console.error(e);
    return null;
  }
}

function collectFormData() {
  let data = {};
  data.numberOfRooms = $w("#input1").value;
  data.atmosphere = $w("#input3").value;
  data.diningArea = $w("#input4").value;
  data.dinnerSet = $w("#input5").value;
  data.demonstration = concatenateValues(["#input2", "#checkboxGroup1", "#checkboxGroup2"]);
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
  const fields = ["#input1", "#input3", "#input4", "#input5"];
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
    console.error(e);
    throw e;
  }
}

function getCollectionName(memberType) {
  if (memberType === "RoomService(TidakDapur)") return "RoomService";
  return null;
}

function handleRedirection(memberType) {
  if (memberType === "RoomService(TidakDapur)")
    wixLocation.to("/booking-calendar/membuat-janji-gritz-room-service");
}
