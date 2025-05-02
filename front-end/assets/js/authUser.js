document.addEventListener("DOMContentLoaded", function () {
  // Check if the user is logged in
  const loggedInUser = localStorage.getItem("loggedInUser");

  if (!loggedInUser) {
    // If no user is found, redirect to login page
    window.location.replace("/front-end/prijava.html"); // Redirect to login page
  } else {
    const user = JSON.parse(loggedInUser);
    console.log(`Welcome back, ${user.ime} ${user.priimek}`);
    // You can also display the user's name or other info on the page here
  }
});