document.addEventListener("DOMContentLoaded", function () {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    const userNameElement = document.getElementById("user-name");
    if (user && userNameElement) {
      console.log(user.image); // This should print the image URL or be undefined
      console.log("Setting username to: " + user.name);
      document.getElementById("user-name").textContent = user.name;
      userNameElement.textContent = user.name;
      console.log("Username set to: " + userNameElement.textContent);
      if (user.image) {
        document.getElementById("user-image").src = user.image;
      } else {
        console.error("Image is undefined!");
      }
    }
  });

  document.addEventListener("DOMContentLoaded", function () {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    const userNameElement = document.getElementById("user-name-strong");
    const lastLoginElement = document.getElementById("last-login-time");
  
    if (user && userNameElement) {
      // Set the username
      userNameElement.textContent = user.name;
  
      // Format and display the last login time (date + time)
      if (user.lastLogin) {
        const lastLoginDate = new Date(user.lastLogin);
  
        // Format the date in Slovenian (sl-SI) format: "1. maj 2025"
        const formattedDate = lastLoginDate.toLocaleDateString("sl-SI", {
          day: "numeric",
          month: "long",
          year: "numeric"
        });
  
        // Format the time in Slovenian format: "16:54 PM"
        const formattedTime = lastLoginDate.toLocaleTimeString("sl-SI", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false, // Set to false for 24-hour time, true for 12-hour time with AM/PM
        });
  
        if (lastLoginElement) {
          lastLoginElement.textContent = `Vaša zadnja prijava je bila ${formattedDate} ob ${formattedTime}.`;
        }
      }
    }
  });
  
  