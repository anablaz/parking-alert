class ZMStudent {
    constructor({ name, surname, phone, email, location }) {
      this.ime = name;
      this.priimek = surname;
      this.kontaktTel = phone;
      this.kontaktEmail = email;
      this.trenutnaLokacija = location;
    }
  
    registracija() {
      console.log(`${this.ime} ${this.priimek} se je registriral.`);
    }
  
    prijava() {
      console.log(`${this.ime} ${this.priimek} se je prijavil.`);
    }
  
    odjava() {
      console.log(`${this.ime} ${this.priimek} se je odjavil.`);
    }
  
    posodobiProfil(noviPodatki) {
      Object.assign(this, noviPodatki);
      console.log("Profil posodobljen:", this);
    }
  
    izbrisiProfil() {
      console.log(`Profil za ${this.ime} ${this.priimek} je izbrisan.`);
      localStorage.removeItem("loggedInUser");
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
        kontaktTel: this.kontaktTel,
        kontaktEmail: this.kontaktEmail,
        trenutnaLokacija: this.trenutnaLokacija,
      };
    }
  }
  