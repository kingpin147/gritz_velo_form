// backend/bookingUtils.js
import wixData from 'wix-data';

/**
 * Retrieves the member type for the given userId from the Members collection.
 * @param {string} userId - The current user's ID.
 * @returns {Promise<string|null>} The memberType if found, otherwise null.
 */
export async function getMemberType(userId) {
  try {
    const result = await wixData.query("Members")
      .eq("memberIdField1", userId)
      .find();
    return result.items.length > 0 ? result.items[0].memberType : null;
  } catch (error) {
    console.error("Error querying Members collection:", error);
    return null;
  }
}

/**
 * Returns the dashboard URL based on the provided memberType.
 * @param {string} memberType - The type of the member.
 * @returns {string|null} The corresponding dashboard URL.
 */
export function getDashboardURL(memberType) {
  switch (memberType) {
    case "RoomService(TidakDapur)":
      return "https://www.gritz.id/hotelakunanggota";
    case "MenyewaDanMengoperasikan(Dapur)":
      return "https://www.gritz.id/hotels/menyewa-dan-mengoperisikan";
    case "Menyewakan":
      return "https://www.gritz.id/akun-restaron/pemilik-properti";
    case "Konsultasi":
      return "https://www.gritz.id/akun-restaron/konsultasi";
    case "Waralaba":
      return "https://www.gritz.id/akun-restaron/pemilik-waralaba";
    case "SopirPengiriman":
      return "https://www.gritz.id/sopirpengirimanakunanggota";
    case "Grosir":
      return "https://www.gritz.id/akun-grosir";
    default:
      return null;
  }
}
