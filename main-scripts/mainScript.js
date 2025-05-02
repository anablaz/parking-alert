// Uporabnik se lahko registrira
document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("#registerForm");
    const usernameInput = document.getElementById("inputUsernameEmail");
    const passwordInput = document.getElementById("inputPassword");
    const loginUsers = [];
  
    form.addEventListener("submit", function (e) {
      e.preventDefault();
  
      const username = usernameInput.value.trim();
      const password = passwordInput.value.trim();
  
      if (username === "" || password === "") {
        showToast("Vsa polja so obvezna.", "error");
      } else {
        // Simulacija uspešne registracije
        // Po potrebi lahko to prenesete v kakšno polje
        localStorage.setItem("registrationSuccess", "true");
        showToast("Registracija uspešna!", "success");
  
        setTimeout(() => {
          window.location.href = "/front-end/prijava.html";
        }, 1500);
      }
    });
  });

  
// Uporabnik se lahko prijavi v aplikacijo

// Auth
(function () {
  const publicPages = ["prijava.html", "ustvariRacun.html", "index.html"];
  const currentPath = window.location.pathname;
  const isPublic = publicPages.some((page) => currentPath.includes(page));

  // If user is not logged in and the page is not public, redirect to login page
  if (!isPublic) {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!user) {
      window.location.href = "/front-end/prijava.html";
    }
  }
})();

// Login logic
function login(username, password) {
  const user = loginUsers.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    const loginData = {
      ...user,
      lastLogin: new Date().toISOString(),
    };
    localStorage.setItem("loggedInUser", JSON.stringify(loginData));
    return loginData;
  }

  // Return null if credentials are wrong
  return null;
}

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  if (!form) return;

  const usernameInput = document.getElementById("inputUsernameEmail");
  const passwordInput = document.getElementById("inputPassword");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    const user = login(username, password);
    if (user) {
      const student = new ZMStudent(user); // Ensure ZMStudent constructor expects these properties
      student.prijava(); // Log the login attempt

      showToast("Prijava uspešna!", "success"); // Show success toast
      setTimeout(() => {
        window.location.href = "/front-end/index.html"; // Redirect after successful login
      }, 1500); // Delay for toast message to be visible
    } else {
      showToast("Napačno uporabniško ime ali geslo.", "error"); // Show error toast
    }
  });
});

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
