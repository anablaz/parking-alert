document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.querySelector("#loginForm");
  const registerForm = document.querySelector("#registerForm");

  if (loginForm) {
    const usernameInput = document.getElementById("inputUsernameEmail");
    const passwordInput = document.getElementById("inputPassword");
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const username = usernameInput.value.trim();
      const password = passwordInput.value.trim();

      // Attempt to log in with the entered credentials
      const user = handleLogin(username, password); 

      if (user) {
        // If login is successful:
        showToast("Prijava uspešna!", "success"); // Show success toast

        // You can now use this `user` object to display info or make decisions for the logged-in state
        setTimeout(() => {
          window.location.href = "/front-end/index.html"; // Redirect to the home page
        }, 1500); // Delay to show the success toast
      } else {
        // If login fails:
        showToast("Napačno uporabniško ime ali geslo.", "error");
      }
    });
  }

  if (registerForm) {
    const usernameInput = registerForm.querySelector("#inputUsernameEmail");
    const passwordInput = registerForm.querySelector("#inputPassword");

    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const username = usernameInput.value.trim();
      const password = passwordInput.value.trim();

      const user = handleRegistration(username, password);
      if (user) {
        showToast("Registracija uspešna!", "success");
        setTimeout(() => {
          window.location.href = "/front-end/prijava.html";
        }, 1500);
      } else {
        showToast("Uporabniško ime že obstaja.", "error");
      }
    });
  }
});

// Handle login
function handleLogin(username, password) {
  // Check the hardcoded loginUsers array for matching credentials
  const user = loginUsers.find(
    (u) => u.username === username && u.password === password
  );

  console.log("Stored Users:", loginUsers); // Debugging log

  return user || null; // Return user object if found, or null if not
}

// Handle registration
function handleRegistration(username, password) {
  const loginUsers = JSON.parse(localStorage.getItem("loginUsers")) || [];

  // Check if the username already exists
  const existingUser = loginUsers.find((u) => u.username === username);

  if (existingUser) {
    return null; // Return null if the user already exists
  }

  // Create new user object and save it to localStorage
  const newUser = { username, password };
  loginUsers.push(newUser);
  localStorage.setItem("loginUsers", JSON.stringify(loginUsers));

  return newUser; // Return the new user object after registration
}

// Uporabnik se lahko odjavi iz aplikacije

// Sprememba osebnih podatkov
function editField(fieldId, triggerElement) {
  const field = document.getElementById(fieldId);
  const container = triggerElement.parentElement;

  if (field.readOnly) {
    // Preklop na način urejanja
    field.readOnly = false;
    field.classList.add("editing");

    // Ustvari ikono za preverjanje, da shranimo
    const checkIcon = document.createElement("span");
    checkIcon.className = "save-icon";
    checkIcon.innerHTML = '<i class="fa fa-check"></i>';
    checkIcon.onclick = function () {
      field.readOnly = true;
      field.classList.remove("editing");

      // Obnovitev ikone za urejanje
      container.replaceChild(triggerElement, checkIcon);
    };

    container.replaceChild(checkIcon, triggerElement);
  }
}

// Vnos parkirne lokacije (ročno ali z GPS)

// Spremljanje redarjev (simulirano)

// Opozorilo, če je redar blizu

// Možnost potrditve opozorila

// Pregled preteklih opozoril

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

      // Redefiniraj closeModal, da bo na voljo po vstavitvi
      window.closeModal = function () {
        modal.style.display = "none";
      };
    })
    .catch((err) => console.error("Ni uspelo naložiti modalnega okna:", err));
}

function closeModal() {
  document.getElementById("deleteModal").style.display = "none";
}

function deleteAccount() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (user) {
    // Simulacija brisanja računa
    localStorage.removeItem("loggedInUser");
    showToast("Račun uspešno izbrisan.", "success");
    setTimeout(() => {
      window.location.href = "/front-end/prijava.html";
    }, 1500);
  } else {
    showToast("Napaka pri brisanju računa.", "error");
  }
}

// Poročanje o opaženih redarjih
