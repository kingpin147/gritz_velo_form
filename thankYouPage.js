// Frontend Code for the Thank You Page (Post-Booking Redirect)
// File: (e.g., Section4_BookingConfirmationRedirect.js)
// Place this code in your thank-you page's Page Code panel.

import wixUsers from 'wix-users';
import wixBookings from 'wix-bookings';
import wixLocation from 'wix-location';
import { getMemberType, getDashboardURL } from 'backend/bookingUtils';

$w.onReady(async function () {
  // Ensure the user is logged in.
  const user = wixUsers.currentUser;
  if (!user.loggedIn) {
    wixLocation.to("/login");
    return;
  }
  const userId = user.id;
  
  // Check if the current user has any confirmed bookings.
  const isConfirmed = await confirmBooking();
  
  if (isConfirmed) {
    // Retrieve the member type from the backend.
    const memberType = await getMemberType(userId);
    if (!memberType) {
      displayError("Unable to retrieve your member type. Please contact support.");
      return;
    }
    // Get the dashboard URL based on the member type.
    const dashboardURL = getDashboardURL(memberType);
    if (!dashboardURL) {
      displayError("Dashboard URL not found for your member type. Please contact support.");
      return;
    }
    // Redirect the user to their dashboard.
    wixLocation.to(dashboardURL);
  } else {
    // If no confirmed booking, display an error message.
    displayError("Your booking is not confirmed yet. Please check your email or contact support for assistance.");
  }
});

/**
 * Checks if the current user has any bookings with status "CONFIRMED"
 * using the standard Wix Bookings API.
 * @returns {Promise<boolean>} True if at least one confirmed booking exists.
 */
async function confirmBooking() {
  try {
    const bookings = await wixBookings.getMyBookings();
    // Assuming the confirmed status is "CONFIRMED"
    return bookings.some(booking => booking.status === "CONFIRMED");
  } catch (error) {
    console.error("Error retrieving bookings:", error);
    return false;
  }
}

/**
 * Displays an error message on the page.
 * Assumes there is a text element with ID "#errorMessage" (initially hidden).
 * @param {string} message - The error message to display.
 */
function displayError(message) {
  $w("#errorMessage").text = message;
  $w("#errorMessage").show();
}
