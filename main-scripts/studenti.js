class ZMStudent {
  constructor(userData) {
    this.username = userData.username;
    this.password = userData.password;
    this.ime = userData.name;
    this.priimek = userData.surname;
    this.email = userData.email;
    this.location = userData.location || "";
    this.phone = userData.phone;
    this.image = userData.image;

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
            showToast(
              `Vaša trenutna lokacija je: ${locationString}`,
              "info"
            );
            console.log("Uporabnikova rešena lokacija:", locationString);
            this.location = locationString;

            // Optional: Update the DOM if this is part of UI update
            const locationSpan = document.getElementById("last-location");
            if (locationSpan) {
              locationSpan.innerHTML += ` <strong>${locationString}</strong>`;
            }

            resolve(locationString);
          } catch (error) {
            showToast(
              "Napaka pri pridobivanju geografske lokacije.",
              "error"
            );
            console.error("Napaka povratnega geokodiranja:", error);
            resolve(`${lat}, ${lon}`); // Fallback to raw coords
          }
        },
        (err) => {
          showToast(
            "Napaka pri pridobivanju geografske lokacije.",
            "error"
          );
          console.error("Napaka geografske lokacije:", err);
          reject(err);
        }
      );
    });
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
