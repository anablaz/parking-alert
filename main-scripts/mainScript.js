// Uporabnik se lahko registrira

// Uporabnik se lahko prijavi v aplikacijo
// Auth
(function () {
    const publicPages = ["prijava.html", "ustvariRacun.html", ""]; // "" handles root access
    const currentPath = window.location.pathname;
    const isPublic = publicPages.some((page) => currentPath.includes(page));
  
    if (!isPublic) {
      const user = JSON.parse(localStorage.getItem("loggedInUser"));
      if (!user) {
        // Optional: console.log("User not logged in, redirecting to login...");
        window.location.href = "/front-end/prijava.html";
      }
    }
  })();

//Sama prijava
function login(username, password) {
  const user = loginUsers.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    console.log(`Login successful. Welcome, ${user.name} (${user.role})`);
    return user;
  } else {
    console.log("Login failed: invalid username or password.");
    return null;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  const usernameInput = document.getElementById("inputUsernameEmail");
  const passwordInput = document.getElementById("inputPassword");

  form.addEventListener("submit", function (e) {
    e.preventDefault(); // prevent default form submission

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    const user = login(username, password); // <-- use your existing login function

    if (user) {
      // Optionally store login info (if you want session persistence)
      localStorage.setItem("loggedInUser", JSON.stringify(user));

      // Redirect on successful login
      window.location.href = "/front-end/index.html";
    } else {
      alert("Napačno uporabniško ime ali geslo.");
    }
  });
});

// Uporabnik se lahko odjavi iz aplikacije
function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.replace("/front-end/prijava.html"); // use replace to avoid back button returning to protected page
  }

// Sprememba osebnih podatkov
function editField(fieldId, triggerElement) {
  const field = document.getElementById(fieldId);
  const container = triggerElement.parentElement;

  if (field.readOnly) {
    // Switch to edit mode
    field.readOnly = false;
    field.classList.add("editing");

    // Create check icon to save
    const checkIcon = document.createElement("span");
    checkIcon.className = "save-icon";
    checkIcon.innerHTML = '<i class="fa fa-check"></i>';
    checkIcon.onclick = function () {
      field.readOnly = true;
      field.classList.remove("editing");

      // Restore the edit icon
      container.replaceChild(triggerElement, checkIcon);
    };

    container.replaceChild(checkIcon, triggerElement);
  }
}

// Uporabnik lahko izbriše račun
function openDeleteModal() {
  fetch("modals/izbrisiRacunModal.html")
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("deleteModalContainer").innerHTML = html;

      const modal = document.querySelector("#deleteModalContainer .modal");
      if (modal) {
        modal.style.display = "block";
      }

      // Redefine closeModal so it's available after insertion
      window.closeModal = function () {
        modal.style.display = "none";
      };
    })
    .catch((err) => console.error("Ni uspelo naložiti modalnega okna:", err));
}

function closeModal() {
  document.getElementById("deleteModal").style.display = "none";
}
