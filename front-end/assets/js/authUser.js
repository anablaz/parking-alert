const user = JSON.parse(localStorage.getItem("loggedInUser"));
if (!user) {
  window.location.href = "/front-end/prijava.html";
}