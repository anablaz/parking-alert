class ZMStudent {
  constructor(userData, gpsInstance) {
    this.username = userData.username;
    this.password = userData.password;
    this.ime = userData.name;
    this.priimek = userData.surname;
    this.email = userData.email;
    this.location = userData.location || "";
    this.phone = userData.phone;
    this.image = userData.image;

    this.gps = gpsInstance; // store the GPS class instance here

    console.log("Uporabniški podatki, posredovani konstruktorju:", userData);
  }

  //REGOISTRACIJA UPORABNIKA
  registracija() {
    // Preveri, ali uporabnik z isto e-pošto že obstaja.
    const existingUser = users.find((u) => u.email === this.email);
    if (existingUser) {
      showToast("Uporabniško ime že obstaja.", "error");
      return null; // Registracija ni uspela
    }

    // Če uporabnik ne obstaja, prikaži uspeh toast
    showToast("Registracija uspešna!", "success");
    return this;
  }

  // PRIJAVA UPORABNIKA
  // Statična metoda za prijavo
  static prijava(email, password) {
    console.log(loginUsers);

    // iskanje uporabnika z ujemanjem e-pošte in gesla
    const userData = loginUsers.find(
      (u) => u.email === email && u.password === password
    );

    // Če je uporabnik najden, ustvari nov primerek ZMStudent in se prijavi
    if (userData) {
      const user = new ZMStudent(userData);
      console.log(`${user.ime} ${user.priimek} se je prijavil.`);
      return user; // Vračanje podatkov o uporabniku
    }

    console.log("Uporabnik ni najden ali ima napačne poverilnice.");
    return null; // Če ne najde nobenega uporabnika, vrni null
  }

  // ODJAVA UPORABNIKA
  odjava() {
    // Izpiši this, da se dobugga
    console.log("Trenutni primerek ZMStudent:", this);

    const message = `Uporabik se je uspešno odjavil.`;
    showToast(message, "success");
    localStorage.removeItem("loggedInUser");
  }

  // POSODOBITEV PROFILA
  posodobiProfil(noviPodatki) {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedInUser) {
      // Posodabljanje uporabniških podatkov
      Object.assign(loggedInUser, noviPodatki);

      // Shranjevanje posodobljenih podatkov nazaj v lokalno shrambo
      localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
      console.log("Profil posodobljen:", loggedInUser);

      // Posodobi polja profila v uporabniškem vmesniku
      document.getElementById("studentName").value = loggedInUser.ime;
      document.getElementById("studentSurname").value = loggedInUser.priimek;
      document.getElementById("studentEmail").value = loggedInUser.email;
      document.getElementById("studentBio").value = loggedInUser.bio || "";
      document.getElementById("studentLocation").value =
        loggedInUser.location || "";
      document.getElementById("studentPhone").value = loggedInUser.phone || "";
      document.getElementById("studentImage").src =
        loggedInUser.image ||
        "https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg";
    }
  }

  // IZBRISANJE PROFILA
  izbrisiProfil() {
    console.log(`Račun za ${this.ime} ${this.priimek} je izbrisan.`);
    localStorage.removeItem("loggedInUser");
    showToast("Račun uspešno izbrisan.", "success");

    // Redirect na prijavno stran
    setTimeout(() => {
      window.location.href = "/front-end/prijava.html";
    }, 1500);
  }

  // PRIJAVA REDARJA
  prijaviRedar(lokacijaRedar, lokacija) {
    console.log(
      `${this.ime} je prijavil redarja na lokaciji ${lokacijaRedar} (trenutna: ${lokacija})`
    );
  }

  // POSODOBI LASTNO LOKACIJO
  async fetchCurrentLocation() {
    if (!("geolocation" in navigator)) {
      showToast("Geolociranje ni podprto.", "warning");
      console.warn("Geolociranje ni podprto.");
      return null;
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
            );
            const data = await res.json();
            const locationString = data.display_name || `${lat}, ${lon}`;
            showToast(`Vaša trenutna lokacija je: ${locationString}`, "info");
            console.log("Uporabnikova rešena lokacija:", locationString);
            this.location = locationString;

            // Po želji: Posodobitev DOM, če je to del posodobitve uporabniškega vmesnika
            const locationSpan = document.getElementById("last-location");
            if (locationSpan) {
              locationSpan.innerHTML += ` <strong>${locationString}</strong>`;
            }

            resolve(locationString);
          } catch (error) {
            showToast("Napaka pri pridobivanju geografske lokacije.", "error");
            console.error("Napaka povratnega geokodiranja:", error);
            resolve(`${lat}, ${lon}`); // Nazadovanje na surove koordinate
          }
        },
        (err) => {
          showToast("Napaka pri pridobivanju geografske lokacije.", "error");
          console.error("Napaka geografske lokacije:", err);
          reject(err);
        }
      );
    });
  }

  async vklopiGPS() {
    if (!this.gps) {
      showToast("GPS modul ni inicializiran.", "error");
      return;
    }

    await this.gps.vklopiGPS(); // prikaži toast in prikliči lokacijo
    this.location = this.gps.getLokacija(); // posodobitev lokacije učenca
  }

  izklopiGPS() {
    if (!this.gps) {
      showToast("GPS modul ni inicializiran.", "error");
      return;
    }

    this.location = ""; // Izbriši uporabnikovo shranjeno lokacijo
    this.gps.izklopiGPS();
    showToast("GPS je izklopljen.", "info");

    // Po želji: Izbriši lokacijo iz uporabniškega vmesnika
    const locationSpan = document.getElementById("last-location");
    if (locationSpan) {
      locationSpan.innerHTML = "<strong>Ni aktivna lokacija</strong>";
    }
  }

  getProfil() {
    return {
      ime: this.ime,
      priimek: this.priimek,
      email: this.email,
      location: this.location,
      phone: this.phone,
      image: this.image,
    };
  }
}

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