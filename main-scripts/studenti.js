class ZMStudent {
  constructor(userData) {
    this.username = userData.username;
    this.password = userData.password;
    this.ime = userData.name;
    this.priimek = userData.surname;
    this.email = userData.email;
    this.location = userData.location;
    this.phone = userData.phone;
    this.image = userData.image;

    console.log("User data passed to constructor:", userData);
  }

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

    console.log("User not found or wrong credentials.");
    return null; // Če ne najde nobenega uporabnika, vrni null
  }

  odjava() {
    // Izpiši this, da se dobugga
    console.log("Current instance of ZMStudent:", this);

    const message = `Uporabik se je uspešno odjavil.`;
    showToast(message, "success");
    localStorage.removeItem("loggedInUser");
  }

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
        loggedInUser.image || "https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg";
    }
  }

  izbrisiProfil() {
    console.log(`Račun za ${this.ime} ${this.priimek} je izbrisan.`);
    localStorage.removeItem("loggedInUser");
    showToast("Račun uspešno izbrisan.", "success");

    // Preusmeritev na stran za prijavo po izbrisu
    setTimeout(() => {
      window.location.href = "/front-end/prijava.html";
    }, 1500);
  }

  prijaviRedar(lokacijaRedar, lokacija) {
    console.log(
      `${this.ime} je prijavil redarja na lokaciji ${lokacijaRedar} (trenutna: ${lokacija})`
    );
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
