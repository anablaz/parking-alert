document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.querySelector("#loginForm");
  const registerForm = document.querySelector("#registerForm");

  if (loginForm) {
    const usernameInput = document.getElementById("inputUsernameEmail");
    const passwordInput = document.getElementById("inputPassword");

    loginForm.addEventListener("submit", function (e) {
      e.preventDefault(); // Preprečevanje osvežitve strani z obrazcem

      const email = usernameInput.value.trim();
      const password = passwordInput.value.trim();

      console.log(
        `Attempting login with email: ${email} and password: ${password}`
      );

      // Poskus prijave z uporabo statične metode razreda ZMStudent
      const user = ZMStudent.prijava(email, password); // Statični klic metode

      if (user) {
        // Login successful
        showToast("Prijava uspešna!", "success");

        // Shranjevanje prijavljenega uporabnika v localStorage
        localStorage.setItem("loggedInUser", JSON.stringify(user));

        // Počakaj, da se toast konča, in preusmerite
        setTimeout(() => {
          window.location.replace("/front-end/profil.html"); // Preusmeritev na stran profila
        }, 2000); // Ta čas (v milisekundah) prilagodite glede na to, kako dolgo želite čakati na toast.
      } else {
        // Login failed
        showToast("Napačen email ali geslo.", "error");
      }
    });
  }

  if (registerForm) {
    const usernameInput = registerForm.querySelector("#inputUsernameEmail");
    const passwordInput = registerForm.querySelector("#inputPassword");

    registerForm.addEventListener("submit", function (e) {
      e.preventDefault(); // Preprečite privzeto vedenje pri oddaji obrazca

      const username = usernameInput.value.trim();
      const password = passwordInput.value.trim();

      // V tem primeru samo prikazujemo toast in ne izvajamo dejanske registracije.
      showToast("Registracija uspešna!", "success");

      // Po želji počakajte nekaj časa in preusmerite na prijavno stran
      setTimeout(() => {
        window.location.href = "/front-end/prijava.html";
      }, 1500); // 1500ms zamuda, da je toast viden
    });
  }
});

// Uporabnik se lahko odjavi iz aplikacije
function logout() {
  const userData = JSON.parse(localStorage.getItem("loggedInUser"));
  console.log("User data retrieved from localStorage:", userData);

  // Dodaj to vrstico, da preveri, kaj je v userData
  console.log(userData); // Debugging line

  if (userData) {
    // Z ustvarjanjem novega primerka ZMStudent zagotovi, da je kontekst this pravilno nastavljen.
    const uporabnik = new ZMStudent(userData);

    // Prijavi ustvarjeni primerek ZMStudent, da preveri pravilno inicializacijo
    console.log("Created ZMStudent instance:", uporabnik); // Preveri, ali sta imeni ime in priimek pravilni

    uporabnik.odjava();

    localStorage.removeItem("loggedInUser");

    setTimeout(() => {
      window.location.href = "/front-end/prijava.html";
    }, 1500);
  }
}

// Sprememba osebnih podatkov
document.addEventListener("DOMContentLoaded", function () {
  const loggedInUser = localStorage.getItem("loggedInUser");

  if (loggedInUser) {
    const user = JSON.parse(loggedInUser);
    // Polja napolni z uporabniškimi podatki
    document.getElementById(
      "studentFullName"
    ).innerText = `${user.ime} ${user.priimek}`;
    document.getElementById("studentName").value = user.ime;
    document.getElementById("studentSurname").value = user.priimek;
    document.getElementById("studentEmail").value = user.email;
    document.getElementById("studentLocation").value = user.location || "";
    document.getElementById("studentPhone").value = user.phone || "";
    document.getElementById("studentImage").src =
      user.image ||
      "https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg"; // Uporabi privzeto sliko, če je ni
  }
});

function editField(fieldId, icon) {
  const field = document.getElementById(fieldId);
  const isReadOnly = field.hasAttribute("readonly");

  if (isReadOnly) {
    // Če je polje samo za branje, ga spremeni v urejevalno.
    field.removeAttribute("readonly");
    field.focus();
    icon.style.display = "none"; // Skrij ikono za urejanje, ko je polje mogoče urejati
  } else {
    // Posodobljeno vrednost shrani v uporabniški predmet
    const updatedValue = field.value.trim();

    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    loggedInUser[fieldId] = updatedValue; // Posodobi ustrezno polje v podatkih prijavljenega uporabnika

    // Shranjevanje posodobljenih uporabniških podatkov nazaj v shrambo localStorage
    localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));

    // Po urejanju ponovno omogoči, da je polje samo za branje.
    field.setAttribute("readonly", "readonly");
    icon.style.display = "inline"; // Ponovno prikažite ikono za urejanje
  }
}

function saveProfileChanges() {
  // Pridobi posodobljene vrednosti iz vhodnih polj
  const updatedData = {
    ime: document.getElementById("studentName").value,
    priimek: document.getElementById("studentSurname").value,
    email: document.getElementById("studentEmail").value,
    location: document.getElementById("studentLocation").value,
    phone: document.getElementById("studentPhone").value,
    // Dodaj vsa druga polja, ki jih posodobljamo.
    image: document.getElementById("studentImage").src,
  };

  // Pridobi prijavljenega uporabnika iz shrambe localStorage
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (loggedInUser) {
    // Posodobitev uporabniških podatkov z novimi vrednostmi
    Object.assign(loggedInUser, updatedData);

    // Shranjevanje posodobljenih podatkov nazaj v shrambo localStorage
    localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));

    // posodobitev polja profila v uporabniškem vmesniku
    document.getElementById(
      "studentFullName"
    ).innerText = `${updatedData.ime} ${updatedData.priimek}`;

    // Prikažite sporočilo o uspehu ali toast
    showToast("Profil uspešno posodobljen!", "success");
    setTimeout(() => {
      window.location.reload(); // Ponovno naloži stran, da se odražajo spremembe
    }, 1500); // 1500ms zamuda, da je toast viden
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

      // Add event listener for the delete button inside the modal
      const deleteButton = document.querySelector("#deleteButton");
      if (deleteButton) {
        deleteButton.addEventListener("click", () => deleteAccount());
      }

      // Redefiniraj closeModal, da bo na voljo po vstavitvi
      window.closeModal = function () {
        modal.style.display = "none";
      };
    })
    .catch((err) => console.error("Ni uspelo naložiti modalnega okna:", err));
}

function deleteAccount() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (user) {
    // Ustvari primerek ZMStudent
    const loggedInUser = new ZMStudent(user);
    localStorage.removeItem("loggedInUser");
    // Pokliči metodo izbrisiRacun, da izbrišete račun
    loggedInUser.izbrisiProfil();
  } else {
    showToast("Napaka pri brisanju računa.", "error");
  }
}

// Poročanje o opaženih redarjih
function openPrijaviRedarModal() {
  fetch("modals/prijaviRedarModal.html")
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("prijaviRedarModalContainer").innerHTML = html;

      const modal = document.querySelector(
        "#prijaviRedarModalContainer .modal"
      );
      if (modal) {
        modal.style.display = "block";
      }

      // Add event listener for the delete button inside the modal
      const prijaviButton = document.querySelector("#prijaviRedar");
      if (prijaviButton) {
        // deleteButton.addEventListener("click", () => deleteAccount());
      }

      // Redefiniraj closeModal, da bo na voljo po vstavitvi
      window.closeModal = function () {
        modal.style.display = "none";
      };
    })
    .catch((err) => console.error("Ni uspelo naložiti modalnega okna:", err));
}
