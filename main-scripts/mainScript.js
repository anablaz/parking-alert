document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.querySelector("#loginForm");
  const registerForm = document.querySelector("#registerForm");

  if (loginForm) {
    const usernameInput = document.getElementById("inputUsernameEmail");
    const passwordInput = document.getElementById("inputPassword");

    loginForm.addEventListener("submit", function (e) {
      e.preventDefault(); // Preprečitev osvežitve strani ob oddaji obrazca

      // Opredelitev funkcije fetchLocation, ki pridobi lokacijo uporabnika
      async function fetchLocation() {
        return new Promise((resolve, reject) => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const location = `Lat: ${position.coords.latitude}, Lon: ${position.coords.longitude}`;
                resolve(location);
              },
              (err) => {
                reject("Napaka geografske lokacije: " + err.message);
              }
            );
          } else {
            reject("Ta brskalnik ne podpira geolokacije.");
          }
        });
      }

      const email = usernameInput.value.trim();
      const password = passwordInput.value.trim();
      console.log(`Poskus prijave z e-pošto: ${email} in geslo: ${password}`);

      // Ustvarjanje instance GPS
      const gpsInstance = new SVGPS(showToast, fetchLocation);

      // Izpiši e-pošto in geslo za debugging
      console.log(`Poskus prijave z e-pošto: ${email} in geslom: ${password}`);

      // Poskus prijave s statično metodo `prijava` iz razreda `ZMStudent`
      const user = ZMStudent.prijava(email, password);

      if (user) {
        // Če je prijava uspešna, inicializirajte GPS z uporabnikom
        user.gps = gpsInstance;

        // Po uspešni prijavi pokliči `fetchCurrentLocation`
        user
          .fetchCurrentLocation()
          .then((location) => {
            console.log("Uporabnikova trenutna lokacija:", location);
          })
          .catch((err) => {
            console.error("Napaka pri pridobivanju lokacije:", err);
          });

        // Shranjevanje prijavljenega uporabnika v shrambo localStorage za prihodnjo uporabo
        localStorage.setItem("loggedInUser", JSON.stringify(user));

        // Odpravljanje napak: Prepričajmo se, da smo dosegli kodo za preusmeritev
        console.log("Redirecting to profile page...");
        showToast(
          `Prijava uspešna! Pozdravljen/a ${user.ime} ${user.priimek}.`,
          "success"
        );

        // Preusmeritev na stran profila
        setTimeout(() => {
          window.location.href = "/front-end/profil.html";
        }, 2000);
      } else {
        // Če prijava ne uspe, prikaži sporočilo o napaki
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
  console.log(
    "Uporabniški podatki, pridobljeni iz shrambe localStorage:",
    userData
  );

  // Dodaj to vrstico, da preveri, kaj je v userData
  console.log(userData); // Debugging line

  if (userData) {
    // Z ustvarjanjem novega primerka ZMStudent zagotovi, da je kontekst this pravilno nastavljen.
    const uporabnik = new ZMStudent(userData);

    // Prijavi ustvarjeni primerek ZMStudent, da preveri pravilno inicializacijo
    console.log("Ustvarjen primerek ZMStudent:", uporabnik); // Preveri, ali sta imeni ime in priimek pravilni

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
// Preko GPS-a
document.addEventListener("DOMContentLoaded", async () => {
  const userData = JSON.parse(localStorage.getItem("loggedInUser"));

  if (userData) {
    const student = new ZMStudent(userData);

    // Zdaj uporabimo metodo fetchCurrentLocation
    try {
      await student.fetchCurrentLocation();
    } catch (error) {
      showToast(
        "Napaka pri pridobivanju trenutne lokacije. Prosim, poskusite znova.",
        "error"
      );
      console.warn("Could not fetch user location.", error);
    }
  }
});

// Ročno

// SPREMLJANJE REDARJEV (SIMULACIJA)

// OPOZORILO, ČE JE REDAR BLIZU

// MOŽNOST POTRDITVE OPOZORILA

// PREGLED PRETEKLIH OPOZORIL

// IZBRIS RAČUNA
function openDeleteModal() {
  fetch("modals/izbrisiRacunModal.html")
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("deleteModalContainer").innerHTML = html;

      const modal = document.querySelector("#deleteModalContainer .modal");
      if (modal) {
        modal.style.display = "block";
      }

      // Dodaj poslušalca dogodkov za gumb za brisanje znotraj modalnega okna
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

// POROČANJE O OPAŽENIH REDARJUEV
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

      // Dodaj poslušalca dogodkov za gumb prijavi znotraj modalnega okna
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

// TOGGLE GPS MODAL
function openToggleGPS() {
  fetch("modals/switchGPSModal.html")
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("gpsModal").innerHTML = html;

      const modal = document.querySelector("#gpsModal .modal");
      if (modal) {
        modal.style.display = "block";
      }

      // Preverite stanje geolokacije in nastavite stanje preklapljanja
      isGeolocationEnabled().then((geolocationEnabled) => {
        const gpsToggle = document.getElementById("gpsToggle");

        if (geolocationEnabled) {
          gpsToggle.checked = true; // Če je geolokacija omogočena, nastavi preklop na „vklopljeno“.
        } else {
          gpsToggle.checked = false; // Če geolokacija ni omogočena, nastavi preklop na „izklopljeno“.
        }

        // Posodobitev besedila stanja glede na stanje preklopa
        updateGPSStatus(gpsToggle.checked);
      });

      // Dodaj poslušalca dogodka za preklapljanje GPS ob spremembi
      const gpsToggle = document.getElementById("gpsToggle");
      if (gpsToggle) {
        gpsToggle.addEventListener("change", async (event) => {
          const isChecked = event.target.checked;

          if (isChecked) {
            // Vključi GPS
            await student.vklopiGPS(); // Uporabi metodo ZMStudent za omogočanje GPS
          } else {
            // Izklop GPS
            student.izklopiGPS(); // Uporabi metodo ZMStudent za onemogočanje GPS
          }

          // Posodobitev besedila o stanju GPS
          updateGPSStatus(isChecked);
        });
      }
      // Redefiniraj closeModal, da bo na voljo po vstavitvi
      window.closeModal = function () {
        modal.style.display = "none";
      };
    })

    .catch((err) => console.error("Ni uspelo naložiti modalnega okna:", err));
}

// Funkcija za preverjanje, ali je v brskalniku omogočena geolokacija
function isGeolocationEnabled() {
  return new Promise((resolve) => {
    if (!("geolocation" in navigator)) {
      resolve(false); // Geolocation not supported
    } else {
      navigator.geolocation.getCurrentPosition(
        () => resolve(true), // Če je geolokacija dovoljena
        () => resolve(false) // Če je geolokacija zavrnjena
      );
    }
  });
}

// Funkcija za posodobitev besedila stanja GPS v modalnem oknu
function updateGPSStatus(isChecked) {
  const gpsStatus = document.getElementById("gpsStatus");

  if (gpsStatus) {
    if (isChecked) {
      gpsStatus.textContent = "GPS je vklopljen";
    } else {
      gpsStatus.textContent = "GPS je izklopljen";
    }
  }
}

// IZBERI PARKIRIŠČE
function izberiLokacijoModal() {
  fetch("modals/izberiParkirisceModal.html")
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("izberiParkirisceModal").innerHTML = html;

      const modal = document.querySelector("#izberiParkirisceModal .modal");
      if (modal) {
        modal.style.display = "block";
      }

      // Populate the parking list dynamically with the imported data
      populateParkingList();

      // Add event listener for search input to filter parking options
      const searchInput = document.getElementById("searchParking");
      searchInput.addEventListener("input", function (e) {
        filterParkingList(e.target.value.toLowerCase());
      });

      // Optional: Add event listener for delete button if required
      const deleteButton = document.querySelector("#deleteButton");
      if (deleteButton) {
        // deleteButton.addEventListener("click", () => deleteAccount());
      }

      // Redefiniraj closeModal, da bo na voljo po vstavitvi
      window.closeModal = function () {
        modal.style.display = "none";
      };
    })
    .catch((err) => console.error("Ni uspelo naložiti modalnega okna:", err));
}

// Function to populate the parking list dynamically using the imported data
function populateParkingList() {
  const parkingList = document.getElementById("parkingList");
  parkingList.innerHTML = ""; // Clear previous options

  // Loop through the imported parkirnaMesta and create <option> elements
  parkirnaMesta.forEach((parkirisce) => {
    const option = document.createElement("option");
    option.value = parkirisce.ime;
    option.textContent = parkirisce.ime;
    parkingList.appendChild(option);
  });
}

// Function to filter parking list based on the search input
function filterParkingList(query) {
  const parkingList = document.getElementById("parkingList");
  const options = parkingList.getElementsByTagName("option");

  // Loop through all options and hide those that don't match the search query
  for (let option of options) {
    const name = option.textContent.toLowerCase();
    if (name.includes(query)) {
      option.style.display = "block"; // Show matching option
    } else {
      option.style.display = "none"; // Hide non-matching option
    }
  }
}
